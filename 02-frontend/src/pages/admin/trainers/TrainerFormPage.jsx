import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { trainerService } from "../../../services/trainerService";
import { FaSave, FaArrowLeft, FaUserTie } from "react-icons/fa";
import toast from "react-hot-toast";

const TrainerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ account: "", tenTrainer: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      const fetchDetail = async () => {
        try {
          const data = await trainerService.getTrainerById(id);
          setFormData({ account: data.account, tenTrainer: data.tenTrainer });
        } catch (err) {
          navigate("/admin/trainers");
        }
      };
      fetchDetail();
    }
  }, [id, navigate]);

  const validateName = (name) => {
    const regex = /^[^0-9]*$/;
    if (!regex.test(name)) {
      setError("Họ tên không được chứa ký số!");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateName(formData.tenTrainer)) return;

    setLoading(true);
    try {
      if (id) {
        await trainerService.updateTrainer(id, formData);
        toast.success("Cập nhật giảng viên thành công");
      } else {
        await trainerService.createTrainer(formData);
        toast.success("Thêm giảng viên mới thành công");
      }
      navigate("/admin/trainers");
    } catch (err) {
      // api.js Interceptor sẽ tự hiện Toast lỗi từ Backend (như trùng Account)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <FaUserTie size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              {id ? "Sửa Trainer" : "Tạo mới Trainer"}
            </h2>
            <p className="text-indigo-100 text-xs opacity-80">
              Vui lòng điền đầy đủ thông tin giảng viên
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">
              Account Trainer
            </label>
            <input
              type="text"
              required
              disabled={!!id}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold disabled:bg-slate-50 disabled:text-slate-400"
              value={formData.account}
              onChange={(e) =>
                setFormData({ ...formData, account: e.target.value })
              }
              placeholder="Ví dụ: Trainer01"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">
              Họ và tên
            </label>
            <input
              type="text"
              required
              className={`w-full px-5 py-4 rounded-2xl border ${error ? "border-rose-300 ring-4 ring-rose-50" : "border-slate-200 focus:ring-4 focus:ring-indigo-50"} outline-none transition-all font-bold`}
              value={formData.tenTrainer}
              onChange={(e) => {
                setFormData({ ...formData, tenTrainer: e.target.value });
                validateName(e.target.value);
              }}
              placeholder="Nhập tên giảng viên..."
            />
            {error && (
              <p className="text-rose-500 text-xs font-bold ml-2 animate-bounce">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !!error}
              className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
            >
              <FaSave /> {loading ? "Đang lưu..." : "Hoàn tất"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/trainers")}
              className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <FaArrowLeft /> Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerFormPage;
