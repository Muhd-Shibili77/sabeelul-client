import React, { useEffect, useState } from "react";
import SideBar from "../../components/sideBar/SideBar";
import { fetchClass,addScore } from "../../redux/classSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStudentByAdmissionNo from "../../hooks/fetch/useStudent";
import { addExtraMark } from "../../redux/studentSlice";
import { fetchProgram } from "../../redux/programSlice";
const AdminScore = () => {
  const dispatch = useDispatch();
  const [scoreType, setScoreType] = useState("Class");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [customItem, setCustomItem] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [studentMarks, setStudentMarks] = useState("");
  const [classMarks, setClassMark] = useState("");

  const { classes } = useSelector((state) => state.class);
  const { programs } = useSelector((state) => state.program);
  const {
    student: foundStudent,
    loading: studentLoading,
    error: studentError,
    fetchStudent,
  } = useStudentByAdmissionNo();

  useEffect(() => {
    dispatch(fetchClass({ search: "", page: 1, limit: 1000 }));
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchProgram({ search: "", page: 1, limit: 1000 }));
  }, [dispatch]);

  const items = ["Discipline", "Cleaning", "Participation"];


  const handleSubmitClassScore = async () => {
    const itemToSubmit = selectedItem === "other" ? customItem : selectedItem;
    const data = {
      item: itemToSubmit,
      score: classMarks,
    };

    try {
      const res = await dispatch(
        addScore({ id: selectedClass, newScore: data })
      ).unwrap();
      toast.success("Class score submitted successfully!");
      setSelectedClass("");
      setSelectedItem("");
      setCustomItem("");
      setClassMark("");
    } catch (err) {
      toast.error(err.message || "Failed to submit class score");
    }
  };

  const handleSearchStudent = () => {
    if (!admissionNo) return toast.warning("Please enter an admission number");
    fetchStudent(admissionNo);
  };

  const handleSubmitStudentScore = async () => {
    const itemToSubmit = selectedItem === "other" ? customItem : selectedItem;
    const data = {
      programName: itemToSubmit,
      mark: studentMarks,
    };
    try {
      const res = await dispatch(
        addExtraMark({ id: foundStudent._id,data })
      ).unwrap();
      toast.success("student score submitted successfully!");
      setAdmissionNo("");
      setSelectedItem("");
      setCustomItem("");
      setStudentMarks("");
    } catch (err) {
      toast.error(err.message || "Failed to submit student score");
    }
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
              scoreType === "Class"
                ? "bg-[rgba(53,130,140,0.9)] text-white"
                : "bg-white"
            }`}
          >
            Class Score
          </button>
          <button
            onClick={() => setScoreType("Student")}
            className={`px-4 py-2 rounded ${
              scoreType === "Student"
                ? "bg-[rgba(53,130,140,0.9)] text-white"
                : "bg-white"
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
                  <option key={i} value={cls._id}>
                    {cls.name}
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
                  <option key={i} value={item._id}>
                    {item}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <input
                type="number"
                placeholder="Enter Marks"
                className="w-full p-2 border rounded"
                value={classMarks}
                onChange={(e) => setClassMark(e.target.value)}
              />
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
                {studentLoading ? "Searching..." : "Search"}
              </button>
            </div>

            {studentError && <p className="text-red-600">{studentError}</p>}
            {foundStudent && (
              <div className="mt-3">
                <p className="mb-2 font-medium">
                  {foundStudent.name}
                </p>

                <div className="mb-3">
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                  >
                    <option value="">Select Item</option>
                    {programs.map((item, i) => (
                      <option key={i} value={item._id}>
                        {item.name}
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
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default AdminScore;
