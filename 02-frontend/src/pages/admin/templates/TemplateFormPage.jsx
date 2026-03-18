import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import templateService from "../../../services/templateService";
import toast from "react-hot-toast";

const TemplateFormPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Bước 1: Nhập tên, Bước 2: Nhập câu hỏi
  const [template, setTemplate] = useState({
    tenTemplate: "",
    danhSachCauHoi: [{ diemToiThieu: 1, diemToiDa: 5, tenCauHoi: "" }],
  });

  // Xử lý thêm câu hỏi mới (Nút Nhập tiếp)
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
    // Duyệt qua danh sách câu hỏi để kiểm tra
    for (let i = 0; i < template.danhSachCauHoi.length; i++) {
      const q = template.danhSachCauHoi[i];

      // 1. Kiểm tra nội dung câu hỏi (Dùng tên biến mới là tenCauHoi)
      // Thêm dấu ? trước .trim() để nếu nó undefined thì cũng không báo lỗi crash
      if (!q.tenCauHoi?.trim()) {
        toast.error(`Vui lòng nhập nội dung cho câu hỏi ${i + 1}`);
        return;
      }

      // 2. Kiểm tra logic điểm
      const min = parseInt(q.diemToiThieu);
      const max = parseInt(q.diemToiDa);

      if (isNaN(min) || isNaN(max)) {
        toast.error(`Câu hỏi ${i + 1}: Điểm phải là số cưng ơi!`);
        return;
      }

      if (min >= max) {
        toast.error(
          `Câu hỏi ${i + 1}: Điểm tối thiểu phải nhỏ hơn điểm tối đa!`,
        );
        return;
      }
    }

    // Nếu mọi thứ OK thì mới gửi đi
    try {
      await templateService.createTemplate(template);
      toast.success("Tạo mẫu feedback thành công!");
      navigate("/admin/templates");
    } catch (error) {
      // api.js sẽ tự hiện toast lỗi từ server
    }
  };

  return (
    <div className="space-y-6">
      {/* BƯỚC 1: NHẬP TÊN TEMPLATE */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <h2 className="text-xl font-bold mb-4">Tạo mới template</h2>
          <div className="flex flex-col gap-4">
            <label className="font-semibold">Tên template</label>
            <input
              type="text"
              className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="VD: FB2019"
              value={template.tenTemplate}
              onChange={(e) =>
                setTemplate({ ...template, tenTemplate: e.target.value })
              }
            />
            <div className="flex gap-2">
              <button
                onClick={() =>
                  template.tenTemplate
                    ? setStep(2)
                    : toast.error("Nhập tên đã cưng!")
                }
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
              >
                Tiếp theo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BƯỚC 2: NHẬP CÂU HỎI ĐỘNG */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-black text-indigo-600 uppercase">
              {template.tenTemplate}
            </h2>
          </div>

          {template.danhSachCauHoi.map((q, index) => (
            <div
              key={index}
              className="p-4 bg-slate-50 rounded-2xl border relative group animate-fadeIn"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400">
                    STT: {index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap">
                    Điểm tối thiểu:
                  </span>
                  <input
                    type="number"
                    className="w-20 p-2 border rounded-lg"
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
                <div className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap">
                    Điểm tối đa:
                  </span>
                  <input
                    type="number"
                    className="w-20 p-2 border rounded-lg"
                    value={q.diemToiDa}
                    onChange={(e) =>
                      handleQuestionChange(index, "diemToiDa", e.target.value)
                    }
                  />
                </div>
              </div>
              <textarea
                placeholder="Nhập nội dung câu hỏi..."
                className="w-full p-3 border rounded-xl outline-none focus:border-indigo-500"
                value={q.tenCauHoi}
                onChange={(e) =>
                  handleQuestionChange(index, "tenCauHoi", e.target.value)
                }
              />
              {template.danhSachCauHoi.length > 1 && (
                <button
                  onClick={() => removeQuestion(index)}
                  className="absolute top-4 right-4 text-rose-500 hover:bg-rose-50 p-2 rounded-full"
                >
                  <i className="ri-delete-bin-line text-xl"></i>
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-4 pt-4">
            <button
              onClick={addQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all"
            >
              <i className="ri-add-line"></i> Nhập tiếp
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
              <i className="ri-check-line"></i> Hoàn tất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateFormPage;
