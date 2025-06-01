import React from "react";
import StudentSideBar from "../../components/sideBar/studentSideBar";
import { FaChalkboardTeacher, FaTrophy } from "react-icons/fa";
import Loader from "../../components/loader/Loader";
import { getLevelData } from "../../utils/studentLevel";
import useStudentDashboardData from "../../hooks/fetch/useStudentDashboard";
import { useStudentContext } from "../../context/StudentContext";
const Home = () => {
  const {  theme } = useStudentContext();
  const {data,loading,error } = useStudentDashboardData()
  const dashboardData = {
   
    totalMark: data?.marks,
    className: data?.class?.name,
    classLogo : data?.class?.icon,
    student: {
      name: data?.name,
      image: data?.profileImage,
    },
    latestAchievement: {
      title: data?.latestAchievement?.name,
      score: `${data?.latestAchievement?.mark}`,
      date: data?.latestAchievement?.date ? new Date(data?.latestAchievement?.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not available",
    },
  };


  const level = getLevelData(dashboardData.totalMark);

  return (
    <div className={`flex min-h-screen bg-gradient-to-br from-gray-100 ${theme.bg}`}>
      <StudentSideBar page="Dashboard" />
  
      <div className="flex-1 p-9 md:ml-68 transition-all duration-300 overflow-y-auto mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader color={theme.color} />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-600 text-lg font-semibold">
              ⚠ Failed to load dashboard data
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
                <img
                  src={dashboardData.student.image}
                  alt="Student"
                  className={`w-14 h-14 rounded-full border-2 ${theme.border} object-cover`}
                />
                <div>
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="text-md font-medium text-gray-800">
                    {dashboardData.student.name}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
                <img
                  src={`${import.meta.env.VITE_API_URL}/${dashboardData.classLogo}`}
                  alt="Student"
                  className={`w-14 h-14 rounded-full border-2 ${theme.border} object-cover`}
                />
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="text-md font-medium text-gray-800">
                    {dashboardData.className}
                  </p>
                </div>
              </div>
            </div>
  
            {/* Score & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <p className="text-sm text-gray-500 mb-1">Your Score</p>
                <h2 className={`text-4xl font-bold ${theme.text}`}>{dashboardData.totalMark}</h2>
              </div>
  
              <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Your Level</p>
                  <h3 className="text-2xl font-semibold text-gray-800">{level.label}</h3>
                </div>
                <div
                  className={`w-10 h-10 rounded-full ${level.color} border-4 border-white shadow-md`}
                />
              </div>
            </div>
  
            {/* Achievement */}
           
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <FaTrophy className="text-yellow-500 text-2xl" />
                <h3 className="text-lg font-semibold text-gray-800">Latest Achievement</h3>
              </div>
              {!data.latestAchievement ? (
                <div className="flex justify-center items-center h-20">
                <p className="text-gray-500 italic">No achievement yet</p>
              </div>
              ):(
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">{dashboardData.latestAchievement.title}</p>
                  <p className="text-sm text-gray-500">{dashboardData.latestAchievement.date}</p>
                </div>
                <span className={`${theme.text} text-lg font-bold`}>
                  {dashboardData.latestAchievement.score}
                </span>
              </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
  
};

export default Home;
