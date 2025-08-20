import React, { useEffect, useState } from "react";
import StudentSideBar from "../../components/sideBar/studentSideBar";
import Loader from "../../components/loader/Loader";
import { getLevelData } from "../../utils/studentLevel";
import useStudentPerformanceData from "../../hooks/fetch/useStdPerfo";
import { useStudentContext } from "../../context/StudentContext";
import CCEModal from "../../components/modals/CCEModal";
import { cceExportUtils } from "../../utils/cceExportUtils";
import { fetchStudentById } from "../../redux/studentSlice";
import { jwtDecode } from "jwt-decode";
import { useSelector,useDispatch } from "react-redux";
const Performance = () => {
  const dispatch = useDispatch()
  const { data, loading, error } = useStudentPerformanceData();
  const { theme, subjects } = useStudentContext(); // subjects contains all subjects for the class
  const [showMore, setShowMore] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [isCCEModalOpen, setIsCCEModalOpen] = useState(false);
  const [cceData, setCceData] = useState(null);

  const performanceData = {
    cceMark: data?.cceScore,
    penaltyMarks: data?.penaltyScore,
    creditMarks: data?.creditScore,
    mentorMarks: data?.mentorMark,
    level: getLevelData(data?.totalScore),
    yourScore: `${data?.totalScore}`,
    recentInputs:
      data?.recentInputs[0]?.marks?.map((item) => ({
        title: item.title || "Untitled",
        score: `${item.score}`,
        scoreType: item.scoreType,
        date: item.date
          ? new Date(item.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Date not available",
      })) || [],
  };
  const displayedActivities = showAllActivities
    ? performanceData.recentInputs
    : performanceData.recentInputs.slice(0, 10);


  const openCCEModal = () => {
    // Pass both subjectWiseMarks and all subjects to the modal
    setCceData({
      subjectWiseMarks: data?.subjectWiseMarks || [],
      allSubjects: subjects || [],
    });
    setIsCCEModalOpen(true);
  };
  const columns = [
    { header: "SI No", key: "si", rowspan: 2 },
    { header: "Subject", key: "subject", rowspan: 2 },
    { header: "Semester", key: "semester", colspan: 2 },
    { header: "Total", key: "total", rowspan: 2 },
  ];
  const subColumns = [
    { header: "Rabee", key: "rabee" },
    { header: "Ramdan", key: "ramdan" },
  ];
  const getData = (student) => {
    const studentMarksMap = {};
    // Process student performance data to build marks map
    if (student.data && student.data.subjectWise) {
      const { subjectWise } = student.data;

      subjectWise.forEach((subject) => {
        const subjectName = subject.subjectName;

        if (!studentMarksMap[subjectName]) {
          studentMarksMap[subjectName] = {
            subjectName: subjectName,
            rabee: 0,
            ramdan: 0,
            total: 0,
          };
        }

        if (subject.semester === "Rabee Semester") {
          studentMarksMap[subjectName].rabee = subject.totalMark;
        } else if (subject.semester === "Ramdan Semester") {
          studentMarksMap[subjectName].ramdan = subject.totalMark;
        }

        studentMarksMap[subjectName].total += subject.totalMark;
      });
    } else if (Array.isArray(student)) {
      student.forEach((mark) => {
        const subjectName = mark.subjectName;
        if (!studentMarksMap[subjectName]) {
          studentMarksMap[subjectName] = {
            subjectName: subjectName,
            rabee: 0,
            ramdan: 0,
            total: 0,
          };
        }

        if (mark.semester === "Rabee" || mark.semester === "Rabee Semester") {
          studentMarksMap[subjectName].rabee = mark.totalMark || mark.mark;
        } else if (
          mark.semester === "Ramdan" ||
          mark.semester === "Ramdan Semester"
        ) {
          studentMarksMap[subjectName].ramdan = mark.totalMark || mark.mark;
        }

        studentMarksMap[subjectName].total += mark.totalMark || mark.mark;
      });
    } else if (student.subjectWise && Array.isArray(student.subjectWise)) {
      student.subjectWise.forEach((subject) => {
        const subjectName = subject.subjectName;

        if (!studentMarksMap[subjectName]) {
          studentMarksMap[subjectName] = {
            subjectName: subjectName,
            rabee: 0,
            ramdan: 0,
            total: 0,
          };
        }

        if (subject.semester === "Rabee Semester") {
          studentMarksMap[subjectName].rabee = subject.totalMark;
        } else if (subject.semester === "Ramdan Semester") {
          studentMarksMap[subjectName].ramdan = subject.totalMark;
        }

        studentMarksMap[subjectName].total += subject.totalMark;
      });
    }

    // Now create table data for ALL subjects in the class
    const tableData = subjects.map((subject, index) => {
      const subjectData = studentMarksMap[subject] || {
        subjectName: subject,
        rabee: 0,
        ramdan: 0,
        total: 0,
      };

      return {
        si: index + 1,
        subject: subjectData.subjectName,
        rabee: subjectData.rabee > 0 ? subjectData.rabee : 0,
        ramdan: subjectData.ramdan > 0 ? subjectData.ramdan : 0,
        total: subjectData.total,
      };
    });

    // Calculate semester totals
    const rabeeTotal = tableData.reduce((acc, curr) => acc + curr.rabee, 0);
    const ramdanTotal = tableData.reduce((acc, curr) => acc + curr.ramdan, 0);
    const grandTotal = tableData.reduce((acc, curr) => acc + curr.total, 0);

    // Append total row
    tableData.push({
      si: "",
      subject: "Total",
      rabee: rabeeTotal,
      ramdan: ramdanTotal,
      total: grandTotal,
    });

    return tableData;
  };
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const id = decodedToken.userId;

      // Fetch student details only when downloading
      const {student} = await dispatch(fetchStudentById({ id })).unwrap();
      const title = `CCE Scores of ${student.name} - AdmNo ${student.admNo}`;

      cceExportUtils.exportToPDF(
        getData(student), // pass freshly fetched student data
        columns,
        subColumns,
        title,
        student
      );
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Download failed: ${error.message}`);
    }
  };

  return (
    <div
      className={`flex min-h-screen bg-gradient-to-br from-gray-100 ${theme.bg}`}
    >
      <StudentSideBar page="Performance" />

      <div className="flex-1 p-1 md:ml-60 md:mt-8 mt-16 transition-all duration-300 overflow-y-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 transition-all">
                <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                  <h4 className="text-md font-semibold text-gray-700">
                    Credit Score
                  </h4>
                  <p className="text-2xl text-green-600 font-bold mt-1">
                    +{performanceData.creditMarks}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-md flex items-center justify-between">
                  <div>
                    <h4 className="text-md font-semibold text-gray-700">
                      CCE Score
                    </h4>
                    <p className="text-2xl text-blue-700 font-bold mt-1">
                      {performanceData.cceMark}
                    </p>
                  </div>
                  <button
                    onClick={openCCEModal}
                    className={`text-sm ${theme.color} text-white px-3 py-1.5 rounded-md ${theme.hoverBg} transition`}
                  >
                    View Details
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                  <h4 className="text-md font-semibold text-gray-700">
                    Mentor Score
                  </h4>
                  <p className="text-2xl text-gray-600 font-bold mt-1">
                    {performanceData.mentorMarks}
                  </p>
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
                {performanceData.recentInputs.length === 0 ? (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-gray-500 font-medium">No Inputs yet</p>
                  </div>
                ) : (
                  displayedActivities.map((activity, index) => (
                    <li
                      key={index}
                      className={`${
                        activity.scoreType === "Penalty"
                          ? "bg-red-100 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      } p-4 rounded-lg border  shadow-sm`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-md font-bold text-gray-700">
                            {activity.title}
                          </h3>
                          <h4 className="text-sm font-bold text-gray-700">
                            Score:{" "}
                            {activity.scoreType === "Penalty"
                              ? `-${activity.score}`
                              : activity.score}
                          </h4>

                          <p className="text-sm text-gray-500">
                            {activity.date}
                          </p>
                        </div>
                        <span className={`${theme.text} font-bold text-lg`}>
                          {activity.scoreType}
                        </span>
                      </div>
                    </li>
                  ))
                )}
              </ul>

              {performanceData.recentInputs.length > 10 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setShowAllActivities(!showAllActivities)}
                    className="text-blue-600 underline font-medium"
                  >
                    {showAllActivities ? "Show Less" : "See More"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <CCEModal
        isOpen={isCCEModalOpen}
        onClose={() => setIsCCEModalOpen(false)}
        cceData={cceData}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default Performance;
