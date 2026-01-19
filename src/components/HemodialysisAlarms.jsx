import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import {
 
  FaTachometerAlt,
  FaWater,
  FaFlask,
  FaWind,
  FaTint,
  FaWeight,
  FaThermometerHalf,
  FaExclamationTriangle,
  FaArrowLeft
} from "react-icons/fa";
import { Link } from "react-router-dom";

//  داده‌های آلارم جداگانه
const alarmData = [
  {
    title: "فشار شریانی (Arterial Pressure)",
    label: "فشار شریانی",
    content: `فشار شریانی (Arterial Pressure):
محدوده نرمال: 250- تا 100- mmHg

 فشار خیلی منفی (مثلاً 300-): احتمال گرفتگی در مسیر خون یا سرعت جریان بیش از حد
 فشار نزدیک صفر: مشکل در دسترسی شریانی یا جابه‌جایی سوزن`,
    color: "from-blue-500 to-cyan-600",
    icon: <FaTachometerAlt size={24} />
  },
  {
    title: "فشار وریدی (Venous Pressure)",
    label: "فشار وریدی",
    content: `فشار وریدی (Venous Pressure):
محدوده نرمال: 100+ تا 250+ mmHg

 بالای 250+: احتمال لخته یا جاگذاری نامناسب سوزن وریدی
 خیلی پایین: شل بودن اتصال یا نشتی در مسیر بازگشت`,
    color: "from-green-500 to-emerald-600",
    icon: <FaTachometerAlt size={24} />
  },
  {
    title: "فشار میان‌غشایی (TMP)",
    label: "فشار TMP",
    content: `TMP یا فشار میان‌غشایی (Transmembrane Pressure):
 اختلاف فشار بین خون و دیالیزیت در دو طرف غشاء صافی

 محدوده قابل قبول: تا 500–600 mmHg بسته به نوع فیلتر

 بالا بودن TMP نشانه:
▪︎ انسداد مسیر
▪︎ لخته شدن
▪︎ UF غیر ایمن`,
    color: "from-yellow-500 to-amber-600",
    icon: <FaWater size={24} />
  },
  {
    title: "هدایت الکتریکی (Conductivity)",
    label: "هدایت الکتریکی",
    content: `آلارم Conductivity:
 محدوده نرمال: 13.5 تا 14.5 mS/cm

 Low:
▪︎ محلول رقیق، خطای بیکربنات، قطع کنسانتره

 High:
▪︎ محلول غلیظ، خطای اختلاط

 None:
▪︎ سنسور خراب یا قطع آب

 خطرات: سردرد، تهوع، ایست قلبی

 اقدام: توقف دیالیز، بررسی سیستم، تماس با فنی`,
    color: "from-red-500 to-pink-600",
    icon: <FaFlask size={24} />
  },
  {
    title: "حباب هوا (Air Bubble)",
    label: "حباب هوا",
    content: `آلارم حباب هوا (Air Bubble):
 ورود هوا به سیستم خون بسیار خطرناک است

 علل:
▪︎ اتصال شل
▪︎ نشت از لاین

 اقدام فوری:
▪︎ توقف پمپ خون
▪︎ حذف هوا
▪︎ اطمینان از بسته بودن اتصالات`,
    color: "from-pink-500 to-rose-600",
    icon: <FaWind size={24} />
  },
  {
    title: "نشت خون (Blood Leak)",
    label: "نشت خون",
    content: `نشت خون (Blood Leak):
 خون وارد دیالیزیت شده

 علت:
▪︎ پارگی غشاء فیلتر

 اقدام:
▪︎ توقف فوری دیالیز
▪︎ تعویض صافی و مدار
▪︎ تماس با فنی`,
    color: "from-purple-500 to-indigo-600",
    icon: <FaTint size={24} />
  },
  {
    title: "محدودیت برداشت مایع (UF Limit)",
    label: "محدودیت UF",
    content: `UF Limit (محدودیت برداشت):
 برداشت مایع بیش از حد مجاز

 علل:
▪︎ تنظیم UF بیش از ظرفیت بیمار
▪︎ زمان دیالیز کوتاه

 علائم:
▪︎ افت فشار، کرامپ، تهوع

 اقدام: کاهش UF و بررسی تنظیمات`,
    color: "from-indigo-500 to-blue-600",
    icon: <FaWeight size={24} />
  },
  {
    title: "آلارم دما (Temperature)",
    label: "آلارم دما",
    content: `آلارم دما (Temperature):
 دمای نرمال دیالیز: حدود 36.5–37.5°C

 دمای پایین:
▪︎ سردی بیمار، هیپوترمی

 دمای بالا:
▪︎ تب، عفونت، یا خرابی گرم‌کن

 اقدام: بررسی گرم‌کن، تماس با فنی، تنظیم دما`,
    color: "from-orange-500 to-amber-600",
    icon: <FaThermometerHalf size={24} />
  },
];

// ✅ کامپوننت اصلی
export default function HemodialysisAlarms() {
  const [selectedAlarm, setSelectedAlarm] = useState(null);

  const openModal = (alarm) => {
    setSelectedAlarm(alarm);
  };

  const closeModal = () => {
    setSelectedAlarm(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* هدر */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <FaExclamationTriangle className="text-red-600" size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  راهنمای آلارم‌های همودیالیز
                </h1>
                <p className="text-gray-600 mt-1">شناسایی و عیب‌یابی آلارم‌های دستگاه همودیالیز</p>
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

        {/* کارت‌های آلارم */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {alarmData.map((alarm, index) => (
            <button
              key={index}
              onClick={() => openModal(alarm)}
              className="block group text-right"
            >
              <div className={`bg-gradient-to-r ${alarm.color} text-white rounded-xl shadow-lg p-6 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl h-full`}>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-full mb-4">
                    {alarm.icon}
                  </div>
                  <h2 className="text-lg font-bold mb-2">{alarm.title}</h2>
                  <p className="text-white text-opacity-90 text-sm leading-relaxed">
                    کلیک برای مشاهده راهنمای عیب‌یابی
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Modal */}
        {selectedAlarm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl relative">
              
              {/* هدر مودال */}
              <div className={`bg-gradient-to-r ${selectedAlarm.color} text-white p-6 rounded-t-2xl`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 p-2 rounded-full">
                      {selectedAlarm.icon}
                    </div>
                    <h2 className="text-xl font-bold">{selectedAlarm.title}</h2>
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
                  {selectedAlarm.content}
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