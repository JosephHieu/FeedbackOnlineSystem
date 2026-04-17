import api from "./api";

export const authService = {
  /**
   * Đăng nhập và lưu trữ phiên làm việc
   */
  login: async (username, password) => {
    const data = await api.post("/auth/login", { username, password });

    if (data) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

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
   * Làm mới Access Token
   */
  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    // Sử dụng api.post vì interceptor trong api.js đã được cấu hình
    // để trả về data.result (là AuthResponse chứa token mới)
    return await api.post("/auth/refresh", refreshToken, {
      headers: { "Content-Type": "text/plain" },
    });
  },

  /**
   * Xử lý đăng xuất phía Client
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken"); // XÓA thêm cái này để bảo mật
    localStorage.removeItem("user");
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
   */
  changePassword: async (passwordData) => {
    return await api.post("/auth/change-password", passwordData);
  },
};
