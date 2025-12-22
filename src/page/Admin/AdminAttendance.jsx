import React, { useState } from "react";
import SideBar from "../../components/sideBar/SideBar";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminHajarClearance = () => {
  const [admNo, setAdmNo] = useState("");
  const [absents, setAbsents] = useState([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [clearingId, setClearingId] = useState(null);

  /* ------------------------------
     FETCH ABSENT DATES
  ------------------------------ */
  const fetchAbsents = async () => {
    if (!admNo) {
      toast.error("Enter Admission Number");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/attendance/absent/${admNo}`);
      setAbsents(res.data.data || []);
      if (res.data.data.length === 0) {
        toast.info("No uncleared absents found");
      }
    } catch (err) {
      toast.error("Failed to fetch absents");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------
     CLEAR ATTENDANCE
  ------------------------------ */
  const clearAttendance = async (attendanceId) => {
    if (!reason) {
      toast.error("Enter clearance reason");
      return;
    }

    try {
      setClearingId(attendanceId);
      await api.put(`/attendance/clear/${attendanceId}`, {
        adminId: "ADMIN", // replace with logged-in admin id later
        reason,
      });



      toast.success("Attendance cleared");
      setReason("");
      fetchAbsents();
    } catch (err) {
      toast.error("Failed to clear attendance");
    } finally {
      setClearingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Attendance" />

      <div className="flex-1 p-8 md:ml-64">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Hajar Clearance
        </h1>

        {/* SEARCH CARD */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 max-w-xl">
          <label className="block text-sm font-medium mb-2">
            Admission Number
          </label>
          <div className="flex gap-3">
            <input
              value={admNo}
              onChange={(e) => setAdmNo(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="Enter admission number"
            />
            <button
              onClick={fetchAbsents}
              className="bg-[rgba(53,130,140,0.9)] text-white px-4 py-2 rounded-lg"
            >
              Search
            </button>
          </div>
        </div>

        {/* ABSENT LIST */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            Absent Dates
          </h2>

          {loading ? (
            <p className="text-center py-6">Loading...</p>
          ) : absents.length === 0 ? (
            <p className="text-gray-500 italic text-center">
              No absents to clear
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-center">Session</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {absents.map((a) => (
                  <tr key={a._id} className="border-b">
                    <td className="p-2">{a.date}</td>
                    <td className="p-2 text-center">{a.session}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => clearAttendance(a._id)}
                        disabled={clearingId === a._id}
                        className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      >
                        {clearingId === a._id ? "Clearing..." : "Clear"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* REASON */}
          {absents.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Clearance Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full border rounded-lg p-3"
                placeholder="Medical leave / Official permission / Other reason"
              />
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AdminHajarClearance;
