import { useEffect, useState } from "react";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";

const useStudentDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError("No token found.");
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.userId;

        if (!userId) {
          throw new Error("Invalid token or user ID missing.");
        }

        setLoading(true);
        const response = await api.get(`/student/dashboard/${userId}`); // Adjust endpoint accordingly
        setData(response.data.dashboard);
      } catch (err) {
        console.error("Error fetching student dashboard data:", err);
        setError(err?.message || "Something went wrong.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500); // Simulate loader experience
      }
    };

    fetchDashboardData();
  }, [token]);

  return { data, loading, error };
};

export default useStudentDashboardData;
