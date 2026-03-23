import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { feedbackService } from "../../services/feedbackService";
import { FaArrowLeft, FaStar, FaRegCommentDots } from "react-icons/fa";

const FeedbackFormPage = () => {
  const { maTopic } = useParams();
  const { state } = useLocation();
  const topic = state?.topic;
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { id: {diem, ghiChu} }

  useEffect(() => {
    if (topic?.maTemplate) {
      feedbackService.getQuestionsByTemplate(topic.maTemplate).then((res) => {
        setQuestions(res.danhSachCauHoi || []);
        const init = {};
        res.danhSachCauHoi.forEach(
          (q) => (init[q.maCauHoi] = { diem: 5, ghiChu: "" }),
        );
        setAnswers(init);
      });
    }
  }, [topic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      maHocVien: "USER_ID_TU_TOKEN", // Cưng bóc từ JWT hoặc Context nhé
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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-100 p-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-all"
          >
            <FaArrowLeft />
          </button>
          <div className="flex-1">
            <h2 className="font-black text-slate-800 uppercase text-sm truncate">
              {topic?.tenTopic}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Trainer: {topic?.tenTrainer}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, idx) => (
            <div
              key={q.maCauHoi}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100"
            >
              <div className="flex gap-4 mb-4">
                <span className="w-8 h-8 flex-shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm">
                  {idx + 1}
                </span>
                <p className="font-bold text-slate-700 leading-snug">
                  {q.noiDungCauHoi}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Chọn điểm */}
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
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                      <option key={v} value={v}>
                        {v} Điểm
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ghi chú */}
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

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95"
            >
              GỬI ĐÁNH GIÁ NGAY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackFormPage;
