import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { ProvedorEstadoGlobal } from '../hooks/EstadoGlobal';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type LocalizacaoScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const LocalizacaoScreen: React.FC<LocalizacaoScreenProps> = ({ navigation }) => {
  const imageUrl = require('../../assets/localizacao.png');
  const { width, height } = Dimensions.get('window');

  return (
    <NativeBaseProvider>
      <ProvedorEstadoGlobal>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={30} color="#007bff" />
          </TouchableOpacity>
          <Image source={imageUrl} style={[styles.image, { width, height }]} />
        </View>
      </ProvedorEstadoGlobal>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAECF0',  
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20, 
    zIndex: 1, 
  },
});

export default LocalizacaoScreen;
