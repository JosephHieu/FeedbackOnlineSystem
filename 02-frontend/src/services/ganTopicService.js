import api from "./api";

export const ganTopicService = {
  /**
   * 1. Lấy danh sách các Topic đã gán cho một Lớp cụ thể
   * Dùng để đổ dữ liệu lên bảng khi Admin chọn Lớp ở Dropdown
   * @param {string} maLop - UUID của lớp học
   */
  getAssignmentsByClass: async (maLop) => {
    return await api.get(`/assign-topics/class/${maLop}`);
  },

  getTopicsByClassId: async (maLop) => {
    const response = await api.get(`/assign-topics/class/${maLop}`);
    return response;
  },

  /**
   * 2. Thực hiện gán hàng loạt Topic cho Lớp và Trainer
   * @param {Object} data - { maLop, maTrainer, danhSachMaTopic: [uuid1, uuid2...] }
   */
  assignTopics: async (assignData) => {
    return await api.post("/assign-topics", assignData);
  },

  /**
   * 3. Xóa một bản ghi gán Topic cụ thể (Nút Xóa trên từng dòng)
   * @param {string} id - UUID của bản ghi GanTopic
   */
  deleteAssignment: async (id) => {
    return await api.delete(`/assign-topics/${id}`);
  },

  /**
   * 4. Xóa SẠCH toàn bộ cấu hình gán Topic của một lớp (Nút "Xóa hết")
   * @param {string} maLop - UUID của lớp học
   */
  clearAllByClass: async (maLop) => {
    return await api.delete(`/assign-topics/class/${maLop}/clear-all`);
  },
};
