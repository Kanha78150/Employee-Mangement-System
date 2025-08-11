import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiGrid } from "react-icons/fi";
import { FaAddressBook } from "react-icons/fa";
import { SiGoogletasks } from "react-icons/si";
import { TbPresentationAnalytics } from "react-icons/tb";
import { BiTask } from "react-icons/bi";
import { VscThreeBars } from "react-icons/vsc";
import { useState, useRef, useEffect } from "react";

export default function Sidebar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      {!isOpen && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          onClick={toggleSidebar}
        >
          <VscThreeBars className="text-xl" />
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        ref={sidebarRef}
        className={`bg-gradient-to-b from-gray-900 to-gray-800 w-64 min-h-screen transform transition-all duration-300 ease-in-out shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 fixed md:static top-0 left-0 z-40`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FiGrid className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Dashboard</h2>
                <p className="text-gray-400 text-sm capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {user?.role === "admin" && (
            <>
              <Link
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-700 text-gray-300 hover:text-white ${
                  location.pathname === "/dashboard"
                    ? "bg-blue-600 text-white shadow-lg"
                    : ""
                }`}
                to="/dashboard"
              >
                <FiGrid className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-700 text-gray-300 hover:text-white ${
                  location.pathname === "/employees"
                    ? "bg-blue-600 text-white shadow-lg"
                    : ""
                }`}
                to="/employees"
              >
                <FaAddressBook className="w-5 h-5" />
                <span className="font-medium">Employees</span>
              </Link>
              <Link
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-700 text-gray-300 hover:text-white ${
                  location.pathname === "/tasks"
                    ? "bg-blue-600 text-white shadow-lg"
                    : ""
                }`}
                to="/tasks"
              >
                <SiGoogletasks className="w-5 h-5" />
                <span className="font-medium">Tasks</span>
              </Link>
              <Link
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-700 text-gray-300 hover:text-white ${
                  location.pathname === "/analytics"
                    ? "bg-blue-600 text-white shadow-lg"
                    : ""
                }`}
                to="/analytics"
              >
                <TbPresentationAnalytics className="w-5 h-5" />
                <span className="font-medium">Analytics</span>
              </Link>
            </>
          )}

          {user?.role === "employee" && (
            <Link
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-700 text-gray-300 hover:text-white ${
                location.pathname === "/employee/tasks"
                  ? "bg-blue-600 text-white shadow-lg"
                  : ""
              }`}
              to="/employee/tasks"
            >
              <BiTask className="w-5 h-5" />
              <span className="font-medium">My Tasks</span>
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
