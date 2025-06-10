import React, { useState } from "react";
import {
  Download,
  Trophy,
  Users,
  Award,
  BarChart3,
  BookOpen,
  UserCheck,
  ChevronDown,
} from "lucide-react";
import SideBar from "../../components/sideBar/SideBar";

// Sample Data
const studentsData = [
  {
    id: 1,
    name: "Alice Johnson",
    class: "10A",
    marks: 95,
    level: "Green",
    cceScore: 92,
    mentorScore: 88,
    subject: "Mathematics",
    admNo: "ADM001",
  },
  {
    id: 2,
    name: "Bob Smith",
    class: "10A",
    marks: 88,
    level: "Blue",
    cceScore: 85,
    mentorScore: 90,
    subject: "Mathematics",
    admNo: "ADM002",
  },
  {
    id: 3,
    name: "Charlie Brown",
    class: "10B",
    marks: 91,
    level: "Green",
    cceScore: 89,
    mentorScore: 86,
    subject: "Science",
    admNo: "ADM003",
  },
  {
    id: 4,
    name: "David Wilson",
    class: "10B",
    marks: 85,
    level: "Blue",
    cceScore: 83,
    mentorScore: 88,
    subject: "English",
    admNo: "ADM004",
  },
  {
    id: 5,
    name: "Eva Davis",
    class: "10A",
    marks: 78,
    level: "Red",
    cceScore: 76,
    mentorScore: 82,
    subject: "Mathematics",
    admNo: "ADM005",
  },
  {
    id: 6,
    name: "Frank Miller",
    class: "10C",
    marks: 92,
    level: "Green",
    cceScore: 90,
    mentorScore: 94,
    subject: "Science",
    admNo: "ADM006",
  },
  {
    id: 7,
    name: "Grace Lee",
    class: "10C",
    marks: 87,
    level: "Blue",
    cceScore: 84,
    mentorScore: 89,
    subject: "English",
    admNo: "ADM007",
  },
  {
    id: 8,
    name: "Henry Taylor",
    class: "10A",
    marks: 82,
    level: "Blue",
    cceScore: 80,
    mentorScore: 85,
    subject: "Mathematics",
    admNo: "ADM008",
  },
  {
    id: 9,
    name: "Ivy Chen",
    class: "10B",
    marks: 94,
    level: "Green",
    cceScore: 91,
    mentorScore: 92,
    subject: "Science",
    admNo: "ADM009",
  },
  {
    id: 10,
    name: "Jack Wilson",
    class: "10C",
    marks: 89,
    level: "Blue",
    cceScore: 87,
    mentorScore: 91,
    subject: "English",
    admNo: "ADM010",
  },
  {
    id: 11,
    name: "Kate Brown",
    class: "10A",
    marks: 76,
    level: "Red",
    cceScore: 74,
    mentorScore: 79,
    subject: "Mathematics",
    admNo: "ADM011",
  },
  {
    id: 12,
    name: "Leo Garcia",
    class: "10B",
    marks: 90,
    level: "Green",
    cceScore: 88,
    mentorScore: 87,
    subject: "Science",
    admNo: "ADM012",
  },
  // Adding more sample data for student-wise CCE scores
  {
    id: 13,
    name: "Alice Johnson",
    class: "10A",
    marks: 88,
    level: "Green",
    cceScore: 85,
    mentorScore: 88,
    subject: "Science",
    admNo: "ADM001",
  },
  {
    id: 14,
    name: "Alice Johnson",
    class: "10A",
    marks: 90,
    level: "Green",
    cceScore: 87,
    mentorScore: 88,
    subject: "English",
    admNo: "ADM001",
  },
  {
    id: 15,
    name: "Bob Smith",
    class: "10A",
    marks: 82,
    level: "Blue",
    cceScore: 80,
    mentorScore: 90,
    subject: "Science",
    admNo: "ADM002",
  },
  {
    id: 16,
    name: "Bob Smith",
    class: "10A",
    marks: 85,
    level: "Blue",
    cceScore: 83,
    mentorScore: 90,
    subject: "English",
    admNo: "ADM002",
  },
];

