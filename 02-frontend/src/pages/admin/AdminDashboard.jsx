import React from "react";

const AdminDashboard = () => {
  // Dữ liệu mẫu để hiển thị (Sau này bạn sẽ fetch từ API)
  const stats = [
    {
      label: "Tổng số lớp",
      value: "12",
      icon: "ri-community-line",
      color: "bg-blue-500",
    },
    {
      label: "Học viên",
      value: "156",
      icon: "ri-user-smile-line",
      color: "bg-indigo-500",
    },
    {
      label: "Giảng viên",
      value: "24",
      icon: "ri-presentation-line",
      color: "bg-purple-500",
    },
    {
      label: "Feedback mới",
      value: "89",
      icon: "ri-chat-heart-line",
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* 1. Header của trang */}
      <div className="flex justify-between items-center mb-8">
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-slate-600">
            Hệ thống: Online
          </span>
        </div>
      </div>

      {/* 2. Các thẻ thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {stat.value}
                </h3>
              </div>
              <div
                className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-inherit/30`}
              >
                <i className={`${stat.icon} text-2xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Nội dung chính (Lời chào trung tâm) */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
        {/* Decorate Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="z-10 text-center px-6">
          <div className="inline-block p-4 bg-white rounded-full shadow-xl mb-6">
            <span className="text-6xl">😃</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-800 mb-4 leading-tight">
            Chào mừng đã đến với <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Tool lấy feedback online
            </span>
          </h1>

          <div className="flex flex-col items-center mt-10">
            <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4"></div>
            <p className="text-slate-400 font-black tracking-[0.4em] uppercase text-xs">
              Project By Fresher46DN
            </p>
          </div>
        </div>
      </div>

      {/* 4. Footer nhỏ cuối trang */}
      <div className="mt-6 flex justify-between items-center text-[11px] font-bold text-slate-300 uppercase tracking-widest px-2">
        <span>Feedback Online System</span>
        <span>Version 2026.1.0</span>
      </div>
    </div>
  );
};

export default AdminDashboard;
