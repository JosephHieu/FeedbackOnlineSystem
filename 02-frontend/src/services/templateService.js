import api from "./api";

/**
 * Service quản lý các mẫu khảo sát (Feedback Templates)
 */
export const templateService = {
  /**
   * Lấy danh sách mẫu khảo sát có phân trang
   * @param {number} page - Trang hiện tại (mặc định 1)
   * @param {number} size - Số bản ghi mỗi trang (mặc định 10)
   * @returns {Promise<Object>} PageResponse chứa mảng templates và thông tin phân trang
   */
  getAllTemplates: (page = 1, size = 5, search = "") => {
    // Truyền tham số dưới dạng query string: ?page=x&size=y
    return api.get("/templates", {
      params: { page, size, search },
    });
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
