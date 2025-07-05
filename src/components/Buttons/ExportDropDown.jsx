import React, { useState } from "react";
import { ChevronDown, Download, } from "lucide-react";

const ExportDropdown = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[rgba(53,130,140,0.8)] text-white px-4 py-2 rounded-lg hover:bg-[rgba(53,130,140,1)] transition-colors"
      >
        <Download size={20} />
        Export
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-10">
          <button
            onClick={() => {
              onExport("pdf");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg"
          >
            Export as PDF
          </button>
          <button
            onClick={() => {
              onExport("excel");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg"
          >
            Export as Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
