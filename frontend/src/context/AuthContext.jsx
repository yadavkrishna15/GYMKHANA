import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('gymkhana_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    async function loadUser() {
      const savedToken = localStorage.getItem('gymkhana_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.success && response.data?.user) {
          setUser(response.data.user);
        } else {
          // Invalidate
          localStorage.removeItem('gymkhana_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Session validation failed:', err.message);
        localStorage.removeItem('gymkhana_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data?.token) {
      localStorage.setItem('gymkhana_token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data.user;
    }
    throw new Error(response.error?.message || 'Login failed');
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.success && response.data?.token) {
      localStorage.setItem('gymkhana_token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data.user;
    }
    throw new Error(response.error?.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('gymkhana_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
