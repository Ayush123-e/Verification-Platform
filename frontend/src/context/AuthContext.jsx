import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, login, signup, logout } from '../services/authService';

export const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedUser = getCurrentUser();
    if (cachedUser) {
      setUser(cachedUser);
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.success) {
        setUser(data.data);
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed. Please verify credentials.' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please verify credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  const signupUser = async (name, email, password, company) => {
    setLoading(true);
    try {
      const data = await signup(name, email, password, company);
      if (data.success) {
        setUser(data.data);
        return { success: true };
      }
      return { success: false, message: data.message || 'Signup failed. Please try again.' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, signupUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
