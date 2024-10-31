import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import { ProvedorEstadoGlobal } from '../hooks/EstadoGlobal';
import Icon from 'react-native-vector-icons/Ionicons'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LojaScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

interface NovaPromocao {
  promocao: string;
  valorCheio: string;
  valorPromocional: string;
  localizacao: string;
}

interface Errors {
  promocao?: string;
  valorCheio?: string;
  localizacao?: string;
}

const LojaScreen: React.FC<LojaScreenProps> = ({ navigation }) => {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [novaPromocao, setNovaPromocao] = useState<NovaPromocao>({
    promocao: '',
    valorCheio: '',
    valorPromocional: '',
    localizacao: '',
  });
  const [errors, setErrors] = useState<Errors>({});

  const fetchLojas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/promocao', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLojas(response.data);
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLojas();
  }, []);

  const handleShowLocation = () => {
    navigation.navigate('Localizacao');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  const addPromocao = async () => {
    const { promocao, valorCheio, localizacao } = novaPromocao;
    const newErrors: Errors = {};

    if (!promocao) newErrors.promocao = 'O campo "Produto" é obrigatório.';
    if (!valorCheio) newErrors.valorCheio = 'O campo "Valor Cheio" é obrigatório.';
    if (!localizacao) newErrors.localizacao = 'O campo "Localização" é obrigatório.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post('http://localhost:3000/promocao', novaPromocao, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModalVisible(false);
      setNovaPromocao({ promocao: '', valorCheio: '', valorPromocional: '', localizacao: '' });
      fetchLojas();
    } catch (error) {
      console.error('Erro ao adicionar promoção:', error);
    }
  };

  const deletePromocao = async (promocaoId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://localhost:3000/promocao/${promocaoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchLojas();
    } catch (error) {
      console.error('Erro ao apagar promoção:', error);
    }
  };

  const renderProduto = ({ item }: { item: { promocao: string; valorCheio: number; valorPromocional: number; localizacao: string; id: string } }) => (
    <View style={styles.produtoContainer}>
      <Text style={styles.produtoNome}>{item.promocao}</Text>
      <Text style={styles.precoOriginal}>R$ {item.valorCheio}</Text>
      <Text style={styles.precoPromocional}>R$ {item.valorPromocional}</Text>
      <TouchableOpacity onPress={() => deletePromocao(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Apagar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoja = ({ item }: { item: { promocao: string; valorCheio: number; valorPromocional: number; localizacao: string; id: string } }) => (
    <View style={styles.lojaContainer}>
      <Text style={styles.lojaNome}>{item.promocao}</Text>
      <Text style={styles.localizacaoText}>Localização: {item.localizacao}</Text>
      <FlatList
        data={[item]}
        renderItem={renderProduto}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.produtosList}
      />
      <TouchableOpacity
        style={styles.localizacaoButton}
        onPress={handleShowLocation}
      >
        <Text style={styles.localizacaoButtonText}>Mostrar Localização</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <NativeBaseProvider>
      <ProvedorEstadoGlobal>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#007bff" /> 
            </TouchableOpacity>
            <Text style={styles.titulo}>Lojas e Ofertas</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Adicionar Promoção</Text>
          </TouchableOpacity>

          <FlatList
            data={lojas}
            renderItem={renderLoja}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer} // Adicionado aqui
          />

          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Adicionar Promoção</Text>
              <TextInput
                placeholder="Produto"
                value={novaPromocao.promocao}
                onChangeText={(text) => setNovaPromocao({ ...novaPromocao, promocao: text })}
                style={styles.input}
              />
              {errors.promocao && <Text style={styles.errorText}>{errors.promocao}</Text>}
              
              <TextInput
                placeholder="Valor Cheio"
                value={novaPromocao.valorCheio}
                onChangeText={(text) => setNovaPromocao({ ...novaPromocao, valorCheio: text })}
                style={styles.input}
                keyboardType="numeric"
              />
              {errors.valorCheio && <Text style={styles.errorText}>{errors.valorCheio}</Text>}
              
              <TextInput
                placeholder="Valor Promocional (opcional)"
                value={novaPromocao.valorPromocional}
                onChangeText={(text) => setNovaPromocao({ ...novaPromocao, valorPromocional: text })}
                style={styles.input}
                keyboardType="numeric"
              />
              
              <TextInput
                placeholder="Localização"
                value={novaPromocao.localizacao}
                onChangeText={(text) => setNovaPromocao({ ...novaPromocao, localizacao: text })}
                style={styles.input}
              />
              {errors.localizacao && <Text style={styles.errorText}>{errors.localizacao}</Text>}
              
              <Button title="Adicionar" onPress={addPromocao} />
              <View style={{ marginTop: 10 }}>
                <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#ff0000" />
              </View>
            </View>
          </Modal>
        </ScrollView>
      </ProvedorEstadoGlobal>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  lojaContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  lojaNome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  localizacaoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  produtosList: {
    marginTop: 10,
  },
  produtoContainer: {
    marginBottom: 10,
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  precoOriginal: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  precoPromocional: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
  localizacaoButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  localizacaoButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    paddingLeft: 10,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginBottom: 10,
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#dc3545',
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
  },
  listContainer: { // Adicionado aqui
    flexGrow: 1,
  },
});

export default LojaScreen;
