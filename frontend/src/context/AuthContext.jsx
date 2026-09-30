import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

const storageKey = 'loksetu_auth';
const legacyStorageKey = 'civicsense_auth';

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() =>
    JSON.parse(localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey) || 'null'),
  );

  const saveAuth = (payload) => {
    localStorage.setItem(storageKey, JSON.stringify(payload));
    localStorage.removeItem(legacyStorageKey);
    setAuth(payload);
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    saveAuth(data);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    saveAuth(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setAuth(null);
  };

  const value = useMemo(
    () => ({
      user: auth?.user || null,
      token: auth?.token || null,
      isAuthenticated: Boolean(auth?.token),
      login,
      register,
      logout,
    }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
};
