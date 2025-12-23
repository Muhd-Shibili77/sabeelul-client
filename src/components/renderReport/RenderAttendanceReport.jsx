import React, { useEffect, useState } from "react";
import { CalendarCheck, AlertTriangle, Download } from "lucide-react";
import FilterControls from "../Buttons/filterControls";
import Select from "../Buttons/Select";
import DataTable from "../dataTable/dataTable";
import ReportLoader from "../loader/reportLoader";
import ReportError from "../loader/reportError";
import api from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchClass } from "../../redux/classSlice";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

      if (type === "sheet") {
        res = await api.get(`/attendance/sheet/${classId}`, {
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

  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    const currentColumns = columns();
    
    // Create CSV header
    const headers = currentColumns.map(col => col.header).join(",");
    
    // Create CSV rows
    const rows = data.map((row, index) => {
      return currentColumns.map(col => {
        if (col.header === "SI No") return index + 1;
        if (col.render && typeof col.render === "function") {
          // Simple case: try to get the value directly if it's just a number/string
          const val = row[col.key];
          if (typeof val === "string" || typeof val === "number") return val;
          return "";
        }
        return row[col.key] || "";
      }).join(",");
    });

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_report_${type}_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF("l", "pt", "a4");
    const title = `Attendance Sheet - ${classes.find((c) => c._id === classId)?.name} - ${month}/${year}`;

    doc.text(title, 40, 30);

    if (type === "sheet") {
      const daysInMonth = new Date(year, month, 0).getDate();
      const headers1 = ["", "", ""];
      const headers2 = ["SI", "Adm No", "Name"];

      for (let i = 1; i <= daysInMonth; i++) {
        headers1.push(`${i}`, "");
        headers2.push("FN", "AN");
      }
      headers1.push("Total", "");
      headers2.push("P", "A");

      const rows = data.map((student, idx) => {
        const row = [idx + 1, student.admissionNo, student.name];
        let totalP = 0;
        let totalA = 0;

        for (let d = 1; d <= daysInMonth; d++) {
          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const fn = student.records.find((r) => r.date === dateStr && r.session === "FN");
          const an = student.records.find((r) => r.date === dateStr && r.session === "AN");

          let fnStatus = "-";
          if (fn) {
            fnStatus = fn.status === "present" ? "P" : "A";
            if (fn.status === "present") totalP += 0.5;
            else totalA += 0.5;
          }

          let anStatus = "-";
          if (an) {
            anStatus = an.status === "present" ? "P" : "A";
            if (an.status === "present") totalP += 0.5;
            else totalA += 0.5;
          }

          row.push(fnStatus, anStatus);
        }
        row.push(totalP, totalA);
        return row;
      });

      doc.autoTable({
        head: [headers1, headers2],
        body: rows,
        startY: 50,
        styles: { fontSize: 5, cellPadding: 1 },
        headStyles: { fillColor: [53, 130, 140], halign: "center" },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 35 },
          2: { cellWidth: 70 },
        },
      });
    } else {
      // Default table export
      const currentColumns = columns().filter((c) => c.header !== "SI No");
      const headers = currentColumns.map((c) => c.header);
      const rows = data.map((item) => currentColumns.map((c) => item[c.key]));

      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 50,
        headStyles: { fillColor: [53, 130, 140] },
      });
    }

    doc.save(`attendance_${type}_${new Date().getTime()}.pdf`);
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
            { value: "sheet", label: "Attendance Sheet" },
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

        {type === "monthly" || type === "sheet" ? (
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
        ) : null}

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

        {data.length > 0 && (
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <Download size={18} />
            CSV
          </button>
        )}

        {data.length > 0 && (
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
          >
            <Download size={18} />
            PDF
          </button>
        )}
      </FilterControls>

      {/* TABLE */}
      {type === "sheet" && data.length > 0 ? (
          <div className="bg-white rounded-xl shadow overflow-x-auto p-4 transition-all duration-300">
              <h2 className="text-lg font-bold mb-4 text-[rgba(53,130,140,0.9)] border-b pb-2">Matrix Attendance Sheet</h2>
              <table className="min-w-full text-[10px] border-collapse">
                  <thead>
                      <tr className="bg-[rgba(53,130,140,0.1)]">
                          <th className="border p-1" rowSpan="2">Adm No</th>
                          <th className="border p-1 text-left" rowSpan="2">Name</th>
                          {Array.from({ length: new Date(year, month, 0).getDate() }).map((_, i) => (
                              <th key={i} className="border p-1 text-center" colSpan="2">{i + 1}</th>
                          ))}
                          <th className="border p-1" rowSpan="2">P</th>
                          <th className="border p-1" rowSpan="2">A</th>
                      </tr>
                      <tr className="bg-[rgba(53,130,140,0.05)]">
                          {Array.from({ length: new Date(year, month, 0).getDate() }).map((_, i) => (
                              <React.Fragment key={i}>
                                  <th className="border p-0.5 text-[8px]">FN</th>
                                  <th className="border p-0.5 text-[8px]">AN</th>
                              </React.Fragment>
                          ))}
                      </tr>
                  </thead>
                  <tbody>
                      {data.map((student) => {
                          const daysInMonth = new Date(year, month, 0).getDate();
                          let totalP = 0;
                          let totalA = 0;
                          return (
                              <tr key={student.studentId} className="hover:bg-teal-50/30 transition-colors">
                                  <td className="border p-1 text-center font-medium bg-gray-50">{student.admissionNo}</td>
                                  <td className="border p-1 font-medium">{student.name}</td>
                                  {Array.from({ length: daysInMonth }).map((_, i) => {
                                      const d = i + 1;
                                      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                                      const fn = student.records.find(r => r.date === dateStr && r.session === "FN");
                                      const an = student.records.find(r => r.date === dateStr && r.session === "AN");
                                      
                                      if (fn) { if (fn.status === "present") totalP += 0.5; else totalA += 0.5; }
                                      if (an) { if (an.status === "present") totalP += 0.5; else totalA += 0.5; }

                                      return (
                                          <React.Fragment key={i}>
                                              <td className={`border p-0.5 text-center ${fn ? (fn.status === "present" ? "text-green-600 font-bold" : "text-red-500 font-bold") : "text-gray-300"}`}>
                                                  {fn ? (fn.status === "present" ? "P" : "A") : "-"}
                                              </td>
                                              <td className={`border p-0.5 text-center ${an ? (an.status === "present" ? "text-green-600 font-bold" : "text-red-500 font-bold") : "text-gray-300"}`}>
                                                  {an ? (an.status === "present" ? "P" : "A") : "-"}
                                              </td>
                                          </React.Fragment>
                                      )
                                  })}
                                  <td className="border p-1 text-center font-bold text-teal-700 bg-[rgba(53,130,140,0.05)]">{totalP}</td>
                                  <td className="border p-1 text-center font-bold text-red-600 bg-[rgba(53,130,140,0.05)]">{totalA}</td>
                              </tr>
                          )
                      })}
                  </tbody>
              </table>
          </div>
      ) : data.length > 0 ? (
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
