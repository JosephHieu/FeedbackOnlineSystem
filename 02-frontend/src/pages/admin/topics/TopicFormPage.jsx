import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { topicService } from "../../../services/topicService";
import { FaSave, FaUndo, FaArrowLeft, FaTags } from "react-icons/fa";
import toast from "react-hot-toast";

const TopicFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialForm = { tenTopic: "" };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (id) {
      const fetchDetail = async () => {
        try {
          const data = await topicService.getTopicById(id);
          setFormData({ tenTopic: data.tenTopic });
        } catch (err) {
          navigate("/admin/topics");
        }
      };
      fetchDetail();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await topicService.updateTopic(id, formData);
        toast.success("Cập nhật chủ đề thành công");
      } else {
        await topicService.createTopic(formData);
        toast.success("Tạo chủ đề mới thành công");
      }
      navigate("/admin/topics");
    } catch (err) {
      // Interceptor đã hiện lỗi trùng tên (nếu có)
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!id) {
      setFormData(initialForm);
      toast.success("Đã làm mới form");
    } else {
      // Nếu đang sửa, reset về dữ liệu ban đầu từ API
      topicService
        .getTopicById(id)
        .then((data) => setFormData({ tenTopic: data.tenTopic }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden">
        {/* Header Form */}
        <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12">
            <FaTags size={150} />
          </div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <FaTags size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight uppercase">
                {id ? "Sửa Topic" : "Tạo mới Topic"}
              </h2>
              <p className="text-indigo-100 text-sm opacity-80 font-medium">
                Vui lòng nhập tên chủ đề khảo sát
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {id && (
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Mã Topic (Read-only)
              </label>
              <input
                type="text"
                disabled
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 font-mono text-sm"
                value={id}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">
              Tên Topic
            </label>
            <input
              type="text"
              required
              autoFocus
              className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
              value={formData.tenTopic}
              onChange={(e) =>
                setFormData({ ...formData, tenTopic: e.target.value })
              }
              placeholder="Ví dụ: Kỹ năng giảng dạy của giảng viên..."
            />
          </div>

          {/* Button Group - Responsive */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-50">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
            >
              <FaSave /> {loading ? "ĐANG XỬ LÝ..." : "HOÀN TẤT"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-rose-500 text-white font-black py-4 rounded-2xl hover:bg-rose-600 transition-all flex items-center justify-center gap-3 shadow-lg shadow-rose-100 active:scale-95"
            >
              <FaUndo /> RESET
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/topics")}
              className="flex-1 bg-amber-500 text-white font-black py-4 rounded-2xl hover:bg-amber-600 transition-all flex items-center justify-center gap-3 shadow-lg shadow-amber-100 active:scale-95"
            >
              <FaArrowLeft /> BACK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopicFormPage;
