import React, { useState } from "react";
import SideBar from "../../components/sideBar/SideBar";

const AdminScore = () => {
  const [scoreType, setScoreType] = useState("Class");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [customItem, setCustomItem] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [foundStudent, setFoundStudent] = useState(null);
  const [studentMarks, setStudentMarks] = useState("");

  const classes = ["8A", "9B", "10C", "7D"];
  const items = ["Discipline", "Cleaning", "Participation"];

  const dummyStudents = [
    { admissionNo: "1001", name: "John Doe", class: "8A" },
    { admissionNo: "1002", name: "Jane Smith", class: "9B" },
    { admissionNo: "1003", name: "Ali Khan", class: "10C" },
  ];

  const handleSubmitClassScore = () => {
    const itemToSubmit = selectedItem === "other" ? customItem : selectedItem;
    const data = {
      class: selectedClass,
      item: itemToSubmit,
    };

    console.log("Class Score Submitted:", data);
    alert("Class Score submitted!");

    setSelectedClass("");
    setSelectedItem("");
    setCustomItem("");
  };

  const handleSearchStudent = () => {
    const found = dummyStudents.find(
      (student) => student.admissionNo === admissionNo
    );
    setFoundStudent(found || null);
  };

  const handleSubmitStudentScore = () => {
    const itemToSubmit = selectedItem === "other" ? customItem : selectedItem;
    const data = {
      admissionNo,
      name: foundStudent.name,
      class: foundStudent.class,
      item: itemToSubmit,
      marks: studentMarks,
    };

    console.log("Student Score Submitted:", data);
    alert("Student Score submitted!");

    setAdmissionNo("");
    setFoundStudent(null);
    setSelectedItem("");
    setCustomItem("");
    setStudentMarks("");
  };

  return (
    <div className="flex  min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Score" />
      <div className="flex-1 p-8 md:ml-64 transition-all duration-300 overflow-y-auto">
        <h1 className="text-xl font-bold mb-4">Score Manager</h1>

        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setScoreType("Class")}
            className={`px-4 py-2 rounded ${
              scoreType === "Class" ? "bg-[rgba(53,130,140,0.9)] text-white" : "bg-white"
            }`}
          >
            Class Score
          </button>
          <button
            onClick={() => setScoreType("Student")}
            className={`px-4 py-2 rounded ${
              scoreType === "Student" ? "bg-[rgba(53,130,140,0.9)] text-white" : "bg-white"
            }`}
          >
            Student Score
          </button>
        </div>

        {scoreType === "Class" && (
          <div className="bg-white p-4 rounded shadow-md">
            <div className="mb-3">
              <select
                className="w-full p-2 border rounded"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select Class</option>
                {classes.map((cls, i) => (
                  <option key={i} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <select
                className="w-full p-2 border rounded"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
              >
                <option value="">Select Item</option>
                {items.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>

            {selectedItem === "other" && (
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Enter Custom Item"
                  className="w-full p-2 border rounded"
                  value={customItem}
                  onChange={(e) => setCustomItem(e.target.value)}
                />
              </div>
            )}

            <button
              onClick={handleSubmitClassScore}
              className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded"
            >
              Submit Class Score
            </button>
          </div>
        )}

        {scoreType === "Student" && (
          <div className="bg-white p-4 rounded shadow-md">
            <div className="mb-3 flex gap-2">
              <input
                type="text"
                placeholder="Enter Admission No"
                className="w-full md:w-1/2 p-2 border rounded"
                value={admissionNo}
                onChange={(e) => setAdmissionNo(e.target.value)}
              />
              <button
                onClick={handleSearchStudent}
                className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded"
              >
                Search
              </button>
            </div>

            {foundStudent && (
              <div className="mt-3">
                <p className="mb-2 font-medium">
                  {foundStudent.name} ({foundStudent.class})
                </p>

                <div className="mb-3">
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                  >
                    <option value="">Select Item</option>
                    {items.map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>

                {selectedItem === "other" && (
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Enter Custom Item"
                      className="w-full p-2 border rounded"
                      value={customItem}
                      onChange={(e) => setCustomItem(e.target.value)}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <input
                    type="number"
                    placeholder="Enter Marks"
                    className="w-full p-2 border rounded"
                    value={studentMarks}
                    onChange={(e) => setStudentMarks(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleSubmitStudentScore}
                  className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded"
                >
                  Submit Student Score
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScore;
