import React, { useState } from "react";

const StudentDetailsModal = ({ student, onClose }) => {
  const [marks, setMarks] = useState(Array.isArray(student?.marks) ? student.marks : []);
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");

  const handleAddMark = () => {
    if (subject && score) {
      const updated = [...marks, { subject, score }];
      setMarks(updated);
      setSubject("");
      setScore("");
    }
  };

  const handleEditMark = (index, newScore) => {
    const updated = [...marks];
    updated[index].score = newScore;
    setMarks(updated);
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Student Details</h2>
        <div className="flex flex-col items-center gap-4 mb-4">
          <img
            src={student?.profile || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
          <div className="text-center">
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Class:</strong> {student.class}</p>
            <p><strong>Phone:</strong> {student.phone}</p>
          </div>
        </div>

       
      

        

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;