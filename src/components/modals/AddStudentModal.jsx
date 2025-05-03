import React, { useState, useRef } from "react";
import photo from '../../assets/freepik__upload__39837.png'; // Default photo path
const AddStudentModal = ({ onAdd,onClose,classes }) => {
  const [formData, setFormData] = useState({
    admissionNo: "",
    name: "",
    phone:'',
    email: "",
    password: "",
    className: "",
    address: "",
    guardianName:'',
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
    let imageUrl = photoPreview;
    if (formData.profile && typeof formData.profile !== "string") {
      const data = new FormData();
      data.append("file", formData.profile);
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
    const submittedData = {
      ...formData,
      profile: imageUrl,
    };
    try {
      await onAdd(submittedData);
    } catch (error) {
      console.error("Unexpected error occurred", error);
      
      if (error && error.message) {
        console.log(error)
      }
    }

    console.log("Adding student:", submittedData);
    onClose();
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
          <span className="text-sm text-gray-500 mt-2">Click to upload photo</span>
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
