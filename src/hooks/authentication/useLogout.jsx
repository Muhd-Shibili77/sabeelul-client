import { useState } from "react";
import api from "../../services/api";

const useUserLogout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
  
    const userLogout = async () => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);
        const res = await api.post('/auth/logout');
        localStorage.removeItem('token')
        setSuccess('logout successful!');
        return { success: true };
      } catch (error) {
        setError(err.response?.data?.message || "logout failed");
        return { success: false };
      }
    };
    return { userLogout, loading, error, success };
  };
  
  export default useUserLogout;