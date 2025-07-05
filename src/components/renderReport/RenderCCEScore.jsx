import React, { useEffect, useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import FilterControls from "../Buttons/filterControls";
import Select from "../Buttons/Select";
import DataCCETable from "../dataTable/dataCCETable";
import { fetchClass, fetchSubInClass } from "../../redux/classSlice";
import { fetchStudentByClass } from "../../redux/studentSlice";
import ReportLoader from "../loader/reportLoader";
import ReportError from "../loader/reportError";
import { useDispatch, useSelector } from "react-redux";
import useStudentPerformanceData from "../../hooks/fetch/useStdPerfo";

const RenderCCEScore = ({ handleExport }) => {
  const dispatch = useDispatch();
  const classes = useSelector((state) => state.class.classes);
  const { students, loading: studentsLoading, error: studentsError } = useSelector((state) => state.student);
  const { subjects } = useSelector((state) => state.class);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [cceViewType, setCceViewType] = useState("class");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  const shouldFetchPerformanceData = cceViewType === "student" && selectedStudent;
  const {
    data: performanceData,
    loading: performanceLoading,
    error: performanceError,
    refetch: refetchPerformanceData,
  } = useStudentPerformanceData(shouldFetchPerformanceData ? selectedStudent : null);

  useEffect(() => {
    dispatch(fetchClass({}));
  }, [dispatch]);

  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]._id);
    }
  }, [classes]);

  useEffect(() => {
    if (selectedClass) {
      dispatch(fetchSubInClass({ classId: selectedClass }));
      dispatch(fetchStudentByClass({ classId: selectedClass }));
      setSelectedStudent("");
    }
  }, [dispatch, selectedClass]);

  useEffect(() => {
    if (subjects && subjects.length > 0) {
      setSelectedSubjects(subjects);
    }
  }, [subjects]);

  useEffect(() => {
    if (shouldFetchPerformanceData && refetchPerformanceData) {
      refetchPerformanceData();
    }
  }, [shouldFetchPerformanceData]);

  const isLoading = studentsLoading || (cceViewType === "student" && selectedStudent && performanceLoading);
  const hasError = studentsError || (cceViewType === "student" && performanceError);

  const selectedClassName = classes.find((cls) => cls._id === selectedClass)?.name || selectedClass;

  let tableData = [];
  if (cceViewType === "class") {
    tableData = students.map((student, index) => {
      const filteredSubjects = Object.fromEntries(
        selectedSubjects.map((subject) => [
          subject.toLowerCase(),
          student.subjects?.[subject.toLowerCase()] || 0,
        ])
      );
      return {
        si: index + 1,
        admNo: student.admNo,
        name: student.name,
        ...filteredSubjects,
        total: student.total,
        percentage: student.percentage,
      };
    });
  } else if (cceViewType === "student" && performanceData) {
    tableData = performanceData.map((mark, index) => ({
      si: index + 1,
      subject: mark.subjectName,
      rabee: mark.semester === "Rabee" ? mark.mark : "-",
      ramdan: mark.semester === "Ramdan" ? mark.mark : "-",
      total: mark.mark,
    }));
  }

  const getColumns = () => {
    if (cceViewType === "class") {
      return [
        { header: "SI No", key: "si", rowspan: 2 },
        { header: "AdmNo", key: "admNo", rowspan: 2 },
        { header: "Name", key: "name", rowspan: 2 },
        { header: "Subject", key: "subject", colspan: selectedSubjects.length },
        { header: "Total", key: "total", rowspan: 2 },
        { header: "Percentage", key: "percentage", rowspan: 2 },
      ];
    } else {
      return [
        { header: "SI No", key: "si", rowspan: 2 },
        { header: "Subject", key: "subject", rowspan: 2 },
        { header: "Semester", key: "semester", colspan: 2 },
        { header: "Total", key: "total", rowspan: 2 },
      ];
    }
  };

  const getSubcolums = () => {
    if (cceViewType === "class") {
      return selectedSubjects.map((subject) => ({ header: subject, key: subject.toLowerCase() }));
    } else {
      return [
        { header: "Rabee", key: "rabee" },
        { header: "Ramdan", key: "ramdan" },
      ];
    }
  };

  if (isLoading) return <ReportLoader content="Fetching student's data. Please wait..." />;
  if (hasError) return <ReportError content="Failed to Load students" error={hasError} />;

  const title =
    cceViewType === "class"
      ? `Class (${selectedClassName}) CCE Scores`
      : `CCE Scores for ${students.find((s) => s._id === selectedStudent)?.name || "Select Student"}`;

  return (
    <div className="space-y-6">
      <FilterControls>
        <Select
          value={cceViewType}
          onChange={setCceViewType}
          options={[
            { value: "class", label: "Class Wise" },
            { value: "student", label: "Student Wise" },
          ]}
        />

        <Select
          value={selectedClass}
          onChange={setSelectedClass}
          options={classes.map((cls) => ({ value: cls._id, label: cls.name }))}
        />

        {cceViewType === "class" && subjects.length > 0 && (
          <div className="relative inline-block text-left">
            <button
              className="inline-flex justify-between w-64 text-sm font-medium text-gray-700 p-3 rounded-lg border border-gray-300 shadow"
              onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
            >
              Select Subjects ({selectedSubjects.length})
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>

            {isSubjectDropdownOpen && (
              <div className="absolute mt-2 w-64 rounded-md shadow-lg bg-white z-50 border border-gray-200">
                <div className="py-1 px-3 max-h-64 overflow-y-auto text-sm text-gray-700">
                  <label className="flex items-center gap-2 mb-2 font-medium border-b pb-2">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.length === subjects.length}
                      onChange={(e) => setSelectedSubjects(e.target.checked ? [...subjects] : [])}
                    />
                    All Subjects
                  </label>
                  {subjects.map((subject) => (
                    <label key={subject} className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject)}
                        onChange={(e) => {
                          setSelectedSubjects((prev) =>
                            e.target.checked
                              ? [...prev, subject]
                              : prev.filter((s) => s !== subject)
                          );
                        }}
                      />
                      {subject}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {cceViewType === "student" && (
          <Select
            value={selectedStudent}
            onChange={setSelectedStudent}
            options={students.map((std) => ({ value: std._id, label: std.name }))}
          />
        )}
      </FilterControls>

      <DataCCETable
        title={title}
        icon={BookOpen}
        iconColor="text-[rgba(53,130,140,0.9)]"
        headerColor="bg-[rgba(53,130,140,0.9)]"
        columns={getColumns()}
        subColumns={getSubcolums()}
        data={tableData}
        onExport={handleExport}
      />
    </div>
  );
};

export default RenderCCEScore;