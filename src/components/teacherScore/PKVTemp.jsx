import React, { useEffect, useState } from "react";
import { fetchPKV, addPKV, editPKV } from "../../redux/PKVSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PKVTemp = ({ cls, semester, student }) => {
  const dispatch = useDispatch();
  const { PKVScores, loading, addLoading, editLoading, error } = useSelector(
    (state) => state.PKV
  );
  // demo data
  const [marks, setMarks] = useState([
    { phase: "Phase 1", mark: 75 },
    { phase: "Phase 2", mark: 82 },
    { phase: "Phase 3", mark: 90 },
  ]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [tempMark, setTempMark] = useState("");
  const [newMark, setNewMark] = useState(""); // <-- for adding new phase

  // Fetch PKV data on component mount
  useEffect(() => {
    if (student?._id && semester) {
      dispatch(fetchPKV({ id: student._id, semester }));
    }
  }, [dispatch, student?._id, semester]);

  const handleEditClick = (index, currentMark) => {
    setEditingIndex(index);
    setTempMark(currentMark);
  };

  const handleSave = async (index) => {
    const currentPhase = PKVScores[index];
    if (tempMark > 10) {
      toast.warning("PKV score cannot exceed 10");
      return;
    }

    try {
      const updatedData = {
        semester: semester,
        ...currentPhase,
        mark: Number(tempMark),
      };

      await dispatch(
        editPKV({
          id: student._id,
          data: updatedData,
        })
      ).unwrap();

      toast.success("Mark updated successfully!");
      setEditingIndex(null);
    } catch (error) {
      toast.error(error.message || "Failed to update mark");
    }
  };

  const handleAddPhase = async () => {
    if (newMark === "" || isNaN(Number(newMark))) {
      toast.warning("Please enter a valid mark");
      return;
    }
    if (newMark > 10) {
      toast.warning("PKV score cannot exceed 10");
      return;
    }

    try {
      const newPhaseData = {
        semester: semester,
        phase: `Phase ${PKVScores.length + 1}`,
        mark: Number(newMark),
      };

      await dispatch(
        addPKV({
          id: student._id,
          data: newPhaseData,
        })
      ).unwrap();

      toast.success("New phase added successfully!");
      setNewMark("");
    } catch (error) {
      toast.error(error.message || "Failed to add new phase");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 bg-[rgba(53,130,140,0.1)] rounded-xl p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgba(53,130,140,0.9)]"></div>
          <span className="ml-2 text-gray-600">Loading PKV scores...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[rgba(53,130,140,0.1)] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">PKV Score</h2>
      {/* Student details */}
      <div>
        <p className="font-medium text-gray-700 text-lg">
          <span className="text-[rgba(53,130,140,0.9)]">Name:</span>{" "}
          {student.name} - ({`AdmNo ${student.admissionNo}`})
        </p>
        <p className="font-medium text-gray-700 text-lg">
          <span className="text-[rgba(53,130,140,0.9)]">Semester:</span>{" "}
          {semester}
        </p>
      </div>

      {/* Marks list */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PKVScores.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-5 flex flex-col justify-between border border-gray-200"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {item.phase}
              </h3>
              {editingIndex === index ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tempMark}
                    onChange={(e) => setTempMark(e.target.value)}
                    className={`w-20 border rounded-md px-2 py-1 text-sm
                      ${tempMark > 10 ? "border-red-500 text-red-600" : ""}
                      `}
                    disabled={editLoading} // disable input while saving
                  />
                  {tempMark > 10 && (
                    <span className="text-md text-red-500 mt-1">Max: 10</span>
                  )}

                  {editLoading ? (
                    <button
                      disabled
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm flex items-center gap-2"
                    >
                      <span className="animate-pulse">Saving</span>
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce delay-100">.</span>
                      <span className="animate-bounce delay-200">.</span>
                    </button>
                  ) : (
                    <>
                      {tempMark <= 10 && (
                        <button
                          onClick={() => handleSave(index)}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                        >
                          Save
                        </button>
                      )}

                      <button
                        onClick={() => setEditingIndex(null)}
                        className="px-3 py-1 bg-gray-300 rounded-lg text-sm hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleEditClick(index, item.mark)}
                  className="px-4 py-2 bg-[rgba(53,130,140,0.9)] hover:bg-[rgba(53,130,140,1)] text-white text-sm rounded-lg shadow"
                >
                  Edit
                </button>
              )}
            </div>

            <p className="text-gray-700 text-lg">
              <span className="font-medium">Mark:</span>{" "}
              {editingIndex === index ? (
                <span className="italic text-gray-500">editing...</span>
              ) : (
                item.mark
              )}
            </p>
          </div>
        ))}

        {/* Add New Phase card (hidden while editing any card) */}
        {editingIndex === null && (
          <div className="bg-white shadow-md rounded-2xl p-5 border border-gray-200 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Phase {PKVScores.length + 1}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Mark"
                disabled={addLoading}
                value={newMark}
                onChange={(e) => setNewMark(e.target.value)}
                className={`w-24 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(53,130,140,0.5)]
                  ${
                    newMark > 10
                      ? "border-red-500 text-red-600 focus:ring-red-500"
                      : "focus:ring-[rgba(53,130,140,0.5)]"
                  }
                  `}
              />
              {newMark > 10 && (
                <span className="text-md text-red-500 mt-1">Max: 10</span>
              )}
              {newMark <= 10 && (
                <button
                  onClick={handleAddPhase}
                  disabled={addLoading} // disable while loading
                  className={`px-4 py-2 flex items-center justify-center gap-2
                  ${
                    addLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[rgba(53,130,140,0.9)] hover:bg-[rgba(53,130,140,1)]"
                  }
                  text-white text-sm rounded-lg shadow`}
                >
                  {addLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    "Add"
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default PKVTemp;
