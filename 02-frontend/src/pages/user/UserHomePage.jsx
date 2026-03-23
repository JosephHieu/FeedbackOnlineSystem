import React, { useState, useEffect } from "react";
import { feedbackService } from "../../services/feedbackService";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaCheckCircle,
  FaChevronRight,
  FaRegClock,
} from "react-icons/fa";

const UserHomePage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    feedbackService
      .getMyTopics()
      .then((res) => setTopics(res || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen font-bold text-slate-400">
        Đang tải danh sách...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
              Chọn Topic cần Feedback
            </h1>
            <p className="text-slate-400 font-bold text-sm mt-1">
              Bạn có {topics.filter((t) => !t.isCompleted).length} chủ đề cần
              hoàn thành
            </p>
          </div>
        </div>

        {/* Grid Danh sách */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <div
              key={topic.maTopic}
              onClick={() =>
                !topic.isCompleted &&
                navigate(`/user/feedback/${topic.maTopic}`, {
                  state: { topic },
                })
              }
              className={`relative overflow-hidden p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                topic.isCompleted
                  ? "bg-slate-100/50 border-slate-100 opacity-80 cursor-default"
                  : "bg-white border-white shadow-sm hover:shadow-xl hover:border-indigo-500 cursor-pointer active:scale-[0.98]"
              }`}
            >
              <div className="flex items-center gap-5">
                <div
                  className={`p-4 rounded-2xl ${topic.isCompleted ? "bg-slate-200 text-slate-400" : "bg-indigo-50 text-indigo-600"}`}
                >
                  <FaBookOpen size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-700 text-lg leading-tight">
                    {topic.tenTopic}
                  </h3>
                  <p className="text-xs font-black text-slate-400 uppercase mt-1 tracking-wider">
                    Trainer: {topic.tenTrainer}
                  </p>
                </div>
                {!topic.isCompleted ? (
                  <FaChevronRight className="text-indigo-200 group-hover:text-indigo-500" />
                ) : (
                  <FaCheckCircle className="text-emerald-500" size={20} />
                )}
              </div>

              {/* Tag trạng thái */}
              <div className="mt-4 flex gap-2">
                {topic.isCompleted ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase rounded-full">
                    Hoàn thành
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-black uppercase rounded-full flex items-center gap-1">
                    <FaRegClock /> Đang chờ
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;
