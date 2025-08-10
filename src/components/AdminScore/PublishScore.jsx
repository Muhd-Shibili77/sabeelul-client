import React, { useEffect, useState } from "react";
import PublishScoreModal from "../modals/PublishScoreModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchFullScore } from "../../redux/classSlice";
import ReportLoader from "../loader/reportLoader";
import ReportError from "../loader/reportError";

const PublishScore = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { fullScore, loading, error } = useSelector((state) => state.class);

  useEffect(() => {
    dispatch(fetchFullScore());
  }, [dispatch]);

  // Calculate totals and averages
  const calculateClassData = (classItem) => {
    const semesters = Object.values(classItem.scores); // [ {CCe, Mentor, PKV}, ... ]

    const avgCCE = semesters.reduce((sum, sem) => sum + (sem.CCe || 0), 0);
    const avgMentor = semesters.reduce(
      (sum, sem) => sum + (sem.Mentor || 0),
      0
    );
    const avgPKV = semesters.reduce((sum, sem) => sum + (sem.PKV || 0), 0);

    const totalScore = avgCCE + avgMentor + avgPKV;

    return { totalScore, avgCCE, avgMentor, avgPKV };
  };

  const calculateGrandTotal = (totalScore) => totalScore + 50; // Example logic

  if (loading) {
    return <ReportLoader content={`Fetching scores. Please wait...`} />;
  }

  if (error) {
    return <ReportError content="Failed to Load scores" error={error} />;
  }
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      {/* Header */}
      <div className="mb-2 flex justify-between items-center">
        <h1 className="font-bold text-lg p-1">Publish Score</h1>
        <button
          className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded-lg hover:bg-[rgba(53,130,140,1)]"
          onClick={() => setShowModal(!showModal)}
        >
          Publish
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Sl No</th>
            <th className="border border-gray-300 p-2">Class</th>
            {/* <th className="border border-gray-300 p-2">Total Score</th> */}
            <th className="border border-gray-300 p-2">Avg CCE</th>
            <th className="border border-gray-300 p-2">Avg Mentor</th>
            <th className="border border-gray-300 p-2">Avg PKV</th>
            <th className="border border-gray-300 p-2">Grand Total</th>
          </tr>
        </thead>
        <tbody>
          {fullScore?.map((classItem, index) => {
            const { totalScore, avgCCE, avgMentor, avgPKV } =
              calculateClassData(classItem);
            return (
              <tr key={classItem.classId}>
                <td className="border border-gray-300 p-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {classItem.className}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {avgCCE}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {avgMentor}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {avgPKV}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {totalScore}
                </td>
                {/* <td className="border border-gray-300 p-2 text-center">
                  {calculateGrandTotal(totalScore)}
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && <PublishScoreModal onClose={() => setShowModal(false)} />}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default PublishScore;
