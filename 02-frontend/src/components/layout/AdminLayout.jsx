import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header"; // Đổi tên từ AdminHeader thành Header
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
      <Header
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showToggle={true}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <AdminSidebar isOpen={isSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 transition-all duration-300 overflow-hidden flex flex-col">
          <div className="flex-1 w-full max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 lg:p-10 flex flex-col overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
