import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDashboardStats } from "../../services/adminService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDashboardStats();

        // Format lại ngày tháng từ YYYY-MM-DD sang DD/MM để biểu đồ đẹp hơn
        const formattedChartData = result.chartData?.map((item) => ({
          ...item,
          displayDate: new Date(item.date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
          }),
        }));

        setData({ ...result, chartData: formattedChartData });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Các thẻ thống kê (Dùng dữ liệu từ API)
  const stats = [
    {
      label: "Tổng số lớp",
      value: data?.totalClasses || 0,
      icon: "ri-community-line",
      color: "text-blue-600",
      bg: "bg-blue-100/50",
    },
    {
      label: "Học viên",
      value: data?.totalStudents || 0,
      icon: "ri-user-smile-line",
      color: "text-indigo-600",
      bg: "bg-indigo-100/50",
    },
    {
      label: "Giảng viên",
      value: data?.totalTrainers || 0,
      icon: "ri-presentation-line",
      color: "text-purple-600",
      bg: "bg-purple-100/50",
    },
    {
      label: "Feedback mới",
      value: data?.totalFeedbacks || 0,
      icon: "ri-chat-heart-line",
      color: "text-rose-600",
      bg: "bg-rose-100/50",
    },
  ];

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-50/50 min-h-screen animate-fade-in space-y-8 md:space-y-10">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">
            Hệ thống Feedback Online
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Chào mừng trở lại,{" "}
            <strong className="font-bold text-slate-700">Joseph Hieu!</strong>
          </p>
        </div>

        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-3 w-full md:w-auto">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
            Máy chủ: Đang hoạt động
          </span>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1.5">
                  {stat.label}
                </p>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {stat.value}
                </h3>
              </div>
              <div
                className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center`}
              >
                <i className={`${stat.icon} text-2xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Nội dung chính */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KHỐI BIỂU ĐỒ */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-20 -mt-20"></div>

          <div className="relative z-10 flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-800">
                Lưu lượng Feedback
              </h3>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
                7 ngày gần nhất
              </p>
            </div>
          </div>

          <div className="h-[250px] sm:h-[300px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chartData || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: "bold" }}
                  dy={10}
                />
                <YAxis hide domain={["dataMin - 2", "dataMax + 5"]} />
                <Tooltip
                  cursor={{
                    stroke: "#6366f1",
                    strokeWidth: 2,
                    strokeDasharray: "6 6",
                  }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [
                    `${value} feedbacks`,
                    "Lượng phản hồi",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  activeDot={{
                    r: 8,
                    stroke: "white",
                    strokeWidth: 3,
                    fill: "#6366f1",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* THAO TÁC NHANH */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-black text-slate-800 mb-6 flex items-center gap-3 text-lg">
            <div className="bg-yellow-100 text-yellow-600 p-2.5 rounded-full flex items-center justify-center">
              <i className="ri-flashlight-line text-lg"></i>
            </div>
            Lối tắt nhanh
          </h3>

          <div className="space-y-4 flex-1">
            <QuickActionButton
              icon="ri-add-circle-line"
              label="Tạo lớp học"
              color="text-blue-600"
              bg="bg-blue-50/50"
              onClick={() => navigate("/admin/classes/create")}
            />
            <QuickActionButton
              icon="ri-user-add-line"
              label="Thêm học viên"
              color="text-purple-600"
              bg="bg-purple-50/50"
              onClick={() => navigate("/admin/students/create")}
            />
            <QuickActionButton
              icon="ri-file-chart-line"
              label="Xuất báo cáo"
              color="text-green-600"
              bg="bg-green-50/50"
              onClick={() => navigate("/admin/export")}
            />
            <QuickActionButton
              icon="ri-shield-keyhole-line"
              label="Cài đặt hệ thống"
              color="text-rose-600"
              bg="bg-rose-50/50"
              onClick={() => navigate("/admin/clear")}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] px-2">
        <span>Feedback Online System</span>
        <span>Version 2026.1.0-beta</span>
      </div>
    </div>
  );
};

// Component con cho các nút bấm
const QuickActionButton = ({ icon, label, color, bg, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 ${bg} rounded-2xl hover:scale-[1.02] hover:shadow-inner transition-all group border border-slate-100`}
  >
    <div className={`${color} text-2xl w-10 flex justify-center`}>
      <i className={icon}></i>
    </div>
    <span className="text-sm font-bold text-slate-700 group-hover:translate-x-1 transition-transform tracking-tight">
      {label}
    </span>
  </button>
);

// Component Skeleton Loading
const DashboardSkeleton = () => (
  <div className="p-8 space-y-10 animate-pulse">
    <div className="h-12 bg-slate-200 rounded-xl w-1/4"></div>
    <div className="grid grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-slate-200 rounded-[2rem]"></div>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 h-80 bg-slate-200 rounded-[2.5rem]"></div>
      <div className="h-80 bg-slate-200 rounded-[2.5rem]"></div>
    </div>
  </div>
);

export default AdminDashboard;
