import React, { useState } from "react";
import { FiX } from "react-icons/fi";

export default function HemodialysisTraining() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const topics = [
    {
      title: "انواع غشاء صافی",
      content: `انواع غشاء صافی:
- Low-flux: نفوذپذیری کمتر – برای اورمی ساده
- High-flux: نفوذپذیری بالا – حذف سموم با وزن مولکولی بالا
- High-efficiency: سطح بیشتر – حذف سریع‌تر مواد
- MCO / Super High-Flux: برای مولکول‌های متوسط – نزدیک به هموفیلتراسیون`,
    },
    {
      title: "محلول پتاسیم ۱",
      content: `محلول پتاسیم ۱:
- پتاسیم کم یا صفر دارد.
- برای بیمارانی که پتاسیم خونشان بالا است (هیپرکالمی).
- هدف: کاهش پتاسیم خون از طریق دیالیز و جلوگیری از عوارض قلبی.`,
    },
    {
      title: "محلول پتاسیم ۲",
      content: `محلول پتاسیم ۲:
- پتاسیم در حد متوسط دارد.
- مناسب بیمارانی که پتاسیم خونشان در حد نرمال یا نزدیک به نرمال است.
- هدف: حفظ تعادل پتاسیم بدون کاهش یا افزایش زیاد.`,
    },
    {
      title: "محلول پتاسیم ۳",
      content: `محلول پتاسیم ۳:
- پتاسیم بالاتری دارد.
- برای بیمارانی که پتاسیم خونشان پایین است (هیپوکالمی).
- هدف: تامین پتاسیم مورد نیاز بدن و جلوگیری از عوارض کمبود پتاسیم.`,
    },
    {
      title: "پودر بی‌کربنات در محلول دیالیز",
      content: `پودر بی‌کربنات (NaHCO3):
- نقش اصلی: تنظیم تعادل اسید-باز خون.
- در بیماران با نارسایی کلیه، اسیدوز متابولیک شایع است.
- بی‌کربنات به عنوان بافر عمل کرده و اسید اضافی خون را خنثی می‌کند.
- باعث افزایش pH خون و بهبود وضعیت بیمار می‌شود.`,
    },
  ];

  const closeModal = () => setSelectedTopic(null);

  return (
    <div
      className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl space-y-6"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-center text-indigo-700">
        آموزش همودیالیز
      </h1>

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

      {/* Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md mx-4 sm:mx-auto p-6 rounded-lg shadow-xl relative text-right">
            <h2 className="text-lg font-bold mb-4 text-indigo-800">
              {selectedTopic.title}
            </h2>
            <pre className="whitespace-pre-wrap text-base leading-loose text-gray-800 font-sans">
              {selectedTopic.content}
            </pre>
            <button
              onClick={closeModal}
              className="absolute top-2 left-2 text-gray-500 hover:text-red-500 text-xl font-bold"
              aria-label="بستن پنجره"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
