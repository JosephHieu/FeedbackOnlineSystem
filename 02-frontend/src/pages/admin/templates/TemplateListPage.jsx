import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import templateService from "../../../services/templateService";
import Swal from "sweetalert2";
import debounce from "lodash.debounce"; // Cưng nhớ: npm install lodash.debounce

const TemplateListPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Hàm gọi API (dùng useCallback để tránh render thừa)
  const fetchTemplates = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      // Gọi với size = 5 như cưng muốn
      const response = await templateService.getAllTemplates(page, 5, search);
      setTemplates(response.data || []);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      });
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates(1, "");
  }, [fetchTemplates]);

  // 2. Xử lý Search với Debounce (Đợi 500ms mới gọi API)
  const debouncedSearch = useCallback(
    debounce((nextValue) => {
      fetchTemplates(1, nextValue);
    }, 500),
    [],
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleToggleStatus = (id, currentStatus) => {
    const actionText = currentStatus ? "Khóa" : "Mở khóa";
    Swal.fire({
      title: `${actionText} mẫu này?`,
      text: currentStatus
        ? "Mẫu này sẽ ẩn khỏi danh sách khảo sát của học viên."
        : "Mẫu này sẽ hoạt động trở lại bình thường.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: currentStatus ? "#f59e0b" : "#10b981",
      confirmButtonText: `Đồng ý ${actionText}`,
      cancelButtonText: "Hủy",
      reverseButtons: true,
      border: "none",
      borderRadius: "20px",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await templateService.deleteTemplate(id);
          fetchTemplates(pagination.currentPage, searchTerm);
        } catch (error) {
          console.error("Lỗi:", error);
        }
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in p-2 md:p-0">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            Quản lý Template
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Tìm thấy {pagination.totalElements} mẫu khảo sát
          </p>
        </div>
        <Link
          to="/admin/templates/create"
          className="bg-emerald-500 text-white px-6 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-95 w-full md:w-auto"
        >
          <i className="ri-add-circle-fill text-xl"></i> Tạo mới mẫu
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="relative max-w-md">
        <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
        <input
          type="text"
          placeholder="Tìm tên mẫu khảo sát..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all shadow-sm"
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[11px] font-black tracking-widest bg-slate-50/50">
                <th className="py-5 px-6">STT</th>
                <th className="py-5 px-6">Thông tin Template</th>
                <th className="py-5 px-6 text-center hidden md:table-cell">
                  Số câu hỏi
                </th>
                <th className="py-5 px-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="py-8 px-6">
                      <div className="h-4 bg-slate-50 rounded-full w-3/4"></div>
                    </td>
                  </tr>
                ))
              ) : templates.length > 0 ? (
                templates.map((item, index) => (
                  <tr
                    key={item.maTemplate}
                    className={`transition-all group ${
                      !item.status
                        ? "bg-slate-50/50 opacity-60"
                        : "hover:bg-indigo-50/30"
                    }`}
                  >
                    <td className="py-6 px-6 font-bold text-slate-300 text-sm">
                      {String(
                        (pagination.currentPage - 1) * 5 + (index + 1),
                      ).padStart(2, "0")}
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex flex-col">
                        <span
                          className={`font-bold text-base ${!item.status ? "text-slate-400 line-through" : "text-slate-700"}`}
                        >
                          {item.tenTemplate}
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono mt-1 break-all md:break-normal">
                          {item.maTemplate}
                        </span>
                        {/* Mobile view only: Số câu hỏi */}
                        <span className="md:hidden mt-2 inline-flex">
                          <span className="bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded text-[10px] font-bold">
                            {item.danhSachCauHoi?.length || 0} câu hỏi
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center hidden md:table-cell">
                      <span
                        className={`px-4 py-2 rounded-xl font-black text-xs ${
                          !item.status
                            ? "bg-slate-200 text-slate-500"
                            : "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        {item.danhSachCauHoi?.length || 0}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <div className="flex justify-end items-center gap-1 md:gap-2">
                        <Link
                          to={`/admin/templates/edit/${item.maTemplate}`}
                          className="p-3 text-sky-500 hover:bg-sky-100/50 rounded-2xl transition-all"
                          title="Chỉnh sửa"
                        >
                          <i className="ri-edit-circle-fill text-2xl"></i>
                        </Link>
                        <button
                          onClick={() =>
                            handleToggleStatus(item.maTemplate, item.status)
                          }
                          className={`p-3 rounded-2xl transition-all ${
                            item.status
                              ? "text-amber-500 hover:bg-amber-50"
                              : "text-emerald-500 hover:bg-emerald-50"
                          }`}
                          title={item.status ? "Khóa" : "Mở khóa"}
                        >
                          <i
                            className={`${item.status ? "ri-lock-unlock-fill" : "ri-lock-fill"} text-2xl`}
                          ></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-32 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <i className="ri-search-2-line text-7xl mb-4"></i>
                      <p className="font-black text-xl">
                        Không tìm thấy mẫu nào!
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION SECTION */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 py-8 px-6 bg-slate-50/30 border-t border-slate-50">
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() =>
                  fetchTemplates(pagination.currentPage - 1, searchTerm)
                }
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 hover:bg-slate-100 disabled:opacity-30 transition-all shadow-sm"
              >
                <i className="ri-arrow-left-s-line text-2xl text-slate-600"></i>
              </button>

              <div className="flex gap-2">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchTemplates(i + 1, searchTerm)}
                    className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                      pagination.currentPage === i + 1
                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-110"
                        : "bg-white border border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-500"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() =>
                  fetchTemplates(pagination.currentPage + 1, searchTerm)
                }
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 hover:bg-slate-100 disabled:opacity-30 transition-all shadow-sm"
              >
                <i className="ri-arrow-right-s-line text-2xl text-slate-600"></i>
              </button>
            </div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Trang {pagination.currentPage} / {pagination.totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateListPage;
