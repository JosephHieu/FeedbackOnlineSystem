function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="p-8 bg-white rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Tailwind v4 đã chạy! 🚀
        </h1>
        <p className="mt-4 text-gray-600 font-medium">
          Dự án FeedbackOnline bắt đầu thôi nào.
        </p>
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:ring-4 ring-blue-300">
          Tuyệt vời
        </button>
      </div>
    </div>
  );
}

export default App;
