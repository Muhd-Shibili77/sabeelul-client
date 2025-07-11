import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Must import like this
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getCurrentAcademicYear } from "./academicYear";
import Logo from "../assets/SabeelBlackLogo.png"; // Adjust the path as necessary
export const exportUtils = {
  exportToPDF: (data, columns, title, headerColor = [53, 130, 140]) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(title, 14, 22);

    // Timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumns = columns.map((col) => col.header);
    const tableData = data.map((row, index) =>
      columns.map((col) => (col.key === "si" ? index + 1 : row[col.key] ?? ""))
    );

    // Use autoTable correctly
    autoTable(doc, {
      head: [tableColumns],
      body: tableData,
      startY: 40,
      theme: "grid", // ✅ Use 'grid' for full borders (instead of 'striped')
      headStyles: {
        fillColor: headerColor,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
        lineWidth: 0.1, // ✅ Border thickness
        lineColor: [180, 180, 180],
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: [180, 180, 180],
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250],
      },
      tableLineColor: [180, 180, 180], // ✅ Border around entire table
      tableLineWidth: 0.1,
      margin: { top: 40 },
    });

    const fileName = `${title.replace(/\s+/g, "_").toLowerCase()}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  },

  // Export to Excel
  exportToExcel: (data, columns, title) => {
    // Prepare data with headers
    const worksheetData = [
      // Header row
      columns.map((col) => col.header),
      // Data rows
      ...data.map((row, index) =>
        columns.map((col) => {
          if (col.render) {
            if (col.key === "si") {
              return index + 1;
            }
            return row[col.key] || "";
          }
          return row[col.key] || "";
        })
      ),
    ];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const colWidths = columns.map((col) => ({ wch: 15 }));
    worksheet["!cols"] = colWidths;

    // Style the header row
    const headerRange = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "35828C" } },
          color: { rgb: "FFFFFF" },
        };
      }
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);

    // Save the file
    const fileName = `${title.replace(/\s+/g, "_").toLowerCase()}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  },

  // Print functionality
  printTable: (data, columns, title) => {
    const academicYear = getCurrentAcademicYear();

    const printContent = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
          }

          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 13px;
          }

          .header img {
            height: 70px;
          }

          .header-center {
            flex: 1;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .college-name {
            font-size: 25px;
            font-weight: bold;
            color: #35828C;
          }

          .college-subheader {
            font-size: 14px;
            color: #666;
            margin-top: 2px;
          }


          .info-bar {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #666;
            margin-top: 5px;
            margin-bottom: 20px;
          }

          h1 {
            color: #35828C;
            text-align: center;
            margin-top: 10px;
            font-size: 20px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }

          th {
            background-color: #35828C;
            color: white;
            font-weight: bold;
          }

          tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${Logo}" alt="Logo" />
          <div class="header-center">
            <div class="college-name">SABEELUL HIDAYA ISLAMIC COLLEGE</div>
            <div class="college-subheader">
              VadeeHidaya, Vattapparamba, Parappur P.O, Kottakkal,<br /> Malappuram Dt., Kerala, India PIN: 676304
            </div>
          </div>
          <div style="width: 60px;"></div>
        </div>

        <div class="info-bar">
          <div>Academic Year: ${academicYear}</div>
          <div>Generated on: ${new Date().toLocaleString()}</div>
        </div>

        <h1>${title}</h1>

        <table>
          <thead>
            <tr>
              ${columns.map((col) => `<th>${col.header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row, index) => `
              <tr>
                ${columns
                  .map((col) => {
                    let value = "";
                    if (col.render) {
                      if (col.key === "si") {
                        value = index + 1;
                      } else {
                        value = row[col.key] ?? "";
                      }
                    } else {
                      value = row[col.key] ?? "";
                    }
                    return `<td>${value}</td>`;
                  })
                  .join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  },
};
