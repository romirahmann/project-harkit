/* eslint-disable no-unused-vars */
import { Outlet, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";
import { Topbar } from "./Topbar";
import { useAuth } from "../store/AuthContext";

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
  const [userLogin, setUserLogin] = useState({});
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  useEffect(() => {
    setUserLogin(user);
  }, []);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <>
      <div className="flex h-screen">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          userLogin={userLogin}
        />

        <div
          className={`flex-1 transition-all duration-500 shadow-xl backdrop-md ${
            isSidebarOpen ? "ml-64" : "ml-16"
          }`}
        >
          <Topbar
            userLogin={userLogin}
            isUserPopupOpen={isUserPopupOpen}
            setIsUserPopupOpen={setIsUserPopupOpen}
            onLogout={handleLogout}
          />
          <div className="">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
