import React, { useState } from "react";

export default function HemodialysisTraining() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const topics = [
    {
      title: "انواع غشاء صافی",
      content: ` انواع غشاء صافی:
- Low-flux: نفوذپذیری کمتر – برای اورمی ساده
- High-flux: نفوذپذیری بالا – حذف سموم با وزن مولکولی بالا
- High-efficiency: سطح بیشتر – حذف سریع‌تر مواد
- MCO / Super High-Flux: برای مولکول‌های متوسط – نزدیک به هموفیلتراسیون`,
    },
    
    
    
  ];

  const closeModal = () => setSelectedTopic(null);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-center text-indigo-700">آموزش همودیالیز</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => setSelectedTopic(topic)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded shadow text-center"
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* 🔲 Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md mx-4 sm:mx-auto p-6 rounded-lg shadow-xl relative text-right">
            <h2 className="text-lg font-bold mb-4 text-indigo-800">{selectedTopic.title}</h2>
            <pre className="whitespace-pre-wrap text-base leading-loose text-gray-800 font-sans">
              {selectedTopic.content}
            </pre>
            <button
              onClick={closeModal}
              className="absolute top-2 left-2 text-gray-500 hover:text-red-500 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
