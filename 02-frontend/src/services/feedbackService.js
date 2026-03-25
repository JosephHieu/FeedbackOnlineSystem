import api from "./api";

export const feedbackService = {
  // 1. Lấy danh sách học viên "nợ" (Admin)
  getPendingFeedbackList: (maLop, maTopic) => {
    // api.get ở đây sẽ trả về thẳng cái "result" (mảng học viên)
    return api.get("/feedbacks/pending", {
      params: { maLop, maTopic },
    });
  },

  // 2. Lấy danh sách Topic của học viên (User - Hình 1 & 2)
  getMyTopics: () => {
    return api.get("/user/feedbacks/my-topics");
  },

  // 3. Lấy bộ câu hỏi từ Template (User - Hình 3)
  getQuestionsByTemplate: (maTemplate) => {
    return api.get(`/templates/${maTemplate}`);
  },

  // 4. Học viên nộp bài feedback
  submitFeedback: (feedbackData) => {
    return api.post("/user/feedbacks/submit", feedbackData);
  },

  // 5. Lấy chi tiết bài đã đánh giá
  getSubmittedFeedback: (maLop, maTopic) => {
    return api.get("/user/feedbacks/detail", {
      params: { maLop, maTopic },
    });
  },

  /** * 6. Xem trước kết quả đánh giá (Admin - Preview)
   */
  getExportPreview: (maLop, maTopic) => {
    return api.get("/admin/export/preview", {
      params: { maLop, maTopic },
    });
  },

  /** * 7. Xuất file Excel kết quả (Admin - Download)
   */
  exportFeedbackExcel: (maLop, maTopic) => {
    return api.get("/admin/export/excel", {
      params: { maLop, maTopic },
      responseType: "blob",
    });
  },

  getTopicsByClass: (maLop) => {
    return api.get(`/assign-topics/class/${maLop}`);
  },
};
