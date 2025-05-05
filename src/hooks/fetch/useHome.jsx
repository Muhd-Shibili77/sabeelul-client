import { useState, useEffect } from "react";
import api from "../../services/api";

const useHomeData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
 

    const fetchHomeData = async () => {
      try {
        const response = await api.get('/home');
          setData(response.data.home);
          setLoading(false);
      } catch (err) {
        console.error("Error fetching homeData:", err);
          setError(err);
          setLoading(false);
      
      }
    };
    fetchHomeData();
  }, []);

  return { data, loading, error };
};
export default useHomeData