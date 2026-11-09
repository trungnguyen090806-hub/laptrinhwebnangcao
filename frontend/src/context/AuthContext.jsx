import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('techstore_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('techstore_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('techstore_user');
    }
  }, [currentUser]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ username, password });
      if (res.success && res.data) {
        setCurrentUser(res.data);
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Đăng nhập không thành công' };
    } catch (err) {
      return { success: false, message: err.message || 'Lỗi kết nối máy chủ' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      if (res.success && res.data) {
        setCurrentUser(res.data);
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Đăng ký không thành công' };
    } catch (err) {
      return { success: false, message: err.message || 'Lỗi kết nối máy chủ' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('techstore_user');
  };

  const isAdmin = () => {
    return currentUser && currentUser.role === 'ADMIN';
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
