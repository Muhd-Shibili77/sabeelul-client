import React from 'react'
import SideBar from '../../components/sideBar/SideBar'

const AdminDashboard = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">


        <SideBar page="Dashboard"/>
        <div className="flex-1 p-4 md:ml-12 transition-all duration-300 mt-5">
            <h2>Dashboard</h2>
        </div>
    </div>
  )
}

export default AdminDashboard