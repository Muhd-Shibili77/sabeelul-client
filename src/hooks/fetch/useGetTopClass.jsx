import { useEffect, useState } from "react";
import api from "../../services/api";

export const useGetTopClasses = () => {
  const [Classleaderboard, setClassLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassLeaderboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/home/leaderboard/classes`);  
        setClassLeaderboard(response.data.leaderboard || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchClassLeaderboard();
  }, []);

  return { Classleaderboard, loading, error };
};
