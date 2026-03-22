import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { topicService } from "../../../services/topicService";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrashAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTags,
} from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const TopicListPage = () => {
  const navigate = useNavigate();

  // Khởi tạo state từ sessionStorage để không mất dữ liệu khi F5
  const [searchTerm, setSearchTerm] = useState(
    () => sessionStorage.getItem("topicSearch") || "",
  );
  const [currentPage, setCurrentPage] = useState(
    () => Number(sessionStorage.getItem("topicPage")) || 1,
  );

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await topicService.getAllTopics(
        currentPage,
        pageSize,
        searchTerm,
      );
      setTopics(res.data || []);
      setTotalPages(res.totalPages || 0);

      // Lưu vết trạng thái
      sessionStorage.setItem("topicSearch", searchTerm);
      sessionStorage.setItem("topicPage", currentPage);
    } catch (err) {
      setTopics([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, pageSize]);

  useEffect(() => {
    const delayDebounce = setTimeout(fetchTopics, 400);
    return () => clearTimeout(delayDebounce);
  }, [fetchTopics]);

  const handleToggleStatus = async (topic) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: `Chủ đề "${topic.tenTopic}" sẽ bị chuyển vào trạng thái ngưng hoạt động!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Đồng ý xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await topicService.toggleStatus(topic.maTopic);
        toast.success("Đã thay đổi trạng thái chủ đề");
        fetchTopics();
      } catch (err) {}
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
            <FaTags size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Quản lý Topic</h2>
            <p className="text-slate-500 text-xs font-medium">
              Danh sách các chủ đề khảo sát hệ thống
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên topic..."
              className="pl-11 pr-4 py-2.5 w-full sm:w-64 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button
            onClick={() => navigate("/admin/topics/create")}
            className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-95"
          >
            <FaPlus size={14} /> Tạo mới topic
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col flex-1">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest w-20">
                  STT
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  Tên Topic
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-20 text-center text-indigo-500 font-bold animate-pulse"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : topics.length > 0 ? (
                topics.map((t, index) => (
                  <tr
                    key={t.maTopic}
                    className="group hover:bg-slate-50/50 transition-all"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-400">
                        {(currentPage - 1) * pageSize + index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                        {t.tenTopic}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${t.status ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}
                      >
                        {t.status ? "Hoạt động" : "Tạm ngưng"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/topics/edit/${t.maTopic}`)
                          }
                          className="p-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-600 hover:text-white transition-all shadow-sm"
                          title="Sửa topic"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(t)}
                          className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          title="Xóa mềm"
                        >
                          <FaTrashAlt size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-20 text-center text-slate-400 font-medium italic"
                  >
                    Danh sách trống...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-500">
              Trang {currentPage} / {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:border-indigo-500 transition-all"
              >
                <FaChevronLeft size={10} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:border-indigo-500 transition-all"
              >
                <FaChevronRight size={10} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicListPage;
