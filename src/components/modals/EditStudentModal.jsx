import React, { useState, useRef, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import defaultPhoto from "../../assets/freepik__upload__39837.png";

const EditStudentModal = ({ onClose, studentData, onUpdate, classes }) => {
  const [formData, setFormData] = useState({
    admissionNo: "",
    name: "",
    phone: "",
    email: "",
    password: "",
    className: "",
    address: "",
    guardianName: "",
    profile: null,
  });

  const [photoPreview, setPhotoPreview] = useState(defaultPhoto);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (studentData) {
      setFormData({
        admissionNo: studentData.admissionNo || "",
        name: studentData.name || "",
        phone: studentData.phone || "",
        className: studentData.classId?._id, // Supports object or id
        address: studentData.address || "",
        guardianName: studentData.guardianName || "",
        email: studentData.email || "",
        password: "", // Don't pre-fill
        profile: studentData.profileImage || null,
      });

      setPhotoPreview(studentData.profileImage || defaultPhoto);
    }
  }, [studentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        fileInputRef.current.value = null; // ✅ clear file input
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = formData.photo;

    if (selectedFile) {
      const data = new FormData();
      data.append("file", selectedFile);
      data.append("upload_preset", "StudentProfile");
      data.append("cloud_name", "dzr8vw5rf");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dzr8vw5rf/image/upload",
          {
            method: "POST",
            body: data,
          }
        );
        const cloudinaryData = await res.json();
        imageUrl = cloudinaryData.secure_url;
      } catch (error) {
        console.error("Image upload failed", error);
        return;
      }
    }

    const updatedData = {
      ...formData,
      profile: imageUrl, // match backend field
    };

    onUpdate && onUpdate(studentData._id, updatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-lg">
        <div className="flex flex-col items-center mb-4 relative">
          <label className="cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <img
              src={photoPreview}
              alt="Student"
              className="w-24 h-24 rounded-full object-cover border-4 border-[rgba(53,130,140,0.6)] shadow"
              onClick={handlePhotoClick}
            />
            <div className="absolute bottom-0 right-0 bg-[rgba(53,130,140,1)] p-1 rounded-full">
              <FiUpload className="text-white text-sm" />
            </div>
          </label>
          <span className="text-sm text-gray-500 mt-2">
            Click to change photo
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">Edit Student</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block mb-1 font-medium">Admission No</label>
    <input
      type="text"
      name="admissionNo"
      value={formData.admissionNo}
      disabled
      className="w-full border rounded px-4 py-2 bg-gray-200 cursor-not-allowed"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium">Student Name</label>
    <input
      type="text"
      name="name"
      value={formData.name}
      required
      onChange={handleChange}
      className="w-full border rounded px-4 py-2"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium">Phone</label>
    <input
      type="text"
      name="phone"
      value={formData.phone}
      required
      onChange={handleChange}
      className="w-full border rounded px-4 py-2"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium">Guardian Name</label>
    <input
      type="text"
      name="guardianName"
      value={formData.guardianName}
      required
      onChange={handleChange}
      className="w-full border rounded px-4 py-2"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium">Address</label>
    <input
      type="text"
      name="address"
      value={formData.address}
      required
      onChange={handleChange}
      className="w-full border rounded px-4 py-2"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium">Class</label>
    <select
      name="class"
      value={formData.className}
      onChange={handleChange}
      className="w-full border rounded px-4 py-2"
    >
      <option value="">Select Class</option>
      {classes.map((cls, idx) => (
        <option key={idx} value={cls._id}>
          {cls.name}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="block mb-1 font-medium">Email</label>
    <input
      type="email"
      name="email"
      value={formData.email}
      required
      onChange={handleChange}
      className="w-full border rounded px-4 py-2"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium">Password</label>
    <input
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      className="w-full border rounded px-4 py-2"
    />
  </div>
</div>

<div className="flex justify-between pt-4">
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
    Save
  </button>
</div>

        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
