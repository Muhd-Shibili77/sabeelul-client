import React from 'react';
import StudentSideBar from '../../components/sideBar/studentSideBar';
import { FaUserTie, FaChalkboardTeacher, FaCheckCircle, FaTrophy } from "react-icons/fa";
const Home = () => {
  const dashboardData = {
    studentName: "Aliya Rahman",
    todayAttendance: "Present",
    totalAttendance: 92,
    overallGrade: "A",
    internalMark: 78,
    className: "Grade 10 - B",
    classTeacher: {
      name: "Mrs. Reena Mathews",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    latestAchievement: {
      title: "Elocution Competition",
      score: "8.5 / 10",
      date: "March 20, 2025",
    },
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <StudentSideBar page="Dashboard" />

      <div className="flex-1 p-6 mt-5 md:ml-12 transition-all duration-300">
       {/* Welcome Header */}
<h2 className="text-3xl font-bold text-gray-800 mb-8">
   Welcome, <span className="text-[rgba(53,130,140,1)]">{dashboardData.studentName}</span>
</h2>

{/* Class Info & Teacher */}
<div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center justify-between max-w-4xl mb-6 hover:shadow-lg transition">
  <div className="flex items-center gap-4">
    <FaChalkboardTeacher className="text-[rgba(53,130,140,1)] text-3xl" />
    <div>
      <p className="text-sm text-gray-500">Class</p>
      <h3 className="text-xl font-semibold text-gray-700">{dashboardData.className}</h3>
    </div>
  </div>
  <div className="flex items-center gap-4 mt-4 md:mt-0">
    <img
      src={dashboardData.classTeacher.image}
      alt="Class Teacher"
      className="w-14 h-14 rounded-full border-2 border-[rgba(53,130,140,1)] object-cover"
    />
    <div>
      <p className="text-sm text-gray-500">Class Teacher</p>
      <p className="text-md font-medium text-gray-800">{dashboardData.classTeacher.name}</p>
    </div>
  </div>
</div>

{/* Attendance Card */}
{/* <div
  className={`p-6 rounded-2xl shadow-md mb-6 max-w-md flex items-center gap-4 ${
    dashboardData.todayAttendance === 'Present' ? 'bg-green-50' : 'bg-red-50'
  } hover:shadow-lg transition`}
>
  <FaCheckCircle
    className={`text-3xl ${
      dashboardData.todayAttendance === 'Present' ? 'text-green-600' : 'text-red-600'
    }`}
  />
  <div>
    <h3 className="text-md font-semibold text-gray-600">Today’s Attendance</h3>
    <p
      className={`text-2xl font-bold mt-1 ${
        dashboardData.todayAttendance === 'Present' ? 'text-green-700' : 'text-red-700'
      }`}
    >
      {dashboardData.todayAttendance}
    </p>
  </div>
</div> */}

{/* Summary Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mb-8">
  {/* Total Attendance */}
  <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
    <h4 className="text-sm text-gray-500 mb-1">Total Attendance</h4>
    <p className="text-3xl font-bold text-[rgba(53,130,140,1)]">{dashboardData.totalAttendance}%</p>
  </div>

  {/* Overall Grade */}
  <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
    <h4 className="text-sm text-gray-500 mb-1">Overall Grade</h4>
    <p className="text-3xl font-bold text-[rgba(53,130,140,1)]">{dashboardData.overallGrade}</p>
  </div>

  {/* Internal Mark */}
  <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
    <h4 className="text-sm text-gray-500 mb-1">Internal Mark</h4>
    <p className="text-3xl font-bold text-[rgba(53,130,140,1)]">{dashboardData.internalMark}</p>
  </div>
</div>

{/* Latest Achievement */}
<div className="bg-white p-6 rounded-2xl shadow-md max-w-3xl hover:shadow-lg transition">
  <div className="flex items-center gap-4 mb-2">
    <FaTrophy className="text-yellow-500 text-2xl" />
    <h3 className="text-lg font-semibold text-gray-700">Latest Achievement</h3>
  </div>
  <div className="flex justify-between items-center mt-2">
    <div>
      <p className="text-md font-medium text-gray-800">{dashboardData.latestAchievement.title}</p>
      <p className="text-sm text-gray-500">{dashboardData.latestAchievement.date}</p>
    </div>
    <span className="text-[rgba(53,130,140,1)] font-bold text-lg">
      {dashboardData.latestAchievement.score}
    </span>
  </div>
</div>
      </div>
    </div>
  );
};

export default Home;
