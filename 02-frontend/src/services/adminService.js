import api from "./api";

/**
 * Gọi API Reset Hệ thống
 * @param {string} password - Mật khẩu Admin để xác nhận
 * @returns {Promise} - Trả về dữ liệu từ Interceptor (result hoặc throw error)
 */
export const resetSystemService = (password) => {
  return api.post("/admin/system/reset", { password });
};

/**
 * Lấy dữ liệu thống kê tổng quan cho Dashboard
 * @returns {Promise} - Trả về object DashboardStatsResponse (totalClasses, totalStudents, ...)
 */
export const getDashboardStats = () => {
  // Vì là GET nên Interceptor của bạn sẽ không tự động hiện toast.success (rất hợp lý)
  return api.get("/admin/system/statistics");
};
