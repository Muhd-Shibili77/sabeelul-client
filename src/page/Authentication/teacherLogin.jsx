import React from "react";
import { useNavigate } from "react-router-dom";
const TeacherLogin = () => {
   const navigate = useNavigate()
  const handleLogin = (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    const password = e.target.password.value;
    console.log("Login with", { phone, password });
    // Handle login logic here
    navigate('/teacher/score')
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[rgba(53,130,140,0.9)]">
          Teacher Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              pattern="[0-9]{10}"
              required
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgba(53,130,140,0.7)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgba(53,130,140,0.7)]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[rgba(53,130,140,0.9)] text-white font-semibold rounded-lg hover:bg-[rgba(53,130,140,1)] transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;
