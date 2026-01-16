import React, { useEffect, useState } from "react";
import { UserCheck } from "lucide-react";
import FilterControls from "../Buttons/filterControls";
import Select from "../Buttons/Select";
import { fetchClass } from "../../redux/classSlice";
import ReportLoader from "../loader/reportLoader";
import ReportError from "../loader/reportError";
import { useDispatch, useSelector } from "react-redux";
import DataCCETable from "../dataTable/dataCCETable";
import { findStudentsWithPKVMarksByClass } from "../../redux/studentSlice";
import { fetchPhaseWisePKVByClass } from "../../redux/PKVSlice";
import useFetchStudents from "../../hooks/fetch/useFetchStudents";
const RenderPKVScore = () => {
  const dispatch = useDispatch();
  const classes = useSelector((state) => state.class.classes || []);
  const { students, loading, error } = useSelector((state) => state.student);
  const {
    phaseWisePKVScores,
    loading: phaseLoading,
    error: phaseError,
  } = useSelector((state) => state.PKV);
  const [selectedClass, setSelectedClass] = useState("");
  const [type, setType] = useState("out of 50");
  const [semester, setSemester] = useState("");
  const { students: allStudents, loading: studentLoading } =
    useFetchStudents(selectedClass);

  // Fetch classes on mount
  useEffect(() => {
    dispatch(fetchClass({ limit: 1000 }));
  }, [dispatch]);
  useEffect(() => {
    if (type === "out of 50" && selectedClass) {
      dispatch(findStudentsWithPKVMarksByClass({ classId: selectedClass }));
    } else if (type === "phase wise" && selectedClass) {
      dispatch(fetchPhaseWisePKVByClass({ classId: selectedClass }));
    }
  }, [dispatch, selectedClass, type]);

  // 🔹 helper: find maxPhase for current semester
  const getMaxPhase = () => {
    const filtered = phaseWisePKVScores.filter((s) => s.semester === semester);
    if (filtered.length === 0) return 1; // ✅ default: show at least Phase 1
    return Math.max(
      ...filtered.map((s) => parseInt(s.phase.split(" ")[1], 10))
    );
  };

  const getColumns = () => {
    if (type === "out of 50") {
      return [
        {
          header: "SI No",
          key: "si",
          render: (_, index) => index + 1,
          rowspan: 2,
        },
        { header: "Ad No", key: "admNo", rowspan: 2 },
        { header: "Name", key: "name", rowspan: 2 },
        { header: "Semester", key: "semester", colspan: 2 },
        { header: "Total", key: "marks", rowspan: 2 },
      ];
    } else if (type === "phase wise") {
      const maxPhase = getMaxPhase();
      let baseCols = [
        { header: "SI No", key: "si", render: (_, index) => index + 1 },
        { header: "AdmNo", key: "admissionNo" },
        { header: "Name", key: "studentName" },
      ];
      for (let i = 1; i <= maxPhase; i++) {
        baseCols.push({
          header: `Phase ${i}`,
          key: `phase${i}`,
          render: (row) => row[`phase${i}`] ?? "-",
        });
      }
      return baseCols;
    }
    return [];
  };

  const getTableData = () => {
    if (type === "out of 50") {
      return [...students].sort((a, b) => {
        const rankA = a.rank || 0;
        const rankB = b.rank || 0;
        if (rankA === 0 && rankB === 0) return 0;
        if (rankA === 0) return 1;
        if (rankB === 0) return -1;
        return rankA - rankB;
      }) || [];
    } else if (type === "phase wise") {
      const filtered = phaseWisePKVScores.filter(
        (s) => s.semester === semester
      );
      const grouped = {};
      filtered.forEach((entry) => {
        const id = entry.studentId;
        if (!grouped[id]) {
          grouped[id] = {
            admissionNo: entry.admissionNo,
            studentName: entry.studentName,
            semester: entry.semester,
          };
        }
        const phaseNo = parseInt(entry.phase.split(" ")[1], 10);
        grouped[id][`phase${phaseNo}`] = entry.mark;
      });

      const maxPhase = getMaxPhase();

      // ✅ ensure ALL students show "-" for all phases
      return allStudents
        .map((stu) => {
          const row = grouped[stu._id] || {
            admissionNo: stu.admissionNo,
            studentName: stu.name,
            semester: semester,
          };
          for (let i = 1; i <= maxPhase; i++) {
            if (row[`phase${i}`] === undefined) {
              row[`phase${i}`] = "-";
            }
          }
          return row;
        })
        .sort((a, b) => {
          const rankA = a.rank || 0;
          const rankB = b.rank || 0;
          if (rankA === 0 && rankB === 0) return 0;
          if (rankA === 0) return 1;
          if (rankB === 0) return -1;
          return rankA - rankB;
        });
    }
    return [];
  };

  const getSubColumns = () => {
    if (type === "out of 50") {
      return [
        { header: "Rabee", key: "Rabee Semester" },
        { header: "Ramadan", key: "Ramadan Semester" },
      ];
    } else {
      return [];
    }
  };
  const shouldShowTable = () => {
    if (type === "out of 50") {
      return selectedClass;
    } else {
      return selectedClass && semester;
    }
  };

  if (loading || studentLoading || phaseLoading) {
    return <ReportLoader content={`Fetching student's data. Please wait...`} />;
  }

  if (error) {
    return <ReportError content="Failed to Load students" error={error} />;
  }
  return (
    <div className="space-y-6">
      <FilterControls>
        <Select
          value={type}
          onChange={(type) => {
            setType(type);
            setSemester("");
            setSelectedClass("");
          }}
          options={[
            { value: "out of 50", label: "Out of 50" },
            { value: "phase wise", label: "Phase Wise" },
          ]}
        />
        <Select
          value={selectedClass}
          onChange={setSelectedClass}
          placeholder="Select Class"
          options={classes.map((cls) => ({ value: cls._id, label: cls.name }))}
        />
        {type === "phase wise" && (
          <Select
            value={semester}
            onChange={setSemester}
            options={[
              { value: "Rabee Semester", label: "Rabee Semester" },
              { value: "Ramadan Semester", label: "Ramadan Semester" },
            ]}
          />
        )}
      </FilterControls>

      {shouldShowTable() ? (
        <DataCCETable
          title={`PKV Scores - (${
            classes.find((cls) => cls._id === selectedClass)?.name || ""
          })`}
          icon={UserCheck}
          iconColor="text-[rgba(53,130,140,0.9)]"
          headerColor="bg-[rgba(53,130,140,0.9)]"
          columns={getColumns()}
          subColumns={getSubColumns()}
          data={getTableData()}
        />
      ) : (
        <div className="flex items-center justify-center p-8 text-gray-500 bg-white rounded-xl">
          <div className="text-center">
            <UserCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium">
              {type === "out of 50" && !selectedClass
                ? "Please select a class to view PKV scores"
                : type === "phase wise" && !selectedClass && !semester
                ? "Please select class and semester to view PKV scores"
                : type === "phase wise" && !selectedClass
                ? "Please select a class to view PKV scores"
                : type === "phase wise" && !semester
                ? "Please select a semester to view PKV scores"
                : "No data available"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RenderPKVScore;
