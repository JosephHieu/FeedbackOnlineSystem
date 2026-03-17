import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
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

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <Routes>
                <Route
                  path="dashboard"
                  element={<div className="p-8">Chào mừng Admin!</div>}
                />
                {/* Thêm các trang quản lý khác ở đây */}
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER"]}>
              <Routes>
                <Route
                  path="home"
                  element={<div className="p-8">Chào mừng Học viên!</div>}
                />
                {/* Thêm các trang feedback ở đây */}
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* 404 Page - Có thể làm đẹp sau */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              404 - Trang không tồn tại
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
