import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Login from './page/Authentication/Login';
import AdminLogin from './page/Authentication/adminLogin';
import LandingPage from './page/Home/LandingPage';
import NotFound from './components/404/404';
import TeacherRoutes from './routes/TeacherRoutes';
import StudentRoutes from './routes/StudentRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ProtectedAuthRoutes from './routes/protectedAuthRoute';
import ProtectedRoutes from './routes/protectedRoute';
import { StudentProvider } from './context/StudentContext';
import useInactivityLogout from './hooks/authentication/useInactivityLogout';
const App = () => {
  useInactivityLogout(); // 🛡️ Enables inactivity logout everywhere
  return (
    <>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path='/' element={<ProtectedAuthRoutes element={<LandingPage/>}/>}/>
        <Route path='/login' element={<ProtectedAuthRoutes element={<Login/>}/>}/>
        <Route path='/admin/login' element={<ProtectedAuthRoutes element={<AdminLogin/>}/>}/>

        <Route path='/admin/*'  element={<ProtectedRoutes element={<AdminRoutes/>} requiredRoles={['Admin']}/>}/>
        <Route path='/student/*'  element={<ProtectedRoutes element={<StudentProvider><StudentRoutes/></StudentProvider>} requiredRoles={['Student']}/>}/>
        <Route path='/teacher/*'  element={<ProtectedRoutes element={<TeacherRoutes/>} requiredRoles={['Teacher']}/>}/>
      </Routes>
    </>
  );
};


export default App