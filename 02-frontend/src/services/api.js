import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL:
    (import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Biến quản lý trạng thái refresh
let isRefreshing = false;
let failedQueue = []; // Hàng đợi để chạy lại các request bị 401

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && data.code === 1000) {
      if (data.message && response.config.method !== "get") {
        toast.success(data.message);
      }
      return data.result;
    }
    // Trường hợp Backend trả về lỗi nghiệp vụ (code != 1000)
    if (data && "code" in data && data.code !== 1000) {
      if (data.code === 4007) {
        toast.error("Vui lòng kiểm tra lại thông tin nhập vào");
      } else {
        toast.error(data.message || "Đã có lỗi xảy ra");
      }

      return Promise.reject(data);
    }
    return data;
  },
  async (error) => {
    const originalRequest = error.config;
    // Lấy dữ liệu lỗi từ Backend trả về
    const backendError = error.response?.data;

    // TRƯỜNG HỢP 1: Lỗi 401 khi ĐĂNG NHẬP (Sai user/pass)
    // trả về backendError để LoginPage lấy được message "Sai tên đăng nhập..."
    if (
      error.response?.status === 401 &&
      originalRequest.url.includes("/auth/login")
    ) {
      return Promise.reject(backendError);
    }

    // TRƯỜNG HỢP 2: Lỗi 401 ở các API khác (Hết hạn Token) -> Chạy luồng Refresh ngầm
    if (
      error.response?.status === 401 &&
      !originalRequest.url.includes("/auth/login")
    ) {
      if (originalRequest._retry) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(backendError || error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      return new Promise((resolve, reject) => {
        axios
          .post(`${api.defaults.baseURL}/auth/refresh`, refreshToken, {
            headers: { "Content-Type": "text/plain" },
          })
          .then(({ data }) => {
            const newAccessToken = data.result.token;
            localStorage.setItem("token", newAccessToken);
            processQueue(null, newAccessToken);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            localStorage.clear();
            window.location.href = "/login";
            toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
            reject(err.response?.data || err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // TRƯỜNG HỢP 3: Các lỗi khác (400, 403, 500...)
    if (error.response?.status !== 401) {
      // Hiển thị toast bằng message từ Backend nếu có
      toast.error(backendError?.message || "Lỗi kết nối hệ thống");
    }

    return Promise.reject(backendError || error);
  },
);

export default api;
