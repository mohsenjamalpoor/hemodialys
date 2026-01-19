import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { 
  FaFilter, 
  FaVial, 
  FaFlask, 
  FaExclamationTriangle, 
  FaHeartbeat, 
  FaAppleAlt,

  FaGraduationCap,
  FaArrowLeft
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function HemodialysisTraining() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const topics = [
    {
      title: "انواع غشاء صافی",
      icon: <FaFilter size={24} />,
      content: `انواع غشاء صافی:
- Low-flux: نفوذپذیری کمتر – برای اورمی ساده
- High-flux: نفوذپذیری بالا – حذف سموم با وزن مولکولی بالا
- High-efficiency: سطح بیشتر – حذف سریع‌تر مواد
- MCO / Super High-Flux: برای مولکول‌های متوسط – نزدیک به هموفیلتراسیون`,
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "محلول پتاسیم ۱",
      icon: <FaVial size={24} />,
      content: `محلول پتاسیم ۱:
- پتاسیم کم یا صفر دارد.
- برای بیمارانی که پتاسیم خونشان بالا است (هیپرکالمی).
- هدف: کاهش پتاسیم خون از طریق دیالیز و جلوگیری از عوارض قلبی.`,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "محلول پتاسیم ۲",
      icon: <FaVial size={24} />,
      content: `محلول پتاسیم ۲:
- پتاسیم در حد متوسط دارد.
- مناسب بیمارانی که پتاسیم خونشان در حد نرمال یا نزدیک به نرمال است.
- هدف: حفظ تعادل پتاسیم بدون کاهش یا افزایش زیاد.`,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "محلول پتاسیم ۳",
      icon: <FaVial size={24} />,
      content: `محلول پتاسیم ۳:
- پتاسیم بالاتری دارد.
- برای بیمارانی که پتاسیم خونشان پایین است (هیپوکالمی).
- هدف: تامین پتاسیم مورد نیاز بدن و جلوگیری از عوارض کمبود پتاسیم.`,
      color: "from-orange-500 to-amber-600"
    },
    {
      title: "پودر بی‌کربنات در محلول دیالیز",
      icon: <FaFlask size={24} />,
      content: `پودر بی‌کربنات (NaHCO3):
- نقش اصلی: تنظیم تعادل اسید-باز خون.
- در بیماران با نارسایی کلیه، اسیدوز متابولیک شایع است.
- بی‌کربنات به عنوان بافر عمل کرده و اسید اضافی خون را خنثی می‌کند.
- باعث افزایش pH خون و بهبود وضعیت بیمار می‌شود.`,
      color: "from-teal-500 to-green-600"
    },
    {
      title: "علائم اورژانسی حین دیالیز",
      icon: <FaExclamationTriangle size={24} />,
      content: `- افت فشار خون (هیپوتانسیون)
- تهوع و استفراغ
- گرفتگی عضلات
- سردرد یا سرگیجه
- واکنش‌های آلرژیک به صافی یا محلول`,
      color: "from-red-500 to-pink-600"
    },
    {
      title: "مراقبت از دسترسی عروقی (فیستول/کاتتر)",
      icon: <FaHeartbeat size={24} />,
      content: `- همیشه محل را تمیز و خشک نگه دارید.
- از فشار یا خوابیدن روی دست فیستول خودداری کنید.
- در صورت قرمزی، تورم یا درد فوراً به پرستار اطلاع دهید.
- هر روز نبض فیستول را بررسی کنید.`,
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "توصیه‌های تغذیه‌ای",
      icon: <FaAppleAlt size={24} />,
      content: `- محدودیت مصرف نمک و مایعات
- کاهش مصرف پتاسیم (مگر در هیپوکالمی)
- محدودیت فسفر (نوشابه، لبنیات پرچرب، مغزها)
- مصرف پروتئین کافی برای جبران دفع در دیالیز`,
      color: "from-indigo-500 to-blue-600"
    },
  ];

  const closeModal = () => setSelectedTopic(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* هدر */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaGraduationCap className="text-blue-600" size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  آموزش جامع همودیالیز
                </h1>
                <p className="text-gray-600 mt-1">مرجع کامل آموزش‌های تخصصی همودیالیز کودکان</p>
              </div>
            </div>
                <Link
              to="/hemo"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft />
              <span>بازگشت</span>
            </Link>
          </div>
        </div>

        {/* کارت‌های آموزشی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topics.map((topic, index) => (
            <button
              key={index}
              onClick={() => setSelectedTopic(topic)}
              className="block group text-right"
            >
              <div className={`bg-gradient-to-r ${topic.color} text-white rounded-xl shadow-lg p-6 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl h-full`}>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-full mb-4">
                    {topic.icon}
                  </div>
                  <h2 className="text-lg font-bold mb-2">{topic.title}</h2>
                  <p className="text-white text-opacity-90 text-sm leading-relaxed">
                    کلیک برای مشاهده جزئیات
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Modal */}
        {selectedTopic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl relative">
              
              {/* هدر مودال */}
              <div className={`bg-gradient-to-r ${selectedTopic.color} text-white p-6 rounded-t-2xl`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 p-2 rounded-full">
                      {selectedTopic.icon}
                    </div>
                    <h2 className="text-xl font-bold">{selectedTopic.title}</h2>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 transition-colors duration-200 p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                    aria-label="بستن پنجره"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>

              {/* محتوای مودال */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-base leading-loose text-gray-800 font-sans text-right">
                  {selectedTopic.content}
                </pre>
              </div>

              {/* فوتر مودال */}
              <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl">
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    بستن
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

     

      </div>
    </div>
  );
}