import { useEffect, useState } from "react";
import api from "../../services/api"; 

const useAdminDashboard = () => {
  const [data, setData] = useState(null);        // dashboard data
  const [loading, setLoading] = useState(true);  // loading state
  const [error, setError] = useState(null);      // error state

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/admin/dashboard"); // adjust endpoint
        setData(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading, error };
};

export default useAdminDashboard;
