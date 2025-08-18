import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacher } from "../../redux/teacherSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/api";
const TeacherToggle = () => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    teachers,
    loading: teacherLoading,
    error,
  } = useSelector((state) => state.teacher);

  useEffect(() => {
    dispatch(fetchTeacher({ limit: 10000 }));
  }, [dispatch]);

  // ✅ Toggle a single teacher's block/unblock status
  const toggleTeacher = async (id) => {
    if (!editing) return; // Prevent toggle if not in manage mode

    try {
      const { data } = await api.put(`/admin/block/${id}`);

      if (data?.success) {
        toast.success("Teacher status updated");
        // Refresh teacher list
        dispatch(fetchTeacher({ limit: 10000 }));
      } else {
        toast.error(data?.message || "Failed to update teacher");
      }
    } catch (error) {
      console.error("Error toggling teacher:", error);
      toast.error("Something went wrong while updating teacher");
    }
  };

  // Toggle all teachers
  const toggleAllTeachers = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const { data } = await api.put(`/admin/block`);
      if (data?.success) {
        toast.success("All teachers toggled");
        dispatch(fetchTeacher({ limit: 10000 }));
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(data?.message || "Failed to update teacher");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Failed to toggle all teachers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-200 relative flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Block Teachers</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            Manage Teachers
          </button>
        )}
      </div>

      {/* Teachers List */}
      <div className="space-y-4 overflow-y-auto pr-1 max-h-[400px] flex-1">
        {teacherLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading teachers...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Teachers Available
            </h3>
          </div>
        ) : (
          teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="p-4 rounded-xl border border-gray-200 shadow-sm bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">
                  {teacher.name}
                </h4>
                <p className="text-gray-600 text-sm">{teacher.email}</p>
              </div>

              {/* Status Button */}
              <button
                onClick={() => toggleTeacher(teacher._id)}
                disabled={!editing} // ❌ disable if not in manage mode
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  teacher.isBlock
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                } ${
                  editing
                    ? "hover:bg-opacity-80 cursor-pointer"
                    : "cursor-not-allowed opacity-70"
                }`}
              >
                {teacher.isBlock ? "Blocked" : "Active"}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Manage Section */}
      {editing && (
        <div className="flex justify-between mt-6">
          <button
            onClick={toggleAllTeachers}
            disabled={loading}
            className="px-5 py-2 bg-[rgba(53,130,140,0.9)] text-white text-sm rounded hover:bg-[rgba(53,130,140,1)] transition"
          >
            {loading ? "Updating" : "Toggle All Teachers"}
          </button>
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

export default TeacherToggle;
