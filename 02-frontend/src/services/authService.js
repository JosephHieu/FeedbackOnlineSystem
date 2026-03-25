import api from "./api";

export const authService = {
  /**
   * Đăng nhập và lưu trữ phiên làm việc
   */
  login: async (username, password) => {
    // Không cần try/catch nếu chỉ để throw lại
    const data = await api.post("/auth/login", { username, password });

    if (data) {
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username,
          role: data.role,
        }),
      );
    }

    return data;
  },

  /**
   * Xử lý đăng xuất phía Client
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Sử dụng replace để tránh người dùng bấm "Back" quay lại trang cũ
    window.location.replace("/login");
  },

  /**
   * Helper để kiểm tra trạng thái đăng nhập nhanh
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  /**
   * Lấy thông tin User hiện tại
   */
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Đổi mật khẩu cho người dùng hiện tại
   * @param {Object} data - { oldPassword, newPassword, confirmPassword }
   */
  changePassword: async (passwordData) => {
    return await api.post("/auth/change-password", passwordData);
  },
};
