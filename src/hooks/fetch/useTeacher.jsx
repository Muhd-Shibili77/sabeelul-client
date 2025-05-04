import { useEffect, useState } from "react";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode"; 

const useFetchTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token')
  let userId;
  if(token){
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId
  }
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/teacher/${userId}`); // adjust endpoint if needed
        setTeachers(response.data.teacher);
      } catch (err) {
        setError(err);
        console.error("Error fetching teachers:", err);
      } finally {
        setTimeout(()=>{
            setLoading(false);
        },500)
      }
    };

    fetchTeachers();
  }, []);

  return { teachers, loading, error };
};

export default useFetchTeachers;
