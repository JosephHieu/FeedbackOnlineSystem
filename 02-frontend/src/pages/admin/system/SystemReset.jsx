// src/pages/admin/SystemReset.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { resetSystemService } from "./../../../services/adminService";

const SystemReset = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // State cho hộp thoại xác nhận thứ 2

  // 1. Hàm xử lý khi bấm nút Reset ban đầu
  const handleInitiateReset = (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu xác nhận.");
      return;
    }
    // Hiện hộp thoại xác nhận chuyên nghiệp thay vì confirm() mặc định
    setShowConfirm(true);
  };

  // 2. Hàm xử lý thực tế khi đã xác nhận lần 2
  const handleConfirmReset = async () => {
    setShowConfirm(false); // Đóng modal xác nhận
    setIsLoading(true);

    try {
      // Gọi Service
      const result = await resetSystemService(password);

      // Chú ý: api.js Interceptor của bạn đã toast.success(data.message) rồi,
      // nên ở đây ta chỉ cần xử lý logic sau thành công.

      // Hiển thị thêm chi tiết dữ liệu đã xóa (tùy chọn)
      console.log("Chi tiết reset:", result);

      // Xóa input password
      setPassword("");
    } catch (error) {
      // Lỗi (sai mật khẩu, lỗi server) đã được api.js Interceptor
      // bắt và toast.error() rồi. Ta không cần làm gì thêm ở đây.
      console.error("Reset system failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Container chính: Responsive padding
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Tiêu đề trang */}
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Cài đặt Hệ thống
        </h1>
        <p className="text-gray-600 mt-1">
          Quản lý các thiết lập nâng cao và bảo mật.
        </p>
      </div>

      {/* Card Reset: Responsive width & Layout */}
      <div className="max-w-4xl mx-auto bg-white p-5 md:p-8 rounded-xl shadow-md border border-gray-100">
        {/* Vùng Cảnh Báo (Danger Zone) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-red-200 bg-red-50 p-5 rounded-lg mb-8">
          <div className="flex-shrink-0 bg-red-100 p-3 rounded-full text-red-600">
            {/* Icon cảnh báo (SVG hoặc FontAwesome) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-800">
              Vùng Nguy Hiểm: Reset Toàn Bộ Dữ Liệu
            </h2>
            <p className="text-red-700 mt-1 text-sm md:text-base">
              Hành động này sẽ{" "}
              <strong className="font-bold">xóa vĩnh viễn</strong> toàn bộ dữ
              liệu khảo sát, phản hồi, và lịch sử phân quyền. Hành động này{" "}
              <strong className="font-bold">không thể hoàn tác</strong>. Vui
              lòng suy nghĩ kỹ trước khi thực hiện.
            </p>
          </div>
        </div>

        {/* Form Nhập Mật Khẩu */}
        <form onSubmit={handleInitiateReset} className="space-y-6">
          <div className="max-w-md">
            <label
              htmlFor="adminPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Xác nhận mật khẩu Admin
            </label>
            <input
              id="adminPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu của bạn để xác nhận"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 transition"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Bạn cần nhập mật khẩu đăng nhập hiện tại để xác thực hành động
              này.
            </p>
          </div>

          {/* Nút bấm Responsive */}
          <div className="pt-4 border-t flex flex-col sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-center order-2 sm:order-1"
              onClick={() => setPassword("")} // Nút Clear
              disabled={isLoading || !password}
            >
              Xóa nhập liệu
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 order-1 sm:order-2 
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 active:bg-red-800"
                }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  {/* Icon loading */}
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Xóa Toàn Bộ Dữ Liệu Ngay Lập Tức"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* --- MODAL XÁC NHẬN CUỐI CÙNG (An Toàn Lớp 2) --- */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 md:p-8 transform transition-all scale-100 animate-fade-in-up">
            {/* Header Modal */}
            <div className="flex items-center gap-3 text-red-600 mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900">
                Xác Nhận Lần Cuối!
              </h3>
            </div>

            {/* Nội dung Modal */}
            <div className="space-y-4 text-gray-700 text-sm md:text-base mb-8 border-y py-5 border-gray-100">
              <p>
                Bạn đang thực hiện hành động{" "}
                <strong className="text-red-700">RESET TOÀN BỘ HỆ THỐNG</strong>
                .
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-red-700 bg-red-50 p-4 rounded-md">
                <li>Tất cả Phản hồi (Feedback) sẽ bị xóa sạch.</li>
                <li>Tất cả Lịch sử phân quyền sẽ mất.</li>
                <li>Không có cách nào để khôi phục lại dữ liệu này.</li>
              </ul>
              <p>
                Hệ thống sẽ ghi lại hành động này kèm theo tài khoản của bạn để
                phục vụ mục đích kiểm toán (Audit log).
              </p>
              <p className="font-semibold text-gray-800">
                Bạn có chắc chắn 100% muốn tiếp tục không?
              </p>
            </div>

            {/* Nút bấm Modal: Responsive */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-center order-2 sm:order-1"
                onClick={() => setShowConfirm(false)}
              >
                Hủy bỏ (Quay lại)
              </button>
              <button
                type="button"
                className="px-6 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-bold transition order-1 sm:order-2"
                onClick={handleConfirmReset}
              >
                Tôi chắc chắn, hãy xóa dữ liệu!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemReset;
