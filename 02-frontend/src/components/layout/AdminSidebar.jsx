import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = ({ isOpen }) => {
  const menuItems = [
    { name: "Trang chủ", path: "/admin/dashboard", icon: "ri-home-4-line" },
    { name: "Lớp học", path: "/admin/classes", icon: "ri-community-line" },
    { name: "Học viên", path: "/admin/students", icon: "ri-user-smile-line" },
    {
      name: "Trainer",
      path: "/admin/trainers",
      icon: "ri-presentation-line",
    },
    { name: "Topic", path: "/admin/topics", icon: "ri-bookmark-3-line" },
    {
      name: "Template",
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
      className={`
        /* Layout cơ bản */
        bg-white border-r border-gray-100 flex flex-col shadow-xl lg:shadow-none 
        fixed lg:sticky top-16 z-40 h-[calc(100vh-64px)] transition-all duration-300
        
        /* Xử lý Mobile: Ẩn hẳn sang trái (-100%) khi đóng */
        ${isOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0 lg:w-20"}
      `}
    >
      <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <i className={`${item.icon} text-2xl flex-shrink-0`}></i>

                  {/* Chữ: Ẩn khi Sidebar thu nhỏ trên Desktop, nhưng HIỆN khi mở trên Mobile */}
                  <span
                    className={`text-[15px] font-bold whitespace-nowrap transition-all duration-200 ${
                      !isOpen
                        ? "lg:opacity-0 lg:invisible lg:w-0"
                        : "opacity-100 visible w-auto"
                    }`}
                  >
                    {item.name}
                  </span>

                  {isActive && (
                    <div
                      className={`absolute right-3 w-1.5 h-6 bg-white/30 rounded-full ${!isOpen && "lg:hidden"}`}
                    ></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
