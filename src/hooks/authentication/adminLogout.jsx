import { useState } from "react";
import api from "../../services/api";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const res = await api.post('/auth/admin/logout');
      localStorage.removeItem('token')
      setSuccess('logout successful!');
      return { success: true };
    } catch (error) {
      setError(err.response?.data?.message || "logout failed");
      return { success: false };
    }
  };
  return { logout, loading, error, success };
};

export default useLogout;
