import { useEffect, useState } from "react";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";

const useStudentPerformanceData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPerformanceData = async () => {
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
        const response = await api.get(`/student/performance/${userId}`); // Adjust endpoint accordingly
        setData(response.data.performance);
      } catch (err) {
        console.error("Error fetching student performance data:", err);
        setError(err?.message || "Something went wrong.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchPerformanceData();
  }, [token]);

  return { data, loading, error };
};

export default useStudentPerformanceData;
