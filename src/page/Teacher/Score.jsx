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
  const { classes } = useSelector((state) => state.class);
  const { students } = useFetchStudents(selectedClass);
  const [marks, setMarks] = useState({});
  const academicYear = getCurrentAcademicYear();

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
          await dispatch(addMentorMark({ id: studentId, data: { mark } }));
        }
      }
      toast.success("Mentor marks submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit mentor marks.");
    }
  };

  const handleCCESubmit = async () => {
    try {
      for (const studentId in marks) {
        const studentMarks = marks[studentId];
        for (const phase of ["Phase1", "Phase2", "Phase3"]) {
          const mark = studentMarks[phase];
          if (mark) {
            const data = {
              classId: selectedClass,
              subjectName: selectedSubject,
              phase,
              mark: Number(mark),
            };
            await dispatch(addCceMark({ id: studentId, data }));
          }
        }
      }
      toast.success("CCE marks submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit CCE marks.");
    }
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

        {/* Class & Subject Selection */}
        <div className="flex gap-4 mb-4">
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
              disabled={scoreType === "Mentor"}
            >
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Show student list based on selected score type */}
        {(scoreType === "Mentor" && selectedClass) ||
        (scoreType === "CCE" && selectedClass && selectedSubject) ? (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Student List - {scoreType} Marks
            </h2>

            {students.length === 0 ? (
              <p className="text-gray-500 italic">
                No students available for this class.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {students.map((student) => (
                  <div
                    key={student._id}
                    className="p-4 bg-[rgba(53,130,140,0.1)] rounded-xl"
                  >
                    <p className="font-medium text-gray-700">{student.name}</p>

                    {scoreType === "CCE" ? (
                      <div className="flex gap-4 mt-2">
                        {["Phase1", "Phase2", "Phase3"].map((phase) => {
                          const existingMark =
                            marks[student._id]?.[phase] ??
                            student.cceMarks
                              ?.find((m) => m.academicYear === academicYear)
                              ?.subjects?.find(
                                (s) =>
                                  s.subjectName === selectedSubject  &&
                                  s.phase === phase
                              )?.mark ??
                            "";

                          return (
                            <div className="flex flex-col items-start gap-1">
                           
                            <input
                              id={`mark-${student._id}-${phase}`}
                              key={phase}
                              type="number"
                             
                              className="px-3 py-2 border border-gray-300 rounded-md md:w-24 w-18"
                              value={existingMark}
                              onChange={(e) =>
                                handleMarkChange(
                                  student._id,
                                  phase,
                                  e.target.value
                                )
                              }
                            />
                             <label htmlFor={`mark-${student._id}-${phase}`} className="text-sm font-medium text-gray-700">
                              {phase}
                            </label>
                          </div>
                          
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mt-2">
                        <input
                          type="number"
                          placeholder="Mentor mark"
                          className="px-3 py-2 border border-gray-300 rounded-md w-36"
                          value={
                            marks[student._id]?.Mentor ??
                            student.mentorMarks?.find(
                              (m) => m.academicYear === academicYear
                            )?.mark ??
                            ""
                          }
                          onChange={(e) =>
                            handleMarkChange(
                              student._id,
                              "Mentor",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {students.length > 0 && (
              <button
                onClick={
                  scoreType === "CCE" ? handleCCESubmit : handleMentorSubmit
                }
                className="mt-6 bg-[rgba(53,130,140,0.9)] text-white px-6 py-2 rounded-lg shadow hover:bg-[rgba(53,130,140,1.5)] transition"
              >
                Submit Marks
              </button>
            )}
          </div>
        ) : null}
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default Score;
