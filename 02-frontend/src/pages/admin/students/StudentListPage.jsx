import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { studentService } from "../../../services/studentService";
import { classService } from "../../../services/classService";
import {
  FaPlus,
  FaFileUpload,
  FaSearch,
  FaUserEdit,
  FaUserSlash, // Đổi icon xóa thành UserSlash cho đúng nghiệp vụ vô hiệu hóa
  FaGraduationCap,
} from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import StudentImportModal from "./StudentImportModal";

const StudentListPage = () => {
  // --- LOGIC GHI NHỚ TRẠNG THÁI ---
  const [selectedLop, setSelectedLop] = useState(() => {
    return sessionStorage.getItem("lastSelectedLop") || "";
  });
  const [searchTerm, setSearchTerm] = useState(() => {
    return sessionStorage.getItem("lastSearchTerm") || "";
  });

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const navigate = useNavigate();

  // 1. Lấy danh sách lớp
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await classService.getAllLops(1, 100);
        const classList = res.data || [];
        setClasses(classList);

        // Nếu chưa có lớp nào được chọn trong session, thì chọn lớp đầu tiên
        if (
          classList.length > 0 &&
          !sessionStorage.getItem("lastSelectedLop")
        ) {
          const firstLopId = classList[0].maLop;
          setSelectedLop(firstLopId);
          sessionStorage.setItem("lastSelectedLop", firstLopId);
        }
      } catch (err) {
        toast.error("Không thể tải danh sách lớp");
      }
    };
    fetchClasses();
  }, []);

  // Lưu lựa chọn vào session khi thay đổi
  useEffect(() => {
    if (selectedLop) sessionStorage.setItem("lastSelectedLop", selectedLop);
  }, [selectedLop]);

  useEffect(() => {
    sessionStorage.setItem("lastSearchTerm", searchTerm);
  }, [searchTerm]);

  // 2. Hàm lấy danh sách học viên
  const fetchStudents = useCallback(async () => {
    if (!selectedLop) return;
    setLoading(true);
    try {
      const res = await studentService.getStudentsByLop(
        selectedLop,
        1,
        100,
        searchTerm,
      );
      setStudents(res.data || []);
    } catch (err) {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLop, searchTerm]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStudents();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [fetchStudents]);

  // 3. Xử lý vô hiệu hóa học viên
  const handleDelete = async (student) => {
    const result = await Swal.fire({
      title: "Vô hiệu hóa?",
      text: `Học viên ${student.tenHocVien} sẽ không thể đăng nhập thực hiện feedback.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
      customClass: {
        confirmButton: "rounded-xl px-6 py-2.5 font-bold",
        cancelButton: "rounded-xl px-6 py-2.5 font-bold",
      },
    });

    if (result.isConfirmed) {
      try {
        await studentService.toggleStatus(student.maHocVien);
        toast.success("Đã thay đổi trạng thái học viên");
        fetchStudents();
      } catch (err) {
        // Interceptor đã handle
      }
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-slate-500 text-sm font-medium">
            Danh sách học viên thuộc lớp đang chọn
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-sm"
          >
            <FaFileUpload /> Import Excel
          </button>
          <button
            onClick={() => navigate("/admin/students/create")}
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm"
          >
            <FaPlus /> Thêm học viên
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">
            Bộ lọc lớp học
          </label>
          <select
            value={selectedLop}
            onChange={(e) => setSelectedLop(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer font-bold text-slate-700"
          >
            <option value="">-- Chọn lớp học --</option>
            {classes.map((c) => (
              <option key={c.maLop} value={c.maLop}>
                {c.tenLop}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-[2]">
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">
            Tìm nhanh theo tên
          </label>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Nhập tên học viên cần tìm..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 border border-slate-100 rounded-2xl overflow-hidden flex flex-col min-h-0">
        <div className="overflow-auto flex-1 hide-scrollbar">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">
                  Học viên
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase hidden md:table-cell">
                  Tài khoản
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr
                    key={s.maHocVien}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">
                        {s.tenHocVien}
                      </div>
                      <div className="text-[10px] text-slate-400 md:hidden font-mono uppercase">
                        {s.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg font-black">
                        {s.username}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${s.status ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${s.status ? "bg-emerald-500" : "bg-rose-500"}`}
                        ></div>
                        {s.status ? "Hoạt động" : "Bị khóa"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() =>
                            navigate(`/admin/students/edit/${s.maHocVien}`)
                          }
                          className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
                          title="Sửa học viên"
                        >
                          <FaUserEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                          title="Vô hiệu hóa"
                        >
                          <FaUserSlash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StudentImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        maLop={selectedLop}
        tenLop={classes.find((c) => c.maLop === selectedLop)?.tenLop}
        onRefresh={fetchStudents}
      />
    </div>
  );
};

export default StudentListPage;
