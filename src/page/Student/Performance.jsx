import React, { useState } from "react";
import StudentSideBar from "../../components/sideBar/studentSideBar";

const Performance = () => {
  const [showMore, setShowMore] = useState(false);

  const performanceData = {
    attendance: 92,
    overallGrade: "A",
    cceMark: 78,
    penaltyMarks: -5,
    creditMarks: 7,
    level: "Blue",
    yourScore: "286 / 500",
    activities: [
      {
        title: "Elocution Competition",
        score: "8.5 / 10",
        date: "March 20, 2025",
      },
      {
        title: "Science Fair Presentation",
        score: "9 / 10",
        date: "February 15, 2025",
      },
      {
        title: "Debate (District Level)",
        score: "7.8 / 10",
        date: "January 10, 2025",
      },
    ],
  };
  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'red':
        return 'bg-red-500';
      case 'orange':
        return 'bg-orange-400';
      case 'purple':
        return 'bg-purple-500';
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <StudentSideBar page="Performance" />

      <div className="flex-1 p-6 mt-5 md:ml-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Student Performance
          </h2>

          {/* Your Score and Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[rgba(53,130,140,0.1)] p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Your Score
              </h3>
              <p className="text-3xl font-bold text-[rgba(53,130,140,1)] mt-2">
                {performanceData.yourScore}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Based on overall performance
              </p>
            </div>
            <div className="bg-[rgba(53,130,140,0.1)] p-6 rounded-lg shadow relative">
              <h3 className="text-lg font-semibold text-gray-700">
                Your Level
              </h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-3xl font-bold text-[rgba(53,130,140,1)]">
                  {performanceData.level}
                </p>
                <span
                  className={`w-10 h-10 rounded-full ${getLevelColor(
                    performanceData.level
                  )}`}
                  title={`Level: ${performanceData.level}`}
                ></span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Level classification</p>
            </div>
          </div>

          {/* Toggle Details Button */}
          <div className="text-right">
            <button
              onClick={() => setShowMore(!showMore)}
              className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded hover:bg-[rgba(53,130,140,1)] transition"
            >
              {showMore ? "Hide Detailed Scores" : "View Detailed Scores"}
            </button>
          </div>

          {/* Conditional Rendering of Details */}
          {showMore && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all">
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h4 className="text-md font-semibold text-gray-700">
                  Credit Score
                </h4>
                <p className="text-2xl text-green-600 font-bold mt-1">
                  +{performanceData.creditMarks}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h4 className="text-md font-semibold text-gray-700">
                  CCE Score
                </h4>
                <a
                  href="#"
                  className="text-2xl text-blue-700 font-bold mt-1 block underline"
                >
                  {performanceData.cceMark}
                </a>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h4 className="text-md font-semibold text-gray-700">
                  Penalty Score
                </h4>
                <p className="text-2xl text-red-500 font-bold mt-1">
                  {performanceData.penaltyMarks}
                </p>
              </div>
            </div>
          )}

          {/* Recent Inputs */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Inputs
            </h3>
            <ul className="space-y-4">
              {performanceData.activities.map((activity, index) => (
                <li
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-md font-semibold text-gray-700">
                        {activity.title}
                      </h4>
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
