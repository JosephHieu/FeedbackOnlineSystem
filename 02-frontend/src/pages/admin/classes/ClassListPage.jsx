import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { classService } from "../../../services/classService";
import ClassRow from "./ClassRow";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const ClassListPage = () => {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  // 1. Sử dụng useCallback để ghi nhớ hàm, tránh tạo hàm mới mỗi lần render
  const fetchClasses = useCallback(async () => {
    try {
      // Thêm một cái flag để kiểm tra nếu component vẫn còn mount
      const res = await classService.getAllLops(currentPage, 5, searchTerm);

      // Chỉ set state nếu dữ liệu thực sự khác hoặc component hợp lệ
      setClasses(res.data || []);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error("Lỗi lấy danh sách lớp:", err);
    }
  }, [currentPage, searchTerm]); // Hàm này chỉ thay đổi khi page hoặc search thay đổi

  // 2. useEffect bây giờ chỉ đóng vai trò "kích hoạt"
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchClasses();
      }
    };

    loadData();

    // Cleanup function: tránh việc gọi setState khi component đã bị unmount
    return () => {
      isMounted = false;
    };
  }, [fetchClasses]);

  const handleToggleStatus = async (lop) => {
    const isDeactivating = lop.status;
    const result = await Swal.fire({
      title: isDeactivating ? "Vô hiệu hóa lớp?" : "Kích hoạt lại lớp?",
      text: isDeactivating
        ? "Lớp này sẽ không thể tham gia khảo sát!"
        : "Lớp sẽ hoạt động trở lại bình thường.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      confirmButtonColor: isDeactivating ? "#dc2626" : "#16a34a",
      borderRadius: "12px",
    });

    if (result.isConfirmed) {
      try {
        await classService.deleteLop(lop.maLop);
        fetchClasses();
        Swal.fire({
          title: "Thành công!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire("Lỗi!", "Hệ thống đang bận.", "error");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Quản lý lớp học
            </h1>
            <p className="text-slate-500 text-sm">
              Quản lý danh sách lớp và gán mẫu khảo sát
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/classes/create")}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <FaPlus /> Tạo lớp mới
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Search Bar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative max-w-sm">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên lớp..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4 text-center w-20">STT</th>
                  <th className="px-6 py-4">Mã ID</th>
                  <th className="px-6 py-4">Tên lớp học</th>
                  <th className="px-6 py-4">Mẫu Template</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.length > 0 ? (
                  classes.map((lop, index) => (
                    <ClassRow
                      key={lop.maLop}
                      lop={lop}
                      index={(currentPage - 1) * 5 + index + 1}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-slate-400 italic"
                    >
                      Không tìm thấy dữ liệu...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
              >
                <FaChevronLeft size={14} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassListPage;
