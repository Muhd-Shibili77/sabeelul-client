import React, { useEffect, useState } from "react";
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
  const [history, setHistory] = useState([]);

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
      fetchClearanceHistory();
    } catch (err) {
      toast.error("Failed to clear attendance");
    } finally {
      setClearingId(null);
    }
  };

  /* ------------------------------
     FETCH CLEARANCE HISTORY
  ------------------------------ */
  const fetchClearanceHistory = async () => {
    try {
      const res = await api.get("/attendance/clearance-history");
      setHistory(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch clearance history");
    }
  };

  useEffect(() => {
    fetchClearanceHistory();
  }, []);


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Attendance" />

      <div className="flex-1 p-8 md:ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Hajar Clearance
          </h1>
        </div>

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
        {admNo && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Absent Dates (to clear)
            </h2>

            {loading ? (
              <p className="text-center py-6">Loading...</p>
            ) : absents.length === 0 ? (
              <p className="text-gray-500 italic text-center">
                No uncleared absents found for this ID
              </p>
            ) : (
              <>
                <table className="w-full text-sm mb-6">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-center">Session</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absents.map((a) => (
                      <tr key={a._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{a.date}</td>
                        <td className="p-3 text-center">{a.session}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => clearAttendance(a._id)}
                            disabled={clearingId === a._id}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 shadow-sm"
                          >
                            {clearingId === a._id ? "Clearing..." : "Clear"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Clearance Reason
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-[rgba(53,130,140,0.5)] focus:outline-none transition-all"
                    placeholder="Enter reason (e.g., Medical leave, Permitted)"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* CLEARANCE HISTORY */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Clearance History
          </h2>
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="p-3 text-left text-gray-600">Adm No</th>
                  <th className="p-3 text-left text-gray-600">Student Name</th>
                  <th className="p-3 text-center text-gray-600">Date</th>
                  <th className="p-3 text-center text-gray-600">Session</th>
                  <th className="p-3 text-left text-gray-600">Reason</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400 italic">No history available</td>
                  </tr>
                ) : (
                  history.map((h) => (
                    <tr key={h._id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-3 font-semibold text-gray-700">{h.admissionNo}</td>
                      <td className="p-3 text-gray-700">{h.studentName}</td>
                      <td className="p-3 text-center text-gray-700">{h.date}</td>
                      <td className="p-3 text-center font-bold text-gray-700">{h.session}</td>
                      <td className="p-3 text-gray-500 text-xs italic">"{h.clearedReason}"</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AdminHajarClearance;
