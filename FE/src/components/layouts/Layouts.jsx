import { Outlet, Link, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaUser,
  FaTachometerAlt,
  FaSearch,
  FaDatabase,
  FaCaretDown,
  FaUsers,
  FaTasks,
  FaUsersCog,
  FaUserCog,
} from "react-icons/fa";
import { MdDocumentScanner } from "react-icons/md";
import { IoDocumentsSharp } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
  const [isKelolaDataOpen, setIsKelolaDataOpen] = useState(false);
  const [userLogin, setUserLogin] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setUserLogin(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate({ to: "/login" });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full transition-all duration-500 bg-gradient-to-b from-blue-800 to-blue-900 shadow-lg ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4 text-white">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars size={24} />
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            {/* Dashboard */}
            <Link to={"/"}>
              <li className="flex items-center p-4 text-white hover:bg-blue-600 cursor-pointer">
                <FaTachometerAlt size={20} />
                {isSidebarOpen && <span className="ml-3">Dashboard</span>}
              </li>
            </Link>

            {/* Scanning */}
            <Link to={"/scanning"}>
              <li className="flex items-center p-4 text-white hover:bg-blue-600 cursor-pointer">
                <MdDocumentScanner size={23} />
                {isSidebarOpen && <span className="ml-3">Scanning</span>}
              </li>
            </Link>

            {userLogin?.jabatan === "Admin" ? (
              <div className="admin">
                {/* Update Data */}
                <Link to={"/update-database"}>
                  <li className="flex items-center p-4 text-white hover:bg-blue-600 cursor-pointer">
                    <FaDatabase size={20} />
                    {isSidebarOpen && <span className="ml-3">Update Data</span>}
                  </li>
                </Link>

                {/* Kelola Data */}
                <li
                  className="flex items-center p-4 text-white hover:bg-blue-600 cursor-pointer"
                  onClick={() => setIsKelolaDataOpen(!isKelolaDataOpen)}
                >
                  <FaTasks size={20} />
                  {isSidebarOpen && (
                    <>
                      <span className="ml-3">Kelola Data</span>
                      <FaCaretDown
                        className={`ml-auto transition-transform ${
                          isKelolaDataOpen ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                </li>
              </div>
            ) : (
              ""
            )}

            {/* Sub-menu Kelola Data */}
            {isKelolaDataOpen && (
              <ul className="ml-8">
                <Link to={"/data-mr"}>
                  <li className="flex items-center p-3 text-white hover:bg-blue-600 cursor-pointer">
                    <IoDocumentsSharp size={16} />
                    {isSidebarOpen && <span className="ml-3">DATA MR</span>}
                  </li>
                </Link>
                <Link to={"/data-candra"}>
                  <li className="flex items-center p-3 text-white hover:bg-blue-600 cursor-pointer">
                    <FaDatabase size={16} />
                    {isSidebarOpen && <span className="ml-3">Data Candra</span>}
                  </li>
                </Link>
                <Link to={"/data-karyawan"}>
                  <li className="flex items-center p-3 text-white hover:bg-blue-600 cursor-pointer">
                    <FaUsers size={16} />
                    {isSidebarOpen && (
                      <span className="ml-3">Data Karyawan</span>
                    )}
                  </li>
                </Link>
                <Link to={"/data-proses"}>
                  <li className="flex items-center p-3 text-white hover:bg-blue-600 cursor-pointer">
                    <FaTasks size={16} />
                    {isSidebarOpen && <span className="ml-3">Data Proses</span>}
                  </li>
                </Link>
                <Link to={"/data-users"}>
                  <li className="flex items-center p-3 text-white hover:bg-blue-600 cursor-pointer">
                    <FaUserCog size={16} />
                    {isSidebarOpen && <span className="ml-3">Data Users</span>}
                  </li>
                </Link>
              </ul>
            )}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-500 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* Topbar */}
        <div className="flex justify-between items-center p-4 bg-white shadow-md">
          <span className="flex items-center font-semibold">
            <img src="/images/logo_candra.png" className="w-8" alt="Logo" />
            <span className="ms-2 text-2xl font-bold">CANDRA</span>
          </span>
          <div className="relative">
            <div className="iconUser flex items-center">
              <p className="text-md font-semibold uppercase me-4 ">
                {userLogin?.username}
              </p>
              <button onClick={() => setIsUserPopupOpen(!isUserPopupOpen)}>
                <FaUser size={24} />
              </button>
            </div>
            {isUserPopupOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg p-4">
                <p className="text-md font-semibold uppercase ">
                  {userLogin?.username}
                </p>
                <p className="text-sm text-gray-500">{userLogin?.jabatan}</p>

                <div className="btn mt-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center bg-red-800 py-1 px-3 rounded-lg"
                  >
                    {" "}
                    <TbLogout className="text-white" />{" "}
                    <span className="text-white ms-2">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
