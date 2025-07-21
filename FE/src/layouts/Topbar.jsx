// src/layouts/Topbar.jsx
import { FaUser } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";

export function Topbar({
  userLogin,
  isUserPopupOpen,
  setIsUserPopupOpen,
  onLogout,
}) {
  return (
    <div className="flex relative z-50 justify-between items-center p-4 bg-white shadow-md backdrop-blur-sm">
      <span className="flex items-center font-semibold">
        <img
          src="/RSAB-HARAPAN-KITA/images/logo_candra.png"
          className="w-8"
          alt="Logo"
        />
        <span className="ms-2 md:text-2xl font-bold">CANDRA</span>
      </span>
      <div className="relative">
        <div className="iconUser flex items-center">
          <p className="text-sm md:text-md font-semibold uppercase me-4">
            {userLogin?.username}
          </p>
          <button onClick={() => setIsUserPopupOpen(!isUserPopupOpen)}>
            <FaUser size={24} />
          </button>
        </div>
        {isUserPopupOpen && (
          <div className="absolute  right-0 mt-2 w-48 bg-white shadow-md rounded-lg p-4">
            <p className="text-sm md:text-md font-semibold uppercase ">
              {userLogin?.username}
            </p>
            <p className="text-sm text-gray-500">{userLogin?.jabatan}</p>
            <div className="btn mt-4">
              <button
                onClick={onLogout}
                className="flex items-center bg-red-800 py-1 px-3 rounded-lg"
              >
                <TbLogout className="text-white" />
                <span className="text-white ms-2">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
