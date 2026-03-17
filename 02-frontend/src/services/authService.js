import api from "./api";

export const authService = {
  /**
   * Gửi yêu cầu đăng nhập về Backend
   * @param {string} username
   * @param {string} password
   * @returns {Promise} Trả về ApiResponse từ Backend
   */
  login: async (username, password) => {
    return api.post("/auth/login", { username, password });
  },

  /**
   * Xử lý đăng xuất phía Client
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
};
