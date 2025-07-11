import React, { useState } from "react";
import logo from "../../assets/SabeelBlackLogo.png";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate } from "react-router";
import { SiGoogleclassroom } from "react-icons/si";
import useLogout from "../../hooks/authentication/adminLogout";
import {
  FaUser,
  FaUsersCog,
  FaCalendarAlt,
  FaSignOutAlt,
  FaThLarge,
  FaBars,
  FaCog, 
} from "react-icons/fa";
import { TbReport } from "react-icons/tb";
import { PiMicrophoneStageFill } from "react-icons/pi";

function SideBar(props) {
  const {logout} = useLogout()
  const navigate = useNavigate();

  const [active, setActive] = useState(props.page);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      route: "dashboard",
      icon: <FaThLarge />,
      key: "Dashboard",
    },
    { name: "Students", route: "students", icon: <FaUser />, key: "Students" },
    {
      name: "Teachers",
      route: "teachers",
      icon: <FaUsersCog />,
      key: "Teachers",
    },
    {
      name: "Classes",
      route: "classes",
      icon: <SiGoogleclassroom />,
      key: "Classes",
    },
    { name: "Score", route: "score", icon: <FaCalendarAlt />, key: "Score" },
    {
      name: "Programs",
      route: "programs",
      icon: <PiMicrophoneStageFill />,
      key: "Programs",
    },
    { name: "Report", route: "report", icon: <TbReport />, key: "Report" },
    {
      name: "Settings",
      route: "settings",
      icon: <FaCog />,
      key: "Settings",
    },
    { name: "Logout", icon: <FaSignOutAlt />, key: "Logout" },
  ];

  const handleLogout = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="fixed inset-0 flex items-center justify-center  z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Logout Confirmation
              </h2>
              <p className="text-gray-600 mt-2">
                Are you sure you want to logout?
              </p>
              <div className="flex justify-center mt-5 gap-4">
                <button
                  onClick={async () => {
                    const result = await logout()
                    
                    if (result.success) {
                      setTimeout(()=>{
                          navigate("/admin/login");
                          onClose();
                      },1000)
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      },
    });
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {!isOpen && (
        <button
          className="md:hidden p-3 text-gray-700 fixed top-4 left-4 z-50 bg-white rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <FaBars size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`h-screen fixed top-0 left-0 w-64 bg-white shadow-md p-5 flex flex-col z-40 overflow-y-auto transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Logo Section */}
        <div className="flex items-center space-x-2 text-xl font-semibold">
          <img className="w-12 h-12 object-contain" src={logo} alt="Logo" />
          <span className="font-bold">Sabeelul Hidaya</span>
        </div>

        <hr className="mb-4 mt-5" />

        {/* Menu Items */}
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={`flex items-center  gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300  ${
                active === item.key
                  ? "bg-[rgba(53,130,140,0.9)]  text-black"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => {
                if (item.key == "Logout") {
                  handleLogout();
                } else {
                  navigate(`/admin/${item.route}`);
                  setActive(item.key);
                  setIsOpen(false);
                }
              }}
            >
              {item.icon} <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default SideBar;
