import React, { useEffect, useState } from "react";
import { Trophy, Award, Users } from "lucide-react";
import DataTable from "../dataTable/dataTable";
import FilterControls from "../Buttons/filterControls";
import Select from "../Buttons/Select";
import LevelBadge from "../Buttons/LevelBadge";
import { fetchClass } from "../../redux/classSlice";
import ReportLoader from "../loader/reportLoader";
import ReportError from "../loader/reportError";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOverallLeaderboard,
  fetchClassUnionLeaderboard,
  fetchClassWiseLeaderboard,
} from "../../redux/leaderBoardSlice";
const RenderLeaderBoard = () => {
  const dispatch = useDispatch();
  const [selectedClass, setSelectedClass] = useState("");
  const [leaderboardType, setLeaderboardType] = useState("Overall");
  const [topCount, setTopCount] = useState(10);
  const classes = useSelector((state) => state.class.classes);
  const { overallData, classUnionData, classWiseData, loading, error } =
    useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchClass({limit:1000}));
  }, [dispatch]);

  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]._id);
    }
  }, [classes]);

  useEffect(() => {
    switch (leaderboardType) {
      case "Overall":
        dispatch(fetchOverallLeaderboard({topCount}));
        break;
      case "ClassUnion":
        dispatch(fetchClassUnionLeaderboard());
        break;
      case "ClassWise":
        dispatch(fetchClassWiseLeaderboard({classId:selectedClass}));
        break;
      default:
        break;
    }
  }, [dispatch, leaderboardType, topCount, selectedClass]);

    useEffect(() => {
    if (leaderboardType === "Overall") {
      dispatch(fetchOverallLeaderboard({topCount}));
    }
  }, [dispatch, topCount, leaderboardType]);

  // // Fetch data when selectedClass changes for ClassWise leaderboard
  useEffect(() => {
    if (leaderboardType === "ClassWise") {
      dispatch(fetchClassWiseLeaderboard({classId:selectedClass}));
    }
  }, [dispatch, selectedClass, leaderboardType]);

  const getLeaderboardData = () => {
    switch (leaderboardType) {
      case "Overall":
        return overallData || [];
      case "ClassUnion":
        return classUnionData || [];
      case "ClassWise":
        return classWiseData || [];
      default:
        return [];
    }
  };

  const getColumns = () => {
    switch (leaderboardType) {
      case "Overall":
        return [
          {
            header: "SI No",
            key: "si",
            render: (_, index) => (
              <span className="font-bold">{index + 1}</span>
            ), // <- handles serial number
          },
          { header: "AdmNo", key: "admNo" },
          { header: "Name", key: "name" },
          { header: "Class", key: "className" },
          { header: "Level", key: "level", render: (row) => <LevelBadge level={row.level} /> },
          {
            header: "Score",
            key: "score",
            render: (row) => <span className="font-semibold">{row.score}</span>,
          },
        ];
      case "ClassUnion":
        return [
          {
            header: "SI No",
            key: "si",
            render: (_, index) => (
              <span className="font-bold">{index + 1}</span>
            ), // <- handles serial number
          },
          {
            header: "Class",
            key: "name",
            render: (row) => <span className="font-semibold">{row.className}</span>,
          },
          { header: "Score", key: "totalStudentScore",render: (row) => <span >{row.totalStudentScore + row.classScore}</span> },
          { header: "Penalty Score", key: "classPenaltyScore", render: (row) => <span className="px-2 py-1 rounded text-sm bg-red-100 text-red-800">{row.classPenaltyScore}</span> },
          { header: "Total Score", key: "totalScore",render: (row) => <span className="font-semibold">{row.totalScore < 0 ? 0 : row.totalScore}</span> },
        ];
      case "ClassWise":
        return [
          {
            header: "SI No",
            key: "si",
            render: (_, index) => (
              <span className="font-bold">{index + 1}</span>
            ), // <- handles serial number
          },
          { header: "AdmNo", key: "admNo" },
          { header: "Name", key: "name" },
          { header: "Class", key: "className" },
          { header: "Level", key: "level", render: (row) => <LevelBadge level={row.level} /> },
          {
            header: "Score",
            key: "score",
            render: (row) => <span className="font-semibold">{row.score}</span>,
          },
        ];
      default:
        return [];
    }
  };

  const getTitle = () => {
    switch (leaderboardType) {
      case "Overall":
        return `Overall Leaderboard (Top ${topCount})`;
      case "ClassUnion":
        return "Class Union Leaderboard";
      case "ClassWise":
        return `Class Top Performers`;
      default:
        return "Leaderboard";
    }
  };

  const getIcon = () => {
    switch (leaderboardType) {
      case "Overall":
        return Trophy;
      case "ClassUnion":
        return Award;
      case "ClassWise":
        return Users;
      default:
        return Trophy;
    }
  };

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
          value={leaderboardType}
          onChange={setLeaderboardType}
          options={[
            { value: "Overall", label: "Overall" },
            { value: "ClassUnion", label: "Class Union" },
            { value: "ClassWise", label: "Class Wise" },
          ]}
        />

        {leaderboardType === "Overall" && (
          <Select
            value={topCount}
            onChange={(value) => setTopCount(Number(value))}
            options={[
              { value: 10, label: "Top 10" },
              { value: 30, label: "Top 30" },
              { value: 50, label: "Top 50" },
            ]}
          />
        )}

        {leaderboardType === "ClassWise" && (
          <Select
            value={selectedClass}
            onChange={setSelectedClass}
            options={classes.map((cls) => ({
              value: cls._id,
              label: cls.name,
            }))}
          />
        )}
      </FilterControls>

      <DataTable
        title={getTitle()}
        icon={getIcon()}
        iconColor="text-[rgba(53,130,140,0.9)]"
        headerColor="bg-[rgba(53,130,140,0.9)]"
        columns={getColumns()}
        data={getLeaderboardData()}
      />
    </div>
  );
};

export default RenderLeaderBoard;
