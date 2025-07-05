import React from "react";

const LevelBadge = ({ level }) => {
  return (
    <span
      className={`px-2 py-1 rounded text-sm ${
        level === "Green"
          ? "bg-green-100 text-green-800"
          : level === "Blue"
          ? "bg-blue-100 text-blue-800"
          : level === "Orange"
          ? "bg-orange-100 text-orange-800"
          : level === "Purple"
          ? "bg-purple-100 text-purple-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {level}
    </span>
  );
};

export default LevelBadge;
