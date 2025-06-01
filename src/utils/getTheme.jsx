export const getThemeColors = (label) => {
  const colorMap = {
    "Green": {
      color: "bg-emerald-500",
      bg: "to-emerald-200",
      text: "text-emerald-700",
      hoverBg: "hover:bg-emerald-600",
      border: "border-emerald-500",
    },
    "Blue": {
      color: "bg-[rgba(0,31,63,0.7)]",
      bg: "to-[rgba(0,31,63,0.7)]",
      text: "text-[#001f3f]",
      hoverBg: "hover:bg-[rgba(0,31,63,0.85)]",
      border: "border-[#001f3f]",
    },
    "Purple": {
      color: "bg-purple-500",
      bg: "to-purple-300",
      text: "text-purple-700",
      hoverBg: "hover:bg-purple-600",
      border: "border-purple-500",
    },
    "Orange": {
      color: "bg-orange-400",
      bg: "to-orange-300",
      text: "text-orange-700",
      hoverBg: "hover:bg-orange-500",
      border: "border-orange-400",
    },
    "Red": {
      color: "bg-red-400",
      bg: "to-red-300",
      text: "text-red-700",
      hoverBg: "hover:bg-red-500",
      border: "border-red-400",
    },
    "Gray": {
      color: "bg-gray-400",
      bg: "to-gray-500",
      text: "text-gray-700",
      hoverBg: "hover:bg-gray-500",
      border: "border-gray-400",
    },
  };

  return colorMap[label] || colorMap["Gray"];
};