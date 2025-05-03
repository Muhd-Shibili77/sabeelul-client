import React from "react";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiUsers,
  FiBookOpen,
  FiHash,
} from "react-icons/fi";

const StudentDetailsModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-[rgba(53,130,140,1)] tracking-wide">
          Student Information
        </h2>

        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src={student.profileImage || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-[rgba(53,130,140,0.8)] shadow-lg"
          />
          <p className="text-gray-600 text-sm flex items-center gap-2">
            <FiHash className="text-[rgba(53,130,140,1)]" />
            <strong>{student.admissionNo}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 mb-6">
          <p className="flex items-center gap-2">
            <FiUser className="text-[rgba(53,130,140,1)]" />
            <strong>Name:</strong> {student.name}
          </p>
          <p className="flex items-center gap-2">
            <FiBookOpen className="text-[rgba(53,130,140,1)]" />
            <strong>Class:</strong> {student.classId.name}
          </p>
          <p className="flex items-center gap-2">
            <FiPhone className="text-[rgba(53,130,140,1)]" />
            <strong>Phone:</strong> {student.phone}
          </p>
          <p className="flex items-center gap-2">
            <FiMail className="text-[rgba(53,130,140,1)]" />
            <strong>Email:</strong> {student.email}
          </p>
          <p className="flex items-center gap-2">
            <FiUsers className="text-[rgba(53,130,140,1)]" />
            <strong>Guardian:</strong> {student.guardianName}
          </p>
          <p className="flex items-center gap-2 col-span-1 sm:col-span-2">
            <FiMapPin className="text-[rgba(53,130,140,1)]" />
            <strong>Address:</strong> {student.address}
          </p>
        </div>

        {Array.isArray(student.marks) && student.marks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-900 mb-2 border-b pb-1">Academic Marks</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 pl-4">
              {student.marks.map((mark, index) => (
                <li key={index}>
                  {mark.subject}: <strong>{mark.score}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[rgba(53,130,140,1)] text-white font-semibold hover:bg-[rgba(53,130,140,0.9)] transition duration-200 shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
