import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
      <AdminHeader
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar isOpen={isSidebarOpen} />

        <main className="flex-1 p-6 transition-all duration-300 overflow-hidden">
          <div className="h-full w-full max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
