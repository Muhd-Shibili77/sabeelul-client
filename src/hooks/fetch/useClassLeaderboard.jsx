import { useEffect, useState } from 'react';
import api from '../../services/api';


export const useClassLeaderboard = (selectedClass) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedClass) return;

    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/home/leaderboard/${selectedClass}`);
        setLeaderboard(response.data.leaderboard || []);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedClass]);

  return { leaderboard, loading, error };
};
