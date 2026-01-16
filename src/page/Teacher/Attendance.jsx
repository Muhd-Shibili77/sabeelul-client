import React, { useEffect, useState } from "react";
import TeacherSideBar from "../../components/sideBar/teacherSideBar";
import api from "../../services/api";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherAttendance = () => {
  const today = new Date().toISOString().split("T")[0];

  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(today);
  const [session, setSession] = useState("FN");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditable, setIsEditable] = useState(true);

  /* ---------------------------------------------
     LOAD CLASSES
  --------------------------------------------- */
  useEffect(() => {
    api
      .get("/class?limit=1000")
      .then((res) => {
        if (res.data?.success) {
          setClasses(res.data.classes || []);
        }
      })
      .catch(() => toast.error("Failed to fetch classes"));
  }, []);

  /* ---------------------------------------------
     ONE MONTH EDIT RULE
  --------------------------------------------- */
  useEffect(() => {
    const diff =
      (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    setIsEditable(diff <= 300);
  }, [date]);

  /* ---------------------------------------------
     LOAD ATTENDANCE
  --------------------------------------------- */
  useEffect(() => {
    if (classId && date && session) loadAttendance();
  }, [classId, date, session]);

  const loadAttendance = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/attendance/class/${classId}`, {
        params: { date, session },
      });

      if (res.data?.success && res.data.data.length > 0) {
        const sortedRecords = [...res.data.data].sort((a, b) => {
          const rankA = a.rank || 0;
          const rankB = b.rank || 0;
          if (rankA === 0 && rankB === 0) return 0;
          if (rankA === 0) return 1;
          if (rankB === 0) return -1;
          return rankA - rankB;
        });

        setRecords(
          sortedRecords.map((r) => ({
            attendanceId: r._id,
            studentId: r.studentId,
            name: r.studentName,
            admissionNo: r.admissionNo,
            status: r.status,
            hajar: r.hajar,
            cleared: r.cleared,
            rank: r.rank,
          }))
        );
        return;
      }

      const stuRes = await api.get(`/student/class/${classId}`);
      const students = stuRes.data.students || stuRes.data;

      const sortedStudents = [...students].sort((a, b) => {
        const rankA = a.rank || 0;
        const rankB = b.rank || 0;
        if (rankA === 0 && rankB === 0) return 0;
        if (rankA === 0) return 1;
        if (rankB === 0) return -1;
        return rankA - rankB;
      });

      setRecords(
        sortedStudents.map((s) => ({
          attendanceId: null,
          studentId: s._id,
          name: s.name,
          admissionNo: s.admissionNo,
          status: "present",
          hajar: 0.5,
          cleared: false,
          rank: s.rank,
        }))
      );
    } catch {
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------
     TOGGLE STATUS
  --------------------------------------------- */
  const toggleStatus = async (rec) => {
    if (!isEditable) {
      toast.error("Attendance cannot be edited after 30 days");
      return;
    }

    const newStatus = rec.status === "present" ? "absent" : "present";
    const newHajar = newStatus === "present" ? 0.5 : 0;

    setRecords((prev) =>
      prev.map((r) =>
        r.studentId === rec.studentId
          ? { ...r, status: newStatus, hajar: newHajar }
          : r
      )
    );

    if (rec.attendanceId) {
      try {
        await api.put(`/attendance/edit/${rec.attendanceId}`, {
          status: newStatus,
        });
      } catch {
        toast.error("Edit failed");
        loadAttendance();
      }
    }
  };

  /* ---------------------------------------------
     SUBMIT
  --------------------------------------------- */
  const submitAttendance = async () => {
    if (!classId || !date) {
      toast.error("Select class & date");
      return;
    }

    try {
      setSaving(true);
      await api.post("/attendance/mark", {
        classId,
        date,
        session,
        records: records.map((r) => ({
          studentId: r.studentId,
          status: r.status,
          hajar: r.hajar,
          cleared: r.cleared,
        })),
      });

      toast.success("Attendance saved");
      loadAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const alreadyTaken = records.some((r) => r.attendanceId);

  /* ---------------------------------------------
     UI
  --------------------------------------------- */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <TeacherSideBar page="Attendance" />

      <div className="flex-1 p-8 md:ml-64 md:mt-2">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Attendance
          </h1>
          <button
            onClick={loadAttendance}
            className="bg-white p-2 rounded-lg shadow hover:bg-gray-50"
          >
            <RefreshCw />
          </button>
        </div>

        {/* FILTER CARD */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[rgba(53,130,140,0.5)] outline-none"
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[rgba(53,130,140,0.5)] outline-none"
            />

            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[rgba(53,130,140,0.5)] outline-none"
            >
              <option value="FN">FN</option>
              <option value="AN">AN</option>
            </select>
          </div>

          {!isEditable && (
            <p className="text-red-600 text-sm mt-3">
              Attendance older than 30 days cannot be edited
            </p>
          )}
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm text-gray-800">
              <thead className="bg-[rgba(53,130,140,0.1)] text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">SI No</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-center">Adm No</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Hajar</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="animate-spin text-[rgba(53,130,140,0.9)]" />
                        <span>Loading students...</span>
                      </div>
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-6 text-gray-500">
                      Select class & date to view students
                    </td>
                  </tr>
                ) : (
                  records.map((r, index) => (
                    <tr key={r.studentId} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-500">{r.rank || index + 1}</td>
                      <td className="px-4 py-3 font-semibold">{r.name}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{r.admissionNo}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            r.status === "present"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {r.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono">{r.hajar}</td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => toggleStatus(r)}
                          className="hover:scale-110 transition-transform p-1 rounded-full hover:bg-gray-100"
                        >
                          {r.status === "present" ? (
                            <XCircle className="text-red-500" size={20} />
                          ) : (
                            <CheckCircle className="text-green-500" size={20} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM SAVE BUTTON */}
        {records.length > 0 && (
          <div className="flex justify-center pb-10">
            <button
              onClick={submitAttendance}
              disabled={alreadyTaken || saving}
              className={`px-10 py-4 rounded-xl text-lg font-bold text-white shadow-xl transition-all active:scale-95 ${
                alreadyTaken || saving
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-[rgba(53,130,140,1)] hover:shadow-[0_10px_20px_rgba(53,130,140,0.3)] hover:-translate-y-1"
              }`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="animate-spin" /> Saving...
                </span>
              ) : alreadyTaken ? (
                "Attendance Already Submitted"
              ) : (
                "Submit Final Attendance"
              )}
            </button>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default TeacherAttendance;
