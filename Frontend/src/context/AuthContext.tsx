import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  token: string | null;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    if (savedToken) {
      try {
        const decoded: any = jwtDecode(savedToken);
        const userFromToken: User = decoded.sub;
        setTokenState(savedToken);
        setUser(userFromToken);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to decode token:', err);
        localStorage.removeItem('accessToken');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setTokenState(null);
    localStorage.removeItem('accessToken');
  };

  const setToken = (newToken: string) => {
    try {
      const decoded: any = jwtDecode(newToken);
      const userFromToken: User = decoded.sub;
      setUser(userFromToken);
      setIsAuthenticated(true);
      setTokenState(newToken);
      localStorage.setItem('accessToken', newToken);
    } catch (err) {
      console.error('Invalid JWT token:', err);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      token, 
      setToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};