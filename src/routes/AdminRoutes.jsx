import React from 'react'
import { Route,Routes } from 'react-router-dom'
import AdminDashboard from '../page/Admin/AdminDashboard'
import AdminStudents from '../page/Admin/AdminStudents'
import AdminTeachers from '../page/Admin/AdminTeachers'
import AdminPrograms from '../page/Admin/AdminPrograms'
import AdminAttendance from '../page/Admin/AdminAttendance'
import AdminReport from '../page/Admin/AdminReport'
import AdminScore from '../page/Admin/AdminScore'
import AdminClasses from '../page/Admin/AdminClasses'
import AdminSettings from '../page/Admin/AdminSettings'
import NotFound from '../components/404/404'

const AdminRoutes = () => {
  return (
    <>
        <Routes>
            <Route path='/dashboard' element={<AdminDashboard/>}/>
            <Route path='/students' element={<AdminStudents/>}/>
            <Route path='/teachers' element={<AdminTeachers/>}/>
            <Route path='/score' element={<AdminScore/>}/>
            <Route path="/attendance" element={<AdminAttendance />} />
            <Route path='/programs' element={<AdminPrograms/>}/>
            <Route path='/report' element={<AdminReport/>}/>
            <Route path='/classes' element={<AdminClasses/>}/>
            <Route path='/settings' element={<AdminSettings/>}/>
            <Route path='*' element={<NotFound />} />
        </Routes>
    </>
  )
}

export default AdminRoutes