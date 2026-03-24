import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { feedbackService } from "../../services/feedbackService";
import { FaArrowLeft, FaStar, FaRegCommentDots } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth"; // Nhớ import hook auth của cưng nhé

const FeedbackFormPage = () => {
  const { maTopic } = useParams();
  const { state } = useLocation();
  const topic = state?.topic;
  const navigate = useNavigate();
  const { user } = useAuth(); // Lấy thông tin user để lấy ID nộp bài

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (topic?.maTemplate) {
      feedbackService.getQuestionsByTemplate(topic.maTemplate).then((res) => {
        const list = res.danhSachCauHoi || [];
        setQuestions(list);

        const init = {};
        list.forEach((q) => {
          init[q.maCauHoi] = { diem: q.diemToiDa || 5, ghiChu: "" };
        });
        setAnswers(init);
      });
    }
  }, [topic]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Dữ liệu User từ Auth:", user);
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

    await feedbackService.submitFeedback(payload);
    navigate("/user/home");
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

      {/* --- 2. VÙNG CUỘN CÂU HỎI--- */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          <form
            id="feedback-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {questions.map((q, idx) => (
              <div
                key={q.maCauHoi}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 transition-all hover:shadow-md"
              >
                <div className="flex gap-4 mb-4">
                  <span className="w-8 h-8 flex-shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm">
                    {idx + 1}
                  </span>
                  <p className="font-bold text-slate-700 leading-snug">
                    {q.tenCauHoi}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1 space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                      <FaStar className="text-amber-400" /> Mức điểm
                    </label>
                    <select
                      className="w-full p-3 bg-slate-50 border-none rounded-xl font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
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
                      <FaRegCommentDots className="text-indigo-400" /> Nhận xét
                      chi tiết
                    </label>
                    <textarea
                      required
                      placeholder="Vui lòng nhập cảm nhận của bạn..."
                      className="w-full p-3 bg-slate-50 border-none rounded-xl font-medium text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
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
            ))}
          </form>
        </div>
      </div>

      {/* --- 3. FOOTER NÚT BẤM CỐ ĐỊNH --- */}
      <div className="bg-white border-t border-slate-100 p-6 flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-3xl mx-auto">
          <button
            type="submit"
            form="feedback-form"
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-600 transition-all active:scale-95 uppercase tracking-widest"
          >
            Gửi đánh giá ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackFormPage;
