import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../common/Header";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  // 1. Khởi tạo trạng thái Sidebar (Mặc định mở trên Desktop, đóng trên Mobile)
  const [isSidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 1024,
  );

  const location = useLocation();
  const navigate = useNavigate();

  // Kiểm tra xem có đang ở trang Dashboard không
  const isDashboard =
    location.pathname === "/admin/dashboard" || location.pathname === "/admin";

  /**
   * Hàm helper lấy tiêu đề dựa trên đường dẫn
   */
  const getPageTitle = (path) => {
    if (path.includes("/admin/dashboard")) return "Dashboard";
    if (path.includes("/admin/classes")) return "Quản lý lớp học";
    if (path.includes("/admin/students")) return "Quản lý học viên";
    if (path.includes("/admin/trainers")) return "Quản lý giảng viên";
    if (path.includes("/admin/topics")) return "Quản lý chủ đề";
    if (path.includes("/admin/templates")) return "Quản lý mẫu feedback";
    if (path.includes("/admin/assign")) return "Gán Topic";
    if (path.includes("/admin/pending")) return "Học viên chưa Feedback";
    if (path.includes("/admin/export")) return "Xuất kết quả";
    if (path.includes("/admin/clear")) return "Cài đặt hệ thống";
    return "Hệ thống Feedback";
  };

  /**
   * 2. Lắng nghe sự kiện Resize màn hình
   */
  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024;
      setSidebarOpen((prev) => (prev !== isLarge ? isLarge : prev));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * 3. Tự động đóng Sidebar khi chuyển trang (Chỉ áp dụng trên Mobile)
   */
  useEffect(() => {
    if (window.innerWidth < 1024) {
      const timeoutId = setTimeout(() => {
        setSidebarOpen(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
      {/* Header dùng chung */}
      <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Lớp nền mờ (Overlay) khi mở Sidebar trên Mobile */}
        {isSidebarOpen && window.innerWidth < 1024 && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar điều hướng */}
        <AdminSidebar isOpen={isSidebarOpen} />

        {/* Nội dung chính bên phải */}
        <main className="flex-1 p-2 md:p-3 lg:p-4 transition-all duration-300 overflow-hidden flex flex-col w-full">
          {/* Container trắng bo góc chứa toàn bộ nội dung */}
          <div className="flex-1 w-full max-w-full mx-auto bg-white rounded-2xl lg:rounded-[1.5rem] shadow-sm border border-gray-100 p-4 lg:p-6 flex flex-col overflow-hidden">
            {/* Header của trang con: Gồm nút Back và Tiêu đề nằm sát nhau */}
            <div className="flex items-center gap-2 mb-6 md:mb-8">
              {!isDashboard && (
                <button
                  onClick={() => navigate(-1)}
                  title="Quay lại"
                  className="p-1.5 md:p-2 hover:bg-slate-100 rounded-full transition-all text-slate-600 active:scale-90"
                >
                  <i className="ri-arrow-left-line text-2xl md:text-3xl font-bold"></i>
                </button>
              )}

              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight select-none">
                {isDashboard ? "Dashboard" : getPageTitle(location.pathname)}
              </h1>
            </div>

            {/* Nội dung chi tiết của từng Route sẽ được Render vào đây */}
            <div className="flex-1 overflow-auto hide-scrollbar">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
