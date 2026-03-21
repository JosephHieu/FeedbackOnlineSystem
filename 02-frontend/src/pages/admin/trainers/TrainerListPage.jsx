import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { trainerService } from "../../../services/trainerService";
import {
  FaPlus,
  FaSearch,
  FaUserEdit,
  FaUserSlash,
  FaChevronLeft,
  FaChevronRight,
  FaUserTie,
} from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const TrainerListPage = () => {
  const navigate = useNavigate();

  // Khởi tạo state từ sessionStorage để tránh mất dữ liệu khi reload
  const [searchTerm, setSearchTerm] = useState(
    () => sessionStorage.getItem("trainerSearch") || "",
  );
  const [currentPage, setCurrentPage] = useState(
    () => Number(sessionStorage.getItem("trainerPage")) || 1,
  );

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await trainerService.getAllTrainers(
        currentPage,
        pageSize,
        searchTerm,
      );
      setTrainers(res.data || []);
      setTotalPages(res.totalPages || 0);

      // Lưu lại trạng thái hiện tại
      sessionStorage.setItem("trainerSearch", searchTerm);
      sessionStorage.setItem("trainerPage", currentPage);
    } catch (err) {
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, pageSize]);

  useEffect(() => {
    const delayDebounce = setTimeout(fetchTrainers, 400);
    return () => clearTimeout(delayDebounce);
  }, [fetchTrainers]);

  const handleToggleStatus = async (trainer) => {
    const result = await Swal.fire({
      title: trainer.status ? "Vô hiệu hóa?" : "Kích hoạt lại?",
      text: `Bạn có chắc chắn muốn thay đổi trạng thái của ${trainer.tenTrainer}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: trainer.status ? "#ef4444" : "#10b981",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await trainerService.toggleStatus(trainer.maTrainer);
        toast.success("Cập nhật trạng thái thành công");
        fetchTrainers();
      } catch (err) {}
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo Account hoặc Tên giảng viên..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset về trang 1 khi search
            }}
          />
        </div>
        <button
          onClick={() => navigate("/admin/trainers/create")}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <FaPlus /> Thêm Trainer
        </button>
      </div>

      {/* Table Section - Nở rộng tối đa */}
      <div className="flex-1 border border-slate-100 rounded-2xl overflow-hidden flex flex-col bg-white shadow-sm">
        <div className="overflow-auto flex-1 hide-scrollbar">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Account (ID)
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Tên giảng viên
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-center">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : trainers.length > 0 ? (
                trainers.map((t) => (
                  <tr
                    key={t.maTrainer}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-mono font-bold">
                        {t.account}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                        {t.tenTrainer}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${t.status ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${t.status ? "bg-emerald-500" : "bg-rose-500"}`}
                        ></div>
                        {t.status ? "Hoạt động" : "Bị khóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/trainers/edit/${t.maTrainer}`)
                          }
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Chỉnh sửa"
                        >
                          <FaUserEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(t)}
                          className={`p-2 rounded-lg transition-all ${t.status ? "text-rose-500 hover:bg-rose-50" : "text-emerald-500 hover:bg-emerald-50"}`}
                          title={t.status ? "Xóa mềm" : "Khôi phục"}
                        >
                          <FaUserSlash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-20 text-center text-slate-400 font-medium"
                  >
                    Không tìm thấy giảng viên nào...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <span className="text-xs text-slate-500">
              Trang {currentPage} / {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-lg border bg-white disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                <FaChevronLeft size={12} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-white border hover:border-indigo-300"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-lg border bg-white disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerListPage;
