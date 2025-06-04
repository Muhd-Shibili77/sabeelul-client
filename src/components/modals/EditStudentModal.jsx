import React, { useState, useRef, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import defaultPhoto from "/defaultProfile/freepik__upload__39837.png";
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditStudentModal = ({ onClose, studentData, onUpdate, classes }) => {
  const fileInputRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    admissionNo: "",
    rank: "",
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
        rank: studentData.rank || "",
        name: studentData.name || "",
        phone: studentData.phone || "",
        className: studentData.classId?._id || studentData.classId || "", // Supports object or id
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

    if (isSubmitting) return;

    const {
      admissionNo,
      rank,
      name,
      phone,
      email,
      password,
      className,
      address,
      guardianName,
      profile,
    } = formData;

    // Required field check
    if (
      !admissionNo.trim() ||
      !name.trim() ||
      !email.trim() ||
      !className.trim() ||
      !address.trim() ||
      !guardianName.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Phone format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    // Image validation (optional)
    if (selectedFile) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Only JPEG, PNG, or WEBP images are allowed.");
        return;
      }

      const maxSizeMB = 2;
      const sizeInMB = selectedFile.size / (1024 * 1024);
      if (sizeInMB > maxSizeMB) {
        toast.error("Image size must be less than 2MB.");
        return;
      }
    }

    setIsSubmitting(true);

    let imageUrl = formData.photo;

    if (selectedFile) {
      try {
        const compressedFile = await imageCompression(selectedFile, {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: "image/webp",
        });

        const data = new FormData();
        data.append("file", compressedFile);
        data.append("upload_preset", "StudentProfile");
        data.append("cloud_name", "dzr8vw5rf");

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
        toast.error("Image upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    const updatedData = {
      ...formData,
      profile: imageUrl, // Make sure your backend expects this field
    };

    try {
      onUpdate && onUpdate(studentData._id, updatedData);
      toast.success("Student updated successfully!");
      onClose();
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update student. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto md:overflow-hidden px-4 py-8">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg max-h-full overflow-y-auto md:overflow-visible md:max-h-none">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <div
                className="w-28 h-28 rounded-full overflow-hidden shadow cursor-pointer"
                onClick={handlePhotoClick}
              >
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-[rgba(53,130,140,1)] p-2 rounded-full">
                <FiUpload className="text-white text-sm" />
              </div>
            </label>
          </div>
          <span className="text-sm text-gray-500 mt-2">
            Click to change photo
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-center">Edit Student</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: 3 inputs - Admission No, Rank, Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Admission No
              </label>
              <input
                type="text"
                name="admissionNo"
                value={formData.admissionNo}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-200 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rank
              </label>
              <input
                type="number"
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                required
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Row 2: 2 inputs - Phone, Guardian Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                required
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Guardian Name
              </label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                required
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Row 3: 1 input - Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              required
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Row 4: 3 inputs - Class, Email, Password */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Class
              </label>
              <select
                name="className"
                value={formData.className}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 flex items-center justify-center ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[rgba(53,130,140,0.9)] hover:bg-[rgba(53,130,140,1)]"
              } text-white rounded`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Saving...
                </div>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default EditStudentModal;
