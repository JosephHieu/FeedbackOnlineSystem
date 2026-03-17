import React from "react";
import { useAuth } from "../../hooks/useAuth";

const AdminHeader = ({ isSidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#2c2e33] h-16 flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
      {/* Cụm bên trái: Toggle Sidebar & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <i
            className={
              isSidebarOpen
                ? "ri-indent-decrease text-2xl"
                : "ri-indent-increase text-2xl"
            }
          ></i>
        </button>

        <div className="flex items-center gap-2 select-none">
          <i className="ri-computer-line text-purple-500 text-2xl font-bold"></i>
          <h1 className="text-white text-xl font-bold tracking-tight">
            Feedback-<span className="text-purple-400">Online</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-[#3e4148] border border-gray-600 px-4 py-1.5 rounded flex items-center gap-2 text-white cursor-default shadow-sm">
          <i className="ri-user-fill text-sm text-gray-400"></i>
          <span className="text-sm font-semibold tracking-wide">
            {user?.username || "admin"}
          </span>
        </div>

        <button className="bg-[#3e4148] hover:bg-[#4a4d55] border border-gray-600 px-4 py-1.5 rounded text-white flex items-center gap-2 transition-all shadow-sm active:scale-95">
          <i className="ri-wrench-line text-sm text-gray-400"></i>
          <span className="text-sm font-medium whitespace-nowrap">
            Đổi mật khẩu
          </span>
        </button>

        <button
          onClick={logout}
          className="bg-[#3e4148] hover:bg-rose-600 border border-gray-600 px-4 py-1.5 rounded text-white flex items-center gap-2 transition-all group shadow-sm active:scale-95 text-nowrap"
        >
          <i className="ri-logout-box-r-line text-sm text-gray-400 group-hover:text-white"></i>
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
