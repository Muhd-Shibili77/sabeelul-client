import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import imageCompression from "browser-image-compression";

const EditTeacherModal = ({ teacher, onClose, onUpdate }) => {
  const [registerNumber, setRegisterNumber] = useState(1552525);
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

    setIsSubmitting(true);
    let imageUrl = previewImage;

    if (selectedFile !== null) {
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
      const result = onUpdate(updatedTeacher._id, updatedTeacher);
    } catch (error) {
      console.error("Unexpected error occurred", error);

      if (error && error.message) {
        console.log(error);
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
        <input
          type="text"
          placeholder="Register number"
          value={registerNumber}
          disabled
          className="w-full mb-3 px-3 py-2 border rounded bg-gray-200"
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <div className="flex justify-end gap-2">
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
            } text-white rounded`}            >
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
    </div>
  );
};

export default EditTeacherModal;
