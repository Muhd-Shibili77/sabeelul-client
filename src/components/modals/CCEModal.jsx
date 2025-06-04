import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useStudentContext } from "../../context/StudentContext";
import { transformCCEData } from "../../utils/transformCCEData ";
const CCEModal = ({ isOpen, onClose, cceData }) => {
  const { theme } = useStudentContext();
  const [activeSem, setActiveSem] = useState("Ramadan Semester");


  useEffect(() => {
    if (data?.semester?.length > 0) {
      setActiveSem(data.semester[0]);
    }
  }, [isOpen, cceData]);

  const data = transformCCEData(cceData || []);

  // Helper function to determine if a phase is a formative assessment (FA) or summative assessment (SA)

  // Max marks for different assessment types
  const getMaxMarks = () => 30;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div
          className={`${theme.color} text-white p-4 flex justify-between items-center`}
        >
          <h3 className="text-xl font-bold">CCE Performance Breakdown</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Phase Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto px-4 py-2">
            {data.semester.map((sem) => (
              <button
                key={sem}
                onClick={() => setActiveSem(sem)}
                className={`px-4 py-2 mr-2 rounded-t-lg font-medium transition ${
                  activeSem === sem
                    ? `${theme.color} text-white`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {sem}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Maximum Score: {getMaxMarks()}
            </p>
          </div>

          <div className="space-y-6">
            {data.subjects.map((subject, index) => {
              const mark = subject.marks[activeSem];
              const maxMark = getMaxMarks();
              const percentage = (mark / maxMark) * 100;

              return (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium text-gray-800">
                      {subject.name}
                    </h5>
                    <span className={`${theme.text} font-bold`}>
                      {mark} / {maxMark}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`${theme.color} h-2.5 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className={`${theme.color} text-white px-4 py-2 rounded ${theme.hoverBg} transition`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CCEModal;
