import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { classService } from "../../../services/classService";
import { ganTopicService } from "../../../services/ganTopicService";
import { FaPlus, FaTrash, FaLink } from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const GanTopicListPage = () => {
  const navigate = useNavigate();
  const [lops, setLops] = useState([]);
  const [selectedLop, setSelectedLop] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Lấy danh sách lớp khi load trang
  useEffect(() => {
    classService
      .getAllLops(1, 100)
      .then((res) => {
        // res là cục result từ api.js, mảng nằm ở res.data
        if (res && res.data) {
          setLops(res.data);
        } else {
          setLops([]);
        }
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách lớp:", err);
        setLops([]);
      });
  }, []);

  // 2. Hàm lấy danh sách Topic đã gán (đưa ra ngoài để tái sử dụng)
  const fetchAssignments = useCallback(async (maLop) => {
    if (!maLop) return;
    setLoading(true);
    try {
      const data = await ganTopicService.getAssignmentsByClass(maLop);
      // Giả sử API này trả về mảng trực tiếp, nếu trả về PageResponse thì dùng data.data
      setAssignments(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách gán:", err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Tự động load bảng khi người dùng chọn Lớp ở Dropdown
  useEffect(() => {
    if (selectedLop) {
      fetchAssignments(selectedLop);
    } else {
      setAssignments([]);
    }
  }, [selectedLop, fetchAssignments]);

  const handleClearAll = async () => {
    if (!selectedLop) return;
    const result = await Swal.fire({
      title: "Xóa toàn bộ?",
      text: "Tất cả cấu hình gán của lớp này sẽ bị xóa sạch!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "Đồng ý, xóa hết",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await ganTopicService.clearAllByClass(selectedLop);
        toast.success("Đã dọn dẹp cấu hình lớp");
        fetchAssignments(selectedLop);
      } catch (err) {}
    }
  };

  const handleDeleteOne = async (id) => {
    const result = await Swal.fire({
      title: "Xóa dòng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        await ganTopicService.deleteAssignment(id);
        toast.success("Đã xóa bản ghi");
        fetchAssignments(selectedLop);
      } catch (err) {}
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500 rounded-2xl text-white shadow-lg shadow-rose-100">
            <FaLink size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              Quản lý gán Topic
            </h2>
            <p className="text-slate-400 text-xs font-bold">
              Kết nối Lớp - Trainer - Topic
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <select
            className="w-full sm:w-64 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500 transition-all cursor-pointer"
            value={selectedLop}
            onChange={(e) => setSelectedLop(e.target.value)}
          >
            <option value="">-- Chọn lớp học --</option>
            {lops.map((l) => (
              <option key={l.maLop} value={l.maLop}>
                {l.tenLop}
              </option>
            ))}
          </select>

          <button
            onClick={handleClearAll}
            disabled={!selectedLop || loading}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 disabled:opacity-30 transition-all active:scale-95"
          >
            Xóa hết
          </button>

          <button
            onClick={() => navigate("/admin/assign/create")}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <FaPlus size={12} /> Gán mới
          </button>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest w-20">
                STT
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Topic
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Trainer
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
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
                  Đang tải cấu hình...
                </td>
              </tr>
            ) : !selectedLop ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-20 text-center text-slate-400 italic font-medium"
                >
                  Vui lòng chọn một lớp để xem cấu hình...
                </td>
              </tr>
            ) : assignments.length > 0 ? (
              assignments.map((as, idx) => (
                <tr
                  key={as.maGanTopic}
                  className="hover:bg-slate-50/50 transition-all group"
                >
                  <td className="px-6 py-4 font-bold text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {as.tenTopic}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase">
                      {as.tenTrainer}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteOne(as.maGanTopic)}
                      className="p-2.5 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm shadow-rose-50"
                      title="Xóa gán"
                    >
                      <FaTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="py-20 text-center text-slate-400 italic font-medium"
                >
                  Lớp này chưa được gán chủ đề nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GanTopicListPage;
