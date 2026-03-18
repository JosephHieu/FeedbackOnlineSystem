import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động gắn Token vào mỗi request nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý Response tập trung dựa trên cấu trúc ApiResponse từ Java
api.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && data.code === 1000) {
      // Nếu có message thành công từ Backend (như "Tạo thành công"), hiện luôn
      if (data.message && response.config.method !== "get") {
        toast.success(data.message);
      }
      return data.result;
    }
    return Promise.reject(data);
  },
  (error) => {
    const apiError = error.response?.data;

    // 2. Tự động hiện Toast lỗi từ Backend trả về
    const errorMessage = apiError?.message || "Lỗi kết nối hệ thống";
    toast.error(errorMessage);

    if (apiError?.traceId) {
      console.error(`[API Error] TraceId: ${apiError.traceId}`);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject({
      message: errorMessage,
      code: apiError?.code,
      traceId: apiError?.traceId,
    });
  },
);

export default api;
