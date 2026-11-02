import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('opd_user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 201,
      name: 'John Doe',
      email: 'patient@hospital.org',
      role: 'patient'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('opd_token') || 'mock-jwt-token-default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('opd_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('opd_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('opd_token', token);
    } else {
      localStorage.removeItem('opd_token');
    }
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authApi.login(credentials);
      setUser(res.user);
      setToken(res.token);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (patientData) => {
    setLoading(true);
    try {
      const res = await authApi.register(patientData);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
  };

  // Quick Demo Role Switcher
  const switchRole = (newRole) => {
    let mockUser = { id: 201, name: 'John Doe', email: 'patient@hospital.org', role: 'patient' };
    if (newRole === 'receptionist') {
      mockUser = { id: 301, name: 'Desk Receptionist', email: 'receptionist@hospital.org', role: 'receptionist' };
    } else if (newRole === 'doctor') {
      mockUser = { id: 101, name: 'Dr. Sarah Jenkins', email: 'doctor@hospital.org', role: 'doctor' };
    } else if (newRole === 'admin') {
      mockUser = { id: 999, name: 'System Administrator', email: 'admin@hospital.org', role: 'admin' };
    }
    setUser(mockUser);
    setToken(`mock-jwt-token-${newRole}`);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, switchRole, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
