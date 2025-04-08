import React, { useState } from "react";

const StudentDetailsModal = ({ student, onClose }) => {
  const [marks, setMarks] = useState(student?.marks || []);
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

        <h3 className="font-semibold mb-2">Marks</h3>
        <ul className="space-y-2 mb-4">
          {marks.map((mark, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{mark.subject}</span>
              <input
                type="number"
                value={mark.score}
                onChange={(e) => handleEditMark(index, e.target.value)}
                className="w-16 border rounded px-2"
              />
            </li>
          ))}
        </ul>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={subject}
            placeholder="Subject"
            onChange={(e) => setSubject(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
          />
          <input
            type="number"
            value={score}
            placeholder="Score"
            onChange={(e) => setScore(e.target.value)}
            className="border rounded px-2 py-1 w-20"
          />
          <button
            onClick={handleAddMark}
            className="bg-[rgba(53,130,140,0.9)] text-white px-3 rounded hover:bg-[rgba(53,130,140,1)]"
          >
            Add
          </button>
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