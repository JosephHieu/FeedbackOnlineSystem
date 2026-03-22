import api from "./api";

export const feedbackService = {
  // Lấy danh sách học viên chưa feedback
  getPendingFeedbackList: async (maLop, maTopic) => {
    return await api.get("/feedbacks/pending", {
      params: { maLop, maTopic },
    });
  },

  // Học viên nộp bài feedback
  submitFeedback: async (feedbackData) => {
    return await api.post("/feedbacks/submit", feedbackData);
  },
};
