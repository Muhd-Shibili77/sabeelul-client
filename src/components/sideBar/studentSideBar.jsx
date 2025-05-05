import React, { useState } from "react";
import { useNavigate } from "react-router";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { PiExamFill } from "react-icons/pi";
import useUserLogout from "../../hooks/authentication/useLogout";
import { useStudentContext } from "../../context/StudentContext";
import {
  FaThLarge,
  FaUserGraduate,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import logo from "../../assets/SabeelBlackLogo.png"; // Replace with correct student logo if needed

const StudentSideBar = ({ page }) => {
    const { totalMark, theme } = useStudentContext();
  const {userLogout} = useUserLogout()
  const navigate = useNavigate();
  const [active, setActive] = useState(page);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      route: "dashboard",
      icon: <FaThLarge />,
      key: "Dashboard",
    },
    {
      name: "Profile",
      route: "profile",
      icon: <FaUserGraduate />,
      key: "Profile",
    },
    {
      name: "Performance",
      route: "performance",
      icon: <PiExamFill />,
      key: "Performance",
    },
    { name: "Logout", icon: <FaSignOutAlt />, key: "Logout" },
  ];

  const handleLogout = () => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="fixed inset-0 flex items-center justify-center z-50">
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
                  const result = await userLogout()
                  if(result.success){
                    setTimeout(()=>{
                      navigate("/"); // Adjust if needed
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
      ),
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
        className={`min-h-screen  w-64 bg-white shadow-md pl-5 pr-5 pt-5 flex flex-col fixed overflow-y-auto top-0 left-0 z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Logo */}
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
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                active === item.key
                  ? `${theme.color} text-black`
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => {
                if (item.key === "Logout") {
                  handleLogout();
                } else {
                  navigate(`/student/${item.route}`);
                  setActive(item.key);
                  setIsOpen(false);
                }
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default StudentSideBar;
