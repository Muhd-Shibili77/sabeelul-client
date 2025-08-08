import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import { getThemeColors } from "../utils/getTheme";
import { fetchTheme } from "../redux/themeSlice";
import { useDispatch, useSelector } from "react-redux";
const StudentContext = createContext(null);

export const StudentProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState({});
  const [subjects,setSubjects] = useState([])
  const [loading, setLoading] = useState(true);
  const [studentMark, setStudentMark] = useState(0);
  const { themes } = useSelector((state) => state.theme);

  const getThemeBasedOnMark = (mark, themesData) => {
    if (!themesData || themesData.length === 0) return {};

    const matchingTheme = themesData.find(
      (theme) => mark >= theme.minMark && mark <= theme.maxMark
    );
    if (matchingTheme) {
      const currentTheme = getThemeColors(matchingTheme.label);
      return currentTheme;
    }
    return themesData[themesData.length - 1] || {};
  };
  useEffect(() => {
    dispatch(fetchTheme({}));
  }, []);

  useEffect(() => {
    const fetchStudentMark = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded?.userId;

        const res = await api.get(`/student/dashboard/${userId}`);
        const mark = Math.floor(res.data.dashboard.marks); // or round
        // setTheme(getLevelData(mark));
        setStudentMark(mark);
        // ✅ Get all subjects
        const subjects = res.data.dashboard.class.subjects || [];
        setSubjects(subjects);
      } catch (err) {
        console.error("Failed to fetch student mark", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentMark();
  }, []);
  useEffect(() => {
    if (studentMark && themes && themes.length > 0) {
      const dynamicTheme = getThemeBasedOnMark(studentMark, themes);
      setTheme(dynamicTheme);
    }
  }, [studentMark, themes]);
  return (
    <StudentContext.Provider value={{ theme, loading, subjects }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context)
    throw new Error("useStudentContext must be used inside StudentProvider");
  return context;
};
