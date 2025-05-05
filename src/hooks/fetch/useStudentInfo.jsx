import { useEffect, useState } from "react";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";

const useStudentInfo = () => {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  let userId;
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
  }

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/student/profile/${userId}`); // adjust endpoint if needed
        setStudent(response.data.student);
      } catch (error) {
        setError(error);
        console.error("Error fetching student:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    fetchStudent();
  }, []);
  
  return { student, loading, error };

};

export default useStudentInfo;
