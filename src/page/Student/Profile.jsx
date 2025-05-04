import React from 'react';
import StudentSideBar from '../../components/sideBar/studentSideBar';
import useStudentInfo from '../../hooks/fetch/useStudentInfo';
import Loader from '../../components/loader/Loader';

const Profile = () => {

  const {student,loading,error } = useStudentInfo()

  const studentData = {
    name: student?.name,
    class: student?.classId?.name,
    role: "Student",
    email: student?.email,
    admissionNo: student?.admissionNo,
    guardian: student?.guardianName,
    address: student?.address,
    profilePhoto: student?.profileImage,
    phone:student?.phone,
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <StudentSideBar page="Profile" />

      <div className="flex-1 p-4 md:ml-60 mt-8 transition-all duration-300 overflow-y-auto">
      {loading ? (
          <div className="flex justify-center mt-10 items-center h-[60vh]">
            <Loader />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[60vh]">
            <p className="text-red-600 text-lg font-semibold">⚠ Failed to load teachers</p>
          </div>
        ) : (
       
       
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <img
              className="w-32 h-32 rounded-full object-cover border-4 border-[rgba(53,130,140,0.9)] shadow-lg"
              src={studentData.profilePhoto}
              alt="Student"
            />
            <h2 className="mt-4 text-3xl font-bold text-gray-800">{studentData.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{studentData.role}</p>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[rgba(53,130,140,0.05)] p-4 rounded-lg border-l-4 border-[rgba(53,130,140,0.8)] shadow-sm">
              <h4 className="text-gray-700 font-semibold">Admission Number</h4>
              <p className="text-gray-600">{studentData.admissionNo}</p>
            </div>

            <div className="bg-[rgba(53,130,140,0.05)] p-4 rounded-lg border-l-4 border-[rgba(53,130,140,0.8)] shadow-sm">
              <h4 className="text-gray-700 font-semibold">Class</h4>
              <p className="text-gray-600">{studentData.class}</p>
            </div>

            <div className="bg-[rgba(53,130,140,0.05)] p-4 rounded-lg border-l-4 border-[rgba(53,130,140,0.8)] shadow-sm">
              <h4 className="text-gray-700 font-semibold">Email</h4>
              <p className="text-gray-600">{studentData.email}</p>
            </div>

            <div className="bg-[rgba(53,130,140,0.05)] p-4 rounded-lg border-l-4 border-[rgba(53,130,140,0.8)] shadow-sm">
              <h4 className="text-gray-700 font-semibold">Guardian</h4>
              <p className="text-gray-600">{studentData.guardian}</p>
            </div>

            <div className="bg-[rgba(53,130,140,0.05)]  p-4 rounded-lg border-l-4 border-[rgba(53,130,140,0.8)] shadow-sm">
              <h4 className="text-gray-700 font-semibold">Address</h4>
              <p className="text-gray-600">{studentData.address}</p>
            </div>
            <div className="bg-[rgba(53,130,140,0.05)]  p-4 rounded-lg border-l-4 border-[rgba(53,130,140,0.8)] shadow-sm">
              <h4 className="text-gray-700 font-semibold">Phone</h4>
              <p className="text-gray-600">{studentData.phone}</p>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
