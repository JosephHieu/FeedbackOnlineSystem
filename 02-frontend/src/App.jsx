import { useAuth } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/layout/AdminLayout";
import UserLayout from "./components/layout/UserLayout";
import TemplateListPage from "./pages/admin/templates/TemplateListPage";
import TemplateFormPage from "./pages/admin/templates/TemplateFormPage";
import ClassListPage from "./pages/admin/classes/ClassListPage";
import ClassFormPage from "./pages/admin/classes/ClassFormPage";
import StudentListPage from "./pages/admin/students/StudentListPage";
import StudentFormPage from "./pages/admin/students/StudentFormPage";
import TrainerListPage from "./pages/admin/trainers/TrainerListPage";
import TrainerFormPage from "./pages/admin/trainers/TrainerFormPage";
import TopicListPage from "./pages/admin/topics/TopicListPage";
import TopicFormPage from "./pages/admin/topics/TopicFormPage";
import GanTopicListPage from "./pages/admin/assign/GanTopicListPage";
import GanTopicFormPage from "./pages/admin/assign/GanTopicFormPage";
import PendingFeedbackPage from "./pages/admin/feedback/PendingFeedbackPage";
import UserHomePage from "./pages/user/UserHomePage";
import FeedbackFormPage from "./pages/user/FeedbackFormPage";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#333",
            color: "#fff",
            fontWeight: "bold",
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin Routes - Có Sidebar */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Quản lý Lớp học */}
          <Route path="classes" element={<ClassListPage />} />
          <Route path="classes/create" element={<ClassFormPage />} />
          <Route path="classes/edit/:id" element={<ClassFormPage />} />
          {/* Quản lý Học viên */}
          <Route path="students" element={<StudentListPage />} />
          <Route path="students/create" element={<StudentFormPage />} />
          <Route path="students/edit/:id" element={<StudentFormPage />} />
          {/* Quản lý Giáo viên */}
          <Route path="trainers" element={<TrainerListPage />} />
          <Route path="trainers/create" element={<TrainerFormPage />} />
          <Route path="trainers/edit/:id" element={<TrainerFormPage />} />{" "}
          {/* Quản lý Chủ đề */}
          <Route path="topics" element={<TopicListPage />} />
          <Route path="topics/create" element={<TopicFormPage />} />
          <Route path="topics/edit/:id" element={<TopicFormPage />} />{" "}
          {/* Quản lý Mẫu khảo sát */}
          <Route path="templates" element={<TemplateListPage />} />
          <Route path="templates/create" element={<TemplateFormPage />} />
          <Route path="templates/edit/:id" element={<TemplateFormPage />} />
          {/* Quản lý Gán Topic */}
          <Route path="assign" element={<GanTopicListPage />} />
          <Route path="assign/create" element={<GanTopicFormPage />} />{" "}
          {/* Học viên chưa Feedback */}
          <Route path="pending" element={<PendingFeedbackPage />} />
          {/* Xuất kết quả */}
          <Route path="export" element={<div>Trang xuất kết quả</div>} />
          {/* Xóa toàn bộ dữ liệu */}
          <Route path="clear" element={<div>Trang xóa dữ liệu</div>} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* User Routes - Không có Sidebar */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<UserHomePage />} />
          <Route path="feedback/:maTopic" element={<FeedbackFormPage />} />
          <Route index element={<Navigate to="home" replace />} />
        </Route>

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center h-screen bg-white">
              <h1 className="text-9xl font-black text-indigo-100">404</h1>
              <p className="text-xl font-bold text-slate-600 -mt-10">
                Trang không tồn tại
              </p>
              <button
                onClick={() => window.history.back()}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
              >
                Quay lại
              </button>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
