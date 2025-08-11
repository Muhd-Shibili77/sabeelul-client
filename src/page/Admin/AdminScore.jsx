import React, { useEffect, useState } from "react";
import SideBar from "../../components/sideBar/SideBar";
import {
  fetchClass,
  addScore,
  updateScore,
  deleteScore,
  addPenaltyScore,
  updatePenaltyScore,
  deletePenaltyScore,
} from "../../redux/classSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStudentByAdmissionNo from "../../hooks/fetch/useStudent";
import {
  addExtraMark,
  deleteExtraMark,
  editExtraMark,
  addStudentPenalty,
  updateStudentPenalty,
  deleteStudentPenalty,
} from "../../redux/studentSlice";
import { PencilIcon, TrashIcon } from "lucide-react";
import { fetchItems } from "../../redux/itemSlice";
import PublishScore from "../../components/AdminScore/PublishScore";
import MentorScore from "../../components/AdminScore/MentorScore";
import CCEScore from "../../components/AdminScore/CCEScore";
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
  const [editItemId, setEditItemId] = useState();
  const [selectedClassPenalty, setSelectedClassPenalty] = useState("");
  const [editClassPenaltyMode, setEditClassPenaltyMode] = useState(false);
  const [selectedPenaltyClassData, setSelectedPenaltyClassData] =
    useState(null);
  const [classPenalty, setClassPenalty] = useState({
    reason: "",
    description: "",
    penaltyScore: "",
  });
  const [editClassPenalty, setEditClassPenalty] = useState({
    id: "",
    reason: "",
    description: "",
    penaltyScore: "",
  });

  const [admNo, setAdmNo] = useState("");
  const [editStudentPenaltyMode, setEditStudentPenaltyMode] = useState(false);
  const [studentPenalty, setStudentPenalty] = useState({
    reason: "",
    description: "",
    penaltyScore: "",
  });
  const [editStudentPenalty, setEditStudentPenalty] = useState({
    id: "",
    reason: "",
    description: "",
    penaltyScore: "",
  });

  const { classes } = useSelector((state) => state.class);
  const programs = useSelector((state) => state.item.items);
  const {
    student: foundStudent,
    loading: studentLoading,
    error: studentError,
    fetchStudent,
  } = useStudentByAdmissionNo();
  const {
    student: foundStudentPenalty,
    loading: studentLoadingPenalty,
    error: studentErrorPenalty,
    fetchStudent: fetchStudentPenalty,
  } = useStudentByAdmissionNo();

  const refreshList = () =>
    dispatch(fetchClass({ search: "", page: 1, limit: 1000 }));
  useEffect(() => {
    refreshList();
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchItems({}));
  }, [dispatch]);

  useEffect(() => {
    if (selectedClass) {
      const classData = classes.find((cls) => cls._id === selectedClass);
      setSelectedClassData(classData);
    } else {
      setSelectedClassData(null);
    }
  }, [selectedClass, classes]);

  useEffect(() => {
    if (selectedClassPenalty) {
      const classData = classes.find((cls) => cls._id === selectedClassPenalty);
      setSelectedPenaltyClassData(classData);
    } else {
      setSelectedPenaltyClassData(null);
    }
  }, [selectedClassPenalty, classes]);

  const handleSubmitClassScore = async (e) => {
    e.preventDefault();
    if (!selectedClass) {
      toast.warning("Select a class!");
      return;
    }
    const itemToSubmit = selectedItem === "other" ? customItem : selectedItem;
    if (!itemToSubmit) {
      toast.warning("All fields are required");
      return;
    }
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
    setEditItemId(mark.item._id);
    setEditItem(
      getItemNameById({
        mark: mark,
        items: programs,
        itemIdKey: "item",
        customItemKey: "customItem",
      })
    );
    setEditdiscription(mark.description);
    setEditScore(mark.score.toString());
    setSelectedItem("");
    setCustomItem("");
    setClassMark("");
    setClassDiscription("");
  };
  const handleExtraEditMark = (mark) => {
    setExtraEditMode(true);
    setEditExtraMarkId(mark._id);
    setEditExtraItem(
      getItemNameById({
        mark: mark,
        items: programs,
        itemIdKey: "programId",
        customItemKey: "customProgramName",
      })
    );
    setEditExtraScore(mark.mark.toString());
    setEditStudentDiscription(mark.description);
  };
  const handleCancelExtraEdit = () => {
    setExtraEditMode(false);
    setEditExtraMarkId(null);
    setEditExtraItem("");
    setEditExtraScore("");
  };
  const handleUpdateExtraMark = async (e) => {
    e.preventDefault();
    if (!editExtraMarkId) return;

    try {
      await dispatch(
        editExtraMark({
          id: editExtraMarkId,
          mark: editExtraScore,
          description: editStudentDiscription,
          userId: foundStudent._id,
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
    setEditItemId("");
    setEditdiscription("");
    setEditScore("");
  };
  const handleUpdateMark = async (e) => {
    e.preventDefault();
    if (!editMarkId) return;

    const data = {
      item: editItemId,
      score: editScore,
      discription: editdiscription,
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
      setEditdiscription("");
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
      await dispatch(
        deleteExtraMark({ id, userId: foundStudent._id })
      ).unwrap();
      toast.success("Extra Mark deleted successfully!");
      handleSearchStudent();
    } catch (err) {
      toast.error(err.message || "Failed to delete mark");
    }
  };
  const handleSearchStudent = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const input = admissionNo;

    if (!input?.trim()) {
      toast.warning("Please enter a valid admission number.");
      return;
    }

    fetchStudent(input.trim());
  };

  const getItemNameById = ({
    mark,
    items,
    itemIdKey = "item",
    customItemKey = "customItem",
    displayKey = "item", // key in the matched item to display
  }) => {
    const itemId = mark[itemIdKey];
    if (itemId) {
      const foundItem = items.find((i) => i._id === itemId);
      return foundItem ? foundItem[displayKey] : itemId;
    }

    return mark[customItemKey] || "N/A";
  };

  const handleSubmitStudentScore = async (e) => {
    e.preventDefault();
    const itemToSubmit = selectedItem === "other" ? customItem : selectedItem;
    const data = {
      programName: itemToSubmit,
      mark: studentMarks,
      discription: studentDiscription,
    };
    try {
      await dispatch(addExtraMark({ id: foundStudent._id, data })).unwrap();
      toast.success("Student score submitted successfully!");
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

  const handleSubmitClassPenaltyScore = async (e) => {
    e.preventDefault();
    if (!selectedClassPenalty) {
      toast.warning("Select a class!");
      return;
    }
    if (
      classPenalty.reason.trim() === "" ||
      classPenalty.description.trim() === ""
    ) {
      toast.warning("All fields are required");
      return;
    }
    const newMark = {
      reason: classPenalty.reason,
      description: classPenalty.description,
      penaltyScore: Number(classPenalty.penaltyScore),
    };

    try {
      await dispatch(
        addPenaltyScore({ id: selectedClassPenalty, newMark })
      ).unwrap();
      toast.success("class penalty score submitted successfully!");
      setClassPenalty({ reason: "", description: "", penaltyScore: "" });

      refreshList();
    } catch (err) {
      toast.error(err.message || "Failed to submit class penalty score");
    }
  };
  const handleEditClassPenalty = (mark) => {
    setEditClassPenaltyMode(true);
    setEditClassPenalty({
      id: mark._id,
      reason: mark.reason,
      description: mark.description,
      penaltyScore: mark.penaltyScore,
    });
    setClassPenalty({ reason: "", description: "", penaltyScore: "" });
  };
  const handleCancelEditClassPenalty = () => {
    setEditClassPenaltyMode(false);
    setEditClassPenalty({
      id: "",
      reason: "",
      description: "",
      penaltyScore: "",
    });
  };
  const handleUpdateClassPenalty = async (e) => {
    e.preventDefault();
    if (!editClassPenalty.id) {
      toast.warning("id missing!");
      return;
    }
    if (
      editClassPenalty.reason.trim() === "" ||
      editClassPenalty.description.trim() === ""
    ) {
      toast.warning("All fields are required");
      return;
    }

    try {
      await dispatch(
        updatePenaltyScore({
          id: selectedClassPenalty,
          markId: editClassPenalty.id,
          reason: editClassPenalty.reason,
          penaltyScore: editClassPenalty.penaltyScore,
          description: editClassPenalty.description,
        })
      ).unwrap();
      toast.success("Penalty Mark updated successfully!");
      refreshList();
      handleCancelEditClassPenalty();
    } catch (error) {
      toast.error(error.message || "Failed to update penalty mark");
    }
  };
  const handleDeleteClassPenalty = async (markId) => {
    try {
      await dispatch(
        deletePenaltyScore({ classId: selectedClassPenalty, markId })
      ).unwrap();
      toast.success("Mark deleted successfully!");
      setConfirmDelete(null);
      refreshList();
    } catch (error) {
      toast.error(error.message || "Failed to delete mark");
    }
  };

  const handleSubmitStudentPenalty = async (e) => {
    e.preventDefault();
    const id = foundStudentPenalty._id;
    if (!id) {
      toast.warning("id required!");
      return;
    }
    console.log(studentPenalty);
    if (
      studentPenalty.reason.trim() === "" ||
      studentPenalty.description.trim() === ""
    ) {
      toast.warning("All fields are required");
      return;
    }
    const newMark = {
      reason: studentPenalty.reason,
      description: studentPenalty.description,
      penaltyScore: Number(studentPenalty.penaltyScore),
    };
    try {
      await dispatch(addStudentPenalty({ id: id, newMark })).unwrap();
      toast.success("student penalty score submitted successfully!");
      setStudentPenalty({ reason: "", description: "", penaltyScore: "" });
      fetchStudentPenalty(admNo);
    } catch (error) {
      toast.error(error.message || "Failed to submit student penalty score");
    }
  };
  const handleEditStudentPenalty = (mark) => {
    setEditStudentPenaltyMode(true);
    setEditStudentPenalty({
      id: mark._id,
      reason: mark.reason,
      description: mark.description,
      penaltyScore: mark.penaltyScore,
    });
  };
  const handleCancelEditStudentPenalty = () => {
    setEditStudentPenaltyMode(false);
    setEditStudentPenalty({
      id: "",
      reason: "",
      description: "",
      penaltyScore: "",
    });
  };
  const handleUpdateStudentPenalty = async (e) => {
    e.preventDefault();
    const id = foundStudentPenalty._id;
    if (!id) {
      toast.warning("id required!");
      return;
    }
    if (
      editStudentPenalty.reason.trim() === "" ||
      editStudentPenalty.description.trim() === ""
    ) {
      toast.warning("All fields are required");
      return;
    }

    try {
      await dispatch(
        updateStudentPenalty({
          id: id,
          markId: editStudentPenalty.id,
          reason: editStudentPenalty.reason,
          penaltyScore: editStudentPenalty.penaltyScore,
          description: editStudentPenalty.description,
        })
      ).unwrap();
      toast.success("Penalty Mark updated successfully!");
      fetchStudentPenalty(admNo);
      handleCancelEditStudentPenalty();
    } catch (error) {
      toast.error(error.message || "Failed to update penalty mark");
    }
  };
  const handleDeleteStudentPenalty = async (markId) => {
    const id = foundStudentPenalty._id;
    if (!id) return;
    try {
      await dispatch(deleteStudentPenalty({ id: id, markId: markId })).unwrap();
      toast.success("Mark deleted successfully!");
      handleSearchStudentPenalty();
    } catch (error) {
      toast.error(error.message || "Failed to delete mark");
    }
  };
  const handleSearchStudentPenalty = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const input = admNo;

    if (!input?.trim()) {
      toast.warning("Please enter a valid admission number.");
      return;
    }

    fetchStudentPenalty(input.trim());
  };

  const scoreTypes = [
    {
      type: "Class",
      label: "Class Score",
    },
    {
      type: "Student",
      label: "Student Score",
    },
    {
      type: "CCE",
      label: "CCE Score",
    },
    {
      type: "Mentor",
      label: "Mentor Score",
    },
    {
      type: "Publish",
      label: "Publish Score",
    },
  ];
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Score" />
      <div className="flex-1 p-8 md:ml-64 md:mt-4 mt-10 transition-all duration-300 overflow-y-auto">
        <h1 className="text-xl font-bold mb-4">Score Manager</h1>

        <div className="flex gap-4 mb-4">
          {scoreTypes.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setScoreType(type)}
              className={`px-4 py-2 rounded ${
                scoreType === type
                  ? "bg-[rgba(53,130,140,0.9)] text-white"
                  : "bg-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {scoreType === "Class" && (
          <div className={"grid md:grid-cols-2 gap-5"}>
            <div className="bg-white p-4 rounded-2xl shadow-md">
              <h1 className={`font-bold text-lg mb-3 p-1`}>Regular Score</h1>
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
                  <h3 className="text-lg font-medium mb-2">Edit Score</h3>
                  <form onSubmit={handleUpdateMark}>
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Item Name"
                        className="w-full p-2 border rounded bg-gray-300"
                        value={editItem}
                        disabled
                        // onChange={(e) => setEditItem(e.target.value)}
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
                        // onClick={handleUpdateMark}
                        type="submit"
                        className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded"
                      >
                        Update Score
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Show add form only when NOT in edit mode */}
              {!editMode && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Add New Score</h3>
                  <form onSubmit={handleSubmitClassScore}>
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
                    <div className="mb-3">
                      {selectedItem === "other" ? (
                        <>
                          <div className="mb-3">
                            <input
                              type="text"
                              placeholder="Specify Item"
                              className="w-full p-2 border rounded"
                              value={customItem}
                              onChange={(e) => setCustomItem(e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <input
                              type="text"
                              placeholder="Description"
                              className="w-full p-2 border rounded"
                              value={classDiscription}
                              onChange={(e) =>
                                setClassDiscription(e.target.value)
                              }
                            />
                          </div>
                        </>
                      ) : (
                        <div className="mb-3">
                          <input
                            type="text"
                            placeholder="Description"
                            className="w-full p-2 border rounded"
                            value={classDiscription}
                            onChange={(e) =>
                              setClassDiscription(e.target.value)
                            }
                          />
                        </div>
                      )}

                      <div className="mb-3">
                        <input
                          type="number"
                          placeholder="Enter Score"
                          className="w-full p-2 border rounded"
                          value={classMarks}
                          onChange={(e) => setClassMark(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      // onClick={handleSubmitClassScore}
                      type="submit"
                      className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded"
                    >
                      Submit Class Score
                    </button>
                  </form>
                </div>
              )}

              {/* Display existing class marks AFTER add new mark section */}
              {selectedClassData &&
                selectedClassData.marks &&
                selectedClassData.marks.length > 0 && (
                  <div className="mb-4 mt-4">
                    <h3 className="text-lg font-medium mb-2">
                      Existing Class Score
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
                                  {getItemNameById({
                                    mark: mark,
                                    items: programs,
                                    itemIdKey: "item",
                                    customItemKey: "customItem",
                                  })}
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
            <div className="bg-white p-4 rounded-2xl shadow-md">
              <h1 className={`font-bold text-lg mb-3 p-1 text-red-500`}>
                Penalty Score
              </h1>

              <div className="mb-3">
                <select
                  className="w-full p-2 border rounded"
                  value={selectedClassPenalty}
                  onChange={(e) => setSelectedClassPenalty(e.target.value)}
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
              {editClassPenaltyMode && (
                <div className="bg-red-100 p-3 rounded border border-red-200 mb-4">
                  <h3 className="text-lg font-medium mb-2">Edit Score</h3>
                  <form onSubmit={handleUpdateClassPenalty}>
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Reason"
                        className="w-full p-2 border rounded"
                        value={editClassPenalty.reason}
                        onChange={(e) =>
                          setEditClassPenalty((prev) => ({
                            ...prev,
                            reason: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Description"
                        className="w-full p-2 border rounded"
                        value={editClassPenalty.description}
                        onChange={(e) =>
                          setEditClassPenalty((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="number"
                        placeholder="Score"
                        className="w-full p-2 border rounded"
                        value={editClassPenalty.penaltyScore}
                        onChange={(e) =>
                          setEditClassPenalty((prev) => ({
                            ...prev,
                            penaltyScore: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        // onClick={handleUpdateClassPenalty}
                        type="submit"
                        className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded"
                      >
                        Update Score
                      </button>
                      <button
                        onClick={handleCancelEditClassPenalty}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Show add form only when NOT in edit mode */}
              {!editClassPenaltyMode && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Add New Score</h3>
                  <form onSubmit={handleSubmitClassPenaltyScore}>
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Reason"
                        className="w-full p-2 border rounded"
                        value={classPenalty.reason}
                        onChange={(e) =>
                          setClassPenalty((prev) => ({
                            ...prev,
                            reason: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Description"
                        className="w-full p-2 border rounded"
                        value={classPenalty.description}
                        onChange={(e) =>
                          setClassPenalty((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="number"
                        placeholder="Enter Score"
                        className="w-full p-2 border rounded"
                        value={classPenalty.penaltyScore}
                        onChange={(e) =>
                          setClassPenalty((prev) => ({
                            ...prev,
                            penaltyScore: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <button
                      // onClick={handleSubmitClassPenaltyScore}
                      type="submit"
                      className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded mb-4"
                    >
                      Submit Penalty Score
                    </button>
                  </form>
                </div>
              )}

              {/* Display existing class marks AFTER add new mark section */}
              {selectedPenaltyClassData &&
                selectedPenaltyClassData?.penaltyMarks &&
                selectedPenaltyClassData?.penaltyMarks?.length > 0 && (
                  <div className="mb-4 mt-4">
                    <h3 className="text-lg font-medium mb-2">
                      Existing Class Score
                    </h3>
                    <div className="bg-gray-50 p-3 rounded">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reason
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
                          {selectedPenaltyClassData.penaltyMarks
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
                                  editClassPenalty.id === mark._id
                                    ? "bg-red-100"
                                    : ""
                                }
                              >
                                <td className="px-3 py-2 text-sm text-gray-900">
                                  {mark.reason}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">
                                  {mark.penaltyScore}
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
                                      onClick={() =>
                                        handleEditClassPenalty(mark)
                                      }
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
                                              handleDeleteClassPenalty(mark._id)
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
          </div>
        )}

        {scoreType === "Student" && (
          <div className={`grid md:grid-cols-2 gap-5`}>
            <div className="bg-white p-4 rounded-2xl shadow-md">
              <div className="mb-3 flex-row gap-2">
                <h1 className={`font-bold text-lg mb-3 p-1`}>Regular Score</h1>
                {/* <label htmlFor="">Admission No</label> */}
                <form onSubmit={handleSearchStudent}>
                  <input
                    type="text"
                    placeholder="Enter Admission No"
                    className="w-full md:w-1/2 p-2 border rounded"
                    value={admissionNo}
                    onChange={(e) => setAdmissionNo(e.target.value)}
                  />
                  <button
                    type="submit"
                    // onClick={handleSearchStudent}
                    className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded ml-2"
                  >
                    {studentLoading ? "Searching..." : "Search"}
                  </button>
                </form>
              </div>

              {studentError && <p className="text-red-600">{studentError}</p>}
              {foundStudent && (
                <div className="mt-3">
                  <p className="mb-2 font-medium">
                    {foundStudent.name} - Ad No: {foundStudent.admissionNo}
                  </p>

                  {/* Student edit form */}
                  {editExtraMode ? (
                    <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-4">
                      <h3 className="text-lg font-medium mb-2">
                        Edit Student Score
                      </h3>
                      <form onSubmit={handleUpdateExtraMark}>
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
                            onChange={(e) =>
                              setEditStudentDiscription(e.target.value)
                            }
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
                            // onClick={handleUpdateExtraMark}
                            type="submit"
                            className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded"
                            disabled={!editExtraItem || !editExtraScore}
                          >
                            Update Score
                          </button>
                          <button
                            onClick={handleCancelExtraEdit}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    // Only show add form when NOT in edit mode
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">
                        Add New Score
                      </h3>
                      <form onSubmit={handleSubmitStudentScore}>
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
                          <>
                            <div className="mb-3">
                              <input
                                type="text"
                                placeholder="Specify Item"
                                className="w-full p-2 border rounded"
                                value={customItem}
                                onChange={(e) => setCustomItem(e.target.value)}
                              />
                            </div>
                            <div className="mb-3">
                              <input
                                type="text"
                                placeholder="Description"
                                className="w-full p-2 border rounded"
                                value={studentDiscription}
                                onChange={(e) =>
                                  setStudentDiscription(e.target.value)
                                }
                              />
                            </div>
                          </>
                        ) : (
                          <div className="mb-3">
                            <input
                              type="text"
                              placeholder="Description"
                              className="w-full p-2 border rounded"
                              value={studentDiscription}
                              onChange={(e) =>
                                setStudentDiscription(e.target.value)
                              }
                            />
                          </div>
                        )}

                        <div className="mb-3">
                          <input
                            type="number"
                            placeholder="Enter Score"
                            className="w-full p-2 border rounded"
                            value={studentMarks}
                            onChange={(e) => setStudentMarks(e.target.value)}
                          />
                        </div>

                        <button
                          type="submit"
                          // onClick={handleSubmitStudentScore}
                          className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded"
                          disabled={
                            (!selectedItem && !customItem) || !studentMarks
                          }
                        >
                          Submit Student Score
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Existing Student Marks Section MOVED BELOW the add mark section */}
                  {foundStudent.extraMarks &&
                    foundStudent.extraMarks.length > 0 && (
                      <div className="mb-4 mt-4">
                        <h3 className="text-lg font-medium mb-2">
                          Existing Student Score
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
                                  Discription
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {foundStudent.extraMarks
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
                                .map((mark) => (
                                  <tr key={mark._id}>
                                    <td className="px-3 py-2 text-sm text-gray-900">
                                      {getItemNameById({
                                        mark: mark,
                                        items: programs,
                                        itemIdKey: "programId",
                                        customItemKey: "customProgramName",
                                      })}
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
                                          onClick={() =>
                                            handleExtraEditMark(mark)
                                          }
                                          className="text-blue-600 hover:text-blue-800"
                                          title="Edit"
                                        >
                                          <PencilIcon size={16} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            setConfirmDelete(mark._id)
                                          }
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
                                                  handleDeleteExtraMark(
                                                    mark._id
                                                  )
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
            <div className="bg-white p-4 rounded-2xl shadow-md">
              <div className="mb-3 flex-row gap-2">
                <h1 className={`font-bold text-lg mb-3 p-1 text-red-400`}>
                  Penalty Score
                </h1>
                <form action={handleSearchStudentPenalty}>
                  <input
                    type="text"
                    placeholder="Enter Admission No"
                    className="w-full md:w-1/2 p-2 border rounded"
                    value={admNo}
                    onChange={(e) => setAdmNo(e.target.value)}
                  />
                  <button className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded ml-2">
                    {studentLoadingPenalty ? "Searching..." : "Search"}
                  </button>
                </form>
              </div>

              {studentErrorPenalty && (
                <p className="text-red-600">{studentErrorPenalty}</p>
              )}
              {foundStudentPenalty && (
                <div className="mt-3">
                  <p className="mb-2 font-medium">
                    {foundStudentPenalty.name} - Ad No:{" "}
                    {foundStudentPenalty.admissionNo}
                  </p>

                  {/* Student edit form */}
                  {editStudentPenaltyMode ? (
                    <div className="bg-red-100 p-3 rounded border border-red-200 mb-4">
                      <h3 className="text-lg font-medium mb-2">
                        Edit Student Score
                      </h3>
                      <form onSubmit={handleUpdateStudentPenalty}>
                        <div className="mb-3">
                          <input
                            type="text"
                            placeholder="Reason"
                            className="w-full p-2 border rounded"
                            value={editStudentPenalty.reason}
                            onChange={(e) =>
                              setEditStudentPenalty((prev) => ({
                                ...prev,
                                reason: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <input
                            type="text"
                            placeholder="Discription"
                            className="w-full p-2 border rounded"
                            value={editStudentPenalty.description}
                            onChange={(e) =>
                              setEditStudentPenalty((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <input
                            type="number"
                            placeholder="Mark"
                            className="w-full p-2 border rounded"
                            value={editStudentPenalty.penaltyScore}
                            onChange={(e) =>
                              setEditStudentPenalty((prev) => ({
                                ...prev,
                                penaltyScore: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            // onClick={handleUpdateStudentPenalty}
                            className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded"
                          >
                            Update Score
                          </button>
                          <button
                            onClick={handleCancelEditStudentPenalty}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">
                        Add New Score
                      </h3>
                      <form onSubmit={handleSubmitStudentPenalty}>
                        <div className="mb-3">
                          <input
                            type="text"
                            placeholder="Reason"
                            className="w-full p-2 border rounded"
                            value={studentPenalty.reason}
                            onChange={(e) =>
                              setStudentPenalty((prev) => ({
                                ...prev,
                                reason: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <input
                            type="text"
                            placeholder="Description"
                            className="w-full p-2 border rounded"
                            value={studentPenalty.description}
                            onChange={(e) =>
                              setStudentPenalty((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="mb-3">
                          <input
                            type="number"
                            placeholder="Enter Score"
                            className="w-full p-2 border rounded"
                            value={studentPenalty.penaltyScore}
                            onChange={(e) =>
                              setStudentPenalty((prev) => ({
                                ...prev,
                                penaltyScore: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <button
                          type="submit"
                          // onClick={handleSubmitStudentPenalty}
                          className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded"
                        >
                          Submit Penalty Score
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Existing Student Marks Section MOVED BELOW the add mark section */}
                  {foundStudentPenalty.penaltyMarks &&
                    foundStudentPenalty.penaltyMarks.length > 0 && (
                      <div className="mb-4 mt-4">
                        <h3 className="text-lg font-medium mb-2">
                          Existing Score
                        </h3>
                        <div className="bg-gray-50 p-3 rounded">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Reason
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Score
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
                              {foundStudentPenalty.penaltyMarks
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
                                .map((mark) => (
                                  <tr key={mark._id}>
                                    <td className="px-3 py-2 text-sm text-gray-900">
                                      {mark.reason}
                                    </td>
                                    <td className="px-3 py-2 text-sm text-gray-900">
                                      {mark.penaltyScore}
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
                                          onClick={() =>
                                            handleEditStudentPenalty(mark)
                                          }
                                          className="text-blue-600 hover:text-blue-800"
                                          title="Edit"
                                        >
                                          <PencilIcon size={16} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            setConfirmDelete(mark._id)
                                          }
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
                                                  handleDeleteStudentPenalty(
                                                    mark._id
                                                  )
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
          </div>
        )}
        {scoreType === "CCE" && <CCEScore />}
        {scoreType === "Mentor" && <MentorScore />}
        {scoreType === "Publish" && <PublishScore />}
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default AdminScore;
