import React from 'react'
import AdminDashboard from './page/Admin/AdminDashboard'
import AdminStudents from './page/Admin/AdminStudents';
import AdminTeachers from './page/Admin/AdminTeachers';
import AdminPrograms from './page/Admin/AdminPrograms';
import AdminReport from './page/Admin/AdminReport';
import AdminScore from './page/Admin/AdminScore';
import Home from './page/Student/Home';
import Profile from './page/Student/Profile';
import Performance from './page/Student/Performance';
import Score from './page/Teacher/Score';
import TeacherInfo from './page/Teacher/teacherProfile';
import StudentLogin from './page/Authentication/studentLogin';
import TeacherLogin from './page/Authentication/teacherLogin';
import AdminLogin from './page/Authentication/adminLogin';
import LandingPage from './page/Home/LandingPage';
import AdminClasses from './page/Admin/AdminClasses';
import { Route,Routes } from 'react-router-dom'
import TempPage from './page/tempPage';
import NotFound from './components/404/404';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='*' element={<NotFound />} />

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<TempPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/teachers" element={<AdminTeachers />} />
        <Route path="/admin/score" element={<AdminScore />} />
        <Route path="/admin/programs" element={<AdminPrograms />} />
        <Route path="/admin/report" element={<AdminReport />} />
        <Route path="/admin/classes" element={<AdminClasses />} />


        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<Home />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/performance" element={<Performance />} />

        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/score" element={<Score />} />
        <Route path="/teacher/profile" element={<TeacherInfo />} />


      </Routes>
    </>
  );
};


export default App