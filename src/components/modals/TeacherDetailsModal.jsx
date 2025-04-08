import React from 'react';

const TeacherDetailsModal = ({ teacher, onClose }) => {
  if (!teacher) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-[rgba(53,130,140,1)]">Teacher Details</h2>
        <div className="flex flex-col items-center">
          <img
            src={teacher.profile}
            alt={teacher.name}
            className="w-24 h-24 rounded-full mb-4 shadow"
          />
          <p><strong>Name:</strong> {teacher.name}</p>
          <p><strong>Subject:</strong> {teacher.subject}</p>
          <p><strong>Phone:</strong> {teacher.phone}</p>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[rgba(53,130,140,1)] text-white rounded hover:bg-[rgba(53,130,140,0.9)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsModal;
