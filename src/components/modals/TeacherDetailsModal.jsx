import React from 'react';

const TeacherDetailsModal = ({ teacher, onClose }) => {
  if (!teacher) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-lg">
        <h2 className="text-xl font-semibold mb-6 text-[rgba(53,130,140,1)] text-center">
          Teacher Details
        </h2>

        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <img
            src={teacher.profile}
            alt={teacher.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-[rgba(53,130,140,0.5)] shadow"
          />
        </div>

        {/* Teacher Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-700 text-[15px]">
          <div>
            <p><strong className="text-[rgba(53,130,140,1)]">Name:</strong> {teacher.name}</p>
          </div>
          <div>
            <p><strong className="text-[rgba(53,130,140,1)]">Subject:</strong> {teacher.subject}</p>
          </div>
          <div>
            <p><strong className="text-[rgba(53,130,140,1)]">Phone:</strong> {teacher.phone}</p>
          </div>
          <div>
            <p><strong className="text-[rgba(53,130,140,1)]">Email:</strong> {teacher.email}</p>
          </div>
          <div>
            <p><strong className="text-[rgba(53,130,140,1)]">Address:</strong> {teacher.address}</p>
          </div>
          <div>
            <p><strong className="text-[rgba(53,130,140,1)]">Register No:</strong> {teacher.registerNumber}</p>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[rgba(53,130,140,1)] text-white rounded hover:bg-[rgba(53,130,140,0.9)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsModal;
