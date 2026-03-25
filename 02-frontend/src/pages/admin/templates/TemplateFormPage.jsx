import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Thêm useParams
import { templateService } from "../../../services/templateService";
import toast from "react-hot-toast";

const TemplateFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL (nếu có)
  const isEditMode = Boolean(id); // Kiểm tra xem đang Thêm hay Sửa

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState({
    tenTemplate: "",
    danhSachCauHoi: [{ diemToiThieu: 1, diemToiDa: 5, tenCauHoi: "" }],
  });

  // 1. Tự động load dữ liệu cũ nếu là chế độ Sửa
  useEffect(() => {
    if (isEditMode) {
      const fetchDetail = async () => {
        try {
          const data = await templateService.getTemplateById(id);
          // Đổ dữ liệu vào state, đảm bảo danhSachCauHoi không bị rỗng
          setTemplate({
            tenTemplate: data.tenTemplate || "",
            danhSachCauHoi:
              data.danhSachCauHoi?.length > 0
                ? data.danhSachCauHoi
                : [{ diemToiThieu: 1, diemToiDa: 5, tenCauHoi: "" }],
          });
          // Nếu là sửa, cho nhảy sang Bước 2 luôn cho tiện
          setStep(2);
        } catch (error) {
          console.error("Lỗi lấy chi tiết:", error);
          toast.error("Không tìm thấy dữ liệu mẫu này!");
          navigate("/admin/templates");
        }
      };
      fetchDetail();
    }
  }, [id, isEditMode, navigate]);

  // Xử lý thêm câu hỏi mới
  const addQuestion = () => {
    setTemplate({
      ...template,
      danhSachCauHoi: [
        ...template.danhSachCauHoi,
        { diemToiThieu: 1, diemToiDa: 5, tenCauHoi: "" },
      ],
    });
  };

  // Xử lý xóa câu hỏi
  const removeQuestion = (index) => {
    const newList = template.danhSachCauHoi.filter((_, i) => i !== index);
    setTemplate({ ...template, danhSachCauHoi: newList });
  };

  // Cập nhật giá trị từng ô input
  const handleQuestionChange = (index, field, value) => {
    const newList = [...template.danhSachCauHoi];
    newList[index][field] = value;
    setTemplate({ ...template, danhSachCauHoi: newList });
  };

  // Gửi dữ liệu về Backend (Nút Hoàn tất)
  const handleSubmit = async () => {
    // Validation
    if (!template.tenTemplate.trim()) {
      toast.error("Tên template không được để trống!");
      setStep(1);
      return;
    }

    for (let i = 0; i < template.danhSachCauHoi.length; i++) {
      const q = template.danhSachCauHoi[i];
      if (!q.tenCauHoi?.trim()) {
        toast.error(`Vui lòng nhập nội dung cho câu hỏi ${i + 1}`);
        return;
      }
      const min = parseInt(q.diemToiThieu);
      const max = parseInt(q.diemToiDa);
      if (isNaN(min) || isNaN(max) || min >= max) {
        toast.error(`Câu hỏi ${i + 1}: Logic điểm không hợp lệ!`);
        return;
      }
    }

    setLoading(true);
    try {
      if (isEditMode) {
        // GỌI API UPDATE (PUT)
        await templateService.updateTemplate(id, template);
        toast.success("Cập nhật mẫu thành công!");
      } else {
        // GỌI API CREATE (POST)
        await templateService.createTemplate(template);
        toast.success("Tạo mẫu mới thành công!");
      }
      navigate("/admin/templates");
    } catch (error) {
      // api.js tự hiện toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* TIÊU ĐỀ TRANG DỰA TRÊN CHẾ ĐỘ */}
      <div className="flex items-center gap-4 border-b pb-4">
        <button
          onClick={() => navigate("/admin/templates")}
          className="p-2 hover:bg-slate-100 rounded-full transition-all"
        >
          <i className="ri-arrow-left-line text-2xl"></i>
        </button>
        <h1 className="text-2xl font-black text-slate-800">
          {isEditMode ? "Chỉnh sửa mẫu feedback" : "Tạo mẫu feedback mới"}
        </h1>
      </div>

      {/* BƯỚC 1: NHẬP TÊN TEMPLATE */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm shadow-indigo-100/50">
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                Tên template
              </label>
              <input
                type="text"
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
                placeholder="VD: Khảo sát giảng viên 2026"
                value={template.tenTemplate}
                onChange={(e) =>
                  setTemplate({ ...template, tenTemplate: e.target.value })
                }
              />
            </div>
            <button
              onClick={() =>
                template.tenTemplate
                  ? setStep(2)
                  : toast.error("Bạn chưa nhập tên!")
              }
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
            >
              Tiếp theo <i className="ri-arrow-right-line ml-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* BƯỚC 2: NHẬP CÂU HỎI */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-indigo-50 p-4 rounded-2xl flex justify-between items-center">
            <span className="font-bold text-indigo-600">
              Mẫu: {template.tenTemplate}
            </span>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-indigo-400 underline uppercase"
            >
              Đổi tên
            </button>
          </div>

          {template.danhSachCauHoi.map((q, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm relative group transition-all hover:border-indigo-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center font-black">
                    {index + 1}
                  </span>
                  <span className="font-bold text-slate-400 uppercase text-xs">
                    Câu hỏi
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase ml-2">
                    Min score
                  </span>
                  <input
                    type="number"
                    className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold"
                    value={q.diemToiThieu}
                    onChange={(e) =>
                      handleQuestionChange(
                        index,
                        "diemToiThieu",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase ml-2">
                    Max score
                  </span>
                  <input
                    type="number"
                    className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold"
                    value={q.diemToiDa}
                    onChange={(e) =>
                      handleQuestionChange(index, "diemToiDa", e.target.value)
                    }
                  />
                </div>
              </div>
              <textarea
                placeholder="Nội dung câu hỏi khảo sát là gì nào..."
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium min-h-[100px]"
                value={q.tenCauHoi}
                onChange={(e) =>
                  handleQuestionChange(index, "tenCauHoi", e.target.value)
                }
              />
              {template.danhSachCauHoi.length > 1 && (
                <button
                  onClick={() => removeQuestion(index)}
                  className="absolute -top-2 -right-2 bg-white text-rose-500 shadow-md p-2 rounded-full hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <i className="ri-delete-bin-line text-lg"></i>
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-4 pt-4 sticky bottom-6">
            <button
              onClick={addQuestion}
              className="flex-1 py-4 bg-white border-2 border-dashed border-emerald-500 text-emerald-600 rounded-2xl font-black hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
            >
              <i className="ri-add-circle-fill text-xl"></i> Nhập câu tiếp
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <i className="ri-save-3-fill text-xl"></i>{" "}
                  {isEditMode ? "Cập nhật mẫu" : "Lưu template"}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateFormPage;
