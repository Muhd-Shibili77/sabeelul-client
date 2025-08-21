import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchClass } from "../../redux/classSlice";
import useFetchStudents from "../../hooks/fetch/useFetchStudents";
import { getCurrentAcademicYear } from "../../utils/academicYear";
import { addMentorMark } from "../../redux/studentSlice";

const MentorScore = () => {
  const dispatch = useDispatch();
  const semesters = ["Rabee Semester", "Ramadan Semester"];
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [marks, setMarks] = useState({});
  const [isSubmittingMentor, setIsSubmittingMentor] = useState(false);
  const { classes } = useSelector((state) => state.class);
  const { students } = useFetchStudents(selectedClass);
  const academicYear = getCurrentAcademicYear();
  useEffect(() => {
    dispatch(fetchClass({ search: "", page: 1, limit: 1000 }));
  }, [dispatch]);

  const getExistingMark = (student, phase) => {
    // First check current marks state
    if (marks[student._id]?.[phase] !== undefined) {
      return marks[student._id][phase];
    }

    if (phase === "Mentor") {
      // Check saved Mentor data
      const mentorRecord = student.mentorMarks?.find(
        (m) =>
          m.academicYear === academicYear && m.semester === selectedSemester
      );
      return mentorRecord ? mentorRecord.mark : "";
    }

    return "";
  };
  const handleMarkChange = (studentId, phase, value) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [phase]: value,
      },
    }));
  };
  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    setMarks({});
    setSelectedStudent("");
  };
  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
    setMarks({});
  };
  const handleStudentChange = (studentId) => {
    setSelectedStudent(studentId);
    setMarks({});
  };
  const shouldShowStudents = () => {
    return selectedClass && selectedSemester && selectedStudent;
  };
  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingMentor(true);
    try {
      for (const studentId in marks) {
        const mark = marks[studentId]["Mentor"];
        if (mark > 30) {
          toast.error("Mentor Score cannot exceed 30.");
          setIsSubmittingMentor(false);
          return;
        }
        if (mark) {
          await dispatch(
            addMentorMark({
              id: studentId,
              data: {
                mark,
                semester: selectedSemester,
              },
            })
          );
        }
      }
      toast.success("Mentor Score submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit mentor Score.");
    } finally {
      setIsSubmittingMentor(false);
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
        <select
          className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
          value={selectedStudent}
          onChange={(e) => handleStudentChange(e.target.value)}
        >
          <option value="">Select Student</option>
          {students
            .slice()
            .sort((a, b) => a.admissionNo - b.admissionNo)
            .map((student) => (
              <option key={student._id} value={student._id}>
                {student.admissionNo} - {student.name}
              </option>
            ))}
        </select>
      </div>
      {shouldShowStudents() ? (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Mentor Score ({selectedSemester})
          </h2>
          {(() => {
            const student = students.find((s) => s._id === selectedStudent);
            return student ? (
              <div className="bg-[rgba(53,130,140,0.1)] rounded-xl p-6">
                <div className="mb-4">
                  <p className="font-medium text-gray-700 text-lg">
                    <span className="text-[rgba(53,130,140,0.9)]">Ad No:</span>{" "}
                    {student.admissionNo}
                  </p>
                  <p className="font-medium text-gray-700 text-lg">
                    <span className="text-[rgba(53,130,140,0.9)]">Name:</span>{" "}
                    {student.name}
                  </p>
                </div>
                <form onSubmit={handleMentorSubmit}>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="mentor-mark"
                      className="text-sm font-medium text-gray-700"
                    >
                      Mentor Score
                    </label>
                    <input
                      id="mentor-mark"
                      type="number"
                      className={`w-40 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(53,130,140,0.5)]
                        ${
                          marks[student._id]?.["Mentor"] > 30
                            ? "border-red-500 text-red-600"
                            : ""
                        }
                      `}
                      value={getExistingMark(student, "Mentor")}
                      onChange={(e) =>
                        handleMarkChange(student._id, "Mentor", e.target.value)
                      }
                      placeholder="Enter Score"
                      disabled={isSubmittingMentor}
                    />
                    {marks[student._id]?.["Mentor"] > 30 && (
                      <span className="text-xs text-red-500 mt-1">Max: 30</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingMentor}
                    className={`mt-6 px-6 py-2 rounded-lg shadow transition duration-200 flex items-center gap-2 ${
                      isSubmittingMentor
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-[rgba(53,130,140,0.9)] text-white hover:bg-[rgba(53,130,140,1)]"
                    }`}
                  >
                    {isSubmittingMentor && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isSubmittingMentor ? "Submitting..." : "Submit Score"}
                  </button>
                </form>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Please select a student to enter Score.
              </p>
            );
          })()}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500 italic text-center">
            Please select class, semester, student to enter score
          </p>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </>
  );
};

export default MentorScore;
