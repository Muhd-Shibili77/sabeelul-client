import React, { useState, useEffect } from "react";
import useLogin from "../../hooks/authentication/adminLogin";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { login, loading, error, success } = useLogin();
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const result = await login({ email, password });
    if (result.success) {
      setRedirect(true);
    }
  };

  useEffect(() => {
    if (redirect) {
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    }
  }, [redirect]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[rgba(53,130,140,0.9)]">
          Admin Login
        </h2>

        {/* Success & Error Messages */}
         
         
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-200 border border-red-400 rounded-md px-4 py-2">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-200 border border-green-400 rounded-md px-4 py-2">
            {success}
          </div>
        )}
          
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
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
            disabled={loading}
            className={`w-full py-2 px-4 ${
              loading
                ? "bg-gray-500 cursor-not-allowed opacity-70"
                : "bg-[rgba(53,130,140,0.9)] hover:bg-[rgba(53,130,140,1)]"
            } text-white font-semibold rounded-lg transition`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
