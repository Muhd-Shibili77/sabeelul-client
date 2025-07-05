import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import DataTable from "../dataTable/dataTable";
import FilterControls from "../Buttons/filterControls";
import Select from "../Buttons/Select";
import LevelBadge from "../Buttons/LevelBadge";
import { fetchClass } from "../../redux/classSlice";
import { useDispatch, useSelector } from "react-redux";
import ReportLoader from "../loader/reportLoader";
import ReportError from "../loader/reportError";
import { fetchStudentByClass } from "../../redux/studentSlice";
const RenderStudents = ({ handleExport }) => {
  const dispatch = useDispatch();
  const [selectedClass, setSelectedClass] = useState("");

  const { students, loading, error } = useSelector((state) => state.student);
  const classes = useSelector((state) => state.class.classes || []);
  useEffect(() => {
    dispatch(fetchClass({}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStudentByClass({ classId: selectedClass }));
  }, [dispatch, selectedClass]);

  const columns = [
    {
      header: "SI No",
      key: "si",
      render: (_, index) => <span className="font-bold">{index + 1}</span>, // <- handles serial number
    },
    { header: "AdmNo", key: "admNo" },
    { header: "Name", key: "name" },
    { header: "Class", key: "className" },
    {
      header: "Level",
      key: "level",
      render: (row) => <LevelBadge level={row.level} />,
    },
    { header: "Phone", key: "phone" },
  ];

  if (loading) {
    return <ReportLoader content={`Fetching student's data. Please wait...`} />;
  }

  if (error) {
    return <ReportError content="Failed to Load students" error={error} />;
  }
  return (
    <div className="space-y-6">
      <FilterControls>
        <Select
          value={selectedClass}
          onChange={setSelectedClass}
          options={classes.map((cls) => ({ value: cls._id, label: cls.name }))}
          placeholder="All Classes"
        />
      </FilterControls>

      <DataTable
        title={
          selectedClass ? `Class Students` : "All Students"
        }
        icon={Users}
        iconColor="text-[rgba(53,130,140,0.9)]"
        headerColor="bg-[rgba(53,130,140,0.9)]"
        columns={columns}
        data={students}
        onExport={handleExport}
      />
    </div>
  );
};

export default RenderStudents;
