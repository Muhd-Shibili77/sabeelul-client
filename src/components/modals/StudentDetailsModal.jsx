import React from "react";
import { getCurrentAcademicYear } from "../../utils/academicYear";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiUsers,
  FiBookOpen,
  FiAward,
} from "react-icons/fi";

const StudentDetailsModal = ({ student, onClose }) => {
  if (!student) return null;

  const academic = getCurrentAcademicYear();

  const currentMentorMark = student.mentorMarks?.find(
    (item) => item.academicYear === academic
  );
  const mentorMark = currentMentorMark ? currentMentorMark.mark : null;

  const extraMarksForCurrentYear =
    student.extraMarks?.filter((entry) => entry.academicYear === academic) ||
    [];
  const extraMarksTotal = extraMarksForCurrentYear.reduce(
    (sum, entry) => sum + entry.mark,
    0
  );

  const cceEntry = student.cceMarks?.find(
    (entry) => entry.academicYear === academic
  );

  const subjectMarks = cceEntry?.subjects || [];

  const totalCceMark = subjectMarks.reduce((total, entry) => {
    return total + entry.mark * 0.2;
  }, 0);

  const totalMark = Math.round(
    mentorMark + totalCceMark + extraMarksTotal + 200
  );

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl border border-gray-200 
                  max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[rgba(53,130,140,1)] tracking-wide">
          Student Information
        </h2>

        <div className="flex flex-col items-center gap-4 mb-8">
          <img
            src={student.profileImage || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-[rgba(53,130,140,0.8)] shadow-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 mb-6">
          <p className="flex items-center gap-2">
            <FiUser className="text-[rgba(53,130,140,1)]" />
            <strong>Admisson No:</strong>{" "}
            {student.admissionNo ? student.admissionNo : "Not Provided"}
          </p>
          <p className="flex items-center gap-2">
            <FiUser className="text-[rgba(53,130,140,1)]" />
            <strong>Name:</strong>{" "}
            {student.name ? student.name : "Not Provided"}
          </p>
          <p className="flex items-center gap-2">
            <FiBookOpen className="text-[rgba(53,130,140,1)]" />
            <strong>Class:</strong>{" "}
            {student.classId.name ? student.classId.name : "Not Provided"}
          </p>
          <p className="flex items-center gap-2">
            <FiPhone className="text-[rgba(53,130,140,1)]" />
            <strong>Phone:</strong>{" "}
            {student.phone ? student.phone : "Not Provided"}
          </p>
          <p className="flex items-center gap-2">
            <FiMail className="text-[rgba(53,130,140,1)]" />
            <strong>Email:</strong>{" "}
            {student.email ? student.email : "Not Provided"}
          </p>
          <p className="flex items-center gap-2">
            <FiUsers className="text-[rgba(53,130,140,1)]" />
            <strong>Guardian:</strong>{" "}
            {student.guardianName ? student.guardianName : "Not Provided"}
          </p>
          <p className="flex items-center gap-2">
            <FiAward className="text-[rgba(53,130,140,1)]" />
            <strong>Rank:</strong>{" "}
            {student.rank ? student.rank : "Not Provided"}
          </p>
          <p className="flex items-center gap-2 ">
            <FiMapPin className="text-[rgba(53,130,140,1)]" />
            <strong>Address:</strong>{" "}
            {student.address ? student.address : "Not Provided"}
          </p>
        </div>

        {/* === CCE MARKS === */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {subjectMarks.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
              <h3 className="text-md font-semibold mb-2 text-[rgba(53,130,140,1)]">
                CCE Score
              </h3>
              <ul className="text-sm text-gray-700 space-y-1 pl-2 list-disc">
                {subjectMarks.map((entry, idx) => (
                  <li key={idx}>
                    {entry.subjectName} ({entry.phase}): {entry.mark}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* === MENTOR MARK === */}
          {mentorMark !== null && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
              <h3 className="text-md font-semibold mb-2 text-[rgba(53,130,140,1)]">
                Mentor Score
              </h3>
              <p className="text-sm">Score: {mentorMark}</p>
            </div>
          )}

          {/* === EXTRA MARKS === */}
          {extraMarksForCurrentYear.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
              <h3 className="text-md font-semibold mb-2 text-[rgba(53,130,140,1)]">
                Extra Score
              </h3>
              <ul className="text-sm text-gray-700 space-y-1 pl-2 list-disc">
                {extraMarksForCurrentYear.map((entry, idx) => (
                  <li key={idx}>Score: {entry.mark}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* === CLOSE BUTTON === */}
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
