import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORE } from '../utils/Storage';
import { User } from '../types/user';
import BaseApi from '../service/baseApi';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { AUTH_TOKEN, USER_INFO } = STORE;

  useEffect(() => {
    const checkAuth = async () => {
      const token = storage.getString('authToken');
      setIsAuthenticated(!!token);
      setIsLoading(false); // Done checking
    };

    checkAuth();
  }, []);

  const login = async (token: string, user: User) => {
    storage.set(AUTH_TOKEN, token);
    // store user as a JSON string to satisfy storage value types
    storage.set(USER_INFO, JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const logout = async () => {
    const response = await BaseApi.post('/auth/logout', {});
    console.log('Logout Response -> ', response);
    if (response.success) {
    }
    storage.remove(AUTH_TOKEN);
    storage.remove(USER_INFO);
    storage.clearAll();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
