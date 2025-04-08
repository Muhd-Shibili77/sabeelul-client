import React, { useState } from "react";
import TeacherSideBar from "../../components/sideBar/teacherSideBar";

const Dashboard = () => {
  const [filter, setFilter] = useState("All");

  const classPerformance = [
    { class: "8A", score: 88 },
    { class: "9B", score: 91 },
    { class: "10C", score: 84 },
    { class: "7D", score: 76 },
    { class: "6A", score: 76 },
    { class: "5V", score: 76 },
    { class: "4D", score: 76 },
    { class: "3C", score: 76 },
    { class: "2B", score: 76 },
    { class: "1A", score: 76 },
  ];

  const teacherClass = "9B";
  const bestClass = classPerformance.reduce((a, b) =>
    a.score > b.score ? a : b
  );

  const filteredClasses =
    filter === "All"
      ? classPerformance
      : classPerformance.filter((item) => item.class === filter);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <TeacherSideBar page="Dashboard" />
      <div className="flex-1 p-6 md:ml-10 transition-all duration-300 mt-5">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

        {/* Best Performing Class */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            🏆 Best Performing Class
          </h2>
          <p className="text-lg text-green-600 font-medium">
            Class {bestClass.class} with {bestClass.score}% average
          </p>
        </div>

        {/* Class Performance Filter */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              📊 Overall Class Performance
            </h2>
            <select
              className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
            >
              <option value="All">All</option>
              {classPerformance.map((item, i) => (
                <option key={i} value={item.class}>
                  {item.class}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClasses.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-[rgba(53,130,140,0.1)] shadow-sm"
              >
                <p className="text-lg font-medium text-gray-800">
                  Class {item.class}
                </p>
                <p className="text-md text-gray-600">Average: {item.score}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher's Own Class Performance */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            📘 Your Class Performance (Class Teacher of {teacherClass})
          </h2>
          <p className="text-lg text-blue-600 font-medium">
            {classPerformance.find((c) => c.class === teacherClass)?.score || 0}%
            average
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
