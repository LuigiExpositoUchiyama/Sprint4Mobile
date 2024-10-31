import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Interface que define a estrutura de uma promoção
interface Promocao {
  id: number;
  promocao: string;
  valorCheio: number;
  valorPromocional: number;
  localizacao: string;
}

// Interface que define o contexto global de estado
interface ContextoEstadoGlobal {
  promocoes: Promocao[];
  adicionarPromocao: (promocao: Omit<Promocao, 'id'>) => void;
  editarPromocao: (id: number, novaPromocao: Omit<Promocao, 'id'>) => void;
  excluirPromocao: (id: number) => void;
}

// Cria o contexto global de estado
const ContextoEstadoGlobal = createContext<ContextoEstadoGlobal>(null!);

// Hook para acessar o contexto global de estado
export const useEstadoGlobal = () => useContext(ContextoEstadoGlobal);

// Componente que fornece o contexto global de estado para seus filhos
export const ProvedorEstadoGlobal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);

  const carregarPromocoes = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/promocao', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Não foi possível carregar as promoções');
      }

      const data = await response.json();
      setPromocoes(data);
    } catch (error) {
      console.error('Erro ao carregar as promoções:', error);
    }
  };

  const adicionarPromocao = async (promocao: Omit<Promocao, 'id'>) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/promocao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(promocao),
      });

      if (!response.ok) {
        throw new Error('Não foi possível adicionar a promoção');
      }

      const data = await response.json();
      setPromocoes(prev => [...prev, data]);
    } catch (error) {
      console.error('Erro ao adicionar a promoção:', error);
    }
  };

  const editarPromocao = async (id: number, novaPromocao: Omit<Promocao, 'id'>) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/promocao/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(novaPromocao),
      });

      if (!response.ok) {
        throw new Error('Não foi possível editar a promoção');
      }

      const novasPromocoes = promocoes.map(promocao =>
        promocao.id === id ? { ...promocao, ...novaPromocao } : promocao
      );
      setPromocoes(novasPromocoes);
    } catch (error) {
      console.error('Erro ao editar a promoção:', error);
    }
  };

  const excluirPromocao = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/promocao/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Não foi possível excluir a promoção');
      }

      const novasPromocoes = promocoes.filter(promocao => promocao.id !== id);
      setPromocoes(novasPromocoes);
    } catch (error) {
      console.error('Erro ao excluir a promoção:', error);
    }
  };

  useEffect(() => {
    carregarPromocoes();
  }, []);

  return (
    <ContextoEstadoGlobal.Provider value={{ promocoes, adicionarPromocao, editarPromocao, excluirPromocao }}>
      {children}
    </ContextoEstadoGlobal.Provider>
  );
};
