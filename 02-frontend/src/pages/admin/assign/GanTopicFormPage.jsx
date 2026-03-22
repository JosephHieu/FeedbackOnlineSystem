import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { classService } from "../../../services/classService";
import { trainerService } from "../../../services/trainerService";
import { topicService } from "../../../services/topicService";
import { ganTopicService } from "../../../services/ganTopicService";
import { FaCheckDouble, FaArrowLeft, FaSave } from "react-icons/fa";
import toast from "react-hot-toast";

const GanTopicFormPage = () => {
  const navigate = useNavigate();
  const [lops, setLops] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [topics, setTopics] = useState([]);

  const [formData, setFormData] = useState({
    maLop: "",
    maTrainer: "",
    danhSachMaTopic: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      classService.getAllLops(1, 100),
      trainerService.getAllTrainers(1, 100),
      topicService.getAllTopics(1, 100),
    ])
      .then(([resLop, resTrainer, resTopic]) => {
        // Log ra để cưng nhìn tận mắt cấu hình dữ liệu trong Console
        console.log("Dữ liệu Lớp:", resLop);
        console.log("Dữ liệu Trainer:", resTrainer);
        console.log("Dữ liệu Topic:", resTopic);

        // Cách lấy data an toàn: Thử lấy .data, nếu không có thì coi chính nó là array, nếu ko phải array thì rỗng
        const getArray = (res) => {
          if (!res) return [];
          if (Array.isArray(res)) return res; // Trường hợp trả về mảng trực tiếp
          if (res.data && Array.isArray(res.data)) return res.data; // Trường hợp bọc trong .data (PageResponse)
          return [];
        };

        setLops(getArray(resLop));
        setTrainers(getArray(resTrainer));
        setTopics(getArray(resTopic));
      })
      .catch((err) => {
        console.error("Lỗi load dữ liệu gán topic:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCheckboxChange = (topicId) => {
    setFormData((prev) => {
      const isSelected = prev.danhSachMaTopic.includes(topicId);
      const newList = isSelected
        ? prev.danhSachMaTopic.filter((id) => id !== topicId)
        : [...prev.danhSachMaTopic, topicId];
      return { ...prev, danhSachMaTopic: newList };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.danhSachMaTopic.length === 0) {
      return toast.error("Vui lòng tích chọn ít nhất 1 Topic cưng ơi!");
    }

    setLoading(true);
    try {
      await ganTopicService.assignTopics(formData);
      toast.success("Gán chủ đề thành công!");
      navigate("/admin/assign"); // Quay lại trang quản lý gán
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 animate-in slide-in-from-bottom-8 duration-700">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
      >
        <div className="bg-emerald-500 p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <FaCheckDouble size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Gán Topic cho Lớp
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/assign")}
            className="p-2 hover:bg-white/20 rounded-xl transition-all"
          >
            <FaArrowLeft size={20} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cột trái: Chọn Lớp & Trainer */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Lớp học
              </label>
              <select
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-50"
                value={formData.maLop}
                onChange={(e) =>
                  setFormData({ ...formData, maLop: e.target.value })
                }
              >
                <option value="">-- Chọn lớp --</option>
                {lops.map((l) => (
                  <option key={l.maLop} value={l.maLop}>
                    {l.tenLop}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Giảng viên (Trainer)
              </label>
              <select
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-50"
                value={formData.maTrainer}
                onChange={(e) =>
                  setFormData({ ...formData, maTrainer: e.target.value })
                }
              >
                <option value="">-- Chọn giảng viên --</option>
                {trainers.map((t) => (
                  <option key={t.maTrainer} value={t.maTrainer}>
                    {t.tenTrainer}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cột phải: Danh sách Topic với Checkbox */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Danh sách Topic (Chọn nhiều)
            </label>
            <div className="border border-slate-100 rounded-2xl h-[300px] overflow-y-auto bg-slate-50/30 p-2 space-y-1 hide-scrollbar">
              {topics.map((topic) => (
                <label
                  key={topic.maTopic}
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl cursor-pointer hover:border-emerald-300 transition-all group"
                >
                  <span className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                    {topic.tenTopic}
                  </span>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    checked={formData.danhSachMaTopic.includes(topic.maTopic)}
                    onChange={() => handleCheckboxChange(topic.maTopic)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full max-w-xs bg-emerald-500 text-white font-black py-4 rounded-2xl hover:bg-emerald-600 shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            <FaSave /> {loading ? "ĐANG XỬ LÝ..." : "GÁN TOPIC NGAY"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GanTopicFormPage;
