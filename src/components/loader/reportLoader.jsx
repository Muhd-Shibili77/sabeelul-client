import { Loader } from "lucide-react";
import React from "react";

const ReportLoader = ({content}) => {
  return (
    <div className="flex items-center  bg-white rounded-xl shadow justify-center h-[77vh] w-full">
      <div className="flex flex-col items-center gap-3">
        <Loader className="animate-spin text-[rgba(53,130,140,0.9)] w-6 h-6" />
        <p className="text-gray-600 font-medium">
          {content}
        </p>
      </div>
    </div>
  );
};

export default ReportLoader;
