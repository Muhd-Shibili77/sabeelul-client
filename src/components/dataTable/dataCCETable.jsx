import React from "react";
import ExportDropdown from "../Buttons/ExportDropDown";

const DataCCETable = ({
  title,
  icon: Icon,
  iconColor,
  headerColor,
  columns,
  subColumns = [],
  data,
  showExport = true,
  onExport,
}) => {
  const hasColSpan = columns.some((col) => col.colspan && col.colspan > 1);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Icon className={iconColor} /> {title}
        </h3>
        {showExport && onExport && <ExportDropdown onExport={onExport} />}
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full border border-gray-300 rounded-lg ">
          <thead>
            <tr className={`text-white ${headerColor}`}>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`p-3 text-center border border-gray-300`}
                  rowSpan={col.rowspan || 1}
                  colSpan={col.colspan || 1}
                >
                  {col.header}
                </th>
              ))}
            </tr>

            {hasColSpan && (
              <tr className={`text-white ${headerColor}`}>
                {columns.map((col, index) => {
                  if (col.colspan && col.colspan > 1) {
                    return subColumns.map((subCol, subIndex) => (
                      <th
                        key={`sub-${index}-${subIndex}`}
                        className="p-3 text-center border border-gray-300"
                      >
                        {subCol.header}
                      </th>
                    ));
                  } else if (!col.colspan && !col.rowspan) {
                    return (
                      <th
                        key={`empty-${index}`}
                        className="p-3 text-center border border-gray-300"
                      >
                        {/* Empty cell if needed */}
                      </th>
                    );
                  }
                  return null;
                })}
              </tr>
            )}
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + subColumns.length}
                  className="p-4 text-center h-[315px] text-gray-500 italic border border-gray-300"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id || index}
                  className="border-t hover:bg-gray-50 text-center"
                >
                  {columns.map((col, colIndex) => {
                    if (col.colspan && col.colspan > 1) {
                      return subColumns.map((subCol, subIndex) => (
                        <td
                          key={`sub-data-${subIndex}`}
                          className="p-3 border border-gray-300"
                        >
                          {row[subCol.key]}
                        </td>
                      ));
                    } else {
                      return (
                        <td
                          key={colIndex}
                          className="p-3 border border-gray-300"
                        >
                          {col.render ? col.render(row, index) : row[col.key]}
                        </td>
                      );
                    }
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataCCETable;
