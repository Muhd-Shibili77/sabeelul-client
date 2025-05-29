import React, { useEffect, useState } from "react";
import SideBar from "../../components/sideBar/SideBar";
import {
  fetchClass,
  addScore,
  updateScore,
  deleteScore,
} from "../../redux/classSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStudentByAdmissionNo from "../../hooks/fetch/useStudent";
import {
  addExtraMark,
  deleteExtraMark,
  editExtraMark,
} from "../../redux/studentSlice";
import { PencilIcon, TrashIcon } from "lucide-react";
import { fetchItems } from "../../redux/itemSlice";
const AdminScore = () => {
  const dispatch = useDispatch();
  const [scoreType, setScoreType] = useState("Class");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [customItem, setCustomItem] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [studentMarks, setStudentMarks] = useState("");
  const [studentDiscription, setStudentDiscription] = useState("");
  const [editStudentDiscription, setEditStudentDiscription] = useState("");
  const [classMarks, setClassMark] = useState("");
  const [classDiscription, setClassDiscription] = useState("");
  const [selectedClassData, setSelectedClassData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editMarkId, setEditMarkId] = useState(null);
  const [editItem, setEditItem] = useState("");
  const [editdiscription, setEditdiscription] = useState("");
  const [editScore, setEditScore] = useState("");
  const [editExtraMode, setExtraEditMode] = useState(false);
  const [editExtraMarkId, setEditExtraMarkId] = useState(null);
  const [editExtraItem, setEditExtraItem] = useState("");
  const [editExtraScore, setEditExtraScore] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { classes } = useSelector((state) => state.class);
  const programs = useSelector((state)=>state.item.items)
  // const { programs } = useSelector((state) => state.program);
  const {
    student: foundStudent,
    loading: studentLoading,
    error: studentError,
    fetchStudent,
  } = useStudentByAdmissionNo();

  const refreshList = () =>
    dispatch(fetchClass({ search: "", page: 1, limit: 1000 }));
  useEffect(() => {
    refreshList();
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchItems({}));
  }, [dispatch]);

  // Update selectedClassData whenever selectedClass changes
  useEffect(() => {
    if (selectedClass) {
      const classData = classes.find((cls) => cls._id === selectedClass);
      setSelectedClassData(classData);
    } else {
      setSelectedClassData(null);
    }
  }, [selectedClass, classes]);

  const items = ["Discipline", "Cleaning", "Participation"];

  const handleSubmitClassScore = async () => {
    const itemToSubmit = selectedItem === "other" ? customItem : selectedItem;

    const data = {
      item: itemToSubmit,
      score: classMarks,
      discription: classDiscription,
    };

    try {
      const res = await dispatch(
        addScore({ id: selectedClass, newScore: data })
      ).unwrap();
      toast.success("Class score submitted successfully!");
      setSelectedItem("");
      setCustomItem("");
      setClassMark("");
      setClassDiscription("");

      // Update selected class data to show new mark immediately
      refreshList();
    } catch (err) {
      toast.error(err.message || "Failed to submit class score");
    }
  };

  const handleEditMark = (mark) => {
    setEditMode(true);
    setEditMarkId(mark._id);
    setEditItem(mark.item);
    setEditdiscription(mark.description)
    setEditScore(mark.score.toString());
    setSelectedItem("");
    setCustomItem("");
    setClassMark("");
    setClassDiscription("");
  };
  const handleExtraEditMark = (mark) => {
    
    setExtraEditMode(true);
    setEditExtraMarkId(mark._id);
    setEditExtraItem(getItemNameById(mark));
    setEditExtraScore(mark.mark.toString());
    setEditStudentDiscription(mark.description)
  };

  const handleCancelExtraEdit = () => {
    setExtraEditMode(false);
    setEditExtraMarkId(null);
    setEditExtraItem("");
    setEditExtraScore("");
  };

  const handleUpdateExtraMark = async () => {
    if (!editExtraMarkId) return;

    try {
      await dispatch(
        editExtraMark({
          id: editExtraMarkId,
          mark: editExtraScore,
          description: editStudentDiscription,
        })
      ).unwrap();
      toast.success("Student mark updated successfully!");
      setExtraEditMode(false);
      setEditExtraMarkId(null);
      setEditExtraItem("");
      setEditExtraScore("");
      setEditStudentDiscription("");
      // Refresh the student data to show updated marks
      fetchStudent(admissionNo);
    } catch (err) {
      toast.error(err.message || "Failed to update student mark");
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditMarkId(null);
    setEditItem("");
    setEditdiscription("")
    setEditScore("");
  };

  const handleUpdateMark = async () => {
    if (!editMarkId) return;

    const data = {
      item: editItem,
      score: editScore,
      discription:editdiscription,
    };

    try {
      await dispatch(
        updateScore({
          classId: selectedClass,
          markId: editMarkId,
          updatedMark: data,
        })
      ).unwrap();
      toast.success("Mark updated successfully!");
      refreshList();
      setEditMode(false);
      setEditMarkId(null);
      setEditItem("");
      setEditdiscription("")
      setEditScore("");
    } catch (err) {
      toast.error(err.message || "Failed to update mark");
    }
  };

  const handleDeleteMark = async (markId) => {
    try {
      await dispatch(deleteScore({ classId: selectedClass, markId })).unwrap();
      toast.success("Mark deleted successfully!");
      setConfirmDelete(null);
      refreshList();
    } catch (err) {
      toast.error(err.message || "Failed to delete mark");
    }
  };
  const handleDeleteExtraMark = async (id) => {
    try {
      await dispatch(deleteExtraMark({ id })).unwrap();
      toast.success("Extra Mark deleted successfully!");
      handleSearchStudent();
    } catch (err) {
      toast.error(err.message || "Failed to delete mark");
    }
  };

  const handleSearchStudent = () => {
    if (!admissionNo) return toast.warning("Please enter an admission number");
    fetchStudent(admissionNo);
  };

  const getItemNameById = (mark) => {
    // If it's a program from the program collection
    if (mark.programId) {
      const program = programs.find((p) => p._id === mark.programId);
      return program ? program.item : mark.programId;
    }

    // If it's a custom program name
    return mark.customProgramName || "N/A";
  };

  const handleSubmitStudentScore = async () => {
    const itemToSubmit = selectedItem === "other" ? customItem : selectedItem;
    const data = {
      programName: itemToSubmit,
      mark: studentMarks,
      discription: studentDiscription,
    };
    try {
      await dispatch(addExtraMark({ id: foundStudent._id, data })).unwrap();
      toast.success("Student score submitted successfully!");
      setAdmissionNo("");
      setSelectedItem("");
      setCustomItem("");
      setStudentMarks("");
      setStudentDiscription("");
      // Optionally, you might want to refetch the student to show updated marks
      fetchStudent(admissionNo);
    } catch (err) {
      toast.error(err.message || "Failed to submit student score");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Score" />
      <div className="flex-1 p-8 md:ml-64 md:mt-4 mt-10 transition-all duration-300 overflow-y-auto">
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
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Show edit form when in edit mode */}
            {editMode && (
              <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-4">
                <h3 className="text-lg font-medium mb-2">Edit Mark</h3>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Item Name"
                    className="w-full p-2 border rounded"
                    value={editItem}
                    onChange={(e) => setEditItem(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                    value={editdiscription}
                    onChange={(e) => setEditdiscription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    placeholder="Score"
                    className="w-full p-2 border rounded"
                    value={editScore}
                    onChange={(e) => setEditScore(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateMark}
                    className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded"
                    disabled={!editItem || !editScore}
                  >
                    Update Mark
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Show add form only when NOT in edit mode */}
            {!editMode && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Add New Mark</h3>
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
                <div className="mb-3">
                  {selectedItem === "other" ? (
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Description"
                        className="w-full p-2 border rounded"
                        value={customItem}
                        onChange={(e) => setCustomItem(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Description"
                        className="w-full p-2 border rounded"
                        value={classDiscription}
                        onChange={(e) => setClassDiscription(e.target.value)}
                      />
                    </div>
                  )}
                 
                  <div className="mb-3">
                    <input
                      type="number"
                      placeholder="Enter Marks"
                      className="w-full p-2 border rounded"
                      value={classMarks}
                      onChange={(e) => setClassMark(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmitClassScore}
                  className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded"
                >
                  Submit Class Score
                </button>
              </div>
            )}

            {/* Display existing class marks AFTER add new mark section */}
            {selectedClassData &&
              selectedClassData.marks &&
              selectedClassData.marks.length > 0 && (
                <div className="mb-4 mt-4">
                  <h3 className="text-lg font-medium mb-2">
                    Existing Class Marks
                  </h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {/* Sort marks by date before mapping */}
                        {selectedClassData.marks
                          .slice() 
                          .sort((a, b) => {
                            const dateA = a.date
                              ? new Date(a.date)
                              : new Date(0);
                            const dateB = b.date
                              ? new Date(b.date)
                              : new Date(0);
                            const dateDiff = dateB - dateA;
                            if (dateDiff === 0) {
                              const timeA = dateA.getTime();
                              const timeB = dateB.getTime();
                              if (timeA !== timeB) return timeB - timeA;
                              if (a._id && b._id) {
                                return b._id.localeCompare(a._id);
                              }
                              return b.score - a.score;
                            }
                            return dateDiff; 
                          })
                          .map((mark, index) => (
                            <tr
                              key={mark._id || index}
                              className={
                                editMarkId === mark._id ? "bg-blue-50" : ""
                              }
                            >
                              <td className="px-3 py-2 text-sm text-gray-900">
                                {mark.item}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-900">
                                {mark.score}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-900">
                                {mark.date
                                  ? new Date(mark.date).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-900">
                                {mark.description || ""}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-900">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditMark(mark)}
                                    className="p-1 text-blue-600 hover:text-blue-800"
                                    title="Edit"
                                  >
                                    <PencilIcon size={16} />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(mark._id)}
                                    className="p-1 text-red-600 hover:text-red-800"
                                    title="Delete"
                                  >
                                    <TrashIcon size={16} />
                                  </button>

                                  {confirmDelete === mark._id && (
                                    <div className="absolute bg-white shadow-lg p-2 rounded border">
                                      <p className="text-xs mb-1">
                                        Confirm delete?
                                      </p>
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() =>
                                            handleDeleteMark(mark._id)
                                          }
                                          className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                                        >
                                          Yes
                                        </button>
                                        <button
                                          onClick={() => setConfirmDelete(null)}
                                          className="px-2 py-1 bg-gray-300 text-gray-800 text-xs rounded"
                                        >
                                          No
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
                <p className="mb-2 font-medium">{foundStudent.name} - Ad No: {foundStudent.admissionNo}</p>

                {/* Student edit form */}
                {editExtraMode ? (
                  <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-4">
                    <h3 className="text-lg font-medium mb-2">
                      Edit Student Mark
                    </h3>
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Program Name"
                        className="w-full p-2 border bg-gray-300 rounded"
                        value={editExtraItem}
                        disabled
                        onChange={(e) => setEditExtraItem(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Discription"
                        className="w-full p-2 border rounded"
                        value={editStudentDiscription}
                        onChange={(e) => setEditStudentDiscription(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="number"
                        placeholder="Mark"
                        className="w-full p-2 border rounded"
                        value={editExtraScore}
                        onChange={(e) => setEditExtraScore(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleUpdateExtraMark}
                        className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded"
                        disabled={!editExtraItem || !editExtraScore}
                      >
                        Update Mark
                      </button>
                      <button
                        onClick={handleCancelExtraEdit}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Only show add form when NOT in edit mode
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Add New Mark</h3>
                      <div className="mb-3">
                        <select
                          className="w-full p-2 border rounded"
                          value={selectedItem}
                          onChange={(e) => setSelectedItem(e.target.value)}
                        >
                          <option value="">Select Item</option>
                          {programs.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.item}
                            </option>
                          ))}
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {selectedItem === "other" ? (
                        <div className="mb-3">
                          <input
                            type="text"
                            placeholder="Description"
                            className="w-full p-2 border rounded"
                            value={customItem}
                            onChange={(e) => setCustomItem(e.target.value)}
                          />
                        </div>
                      ):(
                        <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Description"
                          className="w-full p-2 border rounded"
                          value={studentDiscription}
                          onChange={(e) => setStudentDiscription(e.target.value)}
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
                        disabled={(!selectedItem && !customItem) || !studentMarks}
                      >
                        Submit Student Score
                      </button>
                    </div>
                )}

                {/* Existing Student Marks Section MOVED BELOW the add mark section */}
                {foundStudent.extraMarks &&
                  foundStudent.extraMarks.length > 0 && (
                    <div className="mb-4 mt-4">
                      <h3 className="text-lg font-medium mb-2">
                        Existing Student Marks
                      </h3>
                      <div className="bg-gray-50 p-3 rounded">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Program
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mark
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Discription
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {foundStudent.extraMarks.map((mark) => (
                              <tr key={mark._id}>
                                <td className="px-3 py-2 text-sm text-gray-900">
                                  {getItemNameById(mark)}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">
                                  {mark.mark}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">
                                  {new Date(mark.date).toLocaleDateString(
                                    "en-GB"
                                  )}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">
                                  {mark.description}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleExtraEditMark(mark)}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="Edit"
                                    >
                                      <PencilIcon size={16} />
                                    </button>
                                    <button
                                      onClick={() => setConfirmDelete(mark._id)}
                                      className="text-red-600 hover:text-red-800"
                                      title="Delete"
                                    >
                                      <TrashIcon size={16} />
                                    </button>

                                    {confirmDelete === mark._id && (
                                      <div className="absolute bg-white shadow-lg p-2 rounded border">
                                        <p className="text-xs mb-1">
                                          Confirm delete?
                                        </p>
                                        <div className="flex space-x-2">
                                          <button
                                            onClick={() =>
                                              handleDeleteExtraMark(mark._id)
                                            }
                                            className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                                          >
                                            Yes
                                          </button>
                                          <button
                                            onClick={() =>
                                              setConfirmDelete(null)
                                            }
                                            className="px-2 py-1 bg-gray-300 text-gray-800 text-xs rounded"
                                          >
                                            No
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
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