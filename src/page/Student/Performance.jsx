import React, { useState } from 'react';
import StudentSideBar from '../../components/sideBar/studentSideBar';

const Performance = () => {
  const [showMore, setShowMore] = useState(false);

  const performanceData = {
    attendance: 92,
    overallGrade: 'A',
    internalMark: 78,
    penaltyMarks: -5, // For misbehavior
    creditMarks: 7,   // For good participation
    activities: [
      { title: 'Elocution Competition', score: '8.5 / 10', date: 'March 20, 2025' },
      { title: 'Science Fair Presentation', score: '9 / 10', date: 'February 15, 2025' },
      { title: 'Debate (District Level)', score: '7.8 / 10', date: 'January 10, 2025' },
    ],
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <StudentSideBar page="Performance" />

      <div className="flex-1 p-6 mt-5 md:ml-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Performance</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[rgba(53,130,140,0.1)] p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Attendance</h3>
              <p className="text-3xl font-bold text-[rgba(53,130,140,1)] mt-2">{performanceData.attendance}%</p>
              <p className="text-sm text-gray-600 mt-1">Overall academic attendance</p>
            </div>
            <div className="bg-[rgba(53,130,140,0.1)] p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Overall Grade</h3>
              <p className="text-3xl font-bold text-[rgba(53,130,140,1)] mt-2">{performanceData.overallGrade}</p>
              <p className="text-sm text-gray-600 mt-1">Based on term assessments</p>
            </div>
          </div>

          {/* Toggle Details Button */}
          <div className="text-right">
            <button
              onClick={() => setShowMore(!showMore)}
              className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded hover:bg-[rgba(53,130,140,1)] transition"
            >
              {showMore ? 'Hide Detailed Marks' : 'View Detailed Marks'}
            </button>
          </div>

          {/* Conditional Rendering of Details */}
          {showMore && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all">
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h4 className="text-md font-semibold text-gray-700">Internal Mark</h4>
                <p className="text-2xl text-gray-800 font-bold mt-1">{performanceData.internalMark}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h4 className="text-md font-semibold text-gray-700">Penalty Mark</h4>
                <p className="text-2xl text-red-500 font-bold mt-1">{performanceData.penaltyMarks}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h4 className="text-md font-semibold text-gray-700">Credit Mark</h4>
                <p className="text-2xl text-green-600 font-bold mt-1">+{performanceData.creditMarks}</p>
              </div>
            </div>
          )}

          {/* Recent Activities */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
            <ul className="space-y-4">
              {performanceData.activities.map((activity, index) => (
                <li
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-md font-semibold text-gray-700">{activity.title}</h4>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                    <span className="text-[rgba(53,130,140,1)] font-bold text-lg">
                      {activity.score}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
