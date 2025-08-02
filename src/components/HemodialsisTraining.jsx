import React, { useState } from "react";

export default function HemodialsisTraining() {
  const [info, setInfo] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  const openModal = (titleText, content) => {
    setTitle(titleText);
    setInfo(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setInfo("");
    setTitle("");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-center">آموزش همودیالیز</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
 

     

        <button
          onClick={() =>
            openModal(
              "انواع غشاء صافی",
              `🧪 انواع غشاء صافی:
 Low-flux: نفوذپذیری کمتر – برای اورمی ساده
 High-flux: نفوذپذیری بالا – حذف سموم با وزن مولکولی بالا
 High-efficiency: سطح بیشتر – حذف سریع‌تر مواد
 MCO/Super HF: برای مولکول‌های متوسط – نزدیک به هموفیلتراسیون`
            )
          }
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          انواع غشاء صافی
        </button>

       
      </div>

      {/* 🔲 Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl relative text-right">
            <h2 className="text-lg font-bold mb-3 text-blue-700">{title}</h2>
            <pre className="whitespace-pre-wrap font-[IRANSans] leading-relaxed text-sm text-gray-800">
              {info}
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
