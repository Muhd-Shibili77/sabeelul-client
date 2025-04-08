import React, { useState } from "react";

const AddStudentModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    class: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Adding student:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Add Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            pattern="[0-9]{10}"
            required
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="text"
            name="class"
            placeholder="Class"
            required
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[rgba(53,130,140,0.9)] text-white rounded hover:bg-[rgba(53,130,140,1)]"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;