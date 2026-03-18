import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
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

    // TH1: Dữ liệu trả về đúng cấu trúc ApiResponse { code, result, message, ... }
    if (data && typeof data === "object" && "code" in data) {
      if (data.code === 1000) {
        // Hiện thông báo nếu là các thao tác thay đổi dữ liệu (POST, PUT, DELETE)
        if (data.message && response.config.method !== "get") {
          toast.success(data.message);
        }
        return data.result; // Trả về phần lõi dữ liệu cho Component
      } else {
        // Nếu có code nhưng không phải 1000 (Lỗi nghiệp vụ từ Backend)
        toast.error(data.message || "Đã có lỗi xảy ra");
        return Promise.reject(data);
      }
    }

    // TH2: Backend trả về dữ liệu trực tiếp (Mảng hoặc Object không bọc ApiResponse)
    // Miễn là HTTP Status là 2xx (Thành công)
    return data;
  },
  (error) => {
    // Xử lý lỗi HTTP (401, 403, 404, 500...)
    const apiError = error.response?.data;
    const errorMessage =
      apiError?.message || error.message || "Lỗi kết nối hệ thống";

    // Không hiện toast lỗi nếu là lỗi 401 (để tránh hiện đè lên trang login)
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Tránh lặp vô tận nếu đang ở trang login rồi
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
