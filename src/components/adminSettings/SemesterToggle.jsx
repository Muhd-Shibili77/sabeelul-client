import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSemester, toggleSemesterLock } from "../../redux/semesterSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SemesterToggle = () => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    allSemesters,
    loading: semesterLoading,
    error,
  } = useSelector((state) => state.semester);

  useEffect(() => {
    dispatch(fetchAllSemester());
  }, [dispatch]);

  const toggleSemester = async (id) => {
    if (!editing) return;

    setLoading(true);
    try {
      await dispatch(toggleSemesterLock(id)).unwrap();
      toast.success("Semester lock status updated");
    } catch (error) {
      console.error("Error toggling semester:", error);
      toast.error(error.message || "Failed to update semester lock status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-200 relative flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Lock Semester</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            Manage Semester
          </button>
        )}
      </div>

      {/* Semester List */}
      <div className="space-y-4 overflow-y-auto pr-1 max-h-[400px] flex-1">
        {semesterLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading semesters...</p>
          </div>
        ) : allSemesters.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Semesters Available
            </h3>
          </div>
        ) : (
          allSemesters.map((semester) => (
            <div
              key={semester._id}
              className="p-4 rounded-xl border border-gray-200 shadow-sm bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">
                  {semester.semester}
                </h4>
                {/* <p className="text-gray-600 text-sm">{teacher.email}</p> */}
              </div>

              {/* Status Button */}
              <button
                onClick={() => toggleSemester(semester._id)}
                disabled={!editing}
                className={`px-3 py-1 rounded text-sm font-medium transition 
                ${
                  editing
                    ? semester.isLocked
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-red-500 text-white hover:bg-red-600"
                    : semester.isLocked
                    ? "bg-red-100 text-red-700 cursor-not-allowed"
                    : "bg-green-100 text-green-700 cursor-not-allowed"
                }
        `}
              >
                {editing
                  ? semester.isLocked
                    ? "Unlock Semester"
                    : "Lock Semester"
                  : semester.isLocked
                  ? "Locked"
                  : "Active"}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Manage Section */}
      {editing && (
        <div className="flex justify-end mt-6">
          <button
            onClick={() => setEditing(false)}
            className="px-5 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition"
          >
            Done
          </button>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
    </div>
  );
};

export default SemesterToggle;
