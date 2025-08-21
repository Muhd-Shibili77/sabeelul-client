import React, { useState } from "react";
import {
  Trophy,
  Users,
  Award,
  BarChart3,
  BookOpen,
  UserCheck,
  Mic,
} from "lucide-react";
import SideBar from "../../components/sideBar/SideBar";
import RenderMentorScore from "../../components/renderReport/RenderMentorScore";
import RenderCCEScore from "../../components/renderReport/RenderCCEScore";
import RenderLevel from "../../components/renderReport/RenderLevel";
import RenderTeachers from "../../components/renderReport/RenderTeachers";
import RenderStudents from "../../components/renderReport/RenderStudents";
import RenderLeaderBoard from "../../components/renderReport/RenderLeaderBoard";
import RenderPKVScore from "../../components/renderReport/RenderPKVScore";

const AdminReport = () => {
  const [activeSection, setActiveSection] = useState("Leaderboard");

  const sections = [
    { name: "Leaderboard", icon: Trophy },
    { name: "Students", icon: Users },
    { name: "Teachers", icon: UserCheck },
    { name: "Level", icon: BarChart3 },
    { name: "CCE Score", icon: BookOpen },
    { name: "Mentor Score", icon: Award },
    { name: "PKV Score", icon: Mic },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Leaderboard":
        return <RenderLeaderBoard />;
      case "Students":
        return <RenderStudents />;
      case "Teachers":
        return <RenderTeachers />;
      case "Level":
        return <RenderLevel />;
      case "CCE Score":
        return <RenderCCEScore />;
      case "Mentor Score":
        return <RenderMentorScore />;
      case "PKV Score":
        return <RenderPKVScore />;
      default:
        return <RenderLeaderBoard />;
    }
  };

  return (
    <div className="flex  min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Report" />
      <div className="flex-1 p-8 md:ml-64 md:mt-1 mt-10 transition-all duration-300 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3 mb-8 bg-white p-2 rounded-xl shadow">
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
