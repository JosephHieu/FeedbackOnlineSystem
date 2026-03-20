import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { classService } from "../../../services/classService";
import { templateService } from "../../../services/templateService";
import Swal from "sweetalert2";
import { FaSave, FaArrowLeft } from "react-icons/fa";

const ClassFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State quản lý dữ liệu
  const [templates, setTemplates] = useState([]);
  const [formData, setFormData] = useState({ tenLop: "", maTemplate: "" });
  const [loading, setLoading] = useState(false);

  // useEffect khởi tạo dữ liệu
  useEffect(() => {
    const initData = async () => {
      try {
        // 1. Lấy danh sách Template (truyền size lớn để lấy hết cho dropdown)
        const tRes = await templateService.getAllTemplates(1, 100);
        // Sửa lỗi .map: tRes.data mới là mảng
        setTemplates(tRes?.data || []);

        // 2. Nếu là chế độ Edit (có id), lấy thông tin lớp cũ
        if (id) {
          const cRes = await classService.getLopById(id);
          // Lưu ý: Tùy vào cấu trúc Response của cưng, thường là cRes.data hoặc cRes trực tiếp
          const classData = cRes?.data || cRes;

          setFormData({
            tenLop: classData.tenLop || "",
            maTemplate: classData.maTemplate || "",
          });
        }
      } catch (err) {
        console.error("Lỗi khởi tạo Form:", err);
        Swal.fire("Lỗi", "Không thể tải dữ liệu ban đầu", "error");
      }
    };

    initData();
  }, [id]);

  // Xử lý gửi Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation cơ bản trước khi gửi
    if (!formData.maTemplate) {
      Swal.fire("Thông báo", "Vui lòng chọn một mẫu khảo sát", "info");
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await classService.updateLop(id, formData);
      } else {
        await classService.createLop(formData);
      }

      Swal.fire({
        title: "Thành công!",
        text: id ? "Cập nhật lớp thành công" : "Thêm lớp mới thành công",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/admin/classes");
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      Swal.fire(
        "Lỗi",
        err.response?.data?.message || "Vui lòng kiểm tra lại thông tin",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h2 className="text-xl font-bold flex items-center justify-center gap-2">
            {id ? "Cập nhật lớp học" : "Đăng ký lớp mới"}
          </h2>
          <p className="text-indigo-100 text-sm mt-1">
            Vui lòng điền đầy đủ các thông tin bên dưới
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Tên lớp học
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all placeholder:text-slate-300"
              value={formData.tenLop}
              onChange={(e) =>
                setFormData({ ...formData, tenLop: e.target.value })
              }
              placeholder="Ví dụ: Java Backend K25"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Mẫu khảo sát áp dụng
            </label>
            <div className="relative">
              <select
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none bg-slate-50 transition-all cursor-pointer appearance-none"
                value={formData.maTemplate}
                onChange={(e) =>
                  setFormData({ ...formData, maTemplate: e.target.value })
                }
              >
                <option value="">-- Chọn một mẫu khảo sát --</option>
                {templates && templates.length > 0 ? (
                  templates.map((t) => (
                    <option key={t.maTemplate} value={t.maTemplate}>
                      {t.tenTemplate}
                    </option>
                  ))
                ) : (
                  <option disabled>Đang tải dữ liệu...</option>
                )}
              </select>
              {/* Icon mũi tên cho select */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-50">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
            >
              <FaSave /> {loading ? "Đang xử lý..." : "Lưu dữ liệu"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/classes")}
              className="flex-1 bg-white text-slate-600 font-bold py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <FaArrowLeft /> Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassFormPage;
