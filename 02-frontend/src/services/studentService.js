import api from "./api";

export const studentService = {
  /**
   * 1. Lấy danh sách học viên của một lớp (có phân trang & tìm kiếm)
   * @param {string} maLop - UUID của lớp
   */
  getStudentsByLop: async (maLop, page = 1, size = 5, search = "") => {
    return await api.get(`/hoc-viens/lop/${maLop}`, {
      params: { page, size, search },
    });
  },

  /**
   * 2. Lấy chi tiết một học viên (để sửa)
   */
  getStudentById: async (id) => {
    return await api.get(`/hoc-viens/${id}`);
  },

  /**
   * 3. Tạo mới học viên thủ công
   * @param {Object} data - { username, tenHocVien, maLop }
   */
  createStudent: async (data) => {
    return await api.post("/hoc-viens", data);
  },

  /**
   * 4. Cập nhật thông tin học viên
   */
  updateStudent: async (id, data) => {
    return await api.put(`/hoc-viens/${id}`, data);
  },

  /**
   * 5. Vô hiệu hóa/Kích hoạt học viên (Toggle Status)
   */
  toggleStatus: async (id) => {
    return await api.delete(`/hoc-viens/${id}`);
  },

  /**
   * 6. IMPORT EXCEL - Quan trọng nhất
   * @param {File} file - File .xlsx từ input
   * @param {string} maLop - UUID của lớp cần import vào
   */
  importExcel: async (file, maLop) => {
    const formData = new FormData();
    formData.append("file", file);

    return await api.post(`/hoc-viens/import/${maLop}`, formData, {
      headers: {
        // Ghi đè Content-Type để Axios tự động xử lý boundary cho file
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
