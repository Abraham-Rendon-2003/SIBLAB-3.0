import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState,useEffect } from 'react';

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

  const login = (userData) => {
    AsyncStorage.setItem('user', JSON.stringify(userData)).then(() => {
      setUser(true);
    });
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
