import React, { useState, useRef } from "react";
import { studentService } from "../../../services/studentService";
import {
  FaCloudUploadAlt,
  FaFileExcel,
  FaTimes,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

const StudentImportModal = ({ isOpen, onClose, maLop, tenLop, onRefresh }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".xlsx")) {
      setFile(selectedFile);
    } else {
      toast.error("Vui lòng chọn file định dạng .xlsx");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".xlsx")) {
      setFile(droppedFile);
    } else {
      toast.error("Chỉ chấp nhận file Excel (.xlsx)");
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Bạn chưa chọn file mà!");

    setLoading(true);
    try {
      await studentService.importExcel(file, maLop);
      toast.success(`Import thành công danh sách vào lớp ${tenLop}`);
      setFile(null);
      onRefresh(); // Load lại danh sách học viên ở trang chính
      onClose(); // Đóng modal
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-emerald-500 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FaFileExcel /> Import học viên theo file
            </h3>
            <p className="text-emerald-100 text-xs mt-1">
              Lớp áp dụng:{" "}
              <span className="font-black underline">{tenLop}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-emerald-600 p-2 rounded-full transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-8">
          {/* Hướng dẫn ngắn */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
            <FaInfoCircle className="text-amber-500 mt-1 flex-shrink-0" />
            <div className="text-xs text-amber-800 leading-relaxed">
              <p className="font-bold mb-1">Lưu ý cấu trúc file:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>
                  Cột A: <b>Username</b> (Mã sinh viên)
                </li>
                <li>
                  Cột B: <b>Họ và tên</b>
                </li>
                <li>Hệ thống sẽ tự bỏ qua dòng tiêu đề đầu tiên.</li>
              </ul>
            </div>
          </div>

          {/* Dropzone Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={`
              relative border-2 border-dashed rounded-3xl p-10 transition-all cursor-pointer flex flex-col items-center justify-center
              ${isDragging ? "border-emerald-500 bg-emerald-50 scale-[1.02]" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}
              ${file ? "border-emerald-400 bg-emerald-50/30" : ""}
            `}
          >
            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept=".xlsx"
              onChange={handleFileChange}
            />

            {!file ? (
              <>
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-500 mb-4">
                  <FaCloudUploadAlt size={32} />
                </div>
                <p className="text-slate-600 font-bold">
                  Kéo thả file Excel vào đây
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Hoặc nhấn để chọn từ máy tính
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center animate-bounce-short">
                <FaCheckCircle className="text-emerald-500 mb-3" size={40} />
                <p className="text-slate-700 font-bold text-center break-all px-4">
                  {file.name}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="mt-3 text-rose-500 text-xs font-bold hover:underline"
                >
                  Chọn file khác
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            <button
              onClick={onClose}
              className="py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
            >
              Hủy bỏ
            </button>
            <button
              disabled={!file || loading}
              onClick={handleUpload}
              className={`
                py-3 rounded-xl font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2
                ${!file || loading ? "bg-slate-300 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-100"}
              `}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Bắt đầu Import"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentImportModal;
