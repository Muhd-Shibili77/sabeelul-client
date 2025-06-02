import React, { useEffect, useState } from "react";
import TeacherSideBar from "../../components/sideBar/teacherSideBar";
import { fetchClass } from "../../redux/classSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addCceMark, addMentorMark } from "../../redux/studentSlice";
import useFetchStudents from "../../hooks/fetch/useFetchStudents";
import { getCurrentAcademicYear } from "../../utils/academicYear";

const Score = () => {
  const dispatch = useDispatch();
  const [subjects, setSubjects] = useState([]);
  const [scoreType, setScoreType] = useState("CCE");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const { classes } = useSelector((state) => state.class);
  const { students } = useFetchStudents(selectedClass);
  const [marks, setMarks] = useState({});
  const academicYear = getCurrentAcademicYear();

  // Semester options
  const semesters = ["Rabee Semester", "Ramadan Semester"];

  useEffect(() => {
    dispatch(fetchClass({ search: "", page: 1, limit: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (!selectedClass) return;

    const cls = classes.find((c) => c._id === selectedClass);
    if (cls && cls.subjects) {
      setSubjects(cls.subjects); // assuming `subjects` is an array in class object
    } else {
      setSubjects([]);
    }
  }, [selectedClass, classes]);

  const handleMarkChange = (studentId, phase, value) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [phase]: value,
      },
    }));
  };

  const handleMentorSubmit = async () => {
    try {
      for (const studentId in marks) {
        const mark = marks[studentId]["Mentor"];
        if (mark) {
          await dispatch(addMentorMark({ 
            id: studentId, 
            data: { 
              mark,
              semester: selectedSemester 
            } 
          }));
        }
      }
      toast.success("Mentor Score submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit mentor Score.");
    }
  };

  const handleCCESubmit = async () => {
    try {
      for (const studentId in marks) {
        const studentMarks = marks[studentId];
        
        // Check if total mark exceeds 30
        const totalMark = calculateTotalMark(studentId);
        if (totalMark > 30) {
          toast.error(`Total Score for a student cannot exceed 30. Current total: ${totalMark}`);
          return;
        }

        for (const phase of ["Phase 1", "Phase 2", "Phase 3"]) {
          const mark = studentMarks[phase];
          
          if (mark && mark < 0) {
            toast.error("CCE Score should be greater than 0.");
            return 
          }

          if (mark && mark >= 0) {
            const data = {
              classId: selectedClass,
              subjectName: selectedSubject,
              semester: selectedSemester,
              phase,
              mark: Number(mark),
            };
            await dispatch(addCceMark({ id: studentId, data }));
          }
        }
      }
      toast.success("CCE Score submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit CCE Score.");
    }
  };

  // Calculate total mark for a student
  const calculateTotalMark = (studentId) => {
    // Get the marks from state or existing student data
    const getPhaseValue = (phase) => {
      // First try to get from our current marks state
      if (marks[studentId]?.[phase] !== undefined) {
        return marks[studentId][phase] ? Number(marks[studentId][phase]) : 0;
      }

      // Otherwise look in the student's existing saved marks
      const student = students.find((s) => s._id === studentId);
      if (!student) return 0;

      const cceRecord = student.cceMarks?.find(
        (m) => m.academicYear === academicYear && m.semester === selectedSemester
      );
      
      if (!cceRecord) return 0;

      const subjectMark = cceRecord.subjects?.find(
        (s) => s.subjectName === selectedSubject && s.phase === phase
      );

      return subjectMark ? Number(subjectMark.mark) : 0;
    };

    // Calculate sum of all phases
    const phase1 = getPhaseValue("Phase 1");
    const phase2 = getPhaseValue("Phase 2");
    const phase3 = getPhaseValue("Phase 3");

    return phase1 + phase2 + phase3;
  };

  // Check if we should show students list
  const shouldShowStudents = () => {
    if (scoreType === "CCE") {
      return selectedClass && selectedSubject && selectedSemester;
    } else {
      return selectedClass && selectedSemester && selectedStudent;
    }
  };

  // Handle keyboard navigation for CCE table
  const handleKeyDown = (e, studentIndex, phase) => {
    if (e.key === 'Tab') {
      // Default tab behavior for phase navigation
      return;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // Move to the same phase of the next student
      const nextStudentIndex = studentIndex + 1;
      if (nextStudentIndex < students.length) {
        const nextInputId = `${students[nextStudentIndex]._id}-${phase}`;
        const nextInput = document.getElementById(nextInputId);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  // Get existing mark value for display
  const getExistingMark = (student, phase) => {
    // First check current marks state
    if (marks[student._id]?.[phase] !== undefined) {
      return marks[student._id][phase];
    }

    if (scoreType === "CCE") {
      // Check saved CCE data
      const cceRecord = student.cceMarks?.find(
        (m) => m.academicYear === academicYear && m.semester === selectedSemester
      );
      
      if (cceRecord) {
        const subjectMark = cceRecord.subjects?.find(
          (s) => s.subjectName === selectedSubject && s.phase === phase
        );
        return subjectMark ? subjectMark.mark : "";
      }
    } else if (phase === "Mentor") {
      // Check saved Mentor data
      const mentorRecord = student.mentorMarks?.find(
        (m) => m.academicYear === academicYear && m.semester === selectedSemester
      );
      return mentorRecord ? mentorRecord.mark : "";
    }

    return "";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <TeacherSideBar page="Score" />

      <div className="flex-1 p-8 md:ml-64 md:mt-1 mt-16 transition-all duration-300 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Scores</h1>

        {/* Score Type Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setScoreType("CCE")}
            className={`px-4 py-2 rounded-l-lg ${
              scoreType === "CCE"
                ? "bg-[rgba(53,130,140,0.9)] text-white"
                : "bg-gray-200"
            }`}
          >
            CCE Score
          </button>
          <button
            onClick={() => setScoreType("Mentor")}
            className={`px-4 py-2 rounded-r-lg ${
              scoreType === "Mentor"
                ? "bg-[rgba(53,130,140,0.9)] text-white"
                : "bg-gray-200"
            }`}
          >
            Mentor Score
          </button>
        </div>

        {/* Class, Subject & Semester Selection */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option>Select Class</option>
            {classes.map((cls, idx) => (
              <option key={idx} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>

          {scoreType === "CCE" && (
            <select
              className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          )}

          <select
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>

          {scoreType === "Mentor" && (
            <select
              className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.admissionNo} - {student.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Show student list based on selected score type and semester */}
        {shouldShowStudents() ? (
          <div className="bg-white rounded-2xl shadow-md p-6">
            {scoreType === "CCE" ? (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Student List - CCE Score ({selectedSemester})
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
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                            Phase 1
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                            Phase 2
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                            Phase 3
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, index) => (
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
                            {["Phase 1", "Phase 2", "Phase 3"].map((phase) => (
                              <td
                                key={phase}
                                className="px-4 py-3 text-center border-b border-gray-100"
                              >
                                <input
                                  id={`${student._id}-${phase}`}
                                  type="number"
                                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(53,130,140,0.5)]"
                                  value={getExistingMark(student, phase)}
                                  onChange={(e) =>
                                    handleMarkChange(
                                      student._id,
                                      phase,
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => handleKeyDown(e, index, phase)}
                                  min="0"
                                />
                              </td>
                            ))}
                            <td className="px-4 py-3 text-center border-b border-gray-100">
                              <input
                                type="number"
                                value={calculateTotalMark(student._id)}
                                disabled
                                className={`w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm bg-gray-100 cursor-not-allowed ${
                                  calculateTotalMark(student._id) > 30 ? 'text-red-600 font-semibold' : ''
                                }`}
                              />
                              {calculateTotalMark(student._id) > 30 && (
                                <div className="text-xs text-red-500 mt-1">Max: 30</div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {students.length > 0 && (
                  <button
                    onClick={handleCCESubmit}
                    className="mt-6 bg-[rgba(53,130,140,0.9)] text-white px-6 py-2 rounded-lg shadow hover:bg-[rgba(53,130,140,1)] transition duration-200"
                  >
                    Submit Score
                  </button>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Mentor Score ({selectedSemester})
                </h2>

                {(() => {
                  const student = students.find((s) => s._id === selectedStudent);
                  return student ? (
                    <div className="bg-[rgba(53,130,140,0.1)] rounded-xl p-6">
                      <div className="mb-4">
                        <p className="font-medium text-gray-700 text-lg">
                          <span className="text-[rgba(53,130,140,0.9)]">Ad No:</span> {student.admissionNo}
                        </p>
                        <p className="font-medium text-gray-700 text-lg">
                          <span className="text-[rgba(53,130,140,0.9)]">Name:</span> {student.name}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label htmlFor="mentor-mark" className="text-sm font-medium text-gray-700">
                          Mentor Score
                        </label>
                        <input
                          id="mentor-mark"
                          type="number"
                          className="w-40 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(53,130,140,0.5)]"
                          value={getExistingMark(student, "Mentor")}
                          onChange={(e) =>
                            handleMarkChange(
                              student._id,
                              "Mentor",
                              e.target.value
                            )
                          }
                          placeholder="Enter Score"
                        />
                      </div>

                      <button
                        onClick={handleMentorSubmit}
                        className="mt-6 bg-[rgba(53,130,140,0.9)] text-white px-6 py-2 rounded-lg shadow hover:bg-[rgba(53,130,140,1)] transition duration-200"
                      >
                        Submit Score
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Please select a student to enter Score.</p>
                  );
                })()}
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500 italic text-center">
              Please select {scoreType === "CCE" ? "class, subject, and semester" : "class, semester, and student"} to {scoreType === "CCE" ? "view students" : "enter Score"}.
            </p>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default Score;