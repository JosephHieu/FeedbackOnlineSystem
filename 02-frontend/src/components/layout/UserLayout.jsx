import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";

const UserLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
      <Header showToggle={false} />

      <main className="flex-1 p-6 overflow-hidden flex flex-col items-center">
        <div className="w-full max-w-5xl h-full bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 flex flex-col overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
