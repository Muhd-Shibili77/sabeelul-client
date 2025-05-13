import React, { useState, useEffect } from "react";
import SideBar from "../../components/sideBar/SideBar";
import {
  FaChevronDown,
  FaChevronUp,
  FaTrash,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import Pagination from "../../components/pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  addClass,
  updateClass,
  fetchClass,
  deleteClass,
  deleteSubject,
  addSubject
} from "../../redux/classSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AdminClasses = () => {
  const dispatch = useDispatch();
  const { classes, totalPages } = useSelector((state) => state.class);

  const [newClassName, setNewClassName] = useState("");
  const [expandedClass, setExpandedClass] = useState(null);
  const [subjectInput, setSubjectInput] = useState("");
  const [editingClass, setEditingClass] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editedClassName, setEditedClassName] = useState("");

  const refreshList = () =>
    dispatch(fetchClass({ search: debouncedSearch, page }));

  useEffect(() => {
    refreshList();
  }, [dispatch, debouncedSearch, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleAddClass = async () => {
    if (!newClassName.trim()) return;
    const newClass = {
      name: newClassName,
      subjects: [],
    };
    try {
      await dispatch(addClass({ newClass })).unwrap();
      setNewClassName("");
      setIsModalOpen(false);
      refreshList();
    } catch (err) {
      console.error("Failed to add class:", err.message || err);
    }
  };


 const handleDeleteClass = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="fixed inset-0 flex items-center justify-center  z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Delete Confirmation
              </h2>
              <p className="text-gray-600 mt-2">
                Are you sure you want to delete this class?
              </p>
              <div className="flex justify-center mt-5 gap-4">
                <button
                  onClick={async () => {
                    try {
                      await dispatch(deleteClass(id)).unwrap();
                      toast.success("class deleted successfully");
                      setTimeout(()=>{
                        refreshList();
                        onClose();
                      },1000)
                    } catch (error) {
                       onClose();
                        toast.error(error.message || "Failed to delete class");
                      console.error("Delete error:", error);
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      },
    });
  };


  const handleEditClassName = async (id) => {
    if (!editedClassName.trim()) return;

    try {
      await dispatch(updateClass({ id, updatedData: editedClassName })).unwrap();
      setEditingClass(null);
      setEditedClassName("");
      refreshList();
    } catch (err) {
      console.error("Failed to edit class name:", err.message || err);
    }
  };

  const handleAddSubject = async (classId) => {
    if (!subjectInput.trim()) return;
  
    try {
      await dispatch(addSubject({ id:classId,name: subjectInput.trim()})).unwrap();
      setSubjectInput("");
      refreshList(); 
    } catch (error) {
      console.error("Failed to add subject:", error.message || error);
    }
  };

  const handleDeleteSubject = async (classId, subject) => {
    // Delete subject logic (API + dispatch refetch)
    if (!subject.trim()) return;
    try {
      await dispatch(deleteSubject({ id:classId,name: subject.trim()})).unwrap();
      refreshList(); 
    } catch (error) {
      console.error("Failed to add subject:", error.message || error);
    }
  };

  return (
    <div className="flex min-h-screen  bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Classes" />
      <div className="flex-1 p-8 md:ml-40 md:mt-4 mt-10 transition-all duration-300 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold text-gray-800">
              Class Management
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded-lg shadow hover:bg-[rgba(53,130,140,1)] transition"
            >
              <FaPlus className="inline mr-1" />
              Add Class
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search classes..."
              className="px-4 py-2 border rounded-lg w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Class List */}
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="bg-white rounded-xl shadow-md mb-4 p-4"
            >
              <div className="flex justify-between items-center">
                {editingClass === cls._id ? (
                  <div className="flex gap-2">
                    <input
                      className="border px-2 py-1 rounded"
                      value={editedClassName}
                      onChange={(e) => setEditedClassName(e.target.value)}
                    />
                    <button
                      onClick={() =>
                        handleEditClassName(cls._id)
                      }
                      className="text-green-600"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <h2 className="text-lg font-semibold">{cls.name}</h2>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setExpandedClass(
                        expandedClass === cls._id ? null : cls._id
                      )
                    }
                  >
                    {expandedClass === cls._id ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingClass(cls._id);
                      setEditedClassName(cls.name); // pre-fill input
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls._id)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {expandedClass === cls._id && (
                <div className="mt-4 ml-2">
                  {cls.subjects.length === 0 && (
                    <p className="text-gray-500">No subjects yet.</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cls.subjects.map((subject, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 rounded-md px-3 py-2"
                      >
                       
                          <>
                            <span className="text-gray-800">{subject}</span>
                            <div className="flex gap-2">
                              
                              <button
                                onClick={() =>
                                  handleDeleteSubject(cls._id, subject)
                                }
                                className="text-red-500"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </>
                        
                      </div>
                    ))}
                  </div>

                  {/* Add Subject */}
                  <div className="mt-3 flex gap-3">
                    <input
                      type="text"
                      className="border px-2 py-1 rounded w-full"
                      placeholder="Add a subject"
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                    />
                    <button
                      onClick={() => handleAddSubject(cls._id)}
                      className="bg-[rgba(53,130,140,0.9)] text-white px-3 py-1 rounded"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          <Pagination
            currentPage={page}
            setCurrentPage={setPage}
            totalPages={totalPages}
          />

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Add New Class</h2>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg shadow-sm mb-4"
                  placeholder="Enter class name"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddClass}
                    className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded-md"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default AdminClasses;
