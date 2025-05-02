import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from '../page/Student/Home'
import Profile from '../page/Student/Profile'
import Performance from '../page/Student/Performance'
import NotFound from '../components/404/404'


const StudentRoutes = () => {
  return (
    <>
        <Routes>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/performance" element={<Performance />} />
        <Route path='*' element={<NotFound />} />

        </Routes>
    
    </>
  )
}

export default StudentRoutes