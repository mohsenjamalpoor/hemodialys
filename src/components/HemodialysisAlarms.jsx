import React, { useState } from "react";
import { 
  FiX,
  FiAlertTriangle,
  FiActivity,
  FiWind,
  FiZap,
  FiAlertCircle,
  FiArrowLeft,
  FiChevronRight,
  FiInfo,
  FiClock,
  FiHelpCircle,
} from "react-icons/fi";
import {
  FaShieldAlt,
  FaUserMd,
  FaBookMedical,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  GiBlood,
  GiPressureCooker,
  GiWaterDrop,
} from "react-icons/gi";
import {
  MdOutlineEmergency,
  MdSpeed,
} from "react-icons/md";
import {
  TbTemperature,
  TbGauge,
} from "react-icons/tb";
import { Link } from "react-router-dom";

// داده‌های آلارم
const alarmData = [
  {
    id: 1,
    title: "فشار شریانی (Arterial Pressure)",
    label: "فشار شریانی",
    content: `فشار شریانی (Arterial Pressure):

محدوده نرمال: 250- تا 100- mmHg

فشار خیلی منفی (مثلاً 300-): 
• احتمال گرفتگی در مسیر خون 
• سرعت جریان بیش از حد
• بررسی دسترسی عروقی

فشار نزدیک صفر:
• مشکل در دسترسی شریانی
• جابه‌جایی سوزن
• نشتی در اتصالات

اقدامات فوری:
1. توقف پمپ خون
2. بررسی وضعیت سوزن
3. کنترل اتصالات
4. تنظیم سرعت پمپ خون
5. تماس با پزشک در صورت نیاز`,
    color: "from-blue-500 via-blue-600 to-cyan-500",
    icon: <MdSpeed className="text-white text-2xl" />,
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
    priority: "بالا",
    responseTime: "فوری",
    category: "فشار",
    risk: "خطر متوسط",
    frequency: "شایع"
  },
  {
    id: 2,
    title: "فشار وریدی (Venous Pressure)",
    label: "فشار وریدی",
    content: `فشار وریدی (Venous Pressure):

محدوده نرمال: 100+ تا 250+ mmHg

بالای 250+:
• احتمال لخته در کاتتر
• جاگذاری نامناسب سوزن وریدی
• انسداد بازگشت

خیلی پایین:
• شل بودن اتصال
• نشتی در مسیر بازگشت
• مشکل در پمپ خون

اقدامات فوری:
1. بررسی وضعیت کاتتر
2. کنترل اتصالات
3. شستشوی کاتتر
4. ادامه با احتیاط
5. گزارش به پزشک`,
    color: "from-green-500 via-emerald-600 to-teal-500",
    icon: <GiPressureCooker className="text-white text-2xl" />,
    iconBg: "bg-gradient-to-br from-green-500 to-teal-600",
    priority: "متوسط",
    responseTime: "۱۵ دقیقه",
    category: "فشار",
    risk: "خطر کم",
    frequency: "متوسط"
  },
  {
    id: 3,
    title: "فشار میان‌غشایی (TMP)",
    label: "فشار TMP",
    content: `TMP یا فشار میان‌غشایی (Transmembrane Pressure):

محدوده قابل قبول: تا ۵۰۰–۶۰۰ mmHg

بالا بودن TMP نشانه:
• انسداد مسیر صافی
• لخته شدن در صافی
• UF غیر ایمن
• پارگی غشاء

پایین بودن TMP نشانه:
• نشتی در سیستم
• مشکل در پمپ UF

اقدامات فوری:
1. کاهش UF
2. بررسی وضعیت صافی
3. تنظیم فشار
4. تعویض صافی در صورت نیاز
5. ثبت در پرونده`,
    color: "from-yellow-500 via-amber-600 to-orange-500",
    icon: <TbGauge className="text-white text-2xl" />,
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
    priority: "بالا",
    responseTime: "فوری",
    category: "فشار",
    risk: "خطر بالا",
    frequency: "نادر"
  },
  {
    id: 4,
    title: "هدایت الکتریکی (Conductivity)",
    label: "هدایت الکتریکی",
    content: `آلارم Conductivity:

محدوده نرمال: ۱۳.۵ تا ۱۴.۵ mS/cm

Low Conductivity:
• محلول رقیق
• خطای بیکربنات
• قطع کنسانتره
• مشکل در میکس

High Conductivity:
• محلول غلیظ
• خطای اختلاط
• آلودگی کنسانتره

خطرات:
• سردرد، تهوع
• ایست قلبی
• عدم تعادل الکترولیتی

اقدام فوری:
1. توقف دیالیز
2. بررسی سیستم میکس
3. تماس با بخش فنی
4. گزارش فوری
5. پایش بیمار`,
    color: "from-red-500 via-pink-600 to-rose-500",
    icon: <FiZap className="text-white text-2xl" />,
    iconBg: "bg-gradient-to-br from-red-500 to-rose-600",
    priority: "بحرانی",
    responseTime: "فوری",
    category: "شیمیایی",
    risk: "خطر بسیار بالا",
    frequency: "نادر"
  },
  {
    id: 5,
    title: "حباب هوا (Air Bubble)",
    label: "حباب هوا",
    content: `آلارم حباب هوا (Air Bubble):

ورود هوا به سیستم خون بسیار خطرناک است

علل شایع:
• اتصالات شل
• نشت از لاین
• عدم پرایم مناسب
• سطح پایین مخزن

اقدامات فوری:
1. توقف فوری پمپ خون
2. حذف هوا از سیستم
3. بررسی اتصالات
4. کنترل سطح مخزن
5. بررسی وضعیت بیمار

خطر آمبولی هوا:
• سکته مغزی
• ایست قلبی
• مرگ ناگهانی`,
    color: "from-pink-500 via-rose-600 to-fuchsia-500",
    icon: <FiWind className="text-white text-2xl" />,
    iconBg: "bg-gradient-to-br from-pink-500 to-fuchsia-600",
    priority: "بحرانی",
    responseTime: "فوری",
    category: "ایمنی",
    risk: "خطر بسیار بالا",
    frequency: "نادر"
  },
  {
    id: 6,
    title: "نشت خون (Blood Leak)",
    label: "نشت خون",
    content: `نشت خون (Blood Leak):

خون وارد دیالیزیت شده

علل:
• پارگی غشاء فیلتر
• مشکل در سیگل
• فشار بالا

اقدامات فوری:
1. توقف فوری دیالیز
2. کلیمپ کردن لاین‌ها
3. تعویض صافی و مدار
4. تماس با بخش فنی
5. گزارش حادثه

خطرات:
• خونریزی
• عفونت
• شوک هیپوولمیک`,
    color: "from-purple-500 via-indigo-600 to-violet-500",
    icon: <GiBlood className="text-white text-2xl" />,
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-600",
    priority: "بحرانی",
    responseTime: "فوری",
    category: "ایمنی",
    risk: "خطر بالا",
    frequency: "نادر"
  },
  {
    id: 7,
    title: "محدودیت برداشت مایع (UF Limit)",
    label: "محدودیت UF",
    content: `UF Limit (محدودیت برداشت):

برداشت مایع بیش از حد مجاز

علل شایع:
• تنظیم UF بیش از ظرفیت بیمار
• زمان دیالیز کوتاه
• خطای محاسباتی دستگاه

علائم بیمار:
• افت فشار خون
• کرامپ عضلانی
• تهوع و استفراغ

اقدامات فوری:
1. کاهش UF فوری
2. بررسی تنظیمات بیمار
3. ارزیابی وزن خشک
4. ادامه با UF کاهش یافته
5. پایش علائم حیاتی`,
    color: "from-indigo-500 via-blue-600 to-sky-500",
    icon: <GiWaterDrop className="text-white text-2xl" />,
    iconBg: "bg-gradient-to-br from-indigo-500 to-sky-600",
    priority: "متوسط",
    responseTime: "۱۰ دقیقه",
    category: "مایعات",
    risk: "خطر متوسط",
    frequency: "شایع"
  },
  {
    id: 8,
    title: "آلارم دما (Temperature)",
    label: "آلارم دما",
    content: `آلارم دما (Temperature):

دمای نرمال دیالیز: حدود ۳۶.۵–۳۷.۵°C

علل هشدار دمای پایین:
• سردی بیمار، هیپوترمی
• خرابی گرم‌کن دستگاه
• آب سرد ورودی

علل هشدار دمای بالا:
• تب بیمار
• عفونت فعال
• خرابی کنترل دما

اقدامات فوری:
1. بررسی گرم‌کن دستگاه
2. کنترل دمای بیمار
3. تماس با بخش فنی
4. تنظیم دما
5. ثبت در پرونده`,
    color: "from-orange-500 via-amber-600 to-yellow-500",
    icon: <TbTemperature className="text-white text-2xl" />,
    iconBg: "bg-gradient-to-br from-orange-500 to-yellow-600",
    priority: "متوسط",
    responseTime: "۱۵ دقیقه",
    category: "حرارتی",
    risk: "خطر کم",
    frequency: "نادر"
  }
];

