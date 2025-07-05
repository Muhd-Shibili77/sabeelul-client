import React from "react";

const Input = ({ value, onChange, placeholder, type = "text" }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="p-3 rounded-lg border border-gray-300 shadow"
    />
  );
};

export default Input;
