import React from 'react';
import TeacherSideBar from '../../components/sideBar/teacherSideBar';

const TeacherInfo = () => {
  const teacherData = {
    name: 'Mr. Abdul Hameed',
    registrationNumber: 'SHS-TR-12345',
    phone: '+91 98765 43210',
    email: 'abdulhameed@gmail.com',
    address: '123 Knowledge Street, Edutown, Kerala',
    classTeacherOf: '10th Grade - A Section',
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <TeacherSideBar page="Profile" />

      <div className="flex-1 p-6 md:ml-64 overflow-y-auto transition-all duration-300 mt-8">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture */}
            <img
              src="https://randomuser.me/api/portraits/women/45.jpg"
              alt="Teacher Profile"
              className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full shadow-lg border-4 border-[rgba(53,130,140,0.8)]"
            />

            {/* Info Section */}
            <div className="flex-1">
              {/* <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">{teacherData.name}</h2> */}

              <div className="space-y-4">
                <div className="bg-[rgba(53,130,140,0.05)] p-4 rounded-lg shadow-sm border-l-4 border-[rgba(53,130,140,0.8)]">
                  <h4 className="font-semibold text-gray-700">Name</h4>
                  <p className="text-gray-600">{teacherData.name}</p>
                </div>
                <div className="bg-[rgba(53,130,140,0.05)] p-4 rounded-lg shadow-sm border-l-4 border-[rgba(53,130,140,0.8)]">
                  <h4 className="font-semibold text-gray-700">Registration Number</h4>
                  <p className="text-gray-600">{teacherData.registrationNumber}</p>
                </div>
                <div className="bg-[rgba(53,130,140,0.05)] p-4 rounded-lg shadow-sm border-l-4 border-[rgba(53,130,140,0.8)]">
                  <h4 className="font-semibold text-gray-700">Email</h4>
                  <p className="text-gray-600">{teacherData.email}</p>
                </div>
                <div className="bg-[rgba(53,130,140,0.05)] p-4 rounded-lg shadow-sm border-l-4 border-[rgba(53,130,140,0.8)]">
                  <h4 className="font-semibold text-gray-700">Phone Number</h4>
                  <p className="text-gray-600">{teacherData.phone}</p>
                </div>

                <div className="bg-[rgba(53,130,140,0.05)] p-4 rounded-lg shadow-sm border-l-4 border-[rgba(53,130,140,0.8)]">
                  <h4 className="font-semibold text-gray-700">Address</h4>
                  <p className="text-gray-600">{teacherData.address}</p>
                </div>

              
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default TeacherInfo;
