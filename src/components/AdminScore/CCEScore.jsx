import React, { useEffect, useState } from "react";
import { fetchClass } from "../../redux/classSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addCceMark } from "../../redux/studentSlice";
import { getCurrentAcademicYear } from "../../utils/academicYear";
import useFetchStudents from "../../hooks/fetch/useFetchStudents";

const CCEScore = () => {
  const dispatch = useDispatch();
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const { classes } = useSelector((state) => state.class);
   const { students } = useFetchStudents(selectedClass);
  const [isSubmittingCCE, setIsSubmittingCCE] = useState(false);
  const [marks, setMarks] = useState({});
  const academicYear = getCurrentAcademicYear();
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
  const handleCCESubmit = async () => {
    setIsSubmittingCCE(true);
    const maxLimit = selectedSubject === "Hifz and Tajwid" ? 100 : 30;

    try {
      const batchPayload = [];

      for (const studentId in marks) {
        const studentMarks = marks[studentId];
        const totalMark = calculateTotalMark(studentId);

        if (totalMark > maxLimit) {
          toast.error(
            `Total Score for a student cannot exceed ${maxLimit} for ${selectedSubject}. Current total: ${totalMark}`
          );
          setIsSubmittingCCE(false);
          return;
        }

        for (const phase of ["Phase 1", "Phase 2", "Phase 3"]) {
          const mark = studentMarks[phase];

          if (mark && mark < 0) {
            toast.error("CCE Score should be greater than 0.");
            setIsSubmittingCCE(false);
            return;
          }

          if (mark && mark >= 0) {
            batchPayload.push({
              id: studentId,
              data: {
                classId: selectedClass,
                subjectName: selectedSubject,
                semester: selectedSemester,
                phase,
                mark: Number(mark),
              },
            });
          }
        }
      }

      if (batchPayload.length > 0) {
        await dispatch(addCceMark({ data: batchPayload })).unwrap();
        toast.success("CCE Scores submitted successfully!");
      } else {
        toast.info("No valid marks to submit.");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to submit CCE Scores.");
    } finally {
      setIsSubmittingCCE(false);
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
        (m) =>
          m.academicYear === academicYear && m.semester === selectedSemester
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
  const shouldShowStudents = () => {
    return selectedClass && selectedSubject && selectedSemester;
  };
  const handleKeyDown = (e, studentIndex, phase) => {
    if (e.key === "Tab") {
      // Default tab behavior for phase navigation
      return;
    } else if (e.key === "Enter") {
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
  const getExistingMark = (student, phase) => {
    // First check current marks state
    if (marks[student._id]?.[phase] !== undefined) {
      return marks[student._id][phase];
    }

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

    return "";
  };
  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    setMarks({}); // Reset marks when class changes
    setSelectedSubject(""); // Reset subject since subjects depend on class
  };
  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
    setMarks({}); // Reset marks when subject changes
  };
  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
    setMarks({}); // Reset marks when semester changes
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
          value={selectedSubject}
          onChange={(e) => handleSubjectChange(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
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
                              disabled={isSubmittingCCE}
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center border-b border-gray-100">
                          <input
                            type="number"
                            value={calculateTotalMark(student._id)}
                            disabled
                            className={`w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm bg-gray-100 cursor-not-allowed ${
                              calculateTotalMark(student._id) >
                              (selectedSubject === "Hifz and Tajwid" ? 100 : 30)
                                ? "text-red-600 font-semibold"
                                : ""
                            }`}
                          />
                          {calculateTotalMark(student._id) >
                            (selectedSubject === "Hifz and Tajwid"
                              ? 100
                              : 30) && (
                            <div className="text-xs text-red-500 mt-1">
                              Max:{" "}
                              {selectedSubject === "Hifz and Tajwid" ? 100 : 30}
                            </div>
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
                disabled={isSubmittingCCE}
                className={`mt-6 px-6 py-2 rounded-lg shadow transition duration-200 flex items-center gap-2 ${
                  isSubmittingCCE
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-[rgba(53,130,140,0.9)] text-white hover:bg-[rgba(53,130,140,1)]"
                }`}
              >
                {isSubmittingCCE && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isSubmittingCCE ? "Submitting..." : "Submit Score"}
              </button>
            )}
          </>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-500 italic text-center">
            Please select class, subject, and semester view students.
          </p>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </>
  );
};

export default CCEScore;
