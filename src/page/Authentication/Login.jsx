// components/Login.jsx
import React from "react";
import useLogin from "../../hooks/authentication/useLogin";

const Login = () => {
  const { login, loading, error } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = e.target.identifier.value.trim();
    const password = e.target.password.value;

    login({ loginData, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[rgba(53,130,140,0.9)]">
          Login to Continue
        </h2>
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-200 border border-red-400 rounded-md px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              type="text"
              name="identifier"
              required
              placeholder="Enter your User ID"
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
            className="w-full py-2 px-4 bg-[rgba(53,130,140,0.9)] text-white font-semibold rounded-lg hover:bg-[rgba(53,130,140,1)] transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
