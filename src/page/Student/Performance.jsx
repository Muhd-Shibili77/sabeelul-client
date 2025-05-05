import React, { useState } from "react";
import StudentSideBar from "../../components/sideBar/studentSideBar";
import Loader from "../../components/loader/Loader";
import { getLevelData } from "../../utils/studentLevel";
import useStudentPerformanceData from "../../hooks/fetch/useStdPerfo";
import { useStudentContext } from "../../context/StudentContext";

const Performance = () => {
  const { data, loading, error } = useStudentPerformanceData();
  const { totalMark, theme } = useStudentContext();

  const [showMore, setShowMore] = useState(false);

  const performanceData = {
    cceMark: data?.cceScore,
    penaltyMarks: 0,
    creditMarks: data?.creditScore,
    level: getLevelData(data?.totalScore),
    yourScore: `${data?.totalScore} / 500`,
    activities: data?.achievments?.map((item) => ({
      title: item.name || "Untitled",
      score: `${item.mark} / 10`,
      date: item.date
        ? new Date(item.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Date not available",
    })) || [],
  };

  return (
    <div className={`flex min-h-screen bg-gradient-to-br from-gray-100 ${theme.bg}`}>
      <StudentSideBar page="Performance" />

      <div className="flex-1 p-1 md:ml-60 transition-all duration-300 overflow-y-auto mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-600 text-lg font-semibold">
              ⚠ Failed to load dashboard data
            </p>
          </div>
        ) : (
          <div className="md:max-w-5xl max-w-90 mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Student Performance
            </h2>

            {/* Your Score and Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[rgba(53,130,140,0.1)] p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">
                  Your Score
                </h3>
                <p className={`text-3xl font-bold ${theme.text} mt-2`}>
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
                  <p className={`text-3xl font-bold ${theme.text}`}>
                    {performanceData?.level?.label}
                  </p>
                  <span
                    className={`w-10 h-10 rounded-full ${performanceData.level.color} border-4 border-white shadow-md`}
                    title={`Level: ${performanceData.level.label}`}
                  ></span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Level classification
                </p>
              </div>
            </div>

            {/* Toggle Details Button */}
            <div className="text-right">
              <button
                onClick={() => setShowMore(!showMore)}
                className={`${theme.color} text-white px-4 py-2 rounded ${theme.hoverBg} transition`}
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
                    
                    className="text-2xl text-blue-700 font-bold mt-1 block"
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
                {!data.achievments ? (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-gray-500 font-medium">
                      No achievements yet
                    </p>
                  </div>
                ) : (
                  performanceData.activities.map((activity, index) => (
                    <li
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-md font-semibold text-gray-700">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {activity.date}
                          </p>
                        </div>
                        <span className={`${theme.text} font-bold text-lg`}>
                          {activity.score}
                        </span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Performance;