// کامپوننت آلارم کارت
const AlarmCard = ({ alarm, onClick }) => (
  <button
    onClick={() => onClick(alarm)}
    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-right w-full"
  >
    {/* کارت اصلی */}
    <div className={`bg-gradient-to-br ${alarm.color} p-6 h-full`}>
      <div className="flex flex-col items-end h-full">
        {/* آیکون و وضعیت */}
        <div className="flex justify-between items-start w-full mb-4">
          <div className={`p-3 rounded-xl ${alarm.iconBg} shadow-lg`}>
            {alarm.icon}
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-3 py-1 rounded-full text-xs font-bold mb-2 ${
              alarm.priority === 'بحرانی' ? 'bg-red-500 text-white' :
              alarm.priority === 'بالا' ? 'bg-orange-500 text-white' :
              'bg-yellow-500 text-gray-800'
            }`}>
              {alarm.priority}
            </span>
            <div className="flex items-center gap-1 text-white/80 text-xs">
              <FiClock size={12} />
              <span>{alarm.responseTime}</span>
            </div>
          </div>
        </div>

        {/* عنوان و توضیحات */}
        <div className="w-full">
          <h3 className="text-white font-bold text-lg mb-2 text-right leading-tight">
            {alarm.title}
          </h3>
          <div className="flex items-center justify-between text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                {alarm.category}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
              <span className="text-xs">مشاهده جزئیات</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* افکت هور */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </button>
);

// کامپوننت هدر
const Header = () => (
  <header className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 text-white shadow-2xl rounded-2xl overflow-hidden mb-8">
    <div className="container mx-auto px-6 py-8 relative">
      {/* افکت پس‌زمینه */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <FaExclamationTriangle className="text-white text-3xl"  size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                راهنمای آلارم‌های دستگاه همودیالیز
              </h1>
              <p className="text-blue-100 text-lg">
                شناسایی، عیب‌یابی و اقدام فوری برای آلارم‌های دستگاه
              </p>
            </div>
          </div>
          
          <Link
            to="/hemo"
            className="flex items-center gap-3 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            <FiArrowLeft />
            <span className="font-semibold">بازگشت به صفحه اصلی</span>
          </Link>
        </div>
      </div>
    </div>
  </header>
);

// کامپوننت مودال جزئیات
const AlarmModal = ({ alarm, onClose }) => {
  if (!alarm) return null;

  // تابع برای تبدیل متن به JSX با استایل‌های مختلف
  const renderContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // بررسی برای تیترها
      if (line.includes(':')) {
        const parts = line.split(':');
        return (
          <div key={index} className="mb-2">
            <span className="font-bold text-blue-700">{parts[0]}:</span>
            <span className="text-gray-800">{parts[1]}</span>
          </div>
        );
      }
      
      // بررسی برای لیست‌ها
      if (line.startsWith('•') || line.startsWith('-')) {
        return (
          <div key={index} className="flex items-start gap-2 mr-4 mb-1">
            <span className="text-red-500 mt-1">•</span>
            <span className="text-gray-700">{line.substring(2)}</span>
          </div>
        );
      }
      
      // بررسی برای اقدامات
      if (line.match(/^\d+\./)) {
        return (
          <div key={index} className="flex items-start gap-2 mr-4 mb-2">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">
              {line.match(/^\d+/)[0]}
            </span>
            <span className="text-gray-800">{line.substring(line.indexOf('.') + 2)}</span>
          </div>
        );
      }
      
      // متن معمولی
      return (
        <p key={index} className="text-gray-800 mb-2 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
        {/* هدر مودال */}
        <div className={`bg-gradient-to-r ${alarm.color} text-white p-6 relative overflow-hidden`}>
          {/* افکت */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  {alarm.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{alarm.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      {alarm.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock size={14} />
                      {alarm.responseTime}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-xl"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* اطلاعات آلارم */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* کارت‌های اطلاعات */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <FiAlertTriangle className="text-blue-600" />
                <h4 className="font-bold text-blue-700">اولویت</h4>
              </div>
              <div className={`text-center py-2 rounded-lg font-bold ${
                alarm.priority === 'بحرانی' ? 'bg-red-100 text-red-700' :
                alarm.priority === 'بالا' ? 'bg-orange-100 text-orange-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {alarm.priority}
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <FiClock className="text-green-600" />
                <h4 className="font-bold text-green-700">زمان پاسخ</h4>
              </div>
              <div className="text-center py-2 bg-green-100 text-green-700 rounded-lg font-bold">
                {alarm.responseTime}
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <FiActivity className="text-purple-600" />
                <h4 className="font-bold text-purple-700">میزان خطر</h4>
              </div>
              <div className="text-center py-2 bg-purple-100 text-purple-700 rounded-lg font-bold">
                {alarm.risk}
              </div>
            </div>
          </div>

          {/* محتوای اصلی */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="space-y-4 text-right">
              {renderContent(alarm.content)}
            </div>
          </div>

          {/* نکات مهم */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
            <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
              <FiAlertCircle className="text-amber-600" />
              نکات مهم و احتیاط‌ها
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <FiInfo className="text-blue-500 mt-1" />
                <span>آلارم را نادیده نگیرید و بلافاصله اقدام کنید</span>
              </li>
              <li className="flex items-start gap-2">
                <FaUserMd className="text-green-500 mt-1" />
                <span>در صورت نیاز با پزشک یا بخش فنی تماس بگیرید</span>
              </li>
              <li className="flex items-start gap-2">
                <FaBookMedical className="text-purple-500 mt-1" />
                <span>تمامی اقدامات را در پرونده بیمار ثبت کنید</span>
              </li>
              <li className="flex items-start gap-2">
                <FaShieldAlt className="text-red-500 mt-1" />
                <span>سلامت بیمار اولویت اول است</span>
              </li>
            </ul>
          </div>
        </div>

        {/* فوتر مودال */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <FiHelpCircle />
              <span className="text-sm">برای کمک بیشتر با واحد فنی تماس بگیرید</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors duration-300"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// کامپوننت اصلی - بدون جستجو و فیلتر
export default function HemodialysisAlarms() {
  const [selectedAlarm, setSelectedAlarm] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* بخش کارت‌های آلارم - مستقیماً بعد از هدر */}
        <div className="mb-8">
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {alarmData.map(alarm => (
              <AlarmCard
                key={alarm.id}
                alarm={alarm}
                onClick={setSelectedAlarm}
              />
            ))}
          </div>
        </div>

        {/* راهنمای اضطراری */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-red-100 p-3 rounded-xl">
              <MdOutlineEmergency className="text-red-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-800">دستورالعمل اضطراری</h3>
              <p className="text-red-600">در صورت بروز آلارم‌های بحرانی</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-red-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <h4 className="font-bold text-red-700">اقدام اولیه</h4>
              </div>
              <p className="text-gray-700 text-sm">
                اولین اقدام: حفظ آرامش و توقف پمپ خون در صورت خطر
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-red-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <h4 className="font-bold text-red-700">تماس فوری</h4>
              </div>
              <p className="text-gray-700 text-sm">
                بلافاصله با پزشک مسئول و بخش فنی تماس بگیرید
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-red-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <h4 className="font-bold text-red-700">مستندسازی</h4>
              </div>
              <p className="text-gray-700 text-sm">
                تمام اقدامات و وضعیت بیمار را دقیق ثبت کنید
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* مودال جزئیات */}
      {selectedAlarm && (
        <AlarmModal
          alarm={selectedAlarm}
          onClose={() => setSelectedAlarm(null)}
        />
      )}

      {/* فوتر */}
      <footer className="mt-12 text-center text-gray-600 text-sm">
        <p className="mb-2">این راهنما به‌منظور آموزش و کمک به پرسنل پرستار بخش همودیالیز تهیه شده است</p>
        <p className="text-gray-500">© 2024 سیستم مدیریت آلارم‌های همودیالیز</p>
      </footer>
    </div>
  );
}