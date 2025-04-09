import React from 'react'
import AdminDashboard from './page/Admin/AdminDashboard'
import AdminStudents from './page/Admin/AdminStudents';
import AdminTeachers from './page/Admin/AdminTeachers';
import AdminPrograms from './page/Admin/AdminPrograms';
import Home from './page/Student/Home';
import Profile from './page/Student/Profile';
import Performance from './page/Student/Performance';
import Dashboard from './page/Teacher/Dashboard';
import Grade from './page/Teacher/Grade';
import TeacherInfo from './page/Teacher/teacherProfile';
import StudentLogin from './page/Authentication/studentLogin';
import TeacherLogin from './page/Authentication/teacherLogin';
import AdminLogin from './page/Authentication/adminLogin';
import TempPage from './page/tempPage';
import { Route,Routes } from 'react-router-dom'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<TempPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/teachers" element={<AdminTeachers />} />
        <Route path="/admin/programs" element={<AdminPrograms />} />


        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<Home />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/performance" element={<Performance />} />

        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/dashboard" element={<Dashboard />} />
        <Route path="/teacher/grade" element={<Grade />} />
        <Route path="/teacher/profile" element={<TeacherInfo />} />


      </Routes>
    </>
  );
};


export default App