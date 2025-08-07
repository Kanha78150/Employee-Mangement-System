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
    <div className="md:flex">
      {/* Hamburger Icon (mobile only and visible only when sidebar is closed) */}
      {!isOpen && (
        <div className="md:hidden p-4 z-50 relative">
          <button onClick={toggleSidebar}>
            <VscThreeBars className="text-3xl" />
          </button>
        </div>
      )}

      {/* Sidebar Panel */}
      <div
        ref={sidebarRef}
        className={`bg-gray-100 w-60 min-h-screen p-4 space-y-4 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 fixed md:static top-0 left-0 z-40`}
      >
        <div className="md:hidden text-right">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-black text-5xl"
          >
            &times;
          </button>
        </div>

        {user?.role === "admin" && (
          <>
            <Link
              className="block p-3 hover:bg-gray-200 text-lg"
              to="/dashboard"
            >
              <FiGrid className="inline mr-3 text-2xl" />
              Dashboard
            </Link>
            <Link
              className="block p-3 hover:bg-gray-200 text-lg"
              to="/employees"
            >
              <FaAddressBook className="inline mr-3 text-2xl" />
              Employees
            </Link>
            <Link className="block p-3 hover:bg-gray-200 text-lg" to="/tasks">
              <SiGoogletasks className="inline mr-3 text-2xl" />
              Tasks
            </Link>
            <Link
              className="block p-3 hover:bg-gray-200 text-lg"
              to="/analytics"
            >
              <TbPresentationAnalytics className="inline mr-3 text-2xl" />
              Analytics
            </Link>
          </>
        )}

        {user?.role === "employee" && (
          <Link
            className="block p-3 hover:bg-gray-200 text-lg"
            to="/employee/tasks"
          >
            <BiTask className="inline mr-3 text-2xl" />
            My Tasks
          </Link>
        )}
      </div>
    </div>
  );
}
