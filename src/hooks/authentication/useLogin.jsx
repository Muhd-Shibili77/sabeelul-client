import api from "../../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); 
  const navigate = useNavigate();

  const login = async ({ loginData, password }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
        const res = await api.post('/auth/login', { loginData, password });
        const { token,role } = res.data;

        localStorage.setItem('token', token);
        setSuccess('Login successful!');
        if(role === "Student"){
            navigate("/student/dashboard");
            location.reload()
        }else{
            navigate("/teacher/score");
        }
        return { success: true };
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;
