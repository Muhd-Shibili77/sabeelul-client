import { useState } from "react";
import api from "../../services/api";// adjust the path based on your project structure

const useStudentByAdmissionNo = () => {
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);

  const fetchStudent = async (admissionNo) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/student/${admissionNo}`);
      setStudent(response.data.student); // Adjust key based on your API response
    } catch (err) {
      setError(err.response?.data?.message || "Student not found");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    student,
    loading,
    error,
    fetchStudent,
  };
};

export default useStudentByAdmissionNo;
