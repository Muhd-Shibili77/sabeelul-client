import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const EditTeacherModal = ({ teacher, onClose, onUpdate }) => {
  const [registerNumber, setRegisterNumber] = useState(teacher.registerNo);
  const [name, setName] = useState(teacher.name);
  const [phone, setPhone] = useState(teacher.phone);
  const [address, setAddress] = useState(teacher.address);
  const [email, setEmail] = useState(teacher.email);
  const [password, setPassword] = useState("");
  const [previewImage, setPreviewImage] = useState(teacher.profileImage);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (isSubmitting) return;

    // Validate all fields
    if (
      !registerNumber ||
      !name.trim() ||
      !address.trim() ||
      !email.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    // Validate image if selected
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
    let imageUrl = previewImage;

    if (selectedFile !== null) {
      try {
        const compressedFile = await imageCompression(selectedFile, {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: "image/webp",
        });

        const data = new FormData();
        data.append("file", compressedFile);
        data.append("upload_preset", "TeacherProfile");
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

    const updatedTeacher = {
      ...teacher,
      registerNumber,
      name,
      phone,
      address,
      email,
      password,
      profile: imageUrl,
    };

    try {
      await onUpdate(updatedTeacher._id, updatedTeacher);
      toast.success("Teacher updated successfully!");
    } catch (error) {
      console.error("Unexpected error occurred", error);
      if (error && error.message) {
        toast.error(error.message);
      } else {
        toast.error("Unexpected error occurred.");
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-[rgba(53,130,140,1)]">
          Edit Teacher
        </h2>

        {/* Circular Image Upload */}
        
        <div className="flex justify-center mb-4 relative">
          <label className="cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <img
              src={previewImage}
              alt="Teacher"
              className="w-30 h-30 rounded-full object-cover border-4 border-[rgba(53,130,140,0.6)] shadow"
            />
            <div className="absolute bottom-0 right-0 bg-[rgba(53,130,140,1)] p-1 rounded-full">
              <FiUpload className="text-white text-sm" />
            </div>
          </label>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-3">
        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff ID
            </label>
            <input
              type="text"
              value={registerNumber}
              onChange={(e) => setRegisterNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        

        <div className="flex justify-end gap-3 mt-5 ">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
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
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default EditTeacherModal;
