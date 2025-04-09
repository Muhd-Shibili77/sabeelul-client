import React, { useState } from 'react';
import SideBar from '../../components/sideBar/SideBar';

const dummyPrograms = [
  {
    name: 'Math Enrichment',
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    criteria: 'Score above 75%',
    classes: ['Class 5', 'Class 6'],
  },
  {
    name: 'Science Fair',
    startDate: '2024-07-01',
    endDate: '2024-07-15',
    criteria: 'Participation',
    classes: ['All Classes'],
  },
];

const AdminPrograms = () => {
  const [showModal, setShowModal] = useState(false);
  const [programs, setPrograms] = useState(dummyPrograms);
  const [newProgram, setNewProgram] = useState({
    name: '',
    startDate: '',
    endDate: '',
    criteria: '',
    classes: [],
  });

  const handleAddProgram = () => {
    if (!newProgram.name || !newProgram.startDate || !newProgram.endDate) return;
    setPrograms([...programs, newProgram]);
    setNewProgram({
      name: '',
      startDate: '',
      endDate: '',
      criteria: '',
      classes: [],
    });
    setShowModal(false);
  };

  const toggleClassSelection = (cls) => {
    if (cls === 'All Classes') {
      setNewProgram({ ...newProgram, classes: ['All Classes'] });
    } else {
      setNewProgram((prev) => ({
        ...prev,
        classes: prev.classes.includes(cls)
          ? prev.classes.filter((c) => c !== cls)
          : [...prev.classes.filter((c) => c !== 'All Classes'), cls],
      }));
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Programs" />
      <div className="flex-1 p-4 md:ml-12 transition-all duration-300 mt-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Programs</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[rgba(53,130,140,0.8)] text-white px-4 py-2 rounded-2xl shadow hover:bg-[rgba(53,130,140,1)] transition"
          >
            + Add New Program
          </button>
        </div>

        {/* Program List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {programs.map((program, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-[rgba(53,130,140,0.9)]">{program.name}</h3>
              <p><strong>Start:</strong> {program.startDate}</p>
              <p><strong>End:</strong> {program.endDate}</p>
              <p><strong>Criteria:</strong> {program.criteria}</p>
              <p><strong>Classes:</strong> {program.classes.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-xl">
            <h3 className="text-xl font-bold mb-4">Add New Program</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Program Name"
                className="w-full border p-2 rounded-md"
                value={newProgram.name}
                onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
              />
              <div className="flex gap-4">
                <input
                  type="date"
                  className="w-full border p-2 rounded-md"
                  value={newProgram.startDate}
                  onChange={(e) => setNewProgram({ ...newProgram, startDate: e.target.value })}
                />
                <input
                  type="date"
                  className="w-full border p-2 rounded-md"
                  value={newProgram.endDate}
                  onChange={(e) => setNewProgram({ ...newProgram, endDate: e.target.value })}
                />
              </div>
              <textarea
                placeholder="Criteria"
                className="w-full border p-2 rounded-md"
                value={newProgram.criteria}
                onChange={(e) => setNewProgram({ ...newProgram, criteria: e.target.value })}
              ></textarea>
              <div>
                <p className="font-medium mb-2">Set for Classes:</p>
                <div className="flex flex-wrap gap-2">
                  {['All Classes', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map((cls) => (
                    <button
                      key={cls}
                      onClick={() => toggleClassSelection(cls)}
                      className={`px-3 py-1 rounded-full border ${
                        newProgram.classes.includes(cls)
                          ? 'bg-[rgba(53,130,140,0.8)] text-white'
                          : 'bg-white text-gray-700'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProgram}
                  className="bg-[rgba(53,130,140,0.9)] hover:bg-[rgba(53,130,140,1)] text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPrograms;
