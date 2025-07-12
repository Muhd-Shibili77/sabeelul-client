import React, { useEffect, useState } from "react";
import { UserCheck } from "lucide-react";
import FilterControls from "../Buttons/filterControls";
import Select from "../Buttons/Select";
import { fetchClass } from "../../redux/classSlice";
import ReportLoader from "../loader/reportLoader";
import ReportError from "../loader/reportError";
import { useDispatch, useSelector } from "react-redux";
import { findStudentsWithMentorMarksByClass } from "../../redux/studentSlice";
import DataCCETable from "../dataTable/dataCCETable";
const RenderMentorScore = () => {
  const dispatch = useDispatch();
  const classes = useSelector((state) => state.class.classes || []);
  const { students, loading, error } = useSelector((state) => state.student);
  const [selectedClass, setSelectedClass] = useState("");

  // Fetch classes on mount
  useEffect(() => {
    dispatch(fetchClass({ limit: 1000 }));
  }, [dispatch]);

  // Set default class after fetching class list
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]._id);
    }
  }, [classes]);

  // Fetch mentor scores for selected class
  useEffect(() => {
    if (selectedClass) {
      dispatch(findStudentsWithMentorMarksByClass({ classId: selectedClass }));
    }
  }, [dispatch, selectedClass]);

  const columns = [
    {
      header: "SI No",
      key: "si",
      render: (_, index) => index + 1,
      rowspan: 2, // <- handles serial number
    },
    { header: "AdmNo", key: "admNo", rowspan: 2 },
    { header: "Name", key: "name", rowspan: 2 },
    { header: "Semester", key: "semester", colspan: 2 },
    {
      header: "Total",
      key: "marks",
      rowspan: 2,
    },
  ];
  const subColumns = [
    { header: "Rabee", key: "Rabee Semester" },
    { header: "Ramdan", key: "Ramadan Semester" },
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
        />
      </FilterControls>

    
      <DataCCETable
        title={`Mentor Scores - (${
          classes.find((cls) => cls._id === selectedClass)?.name || ""
        })`}
        icon={UserCheck}
        iconColor="text-[rgba(53,130,140,0.9)]"
        headerColor="bg-[rgba(53,130,140,0.9)]"
        columns={columns}
        subColumns={subColumns}
        data={students || []}
      />
    </div>
  );
};

export default RenderMentorScore;
