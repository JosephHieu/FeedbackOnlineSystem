import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import templateService from "../../../services/templateService";
import Swal from "sweetalert2";

const TemplateListPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    fetchTemplates(1); // Mặc định load trang 1
  }, []);

  const fetchTemplates = async (page) => {
    setLoading(true);
    try {
      // Gọi API phân trang
      const response = await templateService.getAllTemplates(page, 5);

      // VÌ Backend trả về PageResponse, dữ liệu nằm trong response.data
      setTemplates(response.data || []);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  // Đổi tên từ handleDelete sang handleToggleStatus cho đúng ý đồ "Ổ khóa"
  const handleToggleStatus = (id, currentStatus) => {
    const actionText = currentStatus ? "Khóa" : "Mở khóa";

    Swal.fire({
      title: `${actionText} mẫu này?`,
      text: currentStatus
        ? "Mẫu này sẽ không hiển thị cho người dùng nữa!"
        : "Mẫu này sẽ hoạt động trở lại bình thường.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: currentStatus ? "#f59e0b" : "#10b981",
      confirmButtonText: `Đồng ý ${actionText}`,
      cancelButtonText: "Hủy",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await templateService.deleteTemplate(id);
          fetchTemplates(pagination.currentPage); // Load lại trang hiện tại
        } catch (error) {
          console.error("Lỗi thay đổi trạng thái:", error);
        }
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-700">
      {/* 1. Header trang */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Quản lý Template
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Hiện có {pagination.totalElements} mẫu trong hệ thống
          </p>
        </div>
        <Link
          to="/admin/templates/create"
          className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100 active:scale-95"
        >
          <i className="ri-add-circle-fill text-xl"></i> Tạo mới template
        </Link>
      </div>

      {/* 2. Container Bảng */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[11px] font-black tracking-widest">
                <th className="py-4 px-4">STT</th>
                <th className="py-4 px-4">Tên template</th>
                <th className="py-4 px-4 text-center">Số câu hỏi</th>
                <th className="py-4 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="py-6 px-4">
                      <div className="h-6 bg-slate-50 rounded-lg w-full"></div>
                    </td>
                  </tr>
                ))
              ) : templates.length > 0 ? (
                templates.map((item, index) => (
                  <tr
                    key={item.maTemplate}
                    className={`transition-colors group ${!item.status ? "opacity-60 bg-slate-50/30" : "hover:bg-slate-50/50"}`}
                  >
                    <td className="py-5 px-4 font-bold text-slate-400 text-sm">
                      {String(
                        (pagination.currentPage - 1) * 10 + (index + 1),
                      ).padStart(2, "0")}
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${!item.status ? "text-slate-400 line-through" : "text-slate-700"}`}
                        >
                          {item.tenTemplate}
                        </span>
                        {!item.status && (
                          <span className="text-[9px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-black uppercase">
                            Đã khóa
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-300 font-medium uppercase tracking-tighter">
                        {item.maTemplate}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-xl font-black text-xs ${!item.status ? "bg-slate-100 text-slate-400" : "bg-indigo-50 text-indigo-600"}`}
                      >
                        {item.danhSachCauHoi?.length || 0}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-right space-x-1">
                      <Link
                        to={`/admin/templates/edit/${item.maTemplate}`}
                        className="inline-flex p-2.5 text-sky-500 hover:bg-sky-50 rounded-xl transition-all"
                        title="Chỉnh sửa"
                      >
                        <i className="ri-edit-circle-fill text-xl"></i>
                      </Link>

                      {/* NÚT Ổ KHÓA THAY THẾ CHO THÙNG RÁC */}
                      <button
                        onClick={() =>
                          handleToggleStatus(item.maTemplate, item.status)
                        }
                        className={`p-2.5 rounded-xl transition-all ${item.status ? "text-amber-500 hover:bg-amber-50" : "text-emerald-500 hover:bg-emerald-50"}`}
                        title={item.status ? "Khóa mẫu" : "Mở khóa mẫu"}
                      >
                        <i
                          className={`${item.status ? "ri-lock-unlock-fill" : "ri-lock-fill"} text-xl`}
                        ></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-20 text-center text-slate-300 font-bold"
                  >
                    Không tìm thấy dữ liệu nào...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 3. THANH PHÂN TRANG (PAGINATION) */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-slate-50">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => fetchTemplates(pagination.currentPage - 1)}
              className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-all"
            >
              <i className="ri-arrow-left-s-line text-xl"></i>
            </button>

            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchTemplates(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold transition-all ${
                  pagination.currentPage === i + 1
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => fetchTemplates(pagination.currentPage + 1)}
              className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-all"
            >
              <i className="ri-arrow-right-s-line text-xl"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateListPage;
