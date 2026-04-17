import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // THAY ĐỔI: Sử dụng object để lưu lỗi chi tiết cho từng field
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({}); // Reset lỗi cũ
    setLoading(true);

    try {
      const userData = await authService.login(username, password);

      if (userData) {
        login({
          username: userData.username,
          role: userData.role,
        });

        const targetPath =
          userData.role === "ROLE_ADMIN" ? "/admin/dashboard" : "/user/home";
        navigate(targetPath);
      }
    } catch (err) {
      if (err.code === 4007 && err.result) {
        setFieldErrors(err.result);
      } else {
        setGeneralError(err.message || "Thông tin đăng nhập không chính xác.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
        <div className="text-center lg:text-left flex-1 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-600 mb-4 tracking-tight">
            Feedback Online
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
            Lắng nghe ý kiến của bạn, nâng cao chất lượng đào tạo mỗi ngày.
          </p>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-xl border border-gray-100">
            {/* Hiển thị lỗi chung (như sai pass/username) */}
            {generalError && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {generalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Tên đăng nhập"
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 text-lg ${
                    fieldErrors.username
                      ? "border-red-500 ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {/* HIỂN THỊ LỖI CHI TIẾT CHO USERNAME */}
                {fieldErrors.username && (
                  <span className="text-red-500 text-xs ml-1">
                    {fieldErrors.username}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 text-lg ${
                    fieldErrors.password
                      ? "border-red-500 ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* HIỂN THỊ LỖI CHI TIẾT CHO PASSWORD */}
                {fieldErrors.password && (
                  <span className="text-red-500 text-xs ml-1">
                    {fieldErrors.password}
                  </span>
                )}
              </div>

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
