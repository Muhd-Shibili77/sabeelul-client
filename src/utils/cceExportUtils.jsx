import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Logo from "../assets/SabeelBlackLogo.png"; // Adjust the path as necessary
import { getCurrentAcademicYear } from "./academicYear";

export const cceExportUtils = {
  exportToPDF: (data, columns, subColumns, title) => {
    try {
      // Check if jsPDF is properly loaded
      if (!jsPDF) {
        throw new Error("jsPDF is not loaded");
      }

      const doc = new jsPDF("landscape");
      // Add title
      doc.setFontSize(18);
      doc.text(title, 14, 22);

      // Add timestamp
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

      // Check if we have complex headers (colspan > 1)
      const hasComplexHeaders = columns.some(
        (col) => col.colspan && col.colspan > 1
      );

      // Generate table headers - FIXED VERSION
      const headers = [];

      if (hasComplexHeaders) {
        // First row (main headers) - Use simple strings
        const mainHeaderRow = [];
        columns.forEach((col) => {
          if (col.colspan && col.colspan > 1) {
            // For colspan headers, just add the header text
            mainHeaderRow.push(col.header);
            // Add empty strings for the remaining colspan cells
            for (let i = 1; i < col.colspan; i++) {
              mainHeaderRow.push("");
            }
          } else {
            // For regular headers, add the header text
            mainHeaderRow.push(col.header);
          }
        });
        headers.push(mainHeaderRow);

        // Second row (sub-headers) - Use simple strings
        const subHeaderRow = [];
        columns.forEach((col) => {
          if (col.colspan && col.colspan > 1) {
            // Add sub-headers for this column
            subColumns.forEach((subCol) => {
              subHeaderRow.push(subCol.header);
            });
          } else {
            // For non-colspan columns, add empty string
            subHeaderRow.push("");
          }
        });
        headers.push(subHeaderRow);
      } else {
        // Simple single-row headers - Use simple strings
        const headerRow = columns.map((col) => col.header);
        headers.push(headerRow);
      }

      // Prepare table data - Handle undefined/null values properly
      const tableData = data.map((row, index) => {
        const rowData = [];
        columns.forEach((col) => {
          if (col.colspan && col.colspan > 1) {
            // Add sub-column data
            subColumns.forEach((subCol) => {
              let cellValue = "";
              if (subCol.render) {
                try {
                  cellValue = subCol.render(row, index) || "";
                } catch (error) {
                  console.warn("Error in subCol render:", error);
                  cellValue = "";
                }
              } else {
                cellValue =
                  row[subCol.key] !== undefined ? String(row[subCol.key]) : "";
              }
              rowData.push(cellValue);
            });
          } else {
            // Regular column
            let cellValue = "";
            if (col.render) {
              try {
                cellValue = col.render(row, index) || "";
              } catch (error) {
                console.warn("Error in col render:", error);
                cellValue = "";
              }
            } else if (col.key === "si") {
              cellValue = String(index + 1); // Serial number
            } else {
              cellValue =
                row[col.key] !== undefined ? String(row[col.key]) : "";
            }
            rowData.push(cellValue);
          }
        });
        return rowData;
      });

      // Validate that we have data
      if (!tableData || tableData.length === 0) {
        throw new Error("No data to export");
      }

      // Create column styles configuration
      const columnStyles = {};
      const totalColumns = headers[0].length;

      // Apply styles to all columns
      for (let i = 0; i < totalColumns; i++) {
        columnStyles[i] = {
          halign: "center",
          fontSize: 8,
        };
      }

      // Generate table with error handling
      autoTable(doc, {
        head: headers,
        body: tableData,
        startY: 40,
        theme: "striped",
        headStyles: {
          fillColor: [53, 130, 140],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fontSize: 6,
          cellPadding: 1,
          halign: "center",
        },
        columnStyles: columnStyles,
        alternateRowStyles: {
          fillColor: [248, 249, 250],
        },
        margin: { top: 40, left: 10, right: 10 },
        styles: {
          overflow: "linebreak",
          cellWidth: "auto",
          minCellHeight: 6,
        },
        tableWidth: "auto",
        didParseCell: function (data) {
          // Handle complex headers by merging cells
          if (hasComplexHeaders && data.section === "head") {
            // Apply merge logic for complex headers
            if (data.row.index === 0) {
              // First header row - handle colspan
              let colIndex = 0;
              columns.forEach((col) => {
                if (
                  col.colspan &&
                  col.colspan > 1 &&
                  data.column.index >= colIndex &&
                  data.column.index < colIndex + col.colspan
                ) {
                  // This cell is part of a colspan group
                  if (data.column.index === colIndex) {
                    // This is the first cell in the colspan group
                    data.cell.colSpan = col.colspan;
                    data.cell.text = col.header;
                  } else {
                    // This is a continuation cell - hide it
                    data.cell.text = "";
                  }
                }
                colIndex += col.colspan || 1;
              });
            }
          }

          // Ensure all cell content is properly stringified
          if (data.cell.raw !== null && data.cell.raw !== undefined) {
            data.cell.text = String(data.cell.raw);
          }
        },
      });

      // Save the PDF
      const fileName = `${title.replace(/\s+/g, "_").toLowerCase()}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      doc.save(fileName);

      console.log("PDF export successful");
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
