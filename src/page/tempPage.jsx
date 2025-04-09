import React from 'react';
import { useNavigate } from 'react-router-dom';

const TempPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/student/login')}
          className="bg-[rgba(53,130,140,0.9)] hover:bg-[rgba(53,130,140,1)] text-white px-6 py-3 rounded-2xl shadow-md text-lg font-medium transition duration-300"
        >
          Student Page
        </button>
        <button
          onClick={() => navigate('/teacher/login')}
          className="bg-[rgba(53,130,140,0.9)] hover:bg-[rgba(53,130,140,1)] text-white px-6 py-3 rounded-2xl shadow-md text-lg font-medium transition duration-300"
        >
          Teacher Page
        </button>
        <button
          onClick={() => navigate('/admin/login')}
          className="bg-[rgba(53,130,140,0.9)] hover:bg-[rgba(53,130,140,1)] text-white px-6 py-3 rounded-2xl shadow-md text-lg font-medium transition duration-300"
        >
          Admin Page
        </button>
      </div>
    </div>
  );
};

export default TempPage;
