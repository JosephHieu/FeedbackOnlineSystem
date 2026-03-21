import api from "./api";

export const trainerService = {
  /**
   * 1. Lấy danh sách giảng viên (Phân trang + Tìm kiếm)
   * @param {number} page - Trang hiện tại (mặc định 1)
   * @param {number} size - Số bản ghi mỗi trang (mặc định 10)
   * @param {string} search - Từ khóa tìm kiếm (Account hoặc Tên)
   */
  getAllTrainers: async (page = 1, size = 10, search = "") => {
    return await api.get("/trainers", {
      params: {
        page,
        size,
        search,
      },
    });
  },

  /**
   * 2. Lấy chi tiết một giảng viên theo ID (UUID)
   */
  getTrainerById: async (id) => {
    return await api.get(`/trainers/${id}`);
  },

  /**
   * 3. Tạo mới một giảng viên
   * @param {Object} trainerData - { account, tenTrainer }
   */
  createTrainer: async (trainerData) => {
    return await api.post("/trainers", trainerData);
  },

  /**
   * 4. Cập nhật thông tin giảng viên (Chỉ sửa được tên)
   */
  updateTrainer: async (id, trainerData) => {
    return await api.put(`/trainers/${id}`, trainerData);
  },

  /**
   * 5. Xóa mềm / Thay đổi trạng thái (Toggle Status)
   */
  toggleStatus: async (id) => {
    return await api.patch(`/trainers/${id}/toggle-status`);
  },
};
