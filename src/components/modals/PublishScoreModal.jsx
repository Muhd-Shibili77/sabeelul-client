import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClass } from "../../redux/classSlice";
import { getCurrentAcademicYear } from "../../utils/academicYear";
import { publishScore } from "../../redux/classSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PublishScoreModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.class);
  const [scoreType, setScoreType] = useState("CCe");
  const [selectedClass, setSelectedClass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSem, setSelectedSem] = useState("Rabee Semester");
  const scores = ["CCe", "Mentor", "PKV"];
  const semesters = ["Rabee Semester", "Ramadan Semester"];
  const academicYear = getCurrentAcademicYear();

  const handleScoreType = (type) => {
    setScoreType(type);
    setSelectedClass("");
  };

  useEffect(() => {
    if (classes.length === 0) {
      dispatch(fetchClass({ search: "", page: 1, limit: 1000 }));
    }
  }, [dispatch, classes.length]);

  const handleUpdate = async () => {
    if (!selectedClass) {
      toast.warning("Select a class!");
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(
        publishScore({
          classId: selectedClass,
          semester: selectedSem,
          scoreType: scoreType,
        })
      ).unwrap();

      toast.success("Score published successfully!");
      // Optionally close modal after successful publish
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      toast.error(err.message || "Failed to publish score");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div
          className={`bg-[rgba(53,130,140,0.9)] text-white p-4 flex justify-between items-center`}
        >
          <h3 className="text-xl font-bold">Publish Score</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mark Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto px-4 py-2">
            {scores.map((a) => (
              <button
                key={a}
                onClick={() => handleScoreType(a)}
                className={`px-4 py-2 mr-2 rounded-t-lg font-medium transition ${
                  scoreType === a
                    ? `bg-[rgba(53,130,140,0.9)] text-white`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className={"grid md:grid-cols-2 gap-5"}>
            <div className="mb-3">
              <select
                className="w-full p-2 border rounded"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <select
                className="w-full p-2 border rounded"
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
              >
                {semesters.map((sem, idx) => (
                  <option key={idx} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 mt-4">
            {!selectedClass ? (
              // Case 1: No class selected
              <div className="bg-gray-50 p-3 rounded flex items-center justify-center h-32">
                <span className="text-gray-500 font-medium">
                  Please Select Class
                </span>
              </div>
            ) : (
              (() => {
                // Find the selected class from redux store
                const selectedClassData = classes.find(
                  (cls) => cls._id === selectedClass
                );

                // Find existing score for the selected semester
                const existingScore = selectedClassData?.semesterAverages?.find(
                  (avg) =>
                    avg.semester === selectedSem &&
                    avg.academicYear === academicYear // match academic year too
                );

                if (!existingScore) {
                  // Case 2: Class selected but no score exists
                  return (
                    <div className="bg-gray-50 p-3 rounded flex items-center justify-center h-32">
                      <span className="text-gray-500 font-medium">
                        No existing score found for {selectedSem}
                      </span>
                    </div>
                  );
                }

                // Case 3: Score exists
                return (
                  <>
                    <h3 className="text-lg font-medium mb-2">Existing Score</h3>
                    <div className="bg-gray-50 p-3 rounded">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Semester
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {scoreType === "CCe" && "AVG CCE"}
                              {scoreType === "Mentor" && "AVG Mentor"}
                              {scoreType === "PKV" && "AVG PKV"}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-3 py-2 text-sm text-gray-900">
                              {existingScore
                                ? existingScore.semester
                                : selectedSem}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900">
                              {existingScore ? (
                                <>
                                  {scoreType === "CCe"
                                    ? existingScore.avgCCeMark ||
                                      existingScore.avgCCeMark === 0
                                      ? existingScore.avgCCeMark
                                      : "Not Published"
                                    : scoreType === "Mentor"
                                    ? existingScore.avgMentorMark ||
                                      existingScore.avgMentorMark === 0
                                      ? existingScore.avgMentorMark
                                      : "Not Published"
                                    : scoreType === "PKV"
                                    ? existingScore.avgPKVMark ||
                                      existingScore.avgPKVMark === 0
                                      ? existingScore.avgPKVMark
                                      : "Not Published"
                                    : "Not Published"}
                                </>
                              ) : (
                                <span className="text-gray-500 italic">
                                  No data available
                                </span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              })()
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition`}
          >
            Close
          </button>
          <button
            onClick={handleUpdate}
            disabled={isSubmitting || !selectedClass}
            className={`px-4 py-2 flex justify-center items-center ${
              isSubmitting || !selectedClass
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[rgba(53,130,140,0.9)] hover:bg-[rgba(53,130,140,1)]"
            } text-white rounded transition`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Publishing...
              </div>
            ) : (
              "Publish Score"
            )}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default PublishScoreModal;
