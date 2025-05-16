import React, { useState, useRef } from "react";
import photo from "/defaultProfile/freepik__upload__39837.png"; // Default photo path
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddStudentModal = ({ onAdd, onClose, classes }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const [photoPreview, setPhotoPreview] = useState(photo); // Replace with your actual default photo path
  const fileInputRef = useRef(null);

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
      setFormData((prev) => ({ ...prev, profile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const {
      admissionNo,
      name,
      phone,
      email,
      password,
      className,
      address,
      guardianName,
      profile,
    } = formData;

    if (
      !admissionNo.trim() ||
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !password.trim() ||
      !className.trim() ||
      !address.trim() ||
      !guardianName.trim()
    ) {
     

      toast.error("Please fill in all required fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (profile && typeof profile !== "string") {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(profile.type)) {
        toast.error("Only JPEG, PNG, or WEBP images are allowed.");
        return;
      }

      const maxSizeInMB = 2;
      const sizeInMB = profile.size / (1024 * 1024);
      if (sizeInMB > maxSizeInMB) {
        toast.error("Image size should be less than 2MB.");
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
        toast.error("Image upload failed. Please try again.");
        setIsSubmitting(false);

        return;
      }
    }
    const submittedData = {
      ...formData,
      profile: imageUrl,
    };
    try {
      await onAdd(submittedData);
    } catch (error) {
      console.error("Unexpected error occurred", error);

      if (error && error.message) {
        console.log(error);
      }
    }

    onClose();
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-lg">
        <div className="flex flex-col items-center mb-4">
          <div
            className="w-30 h-30 rounded-full overflow-hidden shadow cursor-pointer"
            onClick={handlePhotoClick}
          >
            <img
              src={photoPreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="hidden"
          />
          <span className="text-sm text-gray-500 mt-2">
            Click to upload photo
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">Add Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="admissionNo"
              placeholder="Admission No"
              required
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              required
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
            <input
              type="text"
              name="guardianName"
              placeholder="Guardian Name"
              required
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              required
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
            <select
              name="className"
              value={formData.className}
              required
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            >
              <option value="" disabled>
                Select Class
              </option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="email"
              placeholder="Email"
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
          </div>
          <div className="flex justify-between pt-2">
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
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default AddStudentModal;
