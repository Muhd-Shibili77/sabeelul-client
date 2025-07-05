import React, { useEffect } from "react";
import { UserCheck, Loader } from "lucide-react";
import DataTable from "../dataTable/dataTable";
import { fetchTeacher } from "../../redux/teacherSlice";
import { useDispatch, useSelector } from "react-redux";
import ReportLoader from "../loader/reportLoader";
import ReportError from "../loader/reportError";
const RenderTeachers = ({ handleExport }) => {
  const dispatch = useDispatch();
  const { teachers, loading, error } = useSelector((state) => state.teacher);

  useEffect(() => {
    dispatch(fetchTeacher({limit:1000}));
  }, [dispatch]);

  const columns = [
    {
      header: "SI No",
      key: "si",
      render: (_, index) => index + 1, // <- handles serial number
    },
    {
      header: "Staff ID",
      key: "registerNo",
      render: (row) => <span className="font-semibold">{row.registerNo}</span>,
    },
    {
      header: "Name",
      key: "name",
      render: (row) => <span className="font-semibold">{row.name}</span>,
    },
    { header: "Phone", key: "phone" },
    { header: "Email", key: "email" },
  ];

  if (loading) {
    return (
      <ReportLoader content="Fetching teachers data. Please wait..." />
    );
  }

  if (error) {
    return (
      <ReportError content="Failed to Load Teachers" error={error} />
    );
  }

  return (
    <DataTable
      title="Teachers List"
      icon={UserCheck}
      iconColor="text-[rgba(53,130,140,0.9)]"
      headerColor="bg-[rgba(53,130,140,0.9)]"
      columns={columns}
      data={teachers}
      onExport={handleExport}
    />
  );
};

export default RenderTeachers;
