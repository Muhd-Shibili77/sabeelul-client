import React, { useState } from "react";
import {
  Trophy,
  Users,
  Award,
  BarChart3,
  BookOpen,
  UserCheck,
} from "lucide-react";
import SideBar from "../../components/sideBar/SideBar";
import RenderMentorScore from "../../components/renderReport/RenderMentorScore";
import RenderCCEScore from "../../components/renderReport/RenderCCEScore";
import RenderLevel from "../../components/renderReport/RenderLevel";
import RenderTeachers from "../../components/renderReport/RenderTeachers";
import RenderStudents from "../../components/renderReport/RenderStudents";
import RenderLeaderBoard from "../../components/renderReport/RenderLeaderBoard";
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
    level: "Orange",
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
    level: "Purple",
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
    level: "Purple",
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


const AdminReport = () => {
  const [activeSection, setActiveSection] = useState("Leaderboard");
  const handleExport = (type) => {
    alert(
      `${type.toUpperCase()} export functionality would be implemented here`
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

  const renderContent = () => {
    switch (activeSection) {
      case "Leaderboard":
        return (
          <RenderLeaderBoard
            handleExport={handleExport}
          />
        );
      case "Students":
        return (
          <RenderStudents
            handleExport={handleExport}
          />
        );
      case "Teachers":
        return (
          <RenderTeachers
            handleExport={handleExport}
          />
        );
      case "Level":
        return (
          <RenderLevel
            handleExport={handleExport}
          />
        );
      case "CCE Score":
        return (
          <RenderCCEScore
            studentsData={studentsData}
            handleExport={handleExport}
          />
        );
      case "Mentor Score":
        return (
          <RenderMentorScore
            handleExport={handleExport}
          />
        );
      default:
        return <RenderLeaderBoard handleExport={handleExport} />;
    }
  };

  return (
    <div className="flex  min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Report" />
      <div className="flex-1 p-8 md:ml-64 md:mt-1 mt-10 transition-all duration-300 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8 bg-white p-2 rounded-xl shadow">
            {sections.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setActiveSection(name)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all w-full ${
                  activeSection === name
                    ? "bg-[rgba(53,130,140,1)] text-white shadow-lg"
                    : "text-gray-600 hover:bg-[rgba(53,130,140,0.1)]"
                }`}
              >
                <Icon size={20} />
                {name}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="space-y-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminReport;
