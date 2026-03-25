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
} from "react-icons/fa";
import toast from "react-hot-toast";

const ExportPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedLop, setSelectedLop] = useState("");
  const [topics, setTopics] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(null);

  useEffect(() => {
    classService
      .getAllLops(1, 100)
      .then((res) => {
        const arrayClasses = res?.data || [];

        setClasses(arrayClasses);

        console.log("Danh sách lớp đã nhận:", arrayClasses);
      })
      .catch((err) => {
        toast.error("Không thể tải danh sách lớp");
      });
  }, []);

  const handleClassChange = async (e) => {
    const maLop = e.target.value;
    setSelectedLop(maLop);
    setPreviewData([]);
    setTopics([]);

    if (maLop) {
      try {
        const res = await feedbackService.getTopicsByClass(maLop);

        const extractedTopics = Array.isArray(res)
          ? res.filter((item) => item && item.tenTopic)
          : [];

        setTopics(extractedTopics);
      } catch (err) {
        setTopics([]);
        console.error("Lỗi lấy topic:", err);
        toast.error("Không thể lấy danh sách Topic của lớp này");
      }
    }
  };

  const handlePreview = async (maTopic) => {
    setLoading(true);
    try {
      const res = await feedbackService.getExportPreview(selectedLop, maTopic);
      setPreviewData(res || []);
      if (res.length === 0) toast.error("Topic này chưa có phản hồi nào!");
      else toast.success("Đã cập nhật dữ liệu xem trước");
    } catch (err) {
      toast.error("Không thể lấy dữ liệu xem trước");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (maTopic, tenTopic) => {
    setIsExporting(maTopic);
    try {
      const blob = await feedbackService.exportFeedbackExcel(
        selectedLop,
        maTopic,
      );

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Feedback_${tenTopic}_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Xuất file thành công!");
    } catch (err) {
      toast.error("Lỗi khi xuất file Excel!");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <span className="p-3 bg-green-600 text-white rounded-2xl shadow-lg shadow-green-200">
                <FaFileExcel />
              </span>
              XUẤT KẾT QUẢ
            </h1>
            <p className="text-slate-400 font-medium mt-1 ml-1">
              Quản lý và trích xuất dữ liệu khảo sát hệ thống
            </p>
          </div>
        </div>

        {/* --- FILTER CARD --- */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-end gap-6">
          <div className="w-full md:w-80 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
              Chọn lớp học cần xuất
            </label>
            <div className="relative group">
              <select
                className="w-full appearance-none p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-indigo-500 transition-all outline-none cursor-pointer"
                onChange={handleClassChange}
                value={selectedLop}
              >
                <option value="">-- Click để chọn lớp --</option>
                {Array.isArray(classes) &&
                  classes.map((c) => (
                    <option key={c.maLop} value={c.maLop}>
                      {c.tenLop}
                    </option>
                  ))}
              </select>
              <FaChevronRight className="absolute right-5 top-5 text-slate-300 group-focus-within:rotate-90 transition-transform pointer-events-none" />
            </div>
          </div>

          {selectedLop && (
            <div className="flex-1 animate-in slide-in-from-left-4">
              <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl w-fit font-bold text-sm">
                <FaInfoCircle /> Tìm thấy {topics.length} Topic đã gán cho lớp
                này
              </div>
            </div>
          )}
        </div>

        {/* --- MAIN CONTENT --- */}
        {!selectedLop ? (
          <div className="py-20 flex flex-col items-center text-center space-y-4 opacity-60">
            <div className="w-40 h-40 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 text-6xl">
              <FaRegFolderOpen />
            </div>
            <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">
              Vui lòng chọn một lớp để bắt đầu
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT: TOPIC LIST */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                Danh sách Topic
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {topics.map((t) => (
                  <div
                    key={t.maTopic}
                    className="group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all relative overflow-hidden"
                  >
                    <div className="mb-4">
                      <h4 className="font-black text-slate-700 leading-tight group-hover:text-indigo-600 transition-colors">
                        {t.tenTopic}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                        ID: {t.maTopic.substring(0, 8)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePreview(t.maTopic)}
                        className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-black text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <FaEye /> XEM TRƯỚC
                      </button>
                      <button
                        onClick={() => handleExport(t.maTopic, t.tenTopic)}
                        disabled={isExporting === t.maTopic}
                        className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isExporting === t.maTopic ? (
                          "..."
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
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 mb-4">
                Bản xem trước dữ liệu
              </h3>
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[450px] relative">
                {loading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center font-black text-indigo-600 animate-pulse">
                    ĐANG TẢI DỮ LIỆU...
                  </div>
                )}

                {!previewData.length ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-200 p-10 mt-20">
                    <FaSearch className="text-7xl mb-4" />
                    <p className="font-bold text-slate-400">
                      Nhấn "XEM TRƯỚC" để kiểm tra nội dung
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white">
                          <th className="p-4 text-left text-[10px] uppercase tracking-widest">
                            Học viên
                          </th>
                          <th className="p-4 text-left text-[10px] uppercase tracking-widest">
                            Câu hỏi & Nhận xét
                          </th>
                          <th className="p-4 text-center text-[10px] uppercase tracking-widest">
                            Điểm
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {previewData.map((fb, idx) => (
                          <React.Fragment key={idx}>
                            {fb.chiTietFeedback.map((ct, i) => (
                              <tr
                                key={i}
                                className="hover:bg-slate-50/50 transition-colors"
                              >
                                <td className="p-4 align-top">
                                  <div className="font-black text-slate-700 text-sm">
                                    {fb.tenHocVien}
                                  </div>
                                </td>
                                <td className="p-4 max-w-xs">
                                  <div className="text-slate-600 font-bold text-sm mb-1 line-clamp-2">
                                    {ct.tenCauHoi}
                                  </div>
                                  <div className="text-slate-400 text-xs italic break-words">
                                    {ct.ghiChu || "---"}
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  <span
                                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-xs ${
                                      ct.diem <= 2
                                        ? "bg-rose-100 text-rose-600"
                                        : "bg-indigo-100 text-indigo-600"
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
