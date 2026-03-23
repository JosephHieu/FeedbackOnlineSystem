import React, { useState, useEffect } from "react";
import { classService } from "../../../services/classService";
import { feedbackService } from "../../../services/feedbackService";
import { ganTopicService } from "../../../services/ganTopicService";
import {
  FaUserClock,
  FaSearch,
  FaExclamationCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-toastify";

const PendingFeedbackPage = () => {
  const [lops, setLops] = useState([]);
  const [assignedTopics, setAssignedTopics] = useState([]);
  const [selectedLop, setSelectedLop] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- LOGIC PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Cưng muốn quá 5 thì chia trang nè

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pendingList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pendingList.length / itemsPerPage);

  useEffect(() => {
    classService.getAllLops(1, 100).then((res) => {
      setLops(res.data || []);
    });
  }, []);

  useEffect(() => {
    if (selectedLop) {
      setAssignedTopics([]);
      setSelectedTopic("");
      setPendingList([]); // Reset danh sách khi đổi lớp
      setCurrentPage(1); // Reset về trang 1

      ganTopicService
        .getTopicsByClassId(selectedLop)
        .then((res) => setAssignedTopics(res || []))
        .catch(() =>
          toast.error("Không lấy được danh sách chủ đề của lớp này"),
        );
    }
  }, [selectedLop]);

  const handleFetchPending = async () => {
    if (!selectedLop || !selectedTopic) return;
    setLoading(true);
    setCurrentPage(1); // Luôn về trang 1 khi bấm tìm mới
    try {
      const data = await feedbackService.getPendingFeedbackList(
        selectedLop,
        selectedTopic,
      );
      setPendingList(data);
    } catch (err) {
      setPendingList([]);
      toast.error("Lỗi khi tải danh sách học viên");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        {/* Header giữ nguyên */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-100">
            <FaUserClock size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Học viên chưa Feedback
            </h2>
            <p className="text-slate-400 text-sm font-bold">
              Quản lý và đôn đốc học viên hoàn thành khảo sát
            </p>
          </div>
        </div>

        {/* BỘ LỌC THÔNG MINH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Bước 1: Chọn Lớp học
            </label>
            <select
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-amber-500"
              value={selectedLop}
              onChange={(e) => setSelectedLop(e.target.value)}
            >
              <option value="">-- Danh sách lớp --</option>
              {lops.map((l) => (
                <option key={l.maLop} value={l.maLop}>
                  {l.tenLop}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Bước 2: Chọn Chủ đề đã gán
            </label>
            <select
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={!selectedLop || assignedTopics.length === 0}
            >
              <option value="">
                {selectedLop ? "-- Chọn chủ đề --" : "Hãy chọn lớp trước..."}
              </option>
              {assignedTopics.map((item) => (
                <option key={item.maTopic} value={item.maTopic}>
                  {item.tenTopic}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleFetchPending}
            disabled={!selectedLop || !selectedTopic || loading}
            className="h-[50px] bg-slate-900 text-white rounded-xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-30 active:scale-95 shadow-lg shadow-slate-200"
          >
            <FaSearch /> {loading ? "ĐANG TẢI..." : "XEM DANH SÁCH"}
          </button>
        </div>

        {/* BẢNG DANH SÁCH HỌC VIÊN */}
        <div className="mt-8 border border-slate-100 rounded-3xl overflow-hidden shadow-inner bg-white">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center w-20">
                  STT
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Học viên chưa nộp
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentItems.length > 0 ? (
                currentItems.map((item, idx) => (
                  <tr
                    key={item.maHocVien}
                    className="hover:bg-amber-50/30 transition-all group"
                  >
                    <td className="px-6 py-4 font-bold text-slate-400 text-center">
                      {indexOfFirstItem + idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-slate-700 group-hover:text-amber-600 transition-colors">
                        {item.tenHocVien}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        {item.tenLop}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        <FaExclamationCircle /> Chờ Feedback
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                      <FaUserClock size={48} className="opacity-20" />
                      <p className="font-bold italic">
                        Không có học viên nào nợ bài cho chủ đề này.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- UI PHÂN TRANG --- */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-sm font-bold text-slate-500">
              Hiển thị{" "}
              <span className="text-slate-800">{indexOfFirstItem + 1}</span> -{" "}
              <span className="text-slate-800">
                {Math.min(indexOfLastItem, pendingList.length)}
              </span>{" "}
              trên <span className="text-slate-800">{pendingList.length}</span>{" "}
              học viên
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <FaChevronLeft className="text-slate-600" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-black text-sm transition-all ${
                    currentPage === i + 1
                      ? "bg-slate-900 text-white shadow-lg"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <FaChevronRight className="text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingFeedbackPage;
