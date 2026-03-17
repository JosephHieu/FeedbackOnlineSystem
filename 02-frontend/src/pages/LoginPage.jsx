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
      const response = await authService.login(username, password);
      if (response.result) {
        localStorage.setItem("token", response.result.token);
        login({
          username: response.result.username,
          role: response.result.role,
        });
        navigate(
          response.result.role === "ROLE_ADMIN"
            ? "/admin/dashboard"
            : "/user/home",
        );
      }
    } catch (err) {
      setError(err.message || "Thông tin đăng nhập không chính xác.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
        {/* Left Side: Branding & Slogan */}
        <div className="text-center lg:text-left flex-1">
          <h1 className="text-5xl lg:text-6xl font-bold text-blue-600 mb-4">
            Feedback Online
          </h1>
          <p className="text-xl lg:text-2xl text-gray-700 font-medium leading-tight">
            Lắng nghe ý kiến của bạn, nâng cao chất lượng đào tạo mỗi ngày.
          </p>
          {/* Bạn có thể thêm một cái hình minh họa nhẹ nhàng ở đây nếu muốn giống ảnh mẫu */}
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
                placeholder="Email hoặc tên đăng nhập"
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

              <a
                href="#"
                className="text-blue-600 text-center text-sm hover:underline mt-2"
              >
                Quên mật khẩu?
              </a>

              <hr className="my-2 border-gray-200" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
