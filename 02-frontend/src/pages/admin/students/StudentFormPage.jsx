import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { studentService } from "../../../services/studentService";
import { classService } from "../../../services/classService";
import { FaSave, FaArrowLeft, FaUserPlus } from "react-icons/fa";
import toast from "react-hot-toast";

const StudentFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    tenHocVien: "",
    maLop: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Lấy danh sách lớp cho dropdown
        const classRes = await classService.getAllLops(1, 100);
        setClasses(classRes.data || []);

        // 2. Nếu là Edit, lấy thông tin học viên
        if (id) {
          const studentData = await studentService.getStudentById(id);
          setFormData({
            username: studentData.username,
            tenHocVien: studentData.tenHocVien,
            maLop: studentData.maLop,
          });
        }
      } catch (err) {
        toast.error("Lỗi tải dữ liệu" + (err.message || ""));
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await studentService.updateStudent(id, formData);
        toast.success("Cập nhật học viên thành công");
      } else {
        await studentService.createStudent(formData);
        toast.success("Thêm học viên thành công (Pass mặc định: 123456)");
      }
      navigate("/admin/students");
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaUserPlus /> {id ? "Cập nhật học viên" : "Thêm học viên mới"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Username (Account)
            </label>
            <input
              type="text"
              required
              disabled={!!id} // Không cho sửa username nếu là Edit
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 outline-none transition-all disabled:bg-slate-50"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Ví dụ: student01"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
              value={formData.tenHocVien}
              onChange={(e) =>
                setFormData({ ...formData, tenHocVien: e.target.value })
              }
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Lớp học
            </label>
            <select
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 outline-none bg-white transition-all"
              value={formData.maLop}
              onChange={(e) =>
                setFormData({ ...formData, maLop: e.target.value })
              }
            >
              <option value="">-- Chọn lớp --</option>
              {classes.map((c) => (
                <option key={c.maLop} value={c.maLop}>
                  {c.tenLop}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <FaSave /> {loading ? "Đang lưu..." : "Lưu dữ liệu"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/students")}
              className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <FaArrowLeft /> Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormPage;
