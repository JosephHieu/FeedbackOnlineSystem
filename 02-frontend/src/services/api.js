import axios from "axios";

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

// Xử lý dữ liệu trả về và lỗi tập trung
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
    return Promise.reject({ message, status: error.response?.status });
  },
);

export default api;
