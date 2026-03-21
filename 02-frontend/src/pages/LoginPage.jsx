import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // response ở đây chính là data.result từ Backend trả về (do api.js đã xử lý)
      const userData = await authService.login(username, password);

      if (userData) {
        // 1. Lưu token (Nếu authService chưa lưu)
        localStorage.setItem("token", userData.token);

        // 2. Cập nhật state trong Context để ProtectedRoute nhận biết được
        login({
          username: userData.username,
          role: userData.role,
        });

        // 3. Thông báo (Tùy chọn nếu api.js chưa làm)
        // toast.success("Chào mừng trở lại!");

        // 4. Điều hướng
        const targetPath =
          userData.role === "ROLE_ADMIN" ? "/admin/dashboard" : "/user/home";

        navigate(targetPath);
      }
    } catch (err) {
      // Lấy message lỗi từ object lỗi mà api.js đã format
      setError(err.message || "Thông tin đăng nhập không chính xác.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
        {/* Left Side: Branding & Slogan */}
        <div className="text-center lg:text-left flex-1 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-600 mb-4 tracking-tight">
            Feedback Online
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
            Lắng nghe ý kiến của bạn, nâng cao chất lượng đào tạo mỗi ngày.
          </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full max-w-[400px]">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-xl border border-gray-100">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Tên đăng nhập"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-md text-xl hover:bg-blue-700 transition duration-200 flex justify-center items-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Đăng nhập"
                )}
              </button>

              <hr className="my-2 border-gray-200" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
