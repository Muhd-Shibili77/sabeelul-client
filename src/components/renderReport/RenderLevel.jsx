import React, { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import DataTable from "../dataTable/dataTable";
import FilterControls from "../Buttons/filterControls";
import Select from "../Buttons/Select";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentByLevel } from "../../redux/studentSlice";
import { fetchClass } from "../../redux/classSlice";
import ReportLoader from "../loader/reportLoader";
import ReportError from "../loader/reportError";
const RenderLevel = ({ handleExport }) => {
  const dispatch = useDispatch();
  const [selectedLevel, setSelectedLevel] = useState("Red");
  const [leaderboardType, setLeaderboardType] = useState("Overall");
  const [selectedClass, setSelectedClass] = useState("");
  const levels = ["Red", "Orange", "Purple", "Blue", "Green"];

  const {filteredStudents:students,loading,error} = useSelector((state) => state.student);
  const classes = useSelector((state) => state.class.classes);
  useEffect(() => {
    dispatch(fetchClass({}));
  }, [dispatch]);

  useEffect(() => {
    const params = { level: selectedLevel };
    if (leaderboardType === "ClassWise") {
      params.class = selectedClass;
    }
    dispatch(fetchStudentByLevel(params));
  }, [dispatch, selectedLevel, leaderboardType, selectedClass]);

  const columns = [
    {
      header: "SI No",
      key: "si",
      render: (_, index) => index + 1, // <- handles serial number
    },
    { header: "AdmNo", key: "admNo" },
    { header: "Name", key: "name" },
    { header: "Class", key: "className" },
    {
      header: "Score",
      key: "marks",
      render: (row) => <span className="font-semibold">{row.marks}</span>,
    },
  ];
  const getColorClasses = () => {
    switch (selectedLevel) {
      case "Green":
        return { iconColor: "text-green-500", headerColor: "bg-green-500" };
      case "Blue":
        return { iconColor: "text-blue-500", headerColor: "bg-blue-500" };
      case "Red":
        return { iconColor: "text-red-500", headerColor: "bg-red-500" };
      case "Orange":
        return { iconColor: "text-orange-500", headerColor: "bg-orange-500" };
      case "Purple":
        return { iconColor: "text-purple-500", headerColor: "bg-purple-500" };
      default:
        return { iconColor: "text-gray-500", headerColor: "bg-gray-500" };
    }
  };
  const { iconColor, headerColor } = getColorClasses();



if (loading) {
    return (
      <ReportLoader content={`Fetching student's data in ${selectedLevel} level. Please wait...`} />
    );
  }

  if (error) {
    return (
      <ReportError content="Failed to Load students" error={error} />
    );
  }

  return (
    <div className="space-y-6">
      <FilterControls>
        <Select
          value={selectedLevel}
          onChange={setSelectedLevel}
          options={levels.map((level) => ({
            value: level,
            label: `${level} Level`,
          }))}
        />
        <Select
          value={leaderboardType}
          onChange={setLeaderboardType}
          options={[
            { value: "Overall", label: "Overall" },
            { value: "ClassWise", label: "ClassWise" },
          ]}
        />
        {leaderboardType === "ClassWise" && (
          <Select
            value={selectedClass}
            onChange={setSelectedClass}
            options={classes.map((cls) => ({ value: cls._id, label: cls.name }))}
          />
        )}
      </FilterControls>

      <DataTable
        title={`${selectedLevel} Level Students`}
        icon={BarChart3}
        iconColor={iconColor}
        headerColor={headerColor}
        columns={columns}
        data={students}
        onExport={handleExport}
      />
    </div>
  );
};

export default RenderLevel;
