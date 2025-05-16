import React, { useState } from 'react';
import SideBar from '../../components/sideBar/SideBar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const mockData = [
  { name: 'Alice', class: '10A', marks: 95, month: 'January', year: 2025 },
  { name: 'Bob', class: '10A', marks: 88, month: 'January', year: 2025 },
  { name: 'Charlie', class: '10B', marks: 91, month: 'February', year: 2025 },
  { name: 'David', class: '10B', marks: 85, month: 'February', year: 2025 },
  { name: 'Eva', class: '10A', marks: 78, month: 'March', year: 2025 },
];

const months = ['January', 'February', 'March'];
const years = [2024, 2025];

const AdminReport = () => {
  const [reportType, setReportType] = useState('Student-wise');
  const [monthFilter, setMonthFilter] = useState('January');
  const [yearFilter, setYearFilter] = useState(2025);

  const filteredData = mockData.filter(
    (entry) => entry.month === monthFilter && entry.year === yearFilter
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${reportType} Report`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Month: ${monthFilter}, Year: ${yearFilter}`, 14, 28);

    if (reportType === 'Student-wise') {
      autoTable(doc, {
        head: [['Name', 'Class', 'Marks']],
        body: filteredData.map((item) => [item.name, item.class, item.marks]),
        startY: 35,
        styles: { fillColor: [53, 130, 140] },
        headStyles: { textColor: '#fff', fillColor: [53, 130, 140] },
      });
    } else if (reportType === 'Class-wise') {
      const grouped = {};
      filteredData.forEach((item) => {
        if (!grouped[item.class]) grouped[item.class] = [];
        grouped[item.class].push(item);
      });

      let y = 35;
      for (const className in grouped) {
        doc.text(`Class: ${className}`, 14, y);
        y += 5;
        autoTable(doc, {
          head: [['Name', 'Marks']],
          body: grouped[className].map((item) => [item.name, item.marks]),
          startY: y,
          styles: { fillColor: [53, 130, 140] },
          headStyles: { textColor: '#fff', fillColor: [53, 130, 140] },
        });
        y = doc.lastAutoTable.finalY + 10;
      }
    }

    doc.save(`${reportType.replace(/\s/g, '_')}_Report.pdf`);
  };

  return (
    <div className="flex  min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Report" />
      <div className="flex-1 p-8 md:ml-64 transition-all duration-300 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Reports</h1>

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <select
            className="p-3 rounded-lg border border-gray-300 shadow w-full md:w-1/3"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="Student-wise">Student-wise</option>
            <option value="Class-wise">Class-wise</option>
          </select>

          <select
            className="p-3 rounded-lg border border-gray-300 shadow w-full md:w-1/4"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            {months.map((month) => (
              <option key={month}>{month}</option>
            ))}
          </select>

          <select
            className="p-3 rounded-lg border border-gray-300 shadow w-full md:w-1/4"
            value={yearFilter}
            onChange={(e) => setYearFilter(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>

          <button
            onClick={handleDownloadPDF}
            className="bg-[rgba(53,130,140,0.9)] text-white px-6 py-3 rounded-xl shadow hover:bg-[rgba(53,130,140,1)]"
          >
            Download PDF
          </button>
        </div>

        {/* Report Display */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            {reportType} Report - {monthFilter} {yearFilter}
          </h2>

          {reportType === 'Student-wise' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[rgba(53,130,140,0.9)] text-white rounded-lg">
                  <th className="p-2">Name</th>
                  <th className="p-2">Class</th>
                  <th className="p-2">Marks</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((s, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-2">{s.name}</td>
                      <td className="p-2">{s.class}</td>
                      <td className="p-2">{s.marks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            Object.entries(
              filteredData.reduce((acc, s) => {
                acc[s.class] = [...(acc[s.class] || []), s];
                return acc;
              }, {})
            ).map(([className, students], idx) => (
              <div key={idx} className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Class {className}</h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[rgba(53,130,140,0.9)] text-white rounded-2xl">
                      <th className="p-2">Name</th>
                      <th className="p-2">Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="p-2">{s.name}</td>
                        <td className="p-2">{s.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReport;
