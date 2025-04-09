import React, { useState } from 'react';
import SideBar from '../../components/sideBar/SideBar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const performanceData = [
  { class: 'Class 1', avgScore: 75 },
  { class: 'Class 2', avgScore: 82 },
  { class: 'Class 3', avgScore: 69 },
  { class: 'Class 4', avgScore: 88 },
  { class: 'Class 5', avgScore: 74 },
  { class: 'Class 6', avgScore: 91 },
  { class: 'Class 7', avgScore: 68 },
  { class: 'Class 8', avgScore: 80 },
  { class: 'Class 9', avgScore: 77 },
  { class: 'Class 10', avgScore: 85 },
];

// Determine best performance class
const bestClass = performanceData.reduce((prev, current) => {
  return current.avgScore > prev.avgScore ? current : prev;
}, performanceData[0]);

const bestPerformers = [
  { className: 'Class 1', student: 'John Doe' },
  { className: 'Class 2', student: 'Jane Smith' },
  { className: 'Class 3', student: 'Alice Johnson' },
  { className: 'Class 4', student: 'Michael Brown' },
  { className: 'Class 5', student: 'Emily Clark' },
  { className: 'Class 6', student: 'Daniel White' },
  { className: 'Class 7', student: 'Sophia King' },
  { className: 'Class 8', student: 'William Scott' },
  { className: 'Class 9', student: 'Olivia Green' },
  { className: 'Class 10', student: 'James Taylor' },
];

const AdminDashboard = () => {
  const [showAll, setShowAll] = useState(false);

  const visiblePerformers = showAll ? bestPerformers : bestPerformers.slice(0, 4);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Dashboard" />
      <div className="flex-1 p-4 md:ml-12 transition-all duration-300 mt-5">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold">Students</h3>
            <p className="text-3xl mt-2">150</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold">Teachers</h3>
            <p className="text-3xl mt-2">20</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold">Best Performing Class</h3>
            <p className="text-xl mt-2 text-[rgba(53,130,140,0.9)] font-semibold">{bestClass.class}</p>
            <p className="text-3xl mt-1">{bestClass.avgScore}%</p>
          </div>
        </div>

        {/* Best Performers */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Best Performers</h3>
          <ul className="space-y-2">
            {visiblePerformers.map((item, index) => (
              <li key={index} className="flex justify-between px-4 py-2 bg-gray-100 rounded-xl">
                <span>{item.className}</span>
                <span className="font-medium text-[rgba(53,130,140,0.9)]">{item.student}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-4">
            <button
              className="text-[rgba(53,130,140,0.9)] hover:underline font-medium"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'View Less' : 'View More'}
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
              <Bar dataKey="avgScore" fill="rgba(53,130,140,0.8)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
