import React from "react";

const FilterControls = ({ children }) => {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">{children}</div>
  );
};

export default FilterControls;
