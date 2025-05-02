// hooks/useLogin.js
import { useState } from 'react';
import api from '../../services/api';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); 

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await api.post('/auth/admin/login', { email, password });
      const { token } = res.data;

      localStorage.setItem('token', token);
     
      setSuccess('Login successful!');
      return { success: true };  

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, success };
};

export default useLogin;
