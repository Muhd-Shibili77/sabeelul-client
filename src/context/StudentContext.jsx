import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import { getLevelData } from "../utils/studentLevel";// Assuming you already created this



const StudentContext = createContext(null);

export const StudentProvider = ({ children }) => {
  const [totalMark, setTotalMark] = useState(0);
  const [theme, setTheme] = useState({ label: "", color: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentMark = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded?.userId;

        const res = await api.get(`/student/dashboard/${userId}`);
        const mark = Math.floor(res.data.dashboard.marks); // or round
        setTotalMark(mark);
        setTheme(getLevelData(mark));
      } catch (err) {
        console.error("Failed to fetch student mark", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentMark();
  }, []);

  return (
    <StudentContext.Provider value={{ totalMark, theme, loading }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) throw new Error("useStudentContext must be used inside StudentProvider");
  return context;
};
