import React from 'react';
import StudentSideBar from '../../components/sideBar/studentSideBar';

const Profile = () => {
  const student = {
    name: "Aliya Rahman",
    class: "Grade 10 - A",
    role: "Student",
    email: "aliya.rahman@example.com",
    admissionNo: "SHS10234",
    guardian: "Mr. Rahman",
    address: "Kozhikode, Kerala, India",
    profilePhoto: "https://i.pravatar.cc/150?img=32",
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <StudentSideBar page="Profile" />

      <div className="flex-1 p-4 md:ml-60 mt-8 transition-all duration-300 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <img
              className="w-32 h-32 rounded-full object-cover border-4 border-[rgba(53,130,140,0.9)] shadow-lg"
              src={student.profilePhoto}
              alt="Student"
            />
            <h2 className="mt-4 text-3xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{student.role}</p>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[rgba(53,130,140,0.05)] p-4 rounded-lg border-l-4 border-[rgba(53,130,140,0.8)] shadow-sm">
              <h4 className="text-gray-700 font-semibold">Admission Number</h4>
              <p className="text-gray-600">{student.admissionNo}</p>
            </div>

            <div className="bg-[rgba(53,130,140,0.05)] p-4 rounded-lg border-l-4 border-[rgba(53,130,140,0.8)] shadow-sm">
              <h4 className="text-gray-700 font-semibold">Class</h4>
              <p className="text-gray-600">{student.class}</p>
            </div>

            <div className="bg-[rgba(53,130,140,0.05)] p-4 rounded-lg border-l-4 border-[rgba(53,130,140,0.8)] shadow-sm">
              <h4 className="text-gray-700 font-semibold">Email Address</h4>
              <p className="text-gray-600">{student.email}</p>
            </div>

            <div className="bg-[rgba(53,130,140,0.05)] p-4 rounded-lg border-l-4 border-[rgba(53,130,140,0.8)] shadow-sm">
              <h4 className="text-gray-700 font-semibold">Guardian</h4>
              <p className="text-gray-600">{student.guardian}</p>
            </div>

            <div className="bg-[rgba(53,130,140,0.05)] md:col-span-2 p-4 rounded-lg border-l-4 border-[rgba(53,130,140,0.8)] shadow-sm">
              <h4 className="text-gray-700 font-semibold">Address</h4>
              <p className="text-gray-600">{student.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
