import React from "react";
import { useAuth } from "../../hooks/useAuth";

// Thêm prop showToggle để điều khiển việc hiển thị nút đóng/mở sidebar
const Header = ({ isSidebarOpen, setSidebarOpen, showToggle = true }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#2c2e33] h-16 flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-4">
        {/* Chỉ hiển thị nút Toggle nếu showToggle là true */}
        {showToggle && (
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
        )}

        <div className="flex items-center gap-2 select-none">
          <i className="ri-computer-line text-purple-500 text-2xl font-bold"></i>
          <h1 className="text-white text-xl font-bold tracking-tight">
            Feedback-<span className="text-purple-400">Online</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Nút 1: Username */}
        <div className="bg-[#3e4148] border border-gray-600 px-4 py-1.5 rounded flex items-center gap-2 text-white cursor-default">
          <i className="ri-user-fill text-sm text-gray-400"></i>
          <span className="text-sm font-semibold uppercase tracking-wide">
            {user?.username || "Guest"}
          </span>
        </div>

        {/* Nút 2: Đổi mật khẩu */}
        <button className="bg-[#3e4148] hover:bg-[#4a4d55] border border-gray-600 px-4 py-1.5 rounded text-white flex items-center gap-2 transition-all active:scale-95">
          <i className="ri-wrench-line text-sm text-gray-400"></i>
          <span className="text-sm font-medium whitespace-nowrap">
            Đổi mật khẩu
          </span>
        </button>

        {/* Nút 3: Đăng xuất */}
        <button
          onClick={logout}
          className="bg-[#3e4148] hover:bg-rose-600 border border-gray-600 px-4 py-1.5 rounded text-white flex items-center gap-2 transition-all group active:scale-95"
        >
          <i className="ri-logout-box-r-line text-sm text-gray-400 group-hover:text-white"></i>
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
