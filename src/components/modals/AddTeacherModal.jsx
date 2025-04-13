import React, { useRef, useState } from "react";
import photo from '../../assets/freepik__upload__39837.png'; // Default photo path
const AddTeacherModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(photo); // Make sure this exists in public/
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
      setFormData((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    const submittedData = {
      ...formData,
      photo: photoPreview,
    };

    console.log("New Teacher:", submittedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
        <div className="flex flex-col items-center mb-4">
          <div
            className="w-24 h-24 rounded-full overflow-hidden shadow cursor-pointer"
            onClick={handlePhotoClick}
          >
            <img
              src={photoPreview}
              alt="Teacher"
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

        <h2 className="text-xl font-semibold mb-4 text-[rgba(53,130,140,1)] text-center">
          Add New Teacher
        </h2>

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
            className="px-4 py-2 bg-[rgba(53,130,140,1)] text-white rounded hover:bg-[rgba(53,130,140,0.9)]"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTeacherModal;
