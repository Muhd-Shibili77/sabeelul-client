import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

const EditTeacherModal = ({ teacher, onClose, onUpdate }) => {
  const [registerNumber, setRegisterNumber] = useState(1552525);
  const [name, setName] = useState(teacher.name);
  const [phone, setPhone] = useState(teacher.phone);
  const [address, setAddress] = useState(teacher.address);
  const [email, setEmail] = useState(teacher.email);
  const [password, setPassword] = useState('');
  const [previewImage, setPreviewImage] = useState(teacher.profileImage);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate =async() => {
    let imageUrl = previewImage;

    if(selectedFile !== null){
      const data = new FormData();
      data.append("file", formData.profile);
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
      const result =  onUpdate(updatedTeacher._id,updatedTeacher);
      
     
    } catch (error) {
      console.error("Unexpected error occurred", error);
      
      if (error && error.message) {
        console.log(error)
        setError(error.message,'qwerty'); // Set the specific error message
      } else {
        setError("Unexpected error occurred."); // Fallback message
      }
    }
    
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-[rgba(53,130,140,1)]">Edit Teacher</h2>

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
            className="px-4 py-2 bg-[rgba(53,130,140,1)] text-white rounded hover:bg-[rgba(53,130,140,0.9)]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTeacherModal;
