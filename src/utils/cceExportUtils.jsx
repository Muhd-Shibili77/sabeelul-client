import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Logo from "../assets/SabeelBlackLogo.png"; // Adjust the path as necessary
import { getCurrentAcademicYear } from "./academicYear";
import { convertImageToBase64 } from "./base64";
export const cceExportUtils = {
  exportToPDF: async (data, columns, subColumns, title, studentWise) => {
    try {
      const academicYear = getCurrentAcademicYear();
      const logoBase64 = await convertImageToBase64(Logo);

      const doc = new jsPDF("landscape");
      let currentY = 10;

      // === LOGO ===
      if (logoBase64) {
        doc.addImage(logoBase64, "PNG", 14, currentY, 20, 20);
      }

      // === COLLEGE NAME ===
      doc.setFontSize(20);
      doc.setTextColor(53, 130, 140);
      doc.setFont("helvetica", "bold");
      doc.text("SABEELUL HIDAYA ISLAMIC COLLEGE", 148, currentY + 6, {
        align: "center",
      });

      // === SUBHEADER ===
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(
        "VadeeHidaya, Vattapparamba, Parappur P.O, Kottakkal, Malappuram Dt.,\nKerala, India PIN: 676304",
        148,
        currentY + 12,
        { align: "center" }
      );

      // === INFO BAR ===
      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.text(`Academic Year: ${academicYear}`, 282, currentY + 26, {
        align: "right",
      });

      if (studentWise) {
        const testImage = await convertImageToBase64(studentWise.profileImage);
        console.log("testImage",testImage)
        const studentY = currentY + 30;
        const imageWidth = 25;
        const imageHeight = 30;
        const textStartX = 42;

        if (testImage) {
          doc.addImage(testImage, "PNG", 14, studentY, imageWidth, imageHeight);
        }

        // Labels
        doc.setFontSize(9);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("Name: ", textStartX, studentY + 5);
        doc.text("Ad No: ", textStartX, studentY + 11);
        doc.text("Class: ", textStartX, studentY + 17);

        // Values
        doc.setFont("helvetica", "normal");
        doc.text(studentWise.name, textStartX + 30, studentY + 5);
        doc.text(studentWise.admNo, textStartX + 30, studentY + 11);
        doc.text(studentWise.className, textStartX + 30, studentY + 17);
      }

      // === TITLE ===
      doc.setFontSize(12);
      doc.setTextColor(53, 130, 140);
      doc.setFont("helvetica", "bold");
      doc.text(
        studentWise ? "CCE Scores" : title,
        148,
        studentWise ? currentY + 65 : currentY + 34,
        { align: "center" }
      );

      // === TABLE ===
      const startY = studentWise ? currentY + 70 : currentY + 42;
      const hasComplexHeaders = columns.some(
        (col) => col.colspan || col.rowspan
      );
      const headers = [];

      if (hasComplexHeaders) {
        const mainHeaderRow = [];
        const subHeaderRow = [];

        columns.forEach((col) => {
          mainHeaderRow.push(col.header);
          for (let i = 1; i < (col.colspan || 1); i++) mainHeaderRow.push("");

          if (col.colspan && col.colspan > 1) {
            subColumns.forEach((subCol) => subHeaderRow.push(subCol.header));
          } else if (col.rowspan === 2) {
            subHeaderRow.push("");
          }
        });

        headers.push(mainHeaderRow);
        headers.push(subHeaderRow);
      } else {
        headers.push(columns.map((col) => col.header));
      }

      const tableData = data.map((row, index) => {
        const rowData = [];
        columns.forEach((col) => {
          if (col.colspan && col.colspan > 1) {
            subColumns.forEach((subCol) => {
              rowData.push(
                subCol.render
                  ? subCol.render(row, index)
                  : row[subCol.key] ?? ""
              );
            });
          } else {
            if (col.key === "si") {
              rowData.push(String(index + 1));
            } else {
              rowData.push(
                col.render ? col.render(row, index) : row[col.key] ?? ""
              );
            }
          }
        });
        return rowData;
      });

      const columnStyles = {};
      const totalColumns = headers[0].length;
      for (let i = 0; i < totalColumns; i++) {
        columnStyles[i] = { halign: "center", fontSize: 8 };
      }

      autoTable(doc, {
        head: headers,
        body: tableData,
        theme: "grid", // ✅ ensures borders
        margin: { top: 10, left: 10, right: 10 },
        startY,
        rowPageBreak: "avoid",
        headStyles: {
          fillColor: [53, 130, 140],
          textColor: [255, 255, 255],
          fontSize: 7,
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
        },
        bodyStyles: {
          fontSize: 6,
          halign: "center",
          cellPadding: 1,
        },
        alternateRowStyles: { fillColor: [248, 249, 250] },
        columnStyles,
        styles: {
          overflow: "linebreak",
          cellWidth: "auto",
          minCellHeight: 6,
        },
        tableWidth: "auto",

        didParseCell: (data) => {
          if (hasComplexHeaders && data.section === "head") {
            let colIndex = 0;
            columns.forEach((col) => {
              const colspan = col.colspan || 1;
              const rowspan = col.rowspan || 1;
              const inRange =
                data.column.index >= colIndex &&
                data.column.index < colIndex + colspan;

              if (inRange) {
                if (colspan > 1 && data.row.index === 0) {
                  if (data.column.index === colIndex) {
                    data.cell.colSpan = colspan;
                    data.cell.text = col.header;
                  } else {
                    data.cell.text = "";
                  }
                }

                if (rowspan === 2) {
                  if (data.row.index === 0) {
                    data.cell.rowSpan = 2;
                  } else if (data.row.index === 1 && colspan === 1) {
                    data.cell.text = "";
                  }
                }
              }
              colIndex += colspan;
            });

            if (data.cell.raw !== null && data.cell.raw !== undefined) {
              data.cell.text = String(data.cell.raw);
            }
          }
        },
        didDrawCell: (data) => {
          const { cell, doc } = data;

          if (data.section === "head") {
            doc.setDrawColor(180);
            doc.setLineWidth(0.1);
            doc.rect(cell.x, cell.y, cell.width, cell.height);

            // Vertically center header text
          }
        },
      });

      // === FOOTER ===
      const pageHeight = doc.internal.pageSize.getHeight();
      const generatedOnText = `Generated on: ${new Date().toLocaleString()}`;

      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(
        generatedOnText,
        doc.internal.pageSize.getWidth() - 14,
        pageHeight - 10,
        { align: "right" }
      );

      // === SAVE ===
      const fileName = `${title.replace(/\s+/g, "_").toLowerCase()}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      doc.save(fileName);
    } catch (error) {
      console.error("PDF Export Error:", error);
      throw new Error(`PDF export failed: ${error.message}`);
    }
  },
  // ... rest of your export functions remain the same
  exportToExcel: (data, columns, subColumns, title) => {
    // Your existing Excel export code
    const worksheetData = [];

    // Create main header row
    const mainHeaderRow = [];
    columns.forEach((col) => {
      if (col.colspan && col.colspan > 1) {
        mainHeaderRow.push(col.header);
        // Add empty cells for colspan
        for (let i = 1; i < col.colspan; i++) {
          mainHeaderRow.push("");
        }
      } else {
        mainHeaderRow.push(col.header);
      }
    });
    worksheetData.push(mainHeaderRow);

    // Create sub-header row if exists
    if (subColumns.length > 0) {
      const subHeaderRow = [];
      columns.forEach((col) => {
        if (col.colspan && col.colspan > 1) {
          subColumns.forEach((subCol) => {
            subHeaderRow.push(subCol.header);
          });
        } else {
          subHeaderRow.push(""); // Empty for non-colspan columns
        }
      });
      worksheetData.push(subHeaderRow);
    }

    // Add data rows
    data.forEach((row, index) => {
      const dataRow = [];
      columns.forEach((col) => {
        if (col.colspan && col.colspan > 1) {
          subColumns.forEach((subCol) => {
            dataRow.push(row[subCol.key] || "");
          });
        } else {
          if (col.render) {
            if (col.key === "si") {
              dataRow.push(index + 1);
            } else {
              dataRow.push(row[col.key] ?? 0);
            }
          } else {
            dataRow.push(row[col.key] ?? 0);
          }
        }
      });
      worksheetData.push(dataRow);
    });

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Calculate total columns
    let totalCols = 0;
    columns.forEach((col) => {
      if (col.colspan && col.colspan > 1) {
        totalCols += col.colspan;
      } else {
        totalCols += 1;
      }
    });

    // Set column widths
    const colWidths = Array(totalCols).fill({ wch: 12 });
    worksheet["!cols"] = colWidths;

    // Apply merges for main headers
    const merges = [];
    let colIndex = 0;
    columns.forEach((col) => {
      if (col.colspan && col.colspan > 1) {
        merges.push({
          s: { r: 0, c: colIndex },
          e: { r: 0, c: colIndex + col.colspan - 1 },
        });
        colIndex += col.colspan;
      } else if (subColumns.length > 0) {
        // Merge vertically for non-colspan columns
        merges.push({
          s: { r: 0, c: colIndex },
          e: { r: 1, c: colIndex },
        });
        colIndex += 1;
      } else {
        colIndex += 1;
      }
    });

    worksheet["!merges"] = merges;

    // Style the header rows
    const headerRowCount = subColumns.length > 0 ? 2 : 1;
    for (let row = 0; row < headerRowCount; row++) {
      for (let col = 0; col < totalCols; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "35828C" } },
            alignment: { horizontal: "center", vertical: "center" },
          };
        }
      }
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Truncate sheet name to 31 characters max and sanitize it
    const sanitizeSheetName = (name) => {
      // Remove invalid characters for Excel sheet names
      const sanitized = name.replace(/[\\\/\*\?\[\]]/g, "");
      // Truncate to 31 characters
      return sanitized.length > 31 ? sanitized.substring(0, 31) : sanitized;
    };

    const sheetName = sanitizeSheetName(title);

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Save the file - use original title for filename
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

  // Print function remains the same
  printTable: (data, columns, subColumns, title) => {
    const academicYear = getCurrentAcademicYear();

    // Your existing print code
    let headerHTML = "<thead>";

    // Main header row
    headerHTML += "<tr>";
    columns.forEach((col) => {
      if (col.colspan && col.colspan > 1) {
        headerHTML += `<th colspan="${col.colspan}" style="text-align: center;">${col.header}</th>`;
      } else {
        const rowspan = subColumns.length > 0 ? 2 : 1;
        headerHTML += `<th rowspan="${rowspan}" style="text-align: center;">${col.header}</th>`;
      }
    });
    headerHTML += "</tr>";

    // Sub-header row if exists
    if (subColumns.length > 0) {
      headerHTML += "<tr>";
      columns.forEach((col) => {
        if (col.colspan && col.colspan > 1) {
          subColumns.forEach((subCol) => {
            headerHTML += `<th style="text-align: center;">${subCol.header}</th>`;
          });
        }
      });
      headerHTML += "</tr>";
    }

    headerHTML += "</thead>";

    // Build body HTML
    let bodyHTML = "<tbody>";
    if (data.length === 0) {
      const totalCols = columns.reduce(
        (acc, col) => acc + (col.colspan || 1),
        0
      );
      bodyHTML += `<tr><td colspan="${totalCols}" style="text-align: center; padding: 20px; font-style: italic;">No data available</td></tr>`;
    } else {
      data.forEach((row, index) => {
        bodyHTML += "<tr>";
        columns.forEach((col) => {
          if (col.colspan && col.colspan > 1) {
            subColumns.forEach((subCol) => {
              bodyHTML += `<td style="text-align: center;">${
                row[subCol.key] ?? ""
              }</td>`;
            });
          } else {
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
            bodyHTML += `<td style="text-align: center;">${value}</td>`;
          }
        });
        bodyHTML += "</tr>";
      });
    }
    bodyHTML += "</tbody>";

    // Create print content
    const printContent = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
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
              margin-bottom: 10px;
              margin-top: 10px;
              font-size: 20px;
            }
            .print-info {
              text-align: center;
              font-size: 12px;
              color: #666;
              margin-bottom: 20px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              font-size: 12px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 6px; 
              text-align: center;
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
              table { font-size: 10px; }
              th, td { padding: 4px; }
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
            ${headerHTML}
            ${bodyHTML}
          </table>
        </body>
      </html>
    `;

    // Open print window
    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  },
};
