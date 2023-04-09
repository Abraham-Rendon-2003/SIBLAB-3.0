import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState,useEffect } from 'react';
import { getUser } from '../../../services/GeneralService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const userData = await AsyncStorage.getItem('user');
      setUser(JSON.parse(userData) ? true : false);
    };
    getSession();
  }, []);

  const login = async (userData) => {
    try {
      const userInfo = await getUser(userData.id);
      AsyncStorage.setItem('user', JSON.stringify(userInfo)).then(() => {
        setUser(true);
      });
    } catch (error) {
      
    }

  };

  const logout = () => {
    AsyncStorage.removeItem('user').then(() => {
      setUser(false);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
