import React, { useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import photo from "/defaultProfile/freepik__upload__39837.png";
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddTeacherModal = ({ onClose, onAdd }) => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    registerNumber: "",
    email: "",
    password: "",
    profile: null,
  });

  const [photoPreview, setPhotoPreview] = useState(photo);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async () => {
    setError(""); // clear previous errors
    if (isSubmitting) return;
    const { name, phone, address, registerNumber, email, password, profile } =
      formData;
    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !registerNumber.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Phone number validation (10 digits only)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be 10 digits.");
      return;
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    // Image validation (if profile is selected and not a string)
    if (profile && typeof profile !== "string") {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(profile.type)) {
        toast.error("Only JPEG, PNG, or WEBP images are allowed.");
        return;
      }

      const maxSizeInMB = 2;
      const sizeInMB = profile.size / (1024 * 1024);
      if (sizeInMB > maxSizeInMB) {
        toast.error("Image size must be less than 2MB.");
        return;
      }
    }

    setIsSubmitting(true);
    let imageUrl = photoPreview;

    if (formData.profile && typeof formData.profile !== "string") {
      const compressedFile = await imageCompression(formData.profile, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/webp",
      });

      const data = new FormData();
      data.append("file", compressedFile);
      data.append("upload_preset", "TeacherProfile");
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
        setError("Image upload failed. Please try again.");
        return;
      }
    }

    const newTeacher = {
      ...formData,
      profile: imageUrl,
    };

    try {
      const result = await onAdd(newTeacher);
    } catch (error) {
      console.error("Unexpected error occurred", error);

      if (error && error.message) {
        setError(error.message, "qwerty"); // Set the specific error message
      } else {
        setError("Unexpected error occurred."); // Fallback message
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-[rgba(53,130,140,1)]">
          Add New Teacher
        </h2>

        {error && (
          <div className="mb-4 text-red-500 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        {/* Circular Image Upload */}
        <div className="flex justify-center mb-4 relative">
          <label className="cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              ref={fileInputRef}
              className="hidden"
            />
            <img
              src={photoPreview}
              alt="Teacher"
              className="w-30 h-30 rounded-full object-cover border-4 border-[rgba(53,130,140,0.6)] shadow"
            />
            <div className="absolute bottom-0 right-0 bg-[rgba(53,130,140,1)] p-1 rounded-full">
              <FiUpload className="text-white text-sm" />
            </div>
          </label>
        </div>

        {/* Form Fields */}
        <input
          type="text"
          name="registerNumber"
          placeholder="Register number"
          value={formData.registerNumber}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={isSubmitting}
            className={`px-4 py-2 flex justify-center items-center ${
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
                Adding...
              </div>
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default AddTeacherModal;
