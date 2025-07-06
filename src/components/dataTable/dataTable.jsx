import React from "react";
import ExportDropdown from "../Buttons/ExportDropDown";
import { exportUtils } from "../../utils/exportUtils";
const DataTable = ({
  title,
  icon: Icon,
  iconColor,
  headerColor,
  columns,
  data,
  showExport = true,
  pdfHeaderClr,
}) => {
   const handleExport = (type) => {
    try {
      switch(type){
        case 'PDF':
          exportUtils.exportToPDF(data,columns,title,pdfHeaderClr)
          break
        case 'excel':
          exportUtils.exportToExcel(data,columns,title)
          break  
        case 'print':
          exportUtils.printTable(data,columns,title)
          break  
        default:
          console.warn('Unknown export type:', type);  
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Icon className={iconColor} /> {title}
      </h3>
      {showExport  && <ExportDropdown onExport={handleExport} />}
    </div>
    <table className="w-full border border-gray-300 rounded-lg">
      <thead>
        <tr className={`text-white ${headerColor} rounded-lg`}>
          {columns.map((col, index) => (
            <th key={index} className="p-3 text-center border border-gray-300">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="p-4 text-center h-[315px] text-gray-500 italic"
            >
              No data available
            </td>
          </tr>
        ) : (
          data.map((row, index) => (
            <tr key={row.id || index} className="border-t hover:bg-gray-50 text-center">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="p-3 border border-gray-300">
                  {col.render ? col.render(row, index) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
  );
};

export default DataTable;
