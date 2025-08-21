import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchClass } from "../../redux/classSlice";
import useFetchStudents from "../../hooks/fetch/useFetchStudents";
import { getCurrentAcademicYear } from "../../utils/academicYear";
import { addPkvMark } from "../../redux/studentSlice";

const PKVScore = () => {
  const dispatch = useDispatch();
  const semesters = ["Rabee Semester", "Ramadan Semester"];
  const academicYear = getCurrentAcademicYear();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [marks, setMarks] = useState({});
  const [issubmit, setIsSubmit] = useState(false);
  const { students } = useFetchStudents(selectedClass);
  const { classes } = useSelector((state) => state.class);
  useEffect(() => {
    dispatch(fetchClass({ search: "", page: 1, limit: 1000 }));
  }, [dispatch]);

  const shouldShowStudents = () => {
    return selectedClass && selectedSemester;
  };

  const getExistingMark = (student, phase) => {
    // First check current marks state
    if (marks[student._id] !== undefined) {
      return marks[student._id];
    }

    // Check saved data
    const PKVRecord = student.PKVMarks?.find(
      (m) => m.academicYear === academicYear && m.semester === selectedSemester
    );
    return PKVRecord ? PKVRecord.mark : "";
  };

  const handleMarkChange = (studentId, value) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: Number(value), // save only one score per student
    }));
  };

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    setMarks({});
  };
  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
    setMarks({});
  };
  const handlePKVSubmit = async () => {
    setIsSubmit(true);
    try {
      const batchPayload = [];

      for (const studentId in marks) {
        const mark = marks[studentId];

        // === Validation ===
        if (mark === undefined || mark === null || mark === "") continue;

        if (mark < 0) {
          toast.error("PKV Score should be greater than or equal to 0.");
          setIsSubmit(false);
          return;
        }

        if (mark > 50) {
          toast.error("PKV Score cannot exceed 50.");
          setIsSubmit(false);
          return;
        }

        batchPayload.push({
          id: studentId,
          data: {
            semester: selectedSemester,
            mark: Number(mark),
          },
        });
      }

      if (batchPayload.length > 0) {
        // 🔥 call PKV API
        await dispatch(addPkvMark({ data: batchPayload })).unwrap();
        toast.success("PKV Scores submitted successfully!");
      } else {
        toast.info("No valid marks to submit.");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to submit PKV Scores.");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <div className="flex gap-4 mb-4 flex-wrap">
        <select
          className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
          value={selectedClass}
          onChange={(e) => handleClassChange(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((cls, idx) => (
            <option key={idx} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
          value={selectedSemester}
          onChange={(e) => handleSemesterChange(e.target.value)}
        >
          <option value="">Select Semester</option>
          {semesters.map((semester) => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>
      </div>
      {shouldShowStudents() ? (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Students List - PKV Score ({selectedSemester})
            </h2>

            {students.length === 0 ? (
              <p className="text-gray-500 italic">
                No students available for this class.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-[rgba(53,130,140,0.1)]">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Sl No
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Ad No
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Class
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students
                      .slice()
                      .sort((a, b) => a.admissionNo - b.admissionNo)
                      .map((student, index) => (
                        <tr
                          key={student._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                            {student.admissionNo}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                            {student.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                            {student.classId.name}
                          </td>

                          <td className="px-4 py-3 text-center border-b border-gray-100">
                            <div className="flex flex-col items-center">
                              <input
                                id={`${student._id}`}
                                type="number"
                                className={`w-16 px-2 py-1 border appearance-none border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(53,130,140,0.5)] 
                              ${
                                marks[student._id] > 50
                                  ? "border-red-500 text-red-600"
                                  : ""
                              }`}
                                value={getExistingMark(student)}
                                onChange={(e) =>
                                  handleMarkChange(student._id, e.target.value)
                                }
                                disabled={issubmit}
                              />
                              {marks[student._id] > 50 && (
                                <span className="text-xs text-red-500 mt-1">
                                  Max: 50
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {students.length > 0 && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handlePKVSubmit}
                  disabled={issubmit}
                  className={`px-6 py-2 rounded-lg shadow transition duration-200 flex items-center gap-2 ${
                    issubmit
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-[rgba(53,130,140,0.9)] text-white hover:bg-[rgba(53,130,140,1)]"
                  }`}
                >
                  {issubmit && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {issubmit ? "Submitting..." : "Submit Score"}
                </button>
              </div>
            )}
          </>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500 italic text-center">
            Please select class, and semester view students.
          </p>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </>
  );
};

export default PKVScore;
