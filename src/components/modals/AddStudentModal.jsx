import React, { useState, useRef } from "react";
import photo from '../../assets/freepik__upload__39837.png'; // Default photo path
const AddStudentModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    admissionNo: "",
    name: "",
    password: "",
    class: "",
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(photo); // Replace with your actual default photo path
  const fileInputRef = useRef(null);

  const classOptions = ["Class 1", "Class 2", "Class 3"];

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const submittedData = {
      ...formData,
      photo: photoPreview,
    };

    console.log("Adding student:", submittedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex flex-col items-center mb-4">
          <div
            className="w-24 h-24 rounded-full overflow-hidden shadow cursor-pointer"
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
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          <select
            name="class"
            value={formData.class}
            required
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          >
            <option value="" disabled>
              Select Class
            </option>
            {classOptions.map((cls, idx) => (
              <option key={idx} value={cls}>
                {cls}
              </option>
            ))}
          </select>

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
