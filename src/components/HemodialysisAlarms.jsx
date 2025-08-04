import React, { useState } from "react";

// ✅ داده‌های آلارم جداگانه
const alarmData = [
  {
    title: "فشار شریانی (Arterial Pressure)",
    label: "فشار شریانی",
    content: `فشار شریانی (Arterial Pressure):
محدوده نرمال: 250- تا 100- mmHg

🔹 فشار خیلی منفی (مثلاً 300-): احتمال گرفتگی در مسیر خون یا سرعت جریان بیش از حد
🔹 فشار نزدیک صفر: مشکل در دسترسی شریانی یا جابه‌جایی سوزن`,
    color: "blue",
  },
  {
    title: "فشار وریدی (Venous Pressure)",
    label: "فشار وریدی",
    content: `فشار وریدی (Venous Pressure):
محدوده نرمال: 100+ تا 250+ mmHg

🔺 بالای 250+: احتمال لخته یا جاگذاری نامناسب سوزن وریدی
🔻 خیلی پایین: شل بودن اتصال یا نشتی در مسیر بازگشت`,
    color: "green",
  },
  {
    title: "فشار میان‌غشایی (TMP)",
    label: "TMP",
    content: `TMP یا فشار میان‌غشایی (Transmembrane Pressure):
➤ اختلاف فشار بین خون و دیالیزیت در دو طرف غشاء صافی

✅ محدوده قابل قبول: تا 500–600 mmHg بسته به نوع فیلتر

⬆ بالا بودن TMP نشانه:
▪︎ انسداد مسیر
▪︎ لخته شدن
▪︎ UF غیر ایمن`,
    color: "yellow",
  },
  {
    title: "هدایت الکتریکی (Conductivity)",
    label: "Conductivity",
    content: `آلارم Conductivity:
✅ محدوده نرمال: 13.5 تا 14.5 mS/cm

🔻 Low:
▪︎ محلول رقیق، خطای بیکربنات، قطع کنسانتره

🔺 High:
▪︎ محلول غلیظ، خطای اختلاط

❌ None:
▪︎ سنسور خراب یا قطع آب

⚠️ خطرات: سردرد، تهوع، ایست قلبی

✅ اقدام: توقف دیالیز، بررسی سیستم، تماس با فنی`,
    color: "red",
  },
  {
    title: "حباب هوا (Air Bubble)",
    label: "حباب هوا",
    content: `آلارم حباب هوا (Air Bubble):
⛔ ورود هوا به سیستم خون بسیار خطرناک است

📌 علل:
▪︎ اتصال شل
▪︎ نشت از لاین

✅ اقدام فوری:
▪︎ توقف پمپ خون
▪︎ حذف هوا
▪︎ اطمینان از بسته بودن اتصالات`,
    color: "pink",
  },
  {
    title: "نشت خون (Blood Leak)",
    label: "نشت خون",
    content: `نشت خون (Blood Leak):
🔴 خون وارد دیالیزیت شده

📌 علت:
▪︎ پارگی غشاء فیلتر

🛑 اقدام:
▪︎ توقف فوری دیالیز
▪︎ تعویض صافی و مدار
▪︎ تماس با فنی`,
    color: "purple",
  },
  {
    title: "محدودیت برداشت مایع (UF Limit)",
    label: "UF Limit",
    content: `UF Limit (محدودیت برداشت):
⏳ برداشت مایع بیش از حد مجاز

📌 علل:
▪︎ تنظیم UF بیش از ظرفیت بیمار
▪︎ زمان دیالیز کوتاه

⚠️ علائم:
▪︎ افت فشار، کرامپ، تهوع

✅ اقدام: کاهش UF و بررسی تنظیمات`,
    color: "indigo",
  },
  {
    title: "آلارم دما (Temperature)",
    label: "دما",
    content: `آلارم دما (Temperature):
✅ دمای نرمال دیالیز: حدود 36.5–37.5°C

🔻 دمای پایین:
▪︎ سردی بیمار، هیپوترمی

🔺 دمای بالا:
▪︎ تب، عفونت، یا خرابی گرم‌کن

✅ اقدام: بررسی گرم‌کن، تماس با فنی، تنظیم دما`,
    color: "orange",
  },
];

// ✅ نگاشت رنگ‌ها برای Tailwind کلاس‌ها
const colorMap = {
  blue: "bg-blue-500 hover:bg-blue-600",
  green: "bg-green-500 hover:bg-green-600",
  yellow: "bg-yellow-500 hover:bg-yellow-600",
  red: "bg-red-500 hover:bg-red-600",
  pink: "bg-pink-500 hover:bg-pink-600",
  purple: "bg-purple-500 hover:bg-purple-600",
  indigo: "bg-indigo-500 hover:bg-indigo-600",
  orange: "bg-orange-500 hover:bg-orange-600",
};

// ✅ کامپوننت اصلی
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
    <div className="p-4 max-w-5xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-center">آلارم‌های همودیالیز</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {alarmData.map((alarm, index) => (
          <button
            key={index}
            onClick={() => openModal(alarm.title, alarm.content)}
            className={`${colorMap[alarm.color]} text-white px-4 py-2 rounded`}
          >
            {alarm.label}
          </button>
        ))}
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
