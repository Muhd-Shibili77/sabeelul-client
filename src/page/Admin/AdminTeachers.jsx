import React, { useState } from 'react';
import SideBar from '../../components/sideBar/SideBar';
import AddTeacherModal from '../../components/modals/AddTeacherModal';
import TeacherDetailsModal from '../../components/modals/TeacherDetailsModal';

const AdminTeachers = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const teachers = [
    {
      name: 'John Doe',
      subject: 'Mathematics',
      phone: '1234567890',
      profile: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      name: 'Jane Smith',
      subject: 'English',
      phone: '9876543210',
      profile: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      name: 'Alan Walker',
      subject: 'Science',
      phone: '1112223333',
      profile: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      name: 'Emma Brown',
      subject: 'Social Studies',
      phone: '4445556666',
      profile: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    {
      name: 'David Miller',
      subject: 'Physics',
      phone: '7778889999',
      profile: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    {
      name: 'Lisa Johnson',
      subject: 'Chemistry',
      phone: '9990001111',
      profile: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
  ];

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Teachers" />
      <div className="flex-1 p-4 md:ml-12 mt-5 transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[rgba(53,130,140,1)]">Teachers</h2>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-3 sm:mt-0">
            <input
              type="text"
              placeholder="Search Teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border rounded w-full sm:w-auto"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[rgba(53,130,140,1)] text-white px-4 py-2 rounded hover:bg-[rgba(53,130,140,0.9)]"
            >
              Add Teacher
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedTeachers.map((teacher, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedTeacher(teacher)}
            >
              <img
                src={teacher.profile}
                alt={teacher.name}
                className="w-16 h-16 rounded-full object-cover shadow"
              />
              <div>
                <h3 className="text-lg font-semibold text-[rgba(53,130,140,1)]">{teacher.name}</h3>
                <p className="text-gray-600">Subject: {teacher.subject}</p>
                <p className="text-gray-500">Phone: {teacher.phone}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && <AddTeacherModal onClose={() => setShowAddModal(false)} />}
      {selectedTeacher && (
        <TeacherDetailsModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
        />
      )}
    </div>
  );
};

export default AdminTeachers;
