import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { feedbackService } from "../../services/feedbackService";
import { FaArrowLeft, FaStar, FaRegCommentDots } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const FeedbackFormPage = () => {
  const { maTopic } = useParams();
  const { state } = useLocation();
  const topic = state?.topic;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (topic?.maTemplate) {
      // 1. Lấy danh sách câu hỏi như cũ
      feedbackService.getQuestionsByTemplate(topic.maTemplate).then((res) => {
        const list = res.danhSachCauHoi || [];
        setQuestions(list);

        // 2. NẾU ĐÃ HOÀN THÀNH
        if (topic.completed) {
          feedbackService
            .getSubmittedFeedback(topic.maLop, topic.maTopic)
            .then((oldData) => {
              const oldAnswers = {};
              // Map dữ liệu cũ vào state answers
              oldData.chiTietFeedback.forEach((item) => {
                oldAnswers[item.maCauHoi] = {
                  diem: item.diem,
                  ghiChu: item.ghiChu,
                };
              });
              setAnswers(oldAnswers);
            });
        } else {
          const init = {};
          list.forEach((q) => {
            init[q.maCauHoi] = { diem: q.diemToiDa || 5, ghiChu: "" };
          });
          setAnswers(init);
        }
      });
    }
  }, [topic]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- LOGIC KIỂM TRA ĐIỂM THẤP ---
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const answer = answers[q.maCauHoi];
      const diem = parseInt(answer?.diem);
      const ghiChu = answer?.ghiChu?.trim();

      // Nếu điểm là 1 hoặc 2 mà không có ghi chú -> Chặn lại
      if ((diem === 1 || diem === 2) && !ghiChu) {
        return toast.error(
          `Câu số ${i + 1} điểm quá thấp, cưng vui lòng viết lý do vào phần nhận xét nhé!`,
        );
      }
    }

    const payload = {
      maHocVien: user?.maHocVien || user?.id,
      maLop: topic.maLop,
      maTopic: topic.maTopic,
      maTrainer: topic.maTrainer,
      maTemplate: topic.maTemplate,
      chiTietFeedback: Object.keys(answers).map((id) => ({
        maCauHoi: id,
        diem: parseInt(answers[id].diem),
        ghiChu: answers[id].ghiChu,
      })),
    };

    try {
      await feedbackService.submitFeedback(payload);
      toast.success("Gửi đánh giá thành công!.");
      navigate("/user/home");
    } catch (error) {
      console.error("Lỗi gửi feedback:", error);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* --- 1. HEADER CỐ ĐỊNH --- */}
      <div className="bg-white border-b border-slate-100 p-6 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-start gap-4">
          <button
            onClick={() => navigate(-1)}
            className="mt-1 p-2 hover:bg-slate-50 rounded-full transition-all flex-shrink-0"
          >
            <FaArrowLeft className="text-slate-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-slate-800 uppercase text-lg md:text-xl leading-tight break-words">
              {topic?.tenTopic}
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Trainer: {topic?.tenTrainer}
            </p>
          </div>
        </div>
      </div>

      {/* --- 2. VÙNG CUỘN CÂU HỎI --- */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          <form
            id="feedback-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {questions.map((q, idx) => {
              const isLowScore = parseInt(answers[q.maCauHoi]?.diem) <= 2;

              return (
                <div
                  key={q.maCauHoi}
                  className={`bg-white p-6 rounded-[2rem] shadow-sm border transition-all hover:shadow-md ${
                    isLowScore
                      ? "border-rose-100 bg-rose-50/10"
                      : "border-slate-100"
                  }`}
                >
                  <div className="flex gap-4 mb-4">
                    <span
                      className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center font-black text-sm text-white ${
                        isLowScore ? "bg-rose-500" : "bg-slate-900"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <p className="font-bold text-slate-700 leading-snug">
                      {q.tenCauHoi}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1 space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                        <FaStar
                          className={
                            isLowScore ? "text-rose-500" : "text-amber-400"
                          }
                        />{" "}
                        Mức điểm
                      </label>
                      <select
                        className={`w-full p-3 border-none rounded-xl font-black outline-none focus:ring-2 ${
                          isLowScore
                            ? "bg-rose-50 text-rose-600 focus:ring-rose-200"
                            : "bg-slate-50 text-slate-700 focus:ring-indigo-500"
                        }`}
                        value={answers[q.maCauHoi]?.diem}
                        onChange={(e) =>
                          setAnswers({
                            ...answers,
                            [q.maCauHoi]: {
                              ...answers[q.maCauHoi],
                              diem: e.target.value,
                            },
                          })
                        }
                      >
                        {Array.from(
                          { length: q.diemToiDa - q.diemToiThieu + 1 },
                          (_, i) => q.diemToiThieu + i,
                        ).map((v) => (
                          <option key={v} value={v}>
                            {v} Điểm
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                        <FaRegCommentDots
                          className={
                            isLowScore ? "text-rose-500" : "text-indigo-400"
                          }
                        />
                        Nhận xét chi tiết{" "}
                        {isLowScore && (
                          <span className="text-rose-500 font-black">
                            (Bắt buộc)
                          </span>
                        )}
                      </label>
                      <textarea
                        placeholder={
                          isLowScore
                            ? "Vui lòng cho biết lý do cưng chấm điểm thấp thế này..."
                            : "Vui lòng nhập cảm nhận của bạn..."
                        }
                        className={`w-full p-3 border-none rounded-xl font-medium outline-none focus:ring-2 min-h-[80px] ${
                          isLowScore
                            ? "bg-rose-50/50 text-rose-700 focus:ring-rose-200"
                            : "bg-slate-50 text-slate-600 focus:ring-indigo-500"
                        }`}
                        value={answers[q.maCauHoi]?.ghiChu}
                        onChange={(e) =>
                          setAnswers({
                            ...answers,
                            [q.maCauHoi]: {
                              ...answers[q.maCauHoi],
                              ghiChu: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </form>
        </div>
      </div>

      {/* --- 3. FOOTER CỐ ĐỊNH --- */}
      <div className="bg-white border-t border-slate-100 p-6 flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-3xl mx-auto">
          <button
            type="submit"
            form="feedback-form"
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-600 transition-all active:scale-95 uppercase tracking-widest"
          >
            {topic.completed ? "CẬP NHẬT ĐÁNH GIÁ" : "GỬI ĐÁNH GIÁ NGAY"}{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackFormPage;
