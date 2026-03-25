import React, { useState, useEffect } from "react";
import { feedbackService } from "../../services/feedbackService";
import { classService } from "../../services/classService";
import {
  FaFileExcel,
  FaEye,
  FaSearch,
  FaCloudDownloadAlt,
  FaRegFolderOpen,
  FaInfoCircle,
  FaChevronRight,
  FaFileArchive,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";

const ExportPage = () => {
  // Khởi tạo state từ localStorage nếu có
  const [classes, setClasses] = useState([]);
  const [selectedLop, setSelectedLop] = useState(
    () => localStorage.getItem("export_selectedLop") || "",
  );
  const [topics, setTopics] = useState([]);
  const [previewData, setPreviewData] = useState(() => {
    const saved = localStorage.getItem("export_previewData");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(null);
  const [isExportingAll, setIsExportingAll] = useState(false);

  // 1. Tải danh sách lớp (Chỉ chạy 1 lần khi mount)
  useEffect(() => {
    classService
      .getAllLops(1, 100)
      .then((res) => setClasses(res?.data || []))
      .catch(() => toast.error("Không thể tải danh sách lớp"));
  }, []);

  // 2. Tự động tải danh sách Topic khi selectedLop thay đổi (Hỗ trợ reload)
  useEffect(() => {
    if (selectedLop) {
      localStorage.setItem("export_selectedLop", selectedLop);
      fetchTopics(selectedLop);
    } else {
      localStorage.removeItem("export_selectedLop");
      localStorage.removeItem("export_previewData");
      setTopics([]);
      setPreviewData([]);
    }
  }, [selectedLop]);

  // 3. Lưu previewData vào localStorage mỗi khi nó thay đổi
  useEffect(() => {
    localStorage.setItem("export_previewData", JSON.stringify(previewData));
  }, [previewData]);

  const fetchTopics = async (maLop) => {
    try {
      const res = await feedbackService.getTopicsByClass(maLop);
      const extractedTopics = Array.isArray(res)
        ? res.filter((t) => t && t.tenTopic)
        : [];
      setTopics(extractedTopics);
    } catch (err) {
      console.error("Lỗi tải topic");
    }
  };

  const handleClassChange = (e) => {
    const maLop = e.target.value;
    setSelectedLop(maLop);
    setPreviewData([]); // Reset preview khi đổi lớp mới hoàn toàn
  };

  const handlePreview = async (maTopic) => {
    setLoading(true);
    try {
      const res = await feedbackService.getExportPreview(selectedLop, maTopic);
      const data = res || [];
      setPreviewData(data);
      data.length === 0
        ? toast.error("Chưa có phản hồi cho Topic này")
        : toast.success("Đã tải dữ liệu xem trước");
    } catch (err) {
      toast.error("Lỗi tải dữ liệu xem trước");
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = (blob, fileName) => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExportSingle = async (maTopic, tenTopic) => {
    setIsExporting(maTopic);
    try {
      const blob = await feedbackService.exportFeedbackExcel(
        selectedLop,
        maTopic,
      );
      downloadBlob(
        blob,
        `Feedback_${tenTopic}_${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`,
      );
      toast.success("Đã tải file thành công!");
    } catch (err) {
      toast.error("Lỗi khi xuất file Excel");
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportAllClass = async () => {
    setIsExportingAll(true);
    const loadId = toast.loading("Đang khởi tạo báo cáo tổng hợp...");
    try {
      const blob =
        await feedbackService.exportAllClassFeedbackExcel(selectedLop);
      downloadBlob(blob, `Bao_Cao_Tong_Hop_Lop_${new Date().getTime()}.xlsx`);
      toast.success("Đã xuất báo cáo tổng hợp!", { id: loadId });
    } catch (err) {
      toast.error("Lỗi khi xuất báo cáo tổng hợp", { id: loadId });
    } finally {
      setIsExportingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-4">
              <span className="p-4 bg-green-600 text-white rounded-3xl shadow-xl shadow-green-200">
                <FaFileExcel />
              </span>
              XUẤT BÁO CÁO
            </h1>
            <p className="text-slate-400 font-medium mt-2 ml-1">
              Dữ liệu được tự động lưu trữ để tránh mất mát khi tải lại trang
            </p>
          </div>

          {selectedLop && (
            <button
              onClick={handleExportAllClass}
              disabled={isExportingAll}
              className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {isExportingAll ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaFileArchive className="text-xl" />
              )}
              XUẤT TỔNG HỢP TOÀN BỘ LỚP
            </button>
          )}
        </div>

        {/* --- FILTER SECTION --- */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-end gap-8">
          <div className="w-full md:w-96 space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
              Lớp học mục tiêu
            </label>
            <div className="relative group">
              <select
                className="w-full appearance-none p-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-indigo-500 transition-all outline-none cursor-pointer"
                onChange={handleClassChange}
                value={selectedLop}
              >
                <option value="">-- Chọn lớp học --</option>
                {classes.map((c) => (
                  <option key={c.maLop} value={c.maLop}>
                    {c.tenLop}
                  </option>
                ))}
              </select>
              <FaChevronRight className="absolute right-6 top-6 text-slate-300 group-focus-within:rotate-90 transition-transform" />
            </div>
          </div>

          {selectedLop && (
            <div className="flex-1 pb-2 animate-in slide-in-from-left-5">
              <div className="inline-flex items-center gap-3 text-indigo-600 bg-indigo-50/50 px-5 py-3 rounded-2xl font-bold text-sm border border-indigo-100">
                <FaInfoCircle /> Đang quản lý {topics.length} chủ đề
              </div>
            </div>
          )}
        </div>

        {/* --- MAIN CONTENT --- */}
        {!selectedLop ? (
          <div className="py-32 flex flex-col items-center text-center space-y-6 opacity-40">
            <div className="w-48 h-48 bg-slate-100 rounded-[3rem] flex items-center justify-center text-slate-300 text-7xl">
              <FaRegFolderOpen />
            </div>
            <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">
              Vui lòng chọn lớp để truy xuất
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT: TOPIC LIST */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 mb-4">
                Danh sách chủ đề
              </h3>
              <div className="space-y-4 max-h-[650px] overflow-y-auto pr-3 custom-scrollbar">
                {topics.map((t) => (
                  <div
                    key={t.maTopic}
                    className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-300 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="mb-6">
                      <h4 className="font-black text-slate-700 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                        {t.tenTopic}
                      </h4>
                      <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-tighter">
                        ID: {t.maTopic.substring(0, 8)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePreview(t.maTopic)}
                        className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-black text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <FaEye /> XEM TRƯỚC
                      </button>
                      <button
                        onClick={() =>
                          handleExportSingle(t.maTopic, t.tenTopic)
                        }
                        disabled={isExporting === t.maTopic}
                        className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isExporting === t.maTopic ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <>
                            <FaCloudDownloadAlt /> XUẤT FILE
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: PREVIEW TABLE */}
            <div className="lg:col-span-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 mb-4">
                Dữ liệu chi tiết
              </h3>
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] relative">
                {loading && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-4 animate-in fade-in">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-black text-indigo-600 tracking-widest text-sm">
                      ĐANG TRÍCH XUẤT...
                    </span>
                  </div>
                )}

                {!previewData.length ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-200 p-20 mt-10">
                    <FaSearch className="text-8xl mb-6 opacity-20" />
                    <p className="font-bold text-slate-400 max-w-xs text-center leading-relaxed">
                      Chọn một Topic và nhấn "XEM TRƯỚC" để kiểm tra kết quả
                      đánh giá
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white">
                          <th className="p-5 text-left text-[10px] font-black uppercase tracking-widest">
                            Học viên
                          </th>
                          <th className="p-5 text-left text-[10px] font-black uppercase tracking-widest border-l border-slate-800">
                            Câu hỏi & Nhận xét
                          </th>
                          <th className="p-5 text-center text-[10px] font-black uppercase tracking-widest border-l border-slate-800">
                            Điểm
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewData.map((fb, idx) => (
                          <React.Fragment key={idx}>
                            {fb.chiTietFeedback.map((ct, i) => (
                              <tr
                                key={i}
                                className="hover:bg-slate-50/80 transition-colors group"
                              >
                                <td className="p-5 align-top border-l-4 border-transparent hover:border-indigo-500">
                                  <div className="font-black text-slate-700 text-sm">
                                    {fb.tenHocVien}
                                  </div>
                                </td>
                                <td className="p-5 max-w-sm">
                                  <div className="text-slate-600 font-bold text-sm mb-2 leading-snug">
                                    {ct.tenCauHoi}
                                  </div>
                                  <div className="bg-slate-50 p-3 rounded-xl text-slate-400 text-xs italic border border-slate-100 group-hover:bg-white transition-colors">
                                    {ct.ghiChu ||
                                      "Học viên không để lại nhận xét"}
                                  </div>
                                </td>
                                <td className="p-5 text-center">
                                  <span
                                    className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl font-black text-sm shadow-sm ${
                                      ct.diem <= 2
                                        ? "bg-rose-50 text-rose-600 border border-rose-100"
                                        : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                                    }`}
                                  >
                                    {ct.diem}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportPage;
