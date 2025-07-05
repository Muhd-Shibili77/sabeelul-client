import React from "react";

const Select = ({ value, onChange, options, placeholder = "Select..." }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-3 rounded-lg border border-gray-300 shadow"
    >
      {placeholder && <option value="" disabled={placeholder !== "All Classes"} hidden={placeholder !== "All Classes"}>{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
