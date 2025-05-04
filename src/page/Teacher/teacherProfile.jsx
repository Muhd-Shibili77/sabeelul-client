import React from 'react';
import TeacherSideBar from '../../components/sideBar/teacherSideBar';
import useFetchTeachers from '../../hooks/fetch/useTeacher';
import Loader from '../../components/loader/Loader';

const TeacherInfo = () => {
  const { teachers, loading, error } = useFetchTeachers();

  const teacherData = {
    name: teachers?.name,
    registrationNumber: teachers?.registerNo,
    phone: teachers?.phone,
    email: teachers?.email,
    address: teachers?.address,
    profileImage:teachers?.profileImage
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <TeacherSideBar page="Profile" />

      <div className="flex-1 p-6 md:ml-64 overflow-y-auto transition-all duration-300 mt-8">
        {loading ? (
          <div className="flex justify-center mt-10 items-center h-[60vh]">
            <Loader />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[60vh]">
            <p className="text-red-600 text-lg font-semibold">⚠ Failed to load teachers</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Picture */}
              <img
                src={teacherData?.profileImage}
                alt="Teacher Profile"
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full shadow-lg border-4 border-[rgba(53,130,140,0.8)]"
              />

              {/* Info Section */}
              <div className="flex-1">
                <div className="space-y-4">
                  {[
                    { label: 'Name', value: teacherData.name },
                    { label: 'Registration Number', value: teacherData.registrationNumber },
                    { label: 'Email', value: teacherData.email },
                    { label: 'Phone Number', value: teacherData.phone },
                    { label: 'Address', value: teacherData.address },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-[rgba(53,130,140,0.05)] p-4 rounded-lg shadow-sm border-l-4 border-[rgba(53,130,140,0.8)]"
                    >
                      <h4 className="font-semibold text-gray-700">{item.label}</h4>
                      <p className="text-gray-600">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherInfo;
