import api from "./api";

export const topicService = {
  /**
   * 1. Lấy danh sách Topic (Phân trang + Tìm kiếm)
   * @param {number} page - Trang hiện tại (1-based)
   * @param {number} size - Số bản ghi mỗi trang
   * @param {string} search - Từ khóa tìm kiếm tên Topic
   */
  getAllTopics: async (page = 1, size = 10, search = "") => {
    return await api.get("/topics", {
      params: {
        page,
        size,
        search,
      },
    });
  },

  /**
   * 2. Lấy chi tiết một Topic theo ID (UUID)
   * Dùng khi bấm vào nút "Sửa" để đổ dữ liệu lên Form
   */
  getTopicById: async (id) => {
    return await api.get(`/topics/${id}`);
  },

  /**
   * 3. Tạo mới một Topic
   * @param {Object} topicData - { tenTopic: "Tên chủ đề mới" }
   */
  createTopic: async (topicData) => {
    return await api.post("/topics", topicData);
  },

  /**
   * 4. Cập nhật tên Topic
   * @param {string} id - UUID của Topic
   * @param {Object} topicData - { tenTopic: "Tên chủ đề đã sửa" }
   */
  updateTopic: async (id, topicData) => {
    return await api.put(`/topics/${id}`, topicData);
  },

  /**
   * 5. Xóa mềm / Thay đổi trạng thái (Toggle Status)
   */
  toggleStatus: async (id) => {
    return await api.patch(`/topics/${id}/toggle-status`);
  },
};
