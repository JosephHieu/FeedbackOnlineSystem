import api from "./api";

/**
 * Gọi API Reset Hệ thống
 * @param {string} password - Mật khẩu Admin để xác nhận
 * @returns {Promise} - Trả về dữ liệu từ Interceptor (result hoặc throw error)
 */
export const resetSystemService = (password) => {
  return api.post("/admin/system/reset", { password });
};
