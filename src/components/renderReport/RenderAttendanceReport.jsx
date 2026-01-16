import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import autoTable from "jspdf-autotable";

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

      if (type === "semester" || type === "exceeded") {
        let from = start;
        let to = end;

        if (!from || !to) {
          const defaults = getDefaultRange();
          from = defaults.start;
          to = defaults.end;
        }

        if (type === "semester") {
          res = await api.get(`/attendance/semester/${classId}`, {
            params: { start: from, end: to },
          });
        } else {
          res = await api.get(`/attendance/exceeded/${classId}`, {
            params: { start: from, end: to, limit: 6 },
          });
        }
      }

      let sortedData = res.data.data || [];

      // ✅ Sorting based on Student Rank (1, 2, 3...)
      // Students with rank 0 or undefined are moved to the end
      sortedData.sort((a, b) => {
        const rankA = a.rank || 0;
        const rankB = b.rank || 0;

        if (rankA === 0 && rankB === 0) return 0;
        if (rankA === 0) return 1;
        if (rankB === 0) return -1;
        
        return rankA - rankB;
      });

      setData(sortedData);
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

    let csvContent = "";

    if (type === "sheet") {
      const daysInMonth = new Date(year, month, 0).getDate();
      
      // Header for sheet: Adm No, Name, Day1_FN, Day1_AN, ..., TotalP, TotalA
      let headers = ["Adm No", "Name"];
      for (let d = 1; d <= daysInMonth; d++) {
        headers.push(`${d}_FN`, `${d}_AN`);
      }
      headers.push("Total P", "Total A");
      csvContent += headers.join(",") + "\n";

      // Rows for sheet
      data.forEach(student => {
        let row = [student.admissionNo || "-", `"${student.name || "-"}"`];
        let p = 0; let a = 0;
        for (let d = 1; d <= daysInMonth; d++) {
          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const fn = student.records?.find(r => r.date === dateStr && r.session === "FN");
          const an = student.records?.find(r => r.date === dateStr && r.session === "AN");
          
          row.push(fn ? (fn.status === "present" ? "P" : "A") : "-");
          row.push(an ? (an.status === "present" ? "P" : "A") : "-");
          
          if (fn) { if (fn.status === "present") p += 0.5; else a += 0.5; }
          if (an) { if (an.status === "present") p += 0.5; else a += 0.5; }
        }
        row.push(p, a);
        csvContent += row.join(",") + "\n";
      });
    } else {
      const currentColumns = columns();
      const headers = currentColumns.map(col => col.header).join(",");
      const rows = data.map((row, index) => {
        return currentColumns.map(col => {
          if (col.header === "SI No") return row.rank || index + 1;
          const val = row[col.key];
          if (typeof val === "string") return `"${val}"`;
          return val ?? "";
        }).join(",");
      });
      csvContent = [headers, ...rows].join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_${type}_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    try {
      if (!data || data.length === 0) {
        toast.error("No data available to export");
        return;
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: type === "sheet" ? "a3" : "a4",
      });

      const className = classes.find((c) => c._id === classId)?.name || "Class";
      const campusName = "SABEELUL HIDAYA ISLAMIC COLLEGE";
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      // --- HEADER SECTION ---
      doc.setFontSize(20);
      doc.setTextColor(53, 130, 140);
      doc.setFont("helvetica", "bold");
      doc.text(campusName, doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("MONTHLY ATTENDANCE SHEET", doc.internal.pageSize.getWidth() / 2, 65, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Class: ${className}`, 40, 90);
      doc.text(`Month: ${monthNames[month - 1]} ${year}`, doc.internal.pageSize.getWidth() - 40, 90, { align: "right" });

      if (type === "sheet") {
        const daysInMonth = new Date(year, month, 0).getDate();
        
        // Headers
        const headRow1 = [
          { content: "SI", rowSpan: 2, styles: { halign: "center", valign: "middle" } },
          { content: "Adm No", rowSpan: 2, styles: { halign: "center", valign: "middle" } },
          { content: "Name", rowSpan: 2, styles: { halign: "left", valign: "middle" } },
        ];

        for (let d = 1; d <= daysInMonth; d++) {
          headRow1.push({ content: `${d}`, colSpan: 2, styles: { halign: "center" } });
        }
        headRow1.push({ content: "Total", colSpan: 2, styles: { halign: "center" } });

        const headRow2 = [];
        for (let d = 1; d <= daysInMonth; d++) { headRow2.push("FN", "AN"); }
        headRow2.push("P", "A");

        // Data Rows
        const rows = data.map((student, idx) => {
          const rowData = [idx + 1, student.admissionNo || "-", student.name || "-"];
          let p = 0; let a = 0;

          for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const fn = student.records?.find(r => r.date === dateStr && r.session === "FN");
            const an = student.records?.find(r => r.date === dateStr && r.session === "AN");

            const fnStat = fn ? (fn.status === "present" ? "P" : "A") : "-";
            const anStat = an ? (an.status === "present" ? "P" : "A") : "-";

            if (fn) { if (fn.status === "present") p += 0.5; else a += 0.5; }
            if (an) { if (an.status === "present") p += 0.5; else a += 0.5; }

            rowData.push(fnStat, anStat);
          }
          rowData.push(p, a);
          return rowData;
        });

        // --- SIGNATURE ROW ---
        const sigRow = ["", "", "DAILY SIGNATURE"];
        for (let d = 1; d <= daysInMonth * 2; d++) { sigRow.push(""); }
        sigRow.push("", "");
        rows.push(sigRow);

        autoTable(doc, {
          head: [headRow1, headRow2],
          body: rows,
          startY: 110,
          styles: { fontSize: 6, cellPadding: 2, textColor: [0, 0, 0] },
          headStyles: { fillColor: [53, 130, 140], textColor: 255, fontStyle: "bold" },
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 40 },
            2: { cellWidth: 90 },
          },
          didDrawCell: (data) => {
            if (data.row.index === rows.length - 1) {
              doc.setFont("helvetica", "bold");
            }
          },
          willDrawCell: (data) => {
            if (data.row.index === rows.length - 1 && data.column.index >= 2) {
              doc.setFillColor(235, 250, 250); // Soft styling for signature row
            }
          },
          theme: "grid",
        });

        // --- FOOTER SIGNATURES ---
        const finalY = (doc.lastAutoTable?.finalY || 105) + 30; // Reduce gap to avoid white space
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("CLASS TEACHER SIGNATURE", 40, finalY);
        doc.text("PRINCIPAL / OFFICE SEAL", doc.internal.pageSize.getWidth() - 40, finalY, { align: "right" });
      } else {
        // Standard tables
        const currentCols = columns().filter(c => c.header !== "SI No");
        const headers = ["SI", ...currentCols.map(c => c.header)];
        const bodyRows = data.map((item, idx) => [
          item.rank || idx + 1,
          ...currentCols.map(c => item[c.key] ?? "-"),
        ]);

        autoTable(doc, {
          head: [headers],
          body: bodyRows,
          startY: 110,
          headStyles: { fillColor: [53, 130, 140], textColor: 255 },
          styles: { fontSize: 9 },
          theme: "grid",
        });
      }

      doc.save(`Attendance_${type}_${className}_${month}_${year}.pdf`);
      toast.success("PDF Downloaded Successfully");
    } catch (err) {
      console.error(err);
      toast.error("Error generating PDF: " + err.message);
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
  }, [type, classId, year, month, start, end]);

  const columns = () => {
    if (type === "monthly" || type === "semester") {
      return [
        { header: "SI No", render: (row, i) => row.rank || i + 1 },
        { header: "Adm No", key: "admissionNo" },
        { header: "Name", key: "name" },
        { header: "Present", key: "totalPresent" },
        { header: "Absent", key: "totalAbsent" },
      ];
    }

    return [
      { header: "SI No", render: (row, i) => row.rank || i + 1 },
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
            { value: "semester", label: "Semester Report (Range)" },
            { value: "sheet", label: "Attendance Sheet" },
            { value: "exceeded", label: "Exceeded Absentees" },
          ]}
        />

        <Select
          value={classId}
          onChange={setClassId}
          placeholder="Select Class"
          options={[
            { value: "all", label: "All Classes" },
            ...classes.map((c) => ({
              value: c._id,
              label: c.name,
            })),
          ]}
        />

        {type === "monthly" || type === "sheet" ? (
          <>
            <Select
              value={month}
              onChange={setMonth}
              options={[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((name, i) => ({
                value: i + 1,
                label: name,
              }))}
            />
            <Select
              value={year}
              onChange={setYear}
              options={[
                { value: 2024, label: "2024" },
                { value: 2025, label: "2025" },
                { value: 2026, label: "2026" },
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RenderAttendanceReport;
