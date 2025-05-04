export const getLevelData = (mark) => {
    if (mark >= 85) return { color: "bg-green-500", label: "Green" };
    if (mark >= 70) return { color: "bg-blue-500", label: "Blue" };
    if (mark >= 50) return { color: "bg-purple-500", label: "Purple" };
    return { color: "bg-red-500", label: "Red" };
  };