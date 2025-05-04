// hooks/useFetchStudents.js
import { useEffect, useState } from "react";
import api from "../../services/api";// adjust the path based on your project structure

const useFetchStudents = (classId) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!classId) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/student/class/${classId}`);
        setStudents(res.data.students);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classId]);

  return { students, loading };
};

export default useFetchStudents;
