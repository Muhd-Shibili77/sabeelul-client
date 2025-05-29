import React, { useState } from "react";
import SideBar from "../../components/sideBar/SideBar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import useAdminDashboard from "../../hooks/fetch/useAdmin";

const AdminDashboard = () => {
  const [showAll, setShowAll] = useState(false);
  const { data, loading, error } = useAdminDashboard();

  const performanceData =
    data?.classAnalysis?.map((item) => ({
      class: item.className,
      totalScore: item.totalScore,
    })) || [];

  const bestPerformers =
    data?.performerInClass?.map((item) => ({
      className: item?.classId?.name,
      student: item?.name,
      mark: item?.performanceScore + 200,
    })) || [];

  const visiblePerformers = showAll
    ? bestPerformers
    : bestPerformers.slice(0, 6);

  return (
    <div className="flex  min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Dashboard" />
      <div className="flex-1 p-4 md:ml-64 md:mt-4 mt-16  transition-all duration-300 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold">Students</h3>
            <p className="text-3xl mt-2">{data?.totalStudents}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold">Teachers</h3>
            <p className="text-3xl mt-2">{data?.totalTeachers}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold">Best Performing Class</h3>
            <p className="text-xl mt-2 text-[rgba(53,130,140,0.9)] font-semibold">
              {data?.bestPerformerClass?.className}
            </p>
            <p className="text-3xl mt-1">
              {Math.round(data?.bestPerformerClass?.totalScore)}
            </p>
          </div>
        </div>

        {/* Best Performers */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Class Toppers</h3>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visiblePerformers.map((item, index) => (
              <>
                <li
                  key={index}
                  className="bg-gray-100 rounded-xl p-4 shadow-sm flex justify-between items-start"
                >
                  <div>
                    <span className="block font-semibold text-[rgba(53,130,140,0.9)] text-lg mb-1">
                      {item.student}
                    </span>
                    <span className="block text-sm text-gray-600">
                      Mark:{" "}
                      <span className="font-medium text-[rgba(53,130,140,0.9)]">
                         {Math.round(item.mark)}
                      </span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{item.className}</div>
                </li>
              </>
            ))}
          </ul>

          <div className="flex justify-end mt-4">
            <button
              className="text-[rgba(53,130,140,0.9)] hover:underline font-medium"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "View Less" : "View More"}
            </button>
          </div>
        </div>

        {/* Class-wise Performance Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Class-wise Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="totalScore"
                fill="rgba(53,130,140,0.8)"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
