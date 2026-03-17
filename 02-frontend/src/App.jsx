import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./hooks/useAuth";
import AdminLayout from "./components/layout/AdminLayout"; // Import Layout mới

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "ROLE_ADMIN" ? "/admin/dashboard" : "/user/home"}
        replace
      />
    );
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin Routes - Đã tích hợp Layout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Các Route con sẽ được render vào vị trí <Outlet /> trong AdminLayout */}
          <Route
            path="dashboard"
            element={
              <div className="text-2xl font-bold">Trang quản trị hệ thống</div>
            }
          />
          <Route path="classes" element={<div>Quản lý lớp học</div>} />
          <Route path="students" element={<div>Quản lý học viên</div>} />
          {/* Thêm các trang khác tương ứng với Sidebar ở đây */}

          {/* Tự động redirect từ /admin sang /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER"]}>
              {/* Nếu bạn làm UserLayout sau này thì bọc ở đây tương tự Admin */}
              <div className="p-8">Chào mừng học viên</div>
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<div>Trang chủ học viên</div>} />
        </Route>

        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen font-bold text-gray-500">
              404 - Trang không tồn tại
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
