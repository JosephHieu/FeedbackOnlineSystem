import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = ({ isOpen }) => {
  const menuItems = [
    { name: "Trang chủ", path: "/admin/dashboard", icon: "ri-home-4-line" },
    { name: "Lớp học", path: "/admin/classes", icon: "ri-community-line" },
    { name: "Học viên", path: "/admin/students", icon: "ri-user-smile-line" },
    {
      name: "Giảng viên",
      path: "/admin/trainers",
      icon: "ri-presentation-line",
    },
    { name: "Chủ đề", path: "/admin/topics", icon: "ri-bookmark-3-line" },
    {
      name: "Mẫu Feedback",
      path: "/admin/templates",
      icon: "ri-file-list-3-line",
    },
    { name: "Gán topic", path: "/admin/assign", icon: "ri-link-m" },
    {
      name: "Học viên chưa FB",
      path: "/admin/pending",
      icon: "ri-error-warning-line",
    },
    {
      name: "Xuất kết quả",
      path: "/admin/export",
      icon: "ri-file-excel-2-line",
    },
    { name: "Xóa toàn bộ", path: "/admin/clear", icon: "ri-delete-bin-line" },
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-100 transition-all duration-300 ease-in-out flex flex-col shadow-sm sticky top-16 z-40 ${
        isOpen ? "w-80" : "w-20"
      } h-[calc(100vh-64px)]`} // Chiều cao cố định trừ đi Header
    >
      {/* Container chứa menu: Dùng hide-scrollbar để ẩn thanh cuộn */}
      <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={!isOpen ? item.name : ""}
              className={({ isActive }) =>
                `flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                }`
              }
            >
              <i
                className={`${item.icon} text-2xl flex-shrink-0 ${
                  item.name === "Xóa toàn bộ" &&
                  "text-rose-500 group-[.active]:text-white"
                }`}
              ></i>

              <span
                className={`text-[16px] font-bold tracking-wide whitespace-nowrap transition-all duration-500 ${
                  !isOpen
                    ? "opacity-0 invisible w-0 translate-x-10"
                    : "opacity-100 visible w-auto translate-x-0"
                }`}
              >
                {item.name}
              </span>

              {/* Chấm tròn nhỏ thay thế cho thanh dọc khi Active ở chế độ thu nhỏ */}
              {({ isActive }) =>
                isActive && (
                  <div
                    className={`absolute right-3 w-1.5 h-6 bg-white/30 rounded-full ${!isOpen && "right-2"}`}
                  ></div>
                )
              }
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
