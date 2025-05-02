import React, { useState } from 'react';
import SideBar from '../../components/sideBar/SideBar';
import { FaChevronDown, FaChevronUp, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

const AdminClasses = () => {
  const [classes, setClasses] = useState([
    { id: 1, name: "8A", subjects: ["Math", "Science"] },
    { id: 2, name: "9B", subjects: ["English", "History"] }
  ]);

  const [newClassName, setNewClassName] = useState("");
  const [expandedClass, setExpandedClass] = useState(null);
  const [subjectInput, setSubjectInput] = useState("");
  const [editingClass, setEditingClass] = useState(null);
  const [editingSubject, setEditingSubject] = useState({ classId: null, subjectIndex: null, name: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add new class
  const handleAddClass = () => {
    if (!newClassName.trim()) return;
    const newClass = {
      id: Date.now(),
      name: newClassName,
      subjects: []
    };
    setClasses([...classes, newClass]);
    setNewClassName("");
    setIsModalOpen(false);
  };

  const handleDeleteClass = (id) => {
    setClasses(classes.filter(cls => cls.id !== id));
  };

  const handleEditClassName = (id, newName) => {
    setClasses(classes.map(cls => cls.id === id ? { ...cls, name: newName } : cls));
    setEditingClass(null);
  };

  const handleAddSubject = (classId) => {
    if (!subjectInput.trim()) return;
    setClasses(classes.map(cls =>
      cls.id === classId
        ? { ...cls, subjects: [...cls.subjects, subjectInput] }
        : cls
    ));
    setSubjectInput("");
  };

  const handleDeleteSubject = (classId, index) => {
    setClasses(classes.map(cls =>
      cls.id === classId
        ? { ...cls, subjects: cls.subjects.filter((_, i) => i !== index) }
        : cls
    ));
  };

  const handleEditSubject = () => {
    const { classId, subjectIndex, name } = editingSubject;
    setClasses(classes.map(cls =>
      cls.id === classId
        ? {
            ...cls,
            subjects: cls.subjects.map((subj, i) =>
              i === subjectIndex ? name : subj
            )
          }
        : cls
    ));
    setEditingSubject({ classId: null, subjectIndex: null, name: "" });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Classes" />
      <div className="flex-1 p-8 md:ml-40 transition-all duration-300 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Class Management</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded-lg shadow hover:bg-[rgba(53,130,140,1)] transition"
            >
              <FaPlus className="inline mr-1" />
              Add Class
            </button>
          </div>

          {/* Class List */}
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-xl shadow-md mb-4 p-4">
              <div className="flex justify-between items-center">
                {editingClass === cls.id ? (
                  <div className="flex gap-2">
                    <input
                      className="border px-2 py-1 rounded"
                      value={cls.name}
                      onChange={(e) =>
                        setClasses(classes.map(c =>
                          c.id === cls.id ? { ...c, name: e.target.value } : c
                        ))
                      }
                    />
                    <button
                      onClick={() => handleEditClassName(cls.id, cls.name)}
                      className="text-green-600"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <h2 className="text-lg font-semibold">{cls.name}</h2>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setExpandedClass(expandedClass === cls.id ? null : cls.id)}>
                    {expandedClass === cls.id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  <button onClick={() => setEditingClass(cls.id)}><FaEdit /></button>
                  <button onClick={() => handleDeleteClass(cls.id)} className="text-red-500"><FaTrash /></button>
                </div>
              </div>

              {/* Subjects Display */}
              {expandedClass === cls.id && (
                <div className="mt-4 ml-2">
                  {cls.subjects.length === 0 && <p className="text-gray-500">No subjects yet.</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cls.subjects.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-100 rounded-md px-3 py-2">
                        {editingSubject.classId === cls.id && editingSubject.subjectIndex === index ? (
                          <>
                            <input
                              type="text"
                              className="border px-2 py-1 rounded w-full mr-2"
                              value={editingSubject.name}
                              onChange={(e) =>
                                setEditingSubject({
                                  ...editingSubject,
                                  name: e.target.value,
                                })
                              }
                            />
                            <button className="text-green-600 mr-2" onClick={handleEditSubject}>Save</button>
                          </>
                        ) : (
                          <>
                            <span className="text-gray-800">{subject}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  setEditingSubject({ classId: cls.id, subjectIndex: index, name: subject })
                                }
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteSubject(cls.id, index)}
                                className="text-red-500"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Subject */}
                  <div className="flex mt-4 gap-2">
                    <input
                      type="text"
                      className="px-3 py-2 border rounded-md w-full"
                      placeholder="New Subject"
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                    />
                    <button
                      onClick={() => handleAddSubject(cls.id)}
                      className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded-md"
                    >
                      <FaPlus className="inline mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Class Modal */}
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
    </div>
  );
};

export default AdminClasses;
