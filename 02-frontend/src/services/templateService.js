import api from "./api";

/**
 * Service quản lý các mẫu khảo sát (Feedback Templates)
 */
const templateService = {
  /**
   * Lấy danh sách tất cả mẫu khảo sát (Đã qua xử lý status = true ở Backend)
   * @returns {Promise<Array>} Danh sách TemplateResponse
   */
  getAllTemplates: () => {
    return api.get("/templates");
  },

  /**
   * Tạo mới một mẫu khảo sát
   * @param {Object} data - Format: { tenTemplate: string, danhSachCauHoi: Array }
   */
  createTemplate: (data) => {
    return api.post("/templates", data);
  },

  /**
   * Cập nhật thông tin mẫu khảo sát theo UUID
   * @param {string} id - UUID của template
   * @param {Object} data - Dữ liệu cập nhật tương tự createTemplate
   */
  updateTemplate: (id, data) => {
    return api.put(`/templates/${id}`, data);
  },

  /**
   * Xóa mềm mẫu khảo sát (Đổi status thành false ở Backend)
   * @param {string} id - UUID của template
   */
  deleteTemplate: (id) => {
    return api.delete(`/templates/${id}`);
  },

  /**
   * Lấy chi tiết một mẫu khảo sát (Dùng để đổ dữ liệu vào Form Sửa)
   * @param {string} id - UUID của template
   */
  getTemplateById: (id) => {
    return api.get(`/templates/${id}`);
  },
};

export default templateService;
