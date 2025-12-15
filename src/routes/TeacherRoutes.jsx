import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Score from '../page/Teacher/Score'
import Attendance from '../page/Teacher/Attendance'
import TeacherInfo from '../page/Teacher/teacherProfile'
import NotFound from '../components/404/404'

const TeacherRoutes = () => {
  return (
    <>
        <Routes>
            <Route path="/score" element={<Score />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/profile" element={<TeacherInfo />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    </>
  )
}

export default TeacherRoutes