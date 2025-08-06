import React, { useState } from "react";

export default function PediatricHemodialysisTraining() {
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

  const topics = [
    {
      title: "فیزیولوژی و نیازهای ویژه کودکان",
      content: `👶 تفاوت‌های کودکان:
- حجم خون کمتر و حساس‌تر به برداشت مایع
- نیاز به کنترل دقیق الکترولیت‌ها
- ریسک بالاتر افت فشار`,
    },
    {
      title: "تنظیم دوز و زمان دیالیز در کودکان",
      content: `🕐 تنظیمات دستگاه:
- زمان دیالیز بر اساس وزن و BSA
- انتخاب فیلتر مناسب سایز کودک
- تنظیم UF و پمپ خون با دقت بالا`,
    },
    {
      title: "آماده‌سازی دستگاه برای کودک",
      content: `🛠️ آماده‌سازی:
- انتخاب صافی مخصوص کودک
- پرایم خط دیالیز با سالین بدون حباب
- دوز مناسب هپارین و عدم استفاده بیش از حد`,
    },
    {
      title: "مراقبت از دسترسی عروقی",
      content: `🩺 کاتترهای موقتی:
- استفاده از پانسمان تمیز و شفاف
- پرهیز از کشش یا فشار روی کاتتر
- آموزش والدین برای مراقبت در منزل`,
    },
    {
      title: "داروهای رایج در دیالیز کودکان",
      content: `💊 داروها:
- EPO و آهن تزریقی با دوز وزنی
- ویتامین D فعال (Calcitriol)
- آنتی‌بیوتیک با دوز مناسب کلیوی`,
    },
    {
      title: "تغذیه مناسب کودک دیالیزی",
      content: `🥗 نکات تغذیه‌ای:
- محدودیت پتاسیم (موز، پرتقال)
- پروتئین کافی برای رشد کودک
- مکمل‌های رشد و ویتامین B, C`,
    },
    {
      title: "تعامل با کودک و خانواده",
      content: `🧸 روان‌شناسی کودک:
- کاهش اضطراب با بازی و سرگرمی
- آگاه‌سازی والدین از روند درمان
- آموزش والدین برای همکاری در خانه`,
    },
    {
      title: "مقابله با اورژانس‌های دیالیز کودک",
      content: `🚨 اورژانس‌ها:
- افت فشار خون: توقف دیالیز، بالا آوردن پا
- تشنج: تزریق دارو و تماس با پزشک
- حساسیت به فیلتر: تعویض فیلتر، داروهای ضد آلرژی`,
    },
    {
      title: "پایش رشد و تکامل کودک",
      content: `📊 مانیتورینگ رشد:
- اندازه‌گیری وزن و قد ماهانه
- نمودار رشد و ارجاع به متخصص تغذیه
- بررسی تأثیر دیالیز روی رشد استخوان`,
    },
    {
      title: "آموزش والدین برای مراقبت در خانه",
      content: `👨‍👩‍👧 آموزش خانواده:
- نحوه مراقبت از کاتتر در خانه
- علائم هشدار: تب، تورم، قرمزی، ضعف شدید
- رعایت محدودیت مایعات و داروها`,
    },
  ];

  return (
    <div
      className="p-4 max-w-5xl mx-auto bg-white rounded-xl shadow-md space-y-6"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-center text-blue-800">
        آموزش جامع پرسنل همودیالیز کودکان
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => openModal(topic.title, topic.content)}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 text-sm text-center shadow"
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl relative text-right">
            <h2 className="text-lg font-bold mb-4 text-teal-700">{title}</h2>
            <pre className="whitespace-pre-wrap leading-relaxed text-sm text-gray-800">
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
