import React, { useState } from "react";

export default function HemodialysisAlarms() {
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
      <h1 className="text-xl font-bold text-center">آلارم‌های همودیالیز</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <button
          onClick={() =>
            openModal(
              "فشار شریانی (Arterial Pressure)",
              `فشار شریانی (Arterial Pressure):
محدوده نرمال: 250- تا 100 -mmHg

🔹 فشار خیلی منفی (مثلاً 300-): احتمال گرفتگی در مسیر خون یا سرعت جریان بیش از حد
🔹 فشار نزدیک صفر: مشکل در دسترسی شریانی یا جابه‌جایی سوزن`
            )
          }
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          فشار شریانی
        </button>

        <button
          onClick={() =>
            openModal(
              "فشار وریدی (Venous Pressure)",
              `فشار وریدی (Venous Pressure):
محدوده نرمال:100+ تا 250 +mmHg

 بالای +250: احتمال لخته یا جاگذاری نامناسب سوزن وریدی
 خیلی پایین: شل بودن اتصال یا نشتی در مسیر بازگشت`
            )
          }
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          فشار وریدی
        </button>

        <button
          onClick={() =>
            openModal(
              "فشار میان‌غشایی (TMP)",
              `TMP یا فشار میان‌غشایی (Transmembrane Pressure):
 تعریف: اختلاف فشار بین خون و دیالیزیت در دو طرف غشاء صافی

 نقش: تعیین شدت برداشت مایع از خون (UF)

محدوده قابل قبول: تا 500–600 mmHg بسته به نوع فیلتر

⬆ بالا بودن TMP می‌تواند نشانه‌ی:
1- انسداد مسیر یا صافی
2- لخته شدن خون
3- UF زیاد و غیر ایمن باشد`
            )
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          فشار میان‌غشایی (TMP)
        </button>

        <button
          onClick={() =>
            openModal(
              "هدایت الکتریکی (Conductivity)",
              ` آلارم Conductivity (هدایت الکتریکی):
محدوده نرمال: 13.5 تا 14.5 mS/cm

 Low Conductivity:
– محلول خیلی رقیق (کم سدیم)
– قطع کنسانتره، خرابی پمپ بیکربنات، خطای اختلاط

 High Conductivity:
– محلول خیلی غلیظ (زیاد سدیم)
–  اضافه‌تزریق کنسانتره، اشتباه در ترکیب

 No Conductivity:
– سنسور خراب یا قطع بودن آب

⚠️ خطرات: سردرد، تهوع، افت فشار، ایست قلبی

 اقدام فوری: توقف دیالیز، بررسی پمپ و محلول‌ها، تماس با فنی`
            )
          }
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          هدایت الکتریکی (Conductivity)
        </button>
      </div>

      {/* Modal */}
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
