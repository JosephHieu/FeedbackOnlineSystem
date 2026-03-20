import api from "./api";

export const classService = {
  // 1. Lấy danh sách lớp (có phân trang và tìm kiếm)
  // page mặc định là 1, size là 5 (khớp với Backend)
  getAllLops: async (page = 1, size = 5, search = "") => {
    const response = await api.get("/lops", {
      params: {
        page,
        size,
        search,
      },
    });
    return response; // Trả về PageResponse { data, totalPages, totalElements, ... }
  },

  // 2. Lấy chi tiết một lớp để đổ vào form Sửa
  getLopById: async (maLop) => {
    return await api.get(`/lops/${maLop}`);
  },

  // 3. Tạo mới lớp học
  createLop: async (lopData) => {
    // lopData: { tenLop: "...", maTemplate: "..." }
    return await api.post("/lops", lopData);
  },

  // 4. Cập nhật lớp học
  updateLop: async (maLop, lopData) => {
    return await api.put(`/lops/${maLop}`, lopData);
  },

  // 5. Xóa mềm (Toggle status)
  deleteLop: async (maLop) => {
    return await api.delete(`/lops/${maLop}`);
  },
};
