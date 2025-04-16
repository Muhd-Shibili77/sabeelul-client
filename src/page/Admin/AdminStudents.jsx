import React, { useState } from 'react';
import SideBar from '../../components/sideBar/SideBar';
import AddStudentModal from '../../components/modals/AddStudentModal';
import StudentDetailsModal from '../../components/modals/StudentDetailsModal';
import EditStudentModal from '../../components/modals/EditStudentModal';


const AdminStudents = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Aarav Sharma",
      class: "Class 1",
      phone: "9876543210",
      profile: "https://randomuser.me/api/portraits/men/11.jpg",
      marks: {
        Math: 92,
        English: 88,
        Science: 95,
      },
    },
    {
      id: 2,
      name: "Diya Verma",
      class: "Class 2",
      phone: "9123456780",
      profile: "https://randomuser.me/api/portraits/women/22.jpg",
      marks: {
        Math: 85,
        English: 90,
        Science: 80,
      },
    },
    {
      id: 3,
      name: "Karan Mehta",
      class: "Class 1",
      phone: "9988776655",
      profile: "https://randomuser.me/api/portraits/men/33.jpg",
      marks: {
        Math: 78,
        English: 84,
        Science: 88,
      },
    },
    {
      id: 4,
      name: "Meera Iyer",
      class: "Class 3",
      phone: "9012345678",
      profile: "https://randomuser.me/api/portraits/women/44.jpg",
      marks: {
        Math: 91,
        English: 93,
        Science: 90,
      },
    },
    {
      id: 5,
      name: "Rohan Das",
      class: "Class 2",
      phone: "9871234560",
      profile: "https://randomuser.me/api/portraits/men/55.jpg",
      marks: {
        Math: 67,
        English: 70,
        Science: 72,
      },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const classOptions = ['All', 'Class 1', 'Class 2', 'Class 3'];

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const updateStudent = (updatedStudent) => {
    const updatedList = students.map((student) =>
      student.id === updatedStudent.id ? updatedStudent : student
    );
    setStudents(updatedList);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedClass === 'All' || selectedClass === '' || student.class === selectedClass)
  );

  return (
    <div className="flex  min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Students" />

      <div className="flex-1 p-8 md:ml-64 transition-all duration-300 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-[rgba(53,130,140,0.9)]">Students</h2>

          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border rounded px-3 py-2"
            >
              {classOptions.map((cls, idx) => (
                <option key={idx} value={cls === 'All' ? '' : cls}>{cls}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-2"
            />

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[rgba(53,130,140,0.9)] hover:bg-[rgba(53,130,140,1)] text-white px-4 py-2 rounded"
            >
              Add Student
            </button>
          </div>
        </div>

        {/* Student List Table */}
        <div className="overflow-x-auto rounded-xl shadow-xl bg-white p-4">
          <table className="min-w-full table-auto text-sm text-gray-800">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Class</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={student.profile}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover shadow"
                      />
                      <span className="font-semibold">{student.name}</span>
                    </td>
                    <td className="px-6 py-4">{student.class}</td>
                    <td className="px-6 py-4">{student.phone}</td>
                    <td className="px-6 py-4 text-center space-x-3">
                      <button
                        onClick={() => handleViewDetails(student)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="View Details"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="text-green-600 hover:text-green-800 transition"
                        title="Edit Student"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="flex justify-end mt-4">
          <button className="px-3 py-1 bg-gray-200 rounded mx-1">Prev</button>
          <button className="px-3 py-1 bg-gray-200 rounded mx-1">Next</button>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && <AddStudentModal onClose={() => setShowAddModal(false)} />}
      {showDetailModal && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => {
            setSelectedStudent(null);
            setShowDetailModal(false);
          }}
        />
      )}
      {showEditModal && (
        <EditStudentModal
          student={selectedStudent}
          onClose={() => {
            setSelectedStudent(null);
            setShowEditModal(false);
          }}
          onUpdate={updateStudent}
        />
      )}
    </div>
  );
};

export default AdminStudents;
