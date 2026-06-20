import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('aethrix_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('aethrix_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then((data) => {
        setUser(data);
        localStorage.setItem('aethrix_user', JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem('aethrix_token');
        localStorage.removeItem('aethrix_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem('aethrix_token', data.token);
    localStorage.setItem('aethrix_user', JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    localStorage.setItem('aethrix_token', data.token);
    localStorage.setItem('aethrix_user', JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('aethrix_token');
    localStorage.removeItem('aethrix_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((data) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('aethrix_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, isAdmin: user?.role === 'admin', login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
