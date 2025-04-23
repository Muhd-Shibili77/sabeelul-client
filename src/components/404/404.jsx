import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-[rgba(53,130,140,0.9)] flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 sm:p-10">
          <div className="flex justify-center">
            <div className="text-center">
              <h1 className="text-9xl font-bold text-[rgba(53,130,140,0.9)]">404</h1>
              <div className="h-1 w-16 bg-[rgba(53,130,140,0.9)] mx-auto my-4"></div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-3">Page Not Found</h2>
              <p className="text-gray-600 mb-8">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
              <button
                onClick={handleNavigateHome}
                className="px-6 py-3 bg-[rgba(53,130,140,0.9)] text-white font-medium rounded-lg shadow-md cursor-pointer hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default NotFound;