const teachersData = [
  {
    id: 1,
    name: "Mr. Anderson",
    subject: "Mathematics",
    experience: "8 years",
    classes: ["10A", "10B"],
  },
  {
    id: 2,
    name: "Ms. Thompson",
    subject: "Science",
    experience: "6 years",
    classes: ["10B", "10C"],
  },
  {
    id: 3,
    name: "Dr. Roberts",
    subject: "English",
    experience: "12 years",
    classes: ["10A", "10C"],
  },
  {
    id: 4,
    name: "Mrs. Wilson",
    subject: "History",
    experience: "10 years",
    classes: ["10A", "10B", "10C"],
  },
];

const subjects = ["Mathematics", "Science", "English", "History"];
const classes = ["10A", "10B", "10C"];
const levels = ["Red", "Blue", "Green"];

// Reusable Components
const ExportDropdown = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Download size={20} />
        Export
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-10">
          <button
            onClick={() => {
              onExport("pdf");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg"
          >
            Export as PDF
          </button>
          <button
            onClick={() => {
              onExport("excel");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg"
          >
            Export as Excel
          </button>
        </div>
      )}
    </div>
  );
};

const DataTable = ({
  title,
  icon: Icon,
  iconColor,
  headerColor,
  columns,
  data,
  showExport = true,
  onExport,
}) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Icon className={iconColor} /> {title}
      </h3>
      {showExport && onExport && <ExportDropdown onExport={onExport} />}
    </div>
    <table className="w-full">
      <thead>
        <tr className={`text-white ${headerColor}`}>
          {columns.map((col, index) => (
            <th key={index} className="p-3 text-left">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={row.id || index} className="border-t hover:bg-gray-50">
            {columns.map((col, colIndex) => (
              <td key={colIndex} className="p-3">
                {col.render ? col.render(row, index) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FilterControls = ({ children }) => (
  <div className="flex flex-wrap gap-4 items-center mb-6">{children}</div>
);

const Select = ({ value, onChange, options, placeholder = "Select..." }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="p-3 rounded-lg border border-gray-300 shadow"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const Input = ({ value, onChange, placeholder, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="p-3 rounded-lg border border-gray-300 shadow"
  />
);

const LevelBadge = ({ level }) => (
  <span
    className={`px-2 py-1 rounded text-sm ${
      level === "Green"
        ? "bg-green-100 text-green-800"
        : level === "Blue"
        ? "bg-blue-100 text-blue-800"
        : "bg-red-100 text-red-800"
    }`}
  >
    {level}
  </span>
);

const AdminReport = () => {
  const [activeSection, setActiveSection] = useState("Leaderboard");
  const [leaderboardType, setLeaderboardType] = useState("Overall");
  const [topCount, setTopCount] = useState(10);
  const [selectedClass, setSelectedClass] = useState("10A");
  const [selectedLevel, setSelectedLevel] = useState("Green");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [cceViewType, setCceViewType] = useState("class");
  const [mentorViewType, setMentorViewType] = useState("class");
  const [studentAdmNo, setStudentAdmNo] = useState("");

  // Helper functions
  const getOverallLeaderboard = (count) => {
    return [...studentsData].sort((a, b) => b.marks - a.marks).slice(0, count);
  };

  const getClassUnionLeaderboard = () => {
    const classAverages = classes.map((cls) => {
      const classStudents = studentsData.filter((s) => s.class === cls);
      const average =
        classStudents.reduce((sum, s) => sum + s.marks, 0) /
        classStudents.length;
      return {
        class: cls,
        average: Math.round(average),
        studentCount: classStudents.length,
      };
    });
    return classAverages.sort((a, b) => b.average - a.average);
  };

  const getClassWiseTopPerformers = (className) => {
    return studentsData
      .filter((s) => s.class === className)
      .sort((a, b) => b.marks - a.marks);
  };

  const getStudentsByLevel = (level) => {
    return studentsData.filter((s) => s.level === level);
  };

  const getStudentCCEScores = (admNo) => {
    return studentsData.filter((s) => s.admNo === admNo);
  };

  const getStudentMentorScore = (admNo) => {
    const student = studentsData.find((s) => s.admNo === admNo);
    return student ? [student] : [];
  };

  // Export functions
  const handleExport = (type) => {
    alert(
      `${type.toUpperCase()} export functionality would be implemented here`
    );
  };

  const renderLeaderboard = () => {
    const getLeaderboardData = () => {
      switch (leaderboardType) {
        case "Overall":
          return getOverallLeaderboard(topCount);
        case "ClassUnion":
          return getClassUnionLeaderboard();
        case "ClassWise":
          return getClassWiseTopPerformers(selectedClass);
        default:
          return [];
      }
    };

    const getColumns = () => {
      switch (leaderboardType) {
        case "Overall":
          return [
            {
              header: "Rank",
              key: "rank",
              render: (row, index) => (
                <span className="font-bold">{index + 1}</span>
              ),
            },
            { header: "Name", key: "name" },
            { header: "Class", key: "class" },
            {
              header: "Marks",
              key: "marks",
              render: (row) => (
                <span className="font-semibold">{row.marks}</span>
              ),
            },
          ];
        case "ClassUnion":
          return [
            {
              header: "Rank",
              key: "rank",
              render: (row, index) => (
                <span className="font-bold">{index + 1}</span>
              ),
            },
            {
              header: "Class",
              key: "class",
              render: (row) => (
                <span className="font-semibold">{row.class}</span>
              ),
            },
            { header: "Average Marks", key: "average" },
            { header: "Students", key: "studentCount" },
          ];
        case "ClassWise":
          return [
            {
              header: "Rank",
              key: "rank",
              render: (row, index) => (
                <span className="font-bold">{index + 1}</span>
              ),
            },
            { header: "Name", key: "name" },
            {
              header: "Marks",
              key: "marks",
              render: (row) => (
                <span className="font-semibold">{row.marks}</span>
              ),
            },
            {
              header: "Level",
              key: "level",
              render: (row) => <LevelBadge level={row.level} />,
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
          return `Class ${selectedClass} Top Performers`;
        default:
          return "Leaderboard";
      }
    };

    const getHeaderColor = () => {
      switch (leaderboardType) {
        case "Overall":
          return "bg-yellow-500";
        case "ClassUnion":
          return "bg-purple-500";
        case "ClassWise":
          return "bg-blue-500";
        default:
          return "bg-gray-500";
      }
    };

    const getIconColor = () => {
      switch (leaderboardType) {
        case "Overall":
          return "text-yellow-500";
        case "ClassUnion":
          return "text-purple-500";
        case "ClassWise":
          return "text-blue-500";
        default:
          return "text-gray-500";
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

    return (
      <div className="space-y-6">
        <FilterControls>
          <Select
            value={leaderboardType}
            onChange={setLeaderboardType}
            options={[
              { value: "Overall", label: "Overall Leaderboard" },
              { value: "ClassUnion", label: "Class Union Leaderboard" },
              { value: "ClassWise", label: "Class Wise Top Performers" },
            ]}
          />

          {leaderboardType === "Overall" && (
            <Select
              value={topCount}
              onChange={(value) => setTopCount(Number(value))}
              options={[
                { value: 10, label: "Top 10" },
                { value: 20, label: "Top 20" },
                { value: 30, label: "Top 30" },
              ]}
            />
          )}

          {leaderboardType === "ClassWise" && (
            <Select
              value={selectedClass}
              onChange={setSelectedClass}
              options={classes.map((cls) => ({ value: cls, label: cls }))}
            />
          )}
        </FilterControls>

        <DataTable
          title={getTitle()}
          icon={getIcon()}
          iconColor={getIconColor()}
          headerColor={getHeaderColor()}
          columns={getColumns()}
          data={getLeaderboardData()}
          onExport={handleExport}
        />
      </div>
    );
  };

  const renderStudents = () => {
    const filteredStudents = selectedClass
      ? studentsData.filter((s) => s.class === selectedClass)
      : studentsData;

    const sortedStudents = filteredStudents.sort((a, b) => b.marks - a.marks);

    const columns = [
      {
        header: "Rank",
        key: "rank",
        render: (row, index) => <span className="font-bold">{index + 1}</span>,
      },
      { header: "Name", key: "name" },
      { header: "Class", key: "class" },
      {
        header: "Marks",
        key: "marks",
        render: (row) => <span className="font-semibold">{row.marks}</span>,
      },
      {
        header: "Level",
        key: "level",
        render: (row) => <LevelBadge level={row.level} />,
      },
    ];

    return (
      <div className="space-y-6">
        <FilterControls>
          <Select
            value={selectedClass}
            onChange={setSelectedClass}
            options={classes.map((cls) => ({ value: cls, label: cls }))}
            placeholder="All Classes"
          />
        </FilterControls>

        <DataTable
          title={
            selectedClass ? `Class ${selectedClass} Students` : "All Students"
          }
          icon={Users}
          iconColor="text-green-500"
          headerColor="bg-green-500"
          columns={columns}
          data={sortedStudents}
          onExport={handleExport}
        />
      </div>
    );
  };

  const renderTeachers = () => {
    const columns = [
      {
        header: "Name",
        key: "name",
        render: (row) => <span className="font-semibold">{row.name}</span>,
      },
      { header: "Subject", key: "subject" },
      { header: "Experience", key: "experience" },
      {
        header: "Classes",
        key: "classes",
        render: (row) => row.classes.join(", "),
      },
    ];

    return (
      <DataTable
        title="Teachers List"
        icon={UserCheck}
        iconColor="text-indigo-500"
        headerColor="bg-indigo-500"
        columns={columns}
        data={teachersData}
        onExport={handleExport}
      />
    );
  };

  const renderLevel = () => {
    const levelData = getStudentsByLevel(selectedLevel);

    const columns = [
      { header: "Name", key: "name" },
      { header: "Class", key: "class" },
      {
        header: "Marks",
        key: "marks",
        render: (row) => <span className="font-semibold">{row.marks}</span>,
      },
      { header: "Subject", key: "subject" },
    ];

    const getColorClasses = () => {
      switch (selectedLevel) {
        case "Green":
          return { iconColor: "text-green-500", headerColor: "bg-green-500" };
        case "Blue":
          return { iconColor: "text-blue-500", headerColor: "bg-blue-500" };
        case "Red":
          return { iconColor: "text-red-500", headerColor: "bg-red-500" };
        default:
          return { iconColor: "text-gray-500", headerColor: "bg-gray-500" };
      }
    };

    const { iconColor, headerColor } = getColorClasses();

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
        </FilterControls>

        <DataTable
          title={`${selectedLevel} Level Students`}
          icon={BarChart3}
          iconColor={iconColor}
          headerColor={headerColor}
          columns={columns}
          data={levelData}
          onExport={handleExport}
        />
      </div>
    );
  };

  const renderCCEScore = () => {
    let data = [];
    let title = "CCE Scores";

    if (cceViewType === "class") {
      data = studentsData
        .filter((s) => s.class === selectedClass)
        .sort((a, b) => b.cceScore - a.cceScore);
      title = `Class ${selectedClass} CCE Scores`;
    } else if (cceViewType === "student") {
      data = getStudentCCEScores(studentAdmNo);
      title = studentAdmNo
        ? `CCE Scores for ${studentAdmNo}`
        : "Enter Student Admission Number";
    } else if (cceViewType === "subject") {
      data = studentsData
        .filter((s) => s.subject === selectedSubject)
        .sort((a, b) => b.cceScore - a.cceScore);
      title = `${selectedSubject} CCE Scores`;
    }

    const columns = [
      { header: "Name", key: "name" },
      { header: "Class", key: "class" },
      {
        header: "CCE Score",
        key: "cceScore",
        render: (row) => <span className="font-semibold">{row.cceScore}</span>,
      },
      { header: "Subject", key: "subject" },
    ];

    return (
      <div className="space-y-6">
        <FilterControls>
          <Select
            value={cceViewType}
            onChange={setCceViewType}
            options={[
              { value: "class", label: "Class Wise" },
              { value: "student", label: "Student Wise" },
              { value: "subject", label: "Subject Wise" },
            ]}
            placeholder="Select View Type"
          />

          {cceViewType === "class" && (
            <Select
              value={selectedClass}
              onChange={setSelectedClass}
              options={classes.map((cls) => ({ value: cls, label: cls }))}
            />
          )}

          {cceViewType === "student" && (
            <Input
              value={studentAdmNo}
              onChange={setStudentAdmNo}
              placeholder="Enter Student Admission Number"
            />
          )}

          {cceViewType === "subject" && (
            <Select
              value={selectedSubject}
              onChange={setSelectedSubject}
              options={subjects.map((sub) => ({ value: sub, label: sub }))}
            />
          )}
        </FilterControls>

        <DataTable
          title={title}
          icon={BookOpen}
          iconColor="text-orange-500"
          headerColor="bg-orange-500"
          columns={columns}
          data={data}
          onExport={handleExport}
        />
      </div>
    );
  };

  const renderMentorScore = () => {
    let data = [];
    let title = "Mentor Scores";

    if (mentorViewType === "class") {
      data = studentsData
        .filter((s) => s.class === selectedClass)
        .sort((a, b) => b.mentorScore - a.mentorScore);
      title = `Class ${selectedClass} Mentor Scores`;
    } else if (mentorViewType === "student") {
      data = getStudentMentorScore(studentAdmNo);
      title = studentAdmNo
        ? `Mentor Score for ${studentAdmNo}`
        : "Enter Student Admission Number";
    }

    const columns = [
      { header: "Name", key: "name" },
      { header: "Class", key: "class" },
      {
        header: "Mentor Score",
        key: "mentorScore",
        render: (row) => (
          <span className="font-semibold">{row.mentorScore}</span>
        ),
      },
      {
        header: "Level",
        key: "level",
        render: (row) => <LevelBadge level={row.level} />,
      },
    ];

    return (
      <div className="space-y-6">
        <FilterControls>
          <Select
            value={mentorViewType}
            onChange={setMentorViewType}
            options={[
              { value: "class", label: "Class Wise" },
              { value: "student", label: "Student Wise" },
            ]}
            placeholder="Select View Type"
          />

          {mentorViewType === "class" && (
            <Select
              value={selectedClass}
              onChange={setSelectedClass}
              options={classes.map((cls) => ({ value: cls, label: cls }))}
            />
          )}

          {mentorViewType === "student" && (
            <Input
              value={studentAdmNo}
              onChange={setStudentAdmNo}
              placeholder="Enter Student Admission Number"
            />
          )}
        </FilterControls>

        <DataTable
          title={title}
          icon={UserCheck}
          iconColor="text-teal-500"
          headerColor="bg-teal-500"
          columns={columns}
          data={data}
          onExport={handleExport}
        />
      </div>
    );
  };

  const sections = [
    { name: "Leaderboard", icon: Trophy },
    { name: "Students", icon: Users },
    { name: "Teachers", icon: UserCheck },
    { name: "Level", icon: BarChart3 },
    { name: "CCE Score", icon: BookOpen },
    { name: "Mentor Score", icon: Award },
  ];

  return (
    <div className="flex  min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Report" />
      <div className="flex-1 p-8 md:ml-64 md:mt-4 mt-10 transition-all duration-300 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Reports
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow">
            {sections.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setActiveSection(name)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                  activeSection === name
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-blue-50"
                }`}
              >
                <Icon size={20} />
                {name}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {activeSection === "Leaderboard" && renderLeaderboard()}
            {activeSection === "Students" && renderStudents()}
            {activeSection === "Teachers" && renderTeachers()}
            {activeSection === "Level" && renderLevel()}
            {activeSection === "CCE Score" && renderCCEScore()}
            {activeSection === "Mentor Score" && renderMentorScore()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReport;
