import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/Storage';
import { User } from '../types/user';

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

  useEffect(() => {
    const checkAuth = async () => {
      const token = storage.getString('authToken');
      setIsAuthenticated(!!token);
      setIsLoading(false); // Done checking
    };

    checkAuth();
  }, []);

  const login = async (token: string, user: User) => {
    storage.set('authToken', token);
    // store user as a JSON string to satisfy storage value types
    storage.set('userDetails', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const logout = async () => {
    storage.remove('authToken');
    storage.remove('userDetails');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
