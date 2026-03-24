import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";

const UserLayout = () => {
  return (
    // h-screen để ép toàn bộ ứng dụng bằng đúng chiều cao màn hình
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden">
      <Header showToggle={false} />

      {/* flex-1 và overflow-hidden để main không bị cuộn cả trang */}
      <main className="flex-1 p-4 md:p-8 flex justify-center overflow-hidden">
        {/* Card trắng lớn: h-full để nó chiếm hết chỗ trống */}
        <div className="w-full max-w-5xl h-full bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
