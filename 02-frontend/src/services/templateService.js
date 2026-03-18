import api from "./api";

const templateService = {
  // 1. Lấy danh sách tất cả template đang hoạt động
  getAllTemplates: () => {
    return api.get("/templates");
  },

  // 2. Tạo mới một template
  createTemplate: (data) => {
    // data: { tenTemplate: string, danhSachCauHoi: Array }
    return api.post("/templates", data);
  },

  // 3. Cập nhật template theo ID
  updateTemplate: (id, data) => {
    return api.put(`/templates/${id}`, data);
  },

  // 4. Xóa mềm template theo ID
  deleteTemplate: (id) => {
    return api.delete(`/templates/${id}`);
  },

  // 5. Lấy chi tiết 1 template (nếu sau này bạn viết thêm API GetById)
  getTemplateById: (id) => {
    return api.get(`/templates/${id}`);
  },
};

export default templateService;
