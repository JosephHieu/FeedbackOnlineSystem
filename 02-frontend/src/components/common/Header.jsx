import React from "react";
import { useAuth } from "../../hooks/useAuth";

// Thêm prop showToggle để điều khiển việc hiển thị nút đóng/mở sidebar
const Header = ({ isSidebarOpen, setSidebarOpen, showToggle = true }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#2c2e33] h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2 md:gap-4">
        {showToggle && (
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <i
              className={
                isSidebarOpen
                  ? "ri-indent-decrease text-xl md:text-2xl"
                  : "ri-indent-increase text-xl md:text-2xl"
              }
            ></i>
          </button>
        )}

        <div className="flex items-center gap-2 select-none">
          <i className="ri-computer-line text-purple-500 text-xl md:text-2xl font-bold"></i>
          {/* Ẩn chữ Online hoặc thu nhỏ chữ trên Mobile */}
          <h1 className="text-white text-lg md:text-xl font-bold tracking-tight">
            Feedback Online System
            <span className="hidden xs:inline">
              -<span className="text-purple-400">Online</span>
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Username: Trên mobile chỉ hiện icon và tên ngắn */}
        <div className="bg-[#3e4148] border border-gray-600 px-2 md:px-4 py-1.5 rounded flex items-center gap-2 text-white">
          <i className="ri-user-fill text-sm text-gray-400"></i>
          <span className="text-xs md:text-sm font-semibold uppercase truncate max-w-[60px] md:max-w-none">
            {user?.username || "Guest"}
          </span>
        </div>

        {/* Đổi mật khẩu: Ẩn chữ trên mobile, chỉ hiện icon */}
        <button className="bg-[#3e4148] hover:bg-[#4a4d55] border border-gray-600 px-2 md:px-4 py-1.5 rounded text-white flex items-center gap-2 transition-all">
          <i className="ri-wrench-line text-sm text-gray-400"></i>
          <span className="hidden sm:inline text-sm font-medium">
            Đổi mật khẩu
          </span>
        </button>

        {/* Đăng xuất: Ẩn chữ trên mobile, chỉ hiện icon và đổi màu hover nhanh */}
        <button
          onClick={logout}
          className="bg-[#3e4148] hover:bg-rose-600 border border-gray-600 px-2 md:px-4 py-1.5 rounded text-white flex items-center gap-2 transition-all group"
        >
          <i className="ri-logout-box-r-line text-sm text-gray-400 group-hover:text-white"></i>
          <span className="hidden sm:inline text-sm font-medium">
            Đăng xuất
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
