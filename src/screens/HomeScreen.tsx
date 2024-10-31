import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import { ProvedorEstadoGlobal } from '../hooks/EstadoGlobal';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const servicos = [
    { nome: 'Hambúrgueres', imagem: require('../../assets/hamburguer.jpg') },
    { nome: 'Pizzas', imagem: require('../../assets/pizza.jpg') },
    { nome: 'Bebidas', imagem: require('../../assets/bebidas.jpg') },
    { nome: 'Sobremesas', imagem: require('../../assets/sobremesas.jpg') },
    { nome: 'Sushi', imagem: require('../../assets/sushi.jpg') },
    { nome: 'Saladas', imagem: require('../../assets/salada.jpg') },
    { nome: 'Massas', imagem: require('../../assets/massa.jpg') }
  ];

  const middleIndex = Math.ceil(servicos.length / 2);
  const servicosParte1 = servicos.slice(0, middleIndex);
  const servicosParte2 = servicos.slice(middleIndex);

  const handleServicePress = (nome: string) => {
    navigation.navigate('Lojas'); 
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <NativeBaseProvider>
      <ProvedorEstadoGlobal>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.titulo}>Promoções Disponíveis</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <FlatList
                data={servicosParte1}
                renderItem={({ item }) => (
                  <View style={styles.servicoContainer}>
                    <Image source={item.imagem} style={styles.servicoImagem} />
                    <Pressable
                      style={({ pressed }) => [
                        styles.servicoButton,
                        { backgroundColor: pressed ? '#0056b3' : '#007bff' }
                      ]}
                      onPress={() => handleServicePress(item.nome)}
                    >
                      <Text style={styles.servicoTexto}>{item.nome}</Text>
                    </Pressable>
                  </View>
                )}
                keyExtractor={(item) => item.nome}
                contentContainerStyle={styles.listContainer}
                scrollEnabled={false}
              />
            </View>
            <View style={styles.gridItem}>
              <FlatList
                data={servicosParte2}
                renderItem={({ item }) => (
                  <View style={styles.servicoContainer}>
                    <Image source={item.imagem} style={styles.servicoImagem} />
                    <Pressable
                      style={({ pressed }) => [
                        styles.servicoButton,
                        { backgroundColor: pressed ? '#0056b3' : '#007bff' }
                      ]}
                      onPress={() => handleServicePress(item.nome)}
                    >
                      <Text style={styles.servicoTexto}>{item.nome}</Text>
                    </Pressable>
                  </View>
                )}
                keyExtractor={(item) => item.nome}
                contentContainerStyle={styles.listContainer}
                scrollEnabled={false}
              />
            </View>
          </View>
        </ScrollView>
      </ProvedorEstadoGlobal>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  gridItem: {
    width: '48%',
    marginBottom: 20,
  },
  servicoContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 20,
  },
  servicoImagem: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  servicoTexto: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  servicoButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  listContainer: {
    flexGrow: 1,
  },
});

export default HomeScreen;
