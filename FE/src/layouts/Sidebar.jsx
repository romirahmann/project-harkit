/* eslint-disable no-unused-vars */
import {
  FaBars,
  FaTachometerAlt,
  FaDatabase,
  FaTasks,
  FaCaretDown,
  FaUsers,
  FaBoxes,
  FaUserCog,
  FaFolderOpen,
} from "react-icons/fa";
import { MdOutlineLibraryAddCheck, MdDocumentScanner } from "react-icons/md";
import { AiFillStop } from "react-icons/ai";
import { BsClipboardData } from "react-icons/bs";
import { TbTargetArrow } from "react-icons/tb";
import { IoDocuments, IoDocumentsSharp } from "react-icons/io5";

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Tooltip } from "react-tooltip";

export function Sidebar({ isSidebarOpen, setIsSidebarOpen, userLogin }) {
  const [isKelolaDataOpen, setIsKelolaDataOpen] = useState(false);
  const [lastClicked, setLastClicked] = useState(null);

  const toggleKelola = () => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      setLastClicked("Kelola Data");
    } else {
      setIsKelolaDataOpen((prev) => !prev);
      setLastClicked("Kelola Data");
    }
  };

  return (
    <div
      className={` transition-all duration-500 bg-gradient-to-b from-blue-800 to-blue-900 shadow-lg z-50 ${
        isSidebarOpen ? "w-[13em]" : "w-[4em]"
      }`}
    >
      <div className="flex items-center justify-between p-4 text-white">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FaBars size={24} />
        </button>
      </div>

      <nav className="mt-4">
        <ul
          className={`space-y-1 ${
            !isSidebarOpen ? "flex flex-col items-center" : "text-left"
          }`}
        >
          <SidebarItem
            to="/"
            icon={FaTachometerAlt}
            label="Dashboard"
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            lastClicked={lastClicked}
            setLastClicked={setLastClicked}
          />
          <SidebarItem
            to="/scanning"
            icon={MdDocumentScanner}
            label="Scanning"
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            lastClicked={lastClicked}
            setLastClicked={setLastClicked}
          />

          {userLogin?.jabatan !== "User" && (
            <>
              <SidebarItem
                to="/checksheet"
                icon={MdOutlineLibraryAddCheck}
                label="Checksheet"
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                lastClicked={lastClicked}
                setLastClicked={setLastClicked}
              />
              <SidebarItem
                to="/update-database"
                icon={FaDatabase}
                label="Update Data"
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                lastClicked={lastClicked}
                setLastClicked={setLastClicked}
              />

              <li
                className="flex items-center p-3 text-white hover:bg-blue-600 cursor-pointer relative"
                onClick={toggleKelola}
              >
                <FaTasks
                  size={20}
                  data-tooltip-id="tooltip-kelola"
                  data-tooltip-content="Kelola Data"
                />
                {!isSidebarOpen && (
                  <Tooltip id="tooltip-kelola" place="right" />
                )}
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

              {isSidebarOpen && isKelolaDataOpen && (
                <ul className="ml-8 space-y-1">
                  <SidebarSubItem
                    to="/data-mr"
                    label="DATA MR"
                    icon={<IoDocumentsSharp />}
                  />
                  {/* <SidebarSubItem
                    to="/nonaktifMR"
                    label="DATA NONAKTIF"
                    icon={<AiFillStop />}
                  /> */}
                  <SidebarSubItem
                    to="/data-candra"
                    label="Data Candra"
                    icon={<FaDatabase />}
                  />
                  <SidebarSubItem
                    to="/data-dokumen"
                    label="Data Dokumen"
                    icon={<IoDocuments />}
                  />
                  <SidebarSubItem
                    to="/data-kcp"
                    label="Data KCP"
                    icon={<BsClipboardData />}
                  />
                  {/* <SidebarSubItem
                    to="/data-kcp-a2"
                    label="Data KCP A2"
                    icon={<BsClipboardData />}
                  /> */}
                  <SidebarSubItem
                    to="/data-karyawan"
                    label="Data Karyawan"
                    icon={<FaUsers />}
                  />
                  <SidebarSubItem
                    to="/data-proses"
                    label="Data Proses"
                    icon={<FaTasks />}
                  />
                  <SidebarSubItem
                    to="/box-page"
                    label="Data Box"
                    icon={<FaBoxes />}
                  />
                  <SidebarSubItem
                    to="/targets"
                    label="Data Targets"
                    icon={<TbTargetArrow />}
                  />
                  {userLogin?.jabatan === "Admin" && (
                    <SidebarSubItem
                      to="/data-users"
                      label="Data Users"
                      icon={<FaUserCog />}
                    />
                  )}
                </ul>
              )}
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

function SidebarItem({
  to,
  icon: Icon,
  label,
  isSidebarOpen,
  setIsSidebarOpen,
  lastClicked,
  setLastClicked,
}) {
  const handleClick = (e) => {
    if (!isSidebarOpen) {
      e.preventDefault();
      setIsSidebarOpen(true);
      setLastClicked(label);
    } else if (lastClicked !== label) {
      setLastClicked(label);
    }
  };

  return (
    <Link to={to} onClick={handleClick}>
      <li
        className="flex items-center p-3 text-white hover:bg-blue-600 cursor-pointer relative"
        data-tooltip-id={`tooltip-${label}`}
        data-tooltip-content={label}
      >
        <Icon size={20} />
        {!isSidebarOpen && <Tooltip id={`tooltip-${label}`} place="right" />}
        {isSidebarOpen && <span className="ml-3">{label}</span>}
      </li>
    </Link>
  );
}

function SidebarSubItem({ to, icon, label }) {
  return (
    <Link to={to}>
      <li className="flex items-center p-2 text-white hover:bg-blue-600 cursor-pointer rounded-md">
        <span className="mr-2">{icon}</span>
        <span>{label}</span>
      </li>
    </Link>
  );
}
