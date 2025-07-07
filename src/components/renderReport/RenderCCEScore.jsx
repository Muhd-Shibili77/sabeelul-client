import React, { useEffect, useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import FilterControls from "../Buttons/filterControls";
import Select from "../Buttons/Select";
import DataCCETable from "../dataTable/dataCCETable";
import { fetchClass, fetchSubInClass } from "../../redux/classSlice";
import {
  fetchStudentByClass,
  fetchStudentById,
} from "../../redux/studentSlice";
import ReportLoader from "../loader/reportLoader";
import ReportError from "../loader/reportError";
import { useDispatch, useSelector } from "react-redux";

const RenderCCEScore = () => {
  const dispatch = useDispatch();

  // Redux state selectors
  const classes = useSelector((state) => state.class.classes);
  const { subjects } = useSelector((state) => state.class);
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.student);

  // Student performance data from Redux store
  const {
    student: studentPerformanceData,
    loading: studentPerformanceLoading,
    error: studentPerformanceError,
  } = useSelector((state) => state.student);

  // Local state
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [cceViewType, setCceViewType] = useState("class");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  // Initialize classes on component mount
  useEffect(() => {
    dispatch(fetchClass({ limit: 1000 }));
  }, [dispatch]);

  // Auto-select first class when classes are loaded
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]._id);
    }
  }, [classes, selectedClass]);

  // Fetch subjects and students when class changes
  useEffect(() => {
    if (selectedClass) {
      dispatch(fetchSubInClass({ classId: selectedClass }));
      dispatch(fetchStudentByClass({ classId: selectedClass }));
      setSelectedStudent(""); // Reset student selection
    }
  }, [dispatch, selectedClass]);

  // Auto-select all subjects when subjects are loaded
  useEffect(() => {
    if (subjects && subjects.length > 0) {
      setSelectedSubjects(subjects);
    }
  }, [subjects]);

  // Fetch student performance data ONLY when:
  // 1. View type is "student"
  // 2. A student is selected
  // 3. The selected student has changed
  useEffect(() => {
    if (cceViewType === "student" && selectedStudent) {
      dispatch(fetchStudentById({ id: selectedStudent }));
    }
  }, [dispatch, cceViewType, selectedStudent]);

  // Reset student selection when switching view types
  useEffect(() => {
    if (cceViewType === "class") {
      setSelectedStudent("");
    }
  }, [cceViewType]);

  // Helper function to get subject mark from subjectWiseMarks array
  const getSubjectMark = (student, subjectName) => {
    if (!student.subjectWiseMarks || !Array.isArray(student.subjectWiseMarks)) {
      return 0;
    }

    const subjectMark = student.subjectWiseMarks.find(
      (subject) =>
        subject.subjectName?.toLowerCase() === subjectName.toLowerCase()
    );

    return subjectMark ? subjectMark.mark : 0;
  };

  // Calculate loading and error states
  const isLoading =
    studentsLoading ||
    (cceViewType === "student" && selectedStudent && studentPerformanceLoading);
  const hasError =
    studentsError || (cceViewType === "student" && studentPerformanceError);

  // Get selected class name
  const selectedClassName =
    classes.find((cls) => cls._id === selectedClass)?.name || selectedClass;

  // Check if all subjects are selected
  const allSubjectsSelected =
    subjects.length > 0 && selectedSubjects.length === subjects.length;

  // Generate table data based on view type
  const getTableData = () => {
    if (cceViewType === "class") {
      return students.map((student, index) => {
        // Create an object with subject marks based on selected subjects
        const subjectMarks = {};
        selectedSubjects.forEach((subject) => {
          subjectMarks[subject.toLowerCase()] = getSubjectMark(
            student,
            subject
          );
        });

        // Calculate total from SELECTED subjects only
        const totalMarks = selectedSubjects.reduce((sum, subject) => {
          return sum + getSubjectMark(student, subject);
        }, 0);

        // Calculate percentage only if all subjects are selected
        let percentage = null;
        if (allSubjectsSelected) {
          const subjectCount = selectedSubjects.length;
          const maxTotalMarks =
            subjectCount > 0 ? (subjectCount - 1) * 30 + 100 : 0;
          percentage =
            maxTotalMarks > 0
              ? ((totalMarks / maxTotalMarks) * 100).toFixed(1)
              : "0.00";
        }

        const rowData = {
          si: index + 1,
          admNo: student.admNo,
          name: student.name,
          ...subjectMarks,
          total: totalMarks,
        };

        // Only add percentage if all subjects are selected
        if (allSubjectsSelected) {
          rowData.percentage = `${percentage}%`;
        }

        return rowData;
      });
    } else if (cceViewType === "student" && studentPerformanceData) {
      // Create a map to store student's marks by subject
      const studentMarksMap = {};

      // Process student performance data to build marks map
      if (
        studentPerformanceData.data &&
        studentPerformanceData.data.subjectWise
      ) {
        const { subjectWise } = studentPerformanceData.data;

        subjectWise.forEach((subject) => {
          const subjectName = subject.subjectName;

          if (!studentMarksMap[subjectName]) {
            studentMarksMap[subjectName] = {
              subjectName: subjectName,
              rabee: 0,
              ramdan: 0,
              total: 0,
            };
          }

          if (subject.semester === "Rabee Semester") {
            studentMarksMap[subjectName].rabee = subject.totalMark;
          } else if (subject.semester === "Ramdan Semester") {
            studentMarksMap[subjectName].ramdan = subject.totalMark;
          }

          studentMarksMap[subjectName].total += subject.totalMark;
        });
      }
      // Handle other data structures similarly...
      else if (Array.isArray(studentPerformanceData)) {
        studentPerformanceData.forEach((mark) => {
          const subjectName = mark.subjectName;
          if (!studentMarksMap[subjectName]) {
            studentMarksMap[subjectName] = {
              subjectName: subjectName,
              rabee: 0,
              ramdan: 0,
              total: 0,
            };
          }

          if (mark.semester === "Rabee" || mark.semester === "Rabee Semester") {
            studentMarksMap[subjectName].rabee = mark.totalMark || mark.mark;
          } else if (
            mark.semester === "Ramdan" ||
            mark.semester === "Ramdan Semester"
          ) {
            studentMarksMap[subjectName].ramdan = mark.totalMark || mark.mark;
          }

          studentMarksMap[subjectName].total += mark.totalMark || mark.mark;
        });
      } else if (
        studentPerformanceData.subjectWise &&
        Array.isArray(studentPerformanceData.subjectWise)
      ) {
        studentPerformanceData.subjectWise.forEach((subject) => {
          const subjectName = subject.subjectName;

          if (!studentMarksMap[subjectName]) {
            studentMarksMap[subjectName] = {
              subjectName: subjectName,
              rabee: 0,
              ramdan: 0,
              total: 0,
            };
          }

          if (subject.semester === "Rabee Semester") {
            studentMarksMap[subjectName].rabee = subject.totalMark;
          } else if (subject.semester === "Ramdan Semester") {
            studentMarksMap[subjectName].ramdan = subject.totalMark;
          }

          studentMarksMap[subjectName].total += subject.totalMark;
        });
      }

      // Now create table data for ALL subjects in the class
      return subjects.map((subject, index) => {
        const subjectData = studentMarksMap[subject] || {
          subjectName: subject,
          rabee: 0,
          ramdan: 0,
          total: 0,
        };

        return {
          si: index + 1,
          subject: subjectData.subjectName,
          rabee: subjectData.rabee > 0 ? subjectData.rabee : "-",
          ramdan: subjectData.ramdan > 0 ? subjectData.ramdan : "-",
          total: subjectData.total,
        };
      });
    }
    return [];
  };

  // Generate columns configuration
  const getColumns = () => {
    if (cceViewType === "class") {
      const baseColumns = [
        { header: "SI No", key: "si", rowspan: 2 },
        { header: "AdmNo", key: "admNo", rowspan: 2 },
        { header: "Name", key: "name", rowspan: 2 },
      ];

      // Add subject columns - handle single subject differently
      if (selectedSubjects.length === 1) {
        // For single subject, add it directly without colspan
        baseColumns.push({
          header: selectedSubjects[0],
          key: selectedSubjects[0].toLowerCase(),
          rowspan: 2,
        });
      } else if (selectedSubjects.length > 1) {
        // For multiple subjects, use colspan
        baseColumns.push({
          header: "Subjects",
          key: "subject",
          colspan: selectedSubjects.length,
        });
      }

      // Add total column
      baseColumns.push({ header: "Total", key: "total", rowspan: 2 });

      // Add percentage column only if all subjects are selected
      if (allSubjectsSelected) {
        baseColumns.push({
          header: "Percentage",
          key: "percentage",
          rowspan: 2,
        });
      }

      return baseColumns;
    } else {
      // Student view columns
      return [
        { header: "SI No", key: "si", rowspan: 2 },
        { header: "Subject", key: "subject", rowspan: 2 },
        { header: "Semester", key: "semester", colspan: 2 },
        { header: "Total", key: "total", rowspan: 2 },
      ];
    }
  };

  // Generate subcolumns configuration
  const getSubcolums = () => {
    if (cceViewType === "class") {
      // Only return subcolumns if we have MORE THAN ONE selected subject
      if (selectedSubjects.length > 1) {
        return selectedSubjects.map((subject) => ({
          header: subject,
          key: subject.toLowerCase(),
        }));
      }
      // For single subject, return empty array since it's handled in main columns
      return [];
    } else {
      // Student view subcolumns
      return [
        { header: "Rabee", key: "rabee" },
        { header: "Ramdan", key: "ramdan" },
      ];
    }
  };

  // Handle subject selection changes
  const handleSubjectSelectionChange = (checked, subject = null) => {
    if (subject) {
      // Individual subject selection
      setSelectedSubjects((prev) =>
        checked ? [...prev, subject] : prev.filter((s) => s !== subject)
      );
    } else {
      // All subjects selection
      setSelectedSubjects(checked ? [...subjects] : []);
    }
  };

  // Generate dynamic title
  const getTitle = () => {
    if (cceViewType === "class") {
      return `Class (${selectedClassName}) CCE Scores`;
    } else {
      const selectedStudentName =
        students.find((s) => s._id === selectedStudent) || "Select Student";
      return `CCE Scores of ${selectedStudentName.name} - AdmNo ${selectedStudentName.admNo}`;
    }
  };

  // Handle loading state
  if (isLoading) {
    return <ReportLoader content="Fetching student's data. Please wait..." />;
  }

  // Handle error state
  if (hasError) {
    return <ReportError content="Failed to Load students" error={hasError} />;
  }

  // Show message when student view is selected but no student is chosen
  const shouldShowTable = () => {
    if (cceViewType === "class") {
      return students.length > 0 && selectedSubjects.length > 0;
    } else {
      return selectedStudent && studentPerformanceData;
    }
  };

  return (
    <div className="space-y-6">
      <FilterControls>
        {/* View Type Selection */}
        <Select
          value={cceViewType}
          onChange={setCceViewType}
          options={[
            { value: "class", label: "Class Wise" },
            { value: "student", label: "Student Wise" },
          ]}
        />

        {/* Class Selection */}
        <Select
          value={selectedClass}
          onChange={setSelectedClass}
          options={classes.map((cls) => ({ value: cls._id, label: cls.name }))}
        />

        {/* Subject Selection (only for class view) */}
        {cceViewType === "class" && subjects.length > 0 && (
          <div className="relative inline-block text-left">
            <button
              className="inline-flex justify-between w-64 text-sm font-medium text-gray-700 p-3 rounded-lg border border-gray-300 shadow  focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
              aria-expanded={isSubjectDropdownOpen}
              aria-haspopup="true"
            >
              Select Subjects ({selectedSubjects.length})
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${
                  isSubjectDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSubjectDropdownOpen && (
              <div className="absolute mt-2 w-64 rounded-md shadow-lg bg-white z-50 border border-gray-200">
                <div className="py-1 px-3 max-h-64 overflow-y-auto text-sm text-gray-700">
                  {/* Select All Option */}
                  <label className="flex items-center gap-2 mb-2 font-medium border-b pb-2 cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.length === subjects.length}
                      onChange={(e) =>
                        handleSubjectSelectionChange(e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    All Subjects
                  </label>

                  {/* Individual Subject Options */}
                  {subjects.map((subject) => (
                    <label
                      key={subject}
                      className="flex items-center gap-2 mb-1 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject)}
                        onChange={(e) =>
                          handleSubjectSelectionChange(
                            e.target.checked,
                            subject
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {subject}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Student Selection (only for student view) */}
        {cceViewType === "student" && (
          <Select
            value={selectedStudent}
            onChange={setSelectedStudent}
            options={[
              ...students.map((std) => ({ value: std._id, label: std.name })),
            ]}
            placeholder="Select Student"
          />
        )}
      </FilterControls>

      {/* Data Table or No Data Message */}
      {shouldShowTable() ? (
        <DataCCETable
          title={getTitle()}
          icon={BookOpen}
          iconColor="text-[rgba(53,130,140,0.9)]"
          headerColor="bg-[rgba(53,130,140,0.9)]"
          columns={getColumns()}
          subColumns={getSubcolums()}
          data={getTableData()}
        />
      ) : (
        <div className="flex items-center justify-center p-8 text-gray-500">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium">
              {cceViewType === "student" && !selectedStudent
                ? "Please select a student to view CCE scores"
                : cceViewType === "class" && selectedSubjects.length === 0
                ? "Please select subjects to view CCE scores"
                : "No data available"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RenderCCEScore;
