import React from "react";
import StudentSideBar from "../../components/sideBar/studentSideBar";
import { FaChalkboardTeacher, FaTrophy } from "react-icons/fa";

const Home = () => {
  const dashboardData = {
    studentName: "",
    todayAttendance: "Present",
    totalAttendance: 92,
    overallGrade: "A",
    internalMark: 78,
    className: "Grade 10 - B",
    student: {
      name: "Aliya Rahman",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    latestAchievement: {
      title: "Elocution Competition",
      score: "8.5 / 10",
      date: "March 20, 2025",
    },
  };

  const getLevelData = (mark) => {
    if (mark >= 85) return { color: "bg-green-500", label: "Green" };
    if (mark >= 70) return { color: "bg-blue-500", label: "Blue" };
    if (mark >= 50) return { color: "bg-purple-500", label: "Purple" };
    return { color: "bg-red-500", label: "Red" };
  };

  const level = getLevelData(dashboardData.internalMark);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <StudentSideBar page="Dashboard" />

      <div className="flex-1 p-6 md:p-10">
        

        {/* Class Info & Teacher */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
          <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
            <img
              src={dashboardData.student.image}
              alt="Class Teacher"
              className="w-14 h-14 rounded-full border-2 border-cyan-600 object-cover"
            />
            <div>
              <p className="text-sm text-gray-500">Student Name</p>
              <p className="text-md font-medium text-gray-800">{dashboardData.student.name}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
            <FaChalkboardTeacher className="text-cyan-700 text-3xl" />
            <div>
              <p className="text-sm text-gray-500">Class</p>
              <h3 className="text-lg font-semibold text-gray-800">{dashboardData.className}</h3>
            </div>
          </div>
        </div>

        {/* Score & Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-sm text-gray-500 mb-1">Your Score</p>
            <h2 className="text-4xl font-bold text-cyan-700">{dashboardData.internalMark}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Your Level</p>
              <h3 className="text-2xl font-semibold text-gray-800">{level.label}</h3>
            </div>
            <div className={`w-10 h-10 rounded-full ${level.color} border-4 border-white shadow-md`} />
          </div>
        </div>

        {/* Achievement */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            <FaTrophy className="text-yellow-500 text-2xl" />
            <h3 className="text-lg font-semibold text-gray-800">Latest Achievement</h3>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-700">{dashboardData.latestAchievement.title}</p>
              <p className="text-sm text-gray-500">{dashboardData.latestAchievement.date}</p>
            </div>
            <span className="text-cyan-700 text-lg font-bold">
              {dashboardData.latestAchievement.score}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
