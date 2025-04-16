import React, { useState } from "react";
import TeacherSideBar from "../../components/sideBar/teacherSideBar";

const Score = () => {
  const [scoreType, setScoreType] = useState("CCE");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  
  const classOptions = ["8A", "9B", "10C"];
  const subjectOptions = ["Math", "Science", "English"];

  const students = [
    { name: "John Doe", id: 1 },
    { name: "Jane Smith", id: 2 },
    { name: "Alice Johnson", id: 3 },
  ];

  const [marks, setMarks] = useState({});

  const handleMarkChange = (studentId, phase, value) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [phase]: value,
      },
    }));
  };

  const handleSubmit = () => {
    console.log("Submitted Marks:", marks);
    alert("Marks submitted successfully!");
    // You can post to backend here
  };

  return (
    <div className="flex  min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <TeacherSideBar page="Score" />

      <div className="flex-1 p-8 md:ml-64 transition-all duration-300 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Scores</h1>

        {/* Score Type Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setScoreType("CCE")}
            className={`px-4 py-2 rounded-l-lg ${
              scoreType === "CCE" ? "bg-[rgba(53,130,140,0.9)] text-white" : "bg-gray-200"
            }`}
          >
            CCE Score
          </button>
          <button
            onClick={() => setScoreType("Mentor")}
            className={`px-4 py-2 rounded-r-lg ${
              scoreType === "Mentor" ? "bg-[rgba(53,130,140,0.9)] text-white" : "bg-gray-200"
            }`}
          >
            Mentor Score
          </button>
        </div>

        {/* Class & Subject Selection */}
        <div className="flex gap-4 mb-4">
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm "
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="" >Select Class</option>
            {classOptions.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjectOptions.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Show student list if class & subject selected */}
        {selectedClass && selectedSubject && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Student List - {scoreType} Marks
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 bg-[rgba(53,130,140,0.1)] rounded-xl"
                >
                  <p className="font-medium text-gray-700">{student.name}</p>

                  {scoreType === "CCE" ? (
                    <div className="flex gap-4 mt-2">
                      {["Phase1", "Phase2", "Phase3"].map((phase) => (
                        <input
                          key={phase}
                          type="number"
                          placeholder={`${phase} mark`}
                          className="px-3 py-2 border border-gray-300 rounded-md w-24"
                          onChange={(e) =>
                            handleMarkChange(
                              student.id,
                              phase,
                              e.target.value
                            )
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2">
                      <input
                        type="number"
                        placeholder="Mentor mark"
                        className="px-3 py-2 border border-gray-300 rounded-md w-36"
                        onChange={(e) =>
                          handleMarkChange(student.id, "Mentor", e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 bg-[rgba(53,130,140,0.9)] text-white px-6 py-2 rounded-lg shadow hover:bg-[rgba(53,130,140,1.5)] transition"
            >
              Submit Marks
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Score;
