import React, { useEffect, useState } from "react";
import { CalendarCheck, AlertTriangle } from "lucide-react";
import FilterControls from "../Buttons/filterControls";
import Select from "../Buttons/Select";
import DataTable from "../dataTable/dataTable";
import ReportLoader from "../loader/reportLoader";
import ReportError from "../loader/reportError";
import api from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchClass } from "../../redux/classSlice";

const RenderAttendanceReport = () => {
  const dispatch = useDispatch();
  const classes = useSelector((state) => state.class.classes || []);

  const [type, setType] = useState("monthly");
  const [classId, setClassId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchClass({ limit: 1000 }));
  }, [dispatch]);

  const fetchReport = async () => {
    if (!classId) return;

    try {
      setLoading(true);
      setError("");

      let res;

      if (type === "monthly") {
        res = await api.get(`/attendance/monthly/${classId}`, {
          params: { year, month },
        });
      }

      if (type === "semester") {
        res = await api.get(`/attendance/semester/${classId}`, {
          params: { start, end },
        });
      }

      if (type === "exceeded") {
        let from = start;
        let to = end;

        // ✅ fallback to default if dates not selected
        if (!from || !to) {
          const defaults = getDefaultRange();
          from = defaults.start;
          to = defaults.end;
        }

        res = await api.get(`/attendance/exceeded/${classId}`, {
          params: {
            start: from,
            end: to,
            limit: 6,
          },
        });
      }

      setData(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch attendance report");
    } finally {
      setLoading(false);
    }
  };

  const getDefaultRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1); // Jan 1
    const end = now;

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  };

  useEffect(() => {
    fetchReport();
  }, [type, classId]);

  const columns = () => {
    if (type === "monthly") {
      return [
        { header: "SI No", render: (_, i) => i + 1 },
        { header: "Adm No", key: "admissionNo" },
        { header: "Name", key: "name" },
        { header: "Present", key: "totalPresent" },
        { header: "Absent", key: "totalAbsent" },
      ];
    }

    if (type === "semester") {
      return [
        { header: "SI No", render: (_, i) => i + 1 },
        { header: "Adm No", key: "admissionNo" },
        { header: "Name", key: "name" },
        { header: "Total Absent", key: "totalAbsent" },
      ];
    }

    return [
      { header: "SI No", render: (_, i) => i + 1 },
      { header: "Adm No", key: "admissionNo" },
      { header: "Name", key: "name" },
      {
        header: "Absents",
        key: "totalAbsents",
        render: (row) => (
          <span className="text-red-600 font-semibold">{row.totalAbsents}</span>
        ),
      },
    ];
  };

  if (loading) return <ReportLoader content="Fetching attendance report..." />;
  if (error) return <ReportError content={error} />;

  return (
    <div className="space-y-6">
      {/* FILTERS */}
      <FilterControls>
        <Select
          value={type}
          onChange={(v) => {
            setType(v);
            setData([]);
          }}
          options={[
            { value: "monthly", label: "Monthly Report" },
            { value: "semester", label: "Semester Report" },
            { value: "exceeded", label: "Exceeded Absentees" },
          ]}
        />

        <Select
          value={classId}
          onChange={setClassId}
          placeholder="Select Class"
          options={classes.map((c) => ({
            value: c._id,
            label: c.name,
          }))}
        />

        {type === "monthly" && (
          <>
            <Select
              value={month}
              onChange={setMonth}
              options={Array.from({ length: 12 }).map((_, i) => ({
                value: i + 1,
                label: `Month ${i + 1}`,
              }))}
            />
            <Select
              value={year}
              onChange={setYear}
              options={[
                { value: 2024, label: "2024" },
                { value: 2025, label: "2025" },
              ]}
            />
          </>
        )}

        {(type === "semester" || type === "exceeded") && (
          <>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="px-3 py-2 border rounded"
            />
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="px-3 py-2 border rounded"
            />
          </>
        )}

        <button
          onClick={fetchReport}
          className="px-4 py-2 bg-[rgba(53,130,140,0.9)] text-white rounded-lg"
        >
          Generate
        </button>
      </FilterControls>

      {/* TABLE */}
      {data.length > 0 ? (
        <DataTable
          title="Attendance Report"
          icon={type === "exceeded" ? AlertTriangle : CalendarCheck}
          iconColor="text-[rgba(53,130,140,0.9)]"
          headerColor="bg-[rgba(53,130,140,0.9)]"
          columns={columns()}
          data={data}
        />
      ) : (
        <div className="bg-white p-8 rounded-xl text-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
};

export default RenderAttendanceReport;
