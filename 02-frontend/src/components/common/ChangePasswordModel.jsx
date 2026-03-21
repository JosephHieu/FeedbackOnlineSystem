import React, { useState } from "react";
import { authService } from "../../services/authService";
import { FaLock, FaShieldAlt, FaTimes } from "react-icons/fa";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.changePassword(formData);
      // Nếu thành công (Interceptor đã hiện toast success), mình đóng modal và xóa form
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      onClose();
    } catch (err) {
      // Lỗi (sai pass cũ, ko khớp...) Interceptor của cưng đã hiện toast error rồi
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        {/* Header Modal */}
        <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-black flex items-center gap-2">
            <FaShieldAlt className="text-purple-400" /> Đổi mật khẩu
          </h3>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-all p-1"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              required
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-purple-50 outline-none transition-all font-bold"
              value={formData.oldPassword}
              onChange={(e) =>
                setFormData({ ...formData, oldPassword: e.target.value })
              }
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              required
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-purple-50 outline-none transition-all font-bold"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              placeholder="Tối thiểu 6 ký tự"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              required
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-purple-50 outline-none transition-all font-bold"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 rounded-2xl font-black text-white bg-slate-800 hover:bg-purple-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
