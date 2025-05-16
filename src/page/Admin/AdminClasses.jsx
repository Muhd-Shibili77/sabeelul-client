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
  addSubject,
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
  const [iconFile, setIconFile] = useState(null);
  const [previewIcon, setPreviewIcon] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editedClassName, setEditedClassName] = useState("");

  // Add these new states for editing icon
  const [editedIconFile, setEditedIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

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

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewIcon(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add handler for editing icon
  const handleEditIconChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditedIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAddClass = async () => {
    // Validate class name
    if (!newClassName.trim()) {
      toast.error("Class name is required.");
      return;
    }

    if (newClassName.length < 2 || newClassName.length > 30) {
      toast.error("Class name must be between 2 and 30 characters.");
      return;
    }

    // Validate icon
    if (!iconFile) {
      toast.error("Please select an icon file.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(iconFile.type)) {
      toast.error("Only JPEG, PNG, or WEBP image formats are allowed.");
      return;
    }

    const maxSizeMB = 2;
    const fileSizeMB = iconFile.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error("Icon size must be less than 2MB.");
      return;
    }

    // If all validations pass, proceed
    const newClass = new FormData();
    newClass.append("name", newClassName);
    newClass.append("icon", iconFile);

    try {
      await dispatch(addClass({ newClass })).unwrap();
      setNewClassName("");
      setIsModalOpen(false);
      setIconFile(null);
      setPreviewIcon(null);
      refreshList();
      toast.success("Class added successfully!");
    } catch (err) {
      console.error("Failed to add class:", err.message || err);
      toast.error("Failed to add class. Please try again.");
    }
  };

  const handleDeleteClass = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="fixed inset-0 flex items-center justify-center z-50">
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
                      setTimeout(() => {
                        refreshList();
                        onClose();
                      }, 1000);
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
    // Validate class name
    if (!editedClassName.trim()) {
      toast.error("Class name is required.");
      return;
    }

    if (editedClassName.length < 2 || editedClassName.length > 30) {
      toast.error("Class name must be between 2 and 30 characters.");
      return;
    }

    // Validate icon file (if a new one is selected)
    if (editedIconFile) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSizeMB = 2;
      const fileSizeMB = editedIconFile.size / (1024 * 1024);

      if (!allowedTypes.includes(editedIconFile.type)) {
        toast.error("Only JPEG, PNG, or WEBP images are allowed.");
        return;
      }

      if (fileSizeMB > maxSizeMB) {
        toast.error("Icon size must be less than 2MB.");
        return;
      }
    }

    const updatedData = new FormData();
    updatedData.append("name", editedClassName);

    if (editedIconFile) {
      updatedData.append("icon", editedIconFile);
    } else {
      updatedData.append("keepExistingIcon", "true");
    }

    try {
      await dispatch(updateClass({ id, updatedData })).unwrap();
      toast.success("Class updated successfully");
      setEditingClass(null);
      setEditedClassName("");
      setEditedIconFile(null);
      setIconPreview(null);
      refreshList();
    } catch (err) {
      toast.error(err?.message || "Failed to update class");
      console.error("Failed to edit class:", err?.message || err);
    }
  };

  const handleAddSubject = async (classId) => {
    if (!subjectInput.trim()) return;

    try {
      await dispatch(
        addSubject({ id: classId, name: subjectInput.trim() })
      ).unwrap();
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
      await dispatch(
        deleteSubject({ id: classId, name: subject.trim() })
      ).unwrap();
      refreshList();
    } catch (error) {
      console.error("Failed to add subject:", error.message || error);
    }
  };

  // Add a function to start editing a class
  const startEditingClass = (cls) => {
    setEditingClass(cls._id);
    setEditedClassName(cls.name);
    setIconPreview(
      cls.icon ? `${import.meta.env.VITE_API_URL}/${cls.icon}` : null
    );
    setEditedIconFile(null);
  };

  // Add a function to cancel editing
  const cancelEditing = () => {
    setEditingClass(null);
    setEditedClassName("");
    setEditedIconFile(null);
    setIconPreview(null);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
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
          {classes.length > 0 ? (
            classes.map((cls) => (
              <div
                key={cls._id}
                className="bg-white rounded-xl shadow-md mb-4 p-4 transition hover:shadow-lg"
              >
                <div className="flex justify-between items-center">
                  {/* Left Section */}
                  <div className="flex items-center gap-4 flex-wrap">
                    {editingClass === cls._id ? (
                      <div className="flex flex-col md:flex-row gap-4 w-full">
                        {/* Edit Icon Preview */}
                        <div className="flex flex-col items-center">
                          <label
                            htmlFor={`edit-icon-${cls._id}`}
                            className="cursor-pointer"
                          >
                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                              {iconPreview ? (
                                <img
                                  src={iconPreview}
                                  alt="New Icon Preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-400 text-xs text-center">
                                  Upload Icon
                                </span>
                              )}
                            </div>
                          </label>
                          <input
                            id={`edit-icon-${cls._id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleEditIconChange}
                          />
                        </div>

                        {/* Class Name Edit Input */}
                        <div className="flex flex-col md:flex-row gap-2 items-center flex-1">
                          <input
                            className="border px-3 py-2 rounded w-full"
                            value={editedClassName}
                            onChange={(e) => setEditedClassName(e.target.value)}
                            placeholder="Class name"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClassName(cls._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {cls.icon && (
                          <img
                            src={`${import.meta.env.VITE_API_URL}/${cls.icon}`}
                            alt={`${cls.name} icon`}
                            className="w-12 h-12 rounded-full object-cover border"
                          />
                        )}
                        <h2 className="text-lg font-semibold">{cls.name}</h2>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!editingClass && (
                    <div className="flex gap-3 items-center">
                      <button
                        onClick={() =>
                          setExpandedClass(
                            expandedClass === cls._id ? null : cls._id
                          )
                        }
                        className="text-gray-600 hover:text-black"
                      >
                        {expandedClass === cls._id ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </button>
                      <button
                        onClick={() => startEditingClass(cls)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>

                {/* Expanded Section */}
                {expandedClass === cls._id && editingClass !== cls._id && (
                  <div className="mt-4 ml-2">
                    {cls.subjects.length === 0 && (
                      <p className="text-gray-500 italic">No subjects yet.</p>
                    )}

                    {/* Subjects List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {cls.subjects.map((subject, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-100 rounded-md px-3 py-2"
                        >
                          <span className="text-gray-800">{subject}</span>
                          <button
                            onClick={() =>
                              handleDeleteSubject(cls._id, subject)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Subject Input */}
                    <div className="mt-4 flex gap-3">
                      <input
                        type="text"
                        className="border px-3 py-2 rounded w-full"
                        placeholder="Add a subject"
                        value={subjectInput}
                        onChange={(e) => setSubjectInput(e.target.value)}
                      />
                      <button
                        onClick={() => handleAddSubject(cls._id)}
                        className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded hover:bg-[rgba(53,130,140,1)] transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No classes found.</p>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={page}
            setCurrentPage={setPage}
            totalPages={totalPages}
          />

          {/* Add Class Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Add New Class</h2>

                {/* Upload Icon Preview Section */}
                <div className="flex justify-center mb-4">
                  <label htmlFor="icon-upload" className="cursor-pointer">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                      {previewIcon ? (
                        <img
                          src={previewIcon}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm text-center">
                          Click to upload
                        </span>
                      )}
                    </div>
                    <input
                      id="icon-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleIconChange}
                    />
                  </label>
                </div>

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
