import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL:
    (import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: Gắn Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: Xử lý dữ liệu trả về
api.interceptors.response.use(
  (response) => {
    const data = response.data;

    if (data && typeof data === "object" && "code" in data) {
      if (data.code === 1000) {
        if (data.message && response.config.method !== "get") {
          toast.success(data.message);
        }
        return data.result;
      } else {
        // Lỗi nghiệp vụ từ Backend (ví dụ: sai logic điểm, trùng tên...)
        toast.error(data.message || "Đã có lỗi xảy ra");
        return Promise.reject(data);
      }
    }
    return data;
  },
  (error) => {
    const apiError = error.response?.data;
    const status = error.response?.status;
    const originalRequest = error.config;

    // Kiểm tra xem có phải đang gọi API login hay không
    const isLoginRequest = originalRequest.url.includes("/auth/login");

    const errorMessage =
      apiError?.message || error.message || "Lỗi kết nối hệ thống";

    // XỬ LÝ LỖI 401 (UNAUTHORIZED)
    if (status === 401) {
      if (isLoginRequest) {
        // Nếu sai mật khẩu khi ĐĂNG NHẬP:
        // Không xóa token, không redirect. Chỉ trả lỗi về để trang Login hiện thông báo đỏ.
        return Promise.reject(apiError || error);
      } else {
        // Nếu đang dùng App mà bị 401 (Token hết hạn):
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") {
          toast.error("Phiên làm việc hết hạn, vui lòng đăng nhập lại!");
          window.location.href = "/login";
        }
      }
    }
    // XỬ LÝ CÁC LỖI KHÁC (403, 400, 500...)
    else {
      toast.error(errorMessage);
    }

    return Promise.reject(apiError || error);
  },
);

export default api;
