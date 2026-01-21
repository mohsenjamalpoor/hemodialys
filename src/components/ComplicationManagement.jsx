import React, { useState, useMemo } from 'react';
import { 
  BiHeart, 
  BiBrain,
  BiCapsule,
  BiDroplet,
  BiThermometer,
  BiMessageError
} from 'react-icons/bi';
import { 
  FiX, 
  FiSearch, 
  FiFilter,
  FiAlertTriangle,
  FiActivity,
  FiAlertOctagon
} from 'react-icons/fi';
import { 
  GiBlood,
  GiLungs,
  GiMuscleUp,
  GiStomach,
  GiBurningDot,
  GiChemicalDrop
} from 'react-icons/gi';
import { 
  MdBloodtype,
  MdLocalHospital,
  MdOutlineSick,
  MdOutlineWaterDrop,
  MdOutlineSecurity,
  MdOutlineEmergency
} from 'react-icons/md';
import { 
  FaHeartbeat,
  FaTemperatureHigh,
  FaLungs,
  FaAllergies,
  FaSkull,
  FaExclamationTriangle,
  FaHandHoldingMedical,
  FaProcedures,
  FaNotesMedical
} from 'react-icons/fa';
import { 
  TbHeartbeat,
  TbBrain,
  TbTemperature,
  TbDropletFilled,
  TbMedicalCross,
  TbAlertTriangle
} from 'react-icons/tb';
import { 
  IoMdHeart,
  IoMdWater,
  IoMdWarning,
  IoMdMedical
} from 'react-icons/io';

const complicationsData = [
  {
    id: 1,
    title: "افت فشار خون (Hypotension)",
    category: "قلبی",
    description: "شایع‌ترین عارضه حین همودیالیز با شیوع ۲۰-۳۰٪",
    signs: "بی‌حالی، تهوع، تعریق، کاهش سطح هوشیاری، تاری دید",
    commonCause: "برداشت زیاد UF، Qb بالا، وزن خشک اشتباه، اتونومیک نوروپاتی",
    treatment: " توقف UF\n تزریق سالین 5–10 mL/kg IV\n ترندلنبرگ\n کاهش Qb و بازبینی وزن خشک\n کاهش دمای دیالیز\n استفاده از سدیم پروفایلینگ",
    prevention: "تعیین دقیق وزن خشک، پایش مداوم علائم حیاتی، تنظیم مناسب UF",
    severity: "بالا",
    prevalence: "بسیار شایع"
  },
  {
    id: 2,
    title: "کرامپ عضلانی",
    category: "عضلانی",
    description: "انقباضات دردناک عضلات حین یا پس از دیالیز",
    signs: "درد و گرفتگی پاها یا دست‌ها، اسپاسم عضلانی",
    commonCause: "برداشت مایع زیاد، هایپوناترمی، کاهش کلسیم، اسیدوز",
    treatment: " توقف UF\n 5–10 mL/kg نرمال سالین\n گرمای موضعی\n آرام‌سازی کودک\n کشش ملایم عضلات\n مکمل منیزیم در صورت نیاز",
    prevention: "کنترل وزن بین دیالیز، تنظیم سرعت UF، رژیم غذایی مناسب",
    severity: "متوسط",
    prevalence: "بسیار شایع"
  },
  {
    id: 3,
    title: "تهوع و استفراغ",
    category: "گوارشی",
    description: "عوارض گوارشی شایع در حین دیالیز",
    signs: "استفراغ حین دیالیز، بی‌قراری، درد شکم",
    commonCause: "افت فشار، اورمی شدید، عدم تعادل الکترولیتی",
    treatment: " کاهش UF یا توقف موقت\n اندانسترون 0.1–0.15 mg/kg IV\n متوکلوپرامید\n اصلاح وضعیت بیمار\n اکسیژن در صورت نیاز",
    prevention: "پرهیز از غذای سنگین قبل دیالیز، کنترل اورمی",
    severity: "متوسط",
    prevalence: "شایع"
  },
  {
    id: 4,
    title: "سندرم عدم تعادل دیالیز (DDS)",
    category: "عصبی",
    description: "اختلال در تعادل اسمزی به دنبال دیالیز سریع",
    signs: "سردرد، گیجی، تشنج، خواب‌آلودگی، تاری دید، استفراغ",
    commonCause: "کاهش سریع اوره در اولین جلسات، ادم مغزی",
    treatment: " کاهش Qb و زمان دیالیز\n مانیتور نورولوژیک\n دیالیز کوتاه با UF کم\n در موارد شدید: مانیتول 0.25 g/kg IV\n بنزودیازپین برای تشنج",
    prevention: "دیالیز آهسته و مکرر در جلسات اول، پایش علائم عصبی",
    severity: "بالا",
    prevalence: "نسبتا شایع"
  },
  {
    id: 5,
    title: "واکنش حساسیتی به صافی",
    category: "آلرژیک",
    description: "واکنش آلرژیک به مواد سازنده دیالایزر",
    signs: "کهیر، خارش، تنگی نفس، افت فشار، برونکواسپاسم",
    commonCause: "حساسیت به جنس غشاء (معمولاً صافی نو)، اتیلن اکساید",
    treatment: " قطع فوری دیالیز\n آنتی‌هیستامین: دکسا 0.15–0.3 mg/kg یا کلرفنیرامین\n اپی‌نفرین IM (0.01 mg/kg) در موارد شدید\n کورتیکواستروئید\n برونکودیلاتور",
    prevention: "شستشوی مناسب دیالایزر، تست حساسیت در موارد مشکوک",
    severity: "بالا",
    prevalence: "نادر"
  },
  {
    id: 6,
    title: "تنگی نفس",
    category: "تنفسی",
    description: "اختلال در عملکرد تنفسی حین دیالیز",
    signs: "تنفس سریع، کاهش O₂، سیانوز، احساس خفگی",
    commonCause: "UF زیاد، ادم ریه، آنافیلاکسی، آمبولی هوا",
    treatment: " قطع UF\n اکسیژن، ارزیابی ریه\n اطمینان از عدم واکنش به صافی\n فوروزماید در ادم ریه\n وضعیت نیمه نشسته",
    prevention: "کنترل دقیق مایعات، پایش مداوم علائم حیاتی",
    severity: "بالا",
    prevalence: "شایع"
  },
  {
    id: 7,
    title: "هیپوکالمی/هیپوکلسمی",
    category: "الکترولیتی",
    description: "اختلالات الکترولیتی ناشی از دیالیز",
    signs: "ضعف، آریتمی، تحریک‌پذیری، تشنج، پرش عضلانی",
    commonCause: "دیالیز شدید، محلول اشتباه، رژیم غذایی نامناسب",
    treatment: " چک فوری الکترولیت‌ها\n اصلاح سریع با Ca Gluconate یا KCl\n پایش قلبی\n تنظیم محلول دیالیز\n🔹 مکمل خوراکی",
    prevention: "پایش منظم الکترولیت‌ها، تنظیم مناسب دیالیزات",
    severity: "بالا",
    prevalence: "شایع"
  },
  {
    id: 8,
    title: "هیپوترمی",
    category: "متابولیک",
    description: "کاهش دمای بدن حین دیالیز",
    signs: "لرز، پوست سرد، کاهش دما، سیانوز",
    commonCause: "دیالیز طولانی با مایع سرد، محیط سرد",
    treatment: " گرم‌کردن محیط\n استفاده از مایع دیالیز گرم‌شده (37°C)\n پتو گرم\n پایش مداوم دمای بدن",
    prevention: "تنظیم دمای مناسب دیالیزات، گرم نگه داشتن محیط",
    severity: "متوسط",
    prevalence: "نادر"
  },
  {
    id: 9,
    title: "مشکل در کاتتر یا سوزن فیستول",
    category: "دسترسی عروقی",
    description: "اختلالات مرتبط با دسترسی عروقی",
    signs: "کاهش فشار دستگاه، هشدارهای دستگاه، تورم، درد",
    commonCause: "جابجایی سوزن، کاتتر مسدود شده، ترومبوز، عفونت",
    treatment: " تغییر پوزیشن\n شست‌وشو با سالین\n در موارد شدید: هپارین قفل\n تماس با تیم عروق\n آنتی‌بیوتیک در صورت عفونت",
    prevention: "مراقبت صحیح از دسترسی، آموزش بیمار، پایش منظم",
    severity: "متوسط",
    prevalence: "شایع"
  },
  {
    id: 10,
    title: "خونریزی",
    category: "هماتولوژیک",
    description: "افزایش خطر خونریزی در بیماران دیالیزی",
    signs: "خونریزی از محل دسترسی، کبودی، هماتوم، خونریزی گوارشی",
    commonCause: "هپارینیزاسیون، اختلال عملکرد پلاکت، اورمی",
    treatment: " کاهش یا قطع هپارین\n پروتامین سولفات\n دسموپرسین\n پلاسما در موارد شدید\n فشرده‌سازی موضعی",
    prevention: "مونیتورینگ زمان خونریزی، تنظیم دوز هپارین",
    severity: "بالا",
    prevalence: "نسبتا شایع"
  },
  {
    id: 11,
    title: "آریتمی قلبی",
    category: "قلبی",
    description: "بی‌نظمی‌های قلبی حین دیالیز",
    signs: "تپش قلب، سرگیجه، سنکوپ، درد قفسه سینه",
    commonCause: "اختلالات الکترولیتی، ایسکمی، حجم overload",
    treatment: " پایش قلبی مداوم\n اصلاح الکترولیت‌ها\n اکسیژن\n داروهای ضد آریتمی\n در موارد شدید: قطع دیالیز",
    prevention: "پایش منظم ECG، کنترل الکترولیت‌ها",
    severity: "بالا",
    prevalence: "شایع"
  },
  {
    id: 12,
    title: "خارش اورمیک",
    category: "پوستی",
    description: "خارش مزمن در بیماران دیالیزی",
    signs: "خارش عمومی، خشکی پوست، خراشیدگی",
    commonCause: "افزایش فسفر، هیپرپاراتیروئیدیسم، خشکی پوست",
    treatment: " فتوتراپی\n گاباپنتین\n آنتی‌هیستامین\n مرطوب‌کننده‌ها\n کنترول فسفر",
    prevention: "کنترل فسفر، مرطوب‌کننده منظم، رژیم غذایی",
    severity: "متوسط",
    prevalence: "شایع"
  }
];

const categories = [
  "همه",
  "قلبی",
  "عضلانی", 
  "گوارشی",
  "عصبی",
  "آلرژیک",
  "تنفسی",
  "الکترولیتی",
  "متابولیک",
  "دسترسی عروقی",
  "هماتولوژیک",
  "پوستی"
];

// کامپوننت هدر
const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          
          
          <h1 className="text-3xl font-bold mb-3 flex items-center justify-center gap-2">
            مدیریت عوارض همودیالیز کودکان
            <FiAlertTriangle className="text-yellow-300" />
          </h1>
          
          <p className="text-blue-100 max-w-2xl mx-auto text-sm md:text-base flex items-center justify-center gap-2">
            <MdOutlineSecurity className="text-lg" />
            راهنمای جامع شناسایی و مدیریت عوارض حین دیالیز برای کودکان
          </p>
        </div>
        
     
      </div>
    </header>
  );
};

// کامپوننت جستجو و فیلتر
const SearchFilter = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-200">
      <div className="grid md:grid-cols-2 gap-4">
        {/* جستجو */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FiSearch className="ml-1" />
            جستجوی عوارض
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی نام عارضه، علائم یا درمان..."
              className="w-full outline-0 pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiSearch size={16} />
            </div>
          </div>
        </div>

        {/* فیلتر دسته‌بندی */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FiFilter className="ml-1" />
            فیلتر بر اساس دسته
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 outline-0 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2">
          <IoMdWarning className="text-yellow-500" />
          <p className="text-xs text-gray-600">
            <span className="font-semibold">توجه:</span> برای عوارض با شدت "بالا" اقدام فوری ضروری است.
          </p>
        </div>
      </div>
    </div>
  );
};

// کامپوننت کارت عوارض
const ComplicationCard = ({ complication, onSelect }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'بالا': return 'bg-red-100 text-red-800 border-red-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'خفیف': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'قلبی': <FaHeartbeat className="text-red-600 text-2xl" />,
      'عضلانی': <GiMuscleUp className="text-orange-600 text-2xl" />,
      'گوارشی': <GiStomach className="text-green-600 text-2xl" />,
      'عصبی': <BiBrain className="text-purple-600 text-2xl" />,
      'آلرژیک': <FaAllergies className="text-pink-600 text-2xl" />,
      'تنفسی': <FaLungs className="text-blue-600 text-2xl" />,
      'الکترولیتی': <GiChemicalDrop className="text-cyan-600 text-2xl" />,
      'متابولیک': <FaTemperatureHigh className="text-amber-600 text-2xl" />,
      'دسترسی عروقی': <TbMedicalCross className="text-indigo-600 text-2xl" />,
      'هماتولوژیک': <MdBloodtype className="text-red-700 text-2xl" />,
      'پوستی': <GiBurningDot className="text-gray-600 text-2xl" />
    };
    return iconMap[category] || <MdOutlineSick className="text-gray-600 text-2xl" />;
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'بالا': return <FiAlertOctagon className="text-red-600" />;
      case 'متوسط': return <FiAlertTriangle className="text-yellow-600" />;
      case 'خفیف': return <FiActivity className="text-green-600" />;
      default: return <BiMessageError className="text-gray-600" />;
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg cursor-pointer transition-all duration-300 hover:translate-y-[-2px] group"
      onClick={() => onSelect(complication)}
    >
      <div className="p-4">
        {/* هدر کارت */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
              {getCategoryIcon(complication.category)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {complication.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  <IoMdMedical size={12} />
                  {complication.category}
                </span>
              </div>
            </div>
          </div>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(complication.severity)}`}>
            {getSeverityIcon(complication.severity)}
            <span>{complication.severity}</span>
          </div>
        </div>

        {/* توضیحات */}
        <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">
          {complication.description}
        </p>

        {/* علائم شایع */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <TbAlertTriangle className="text-orange-500" size={14} />
            <h4 className="font-semibold text-gray-700 text-sm">
              علائم شایع:
            </h4>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">
            {complication.signs}
          </p>
        </div>

        {/* اطلاعات پایین کارت */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <IoMdWater className="text-blue-400" size={14} />
            <span className="text-xs text-gray-500">
              {complication.prevalence}
            </span>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1 transition-colors group">
            مشاهده جزئیات
            <FiSearch size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// کامپوننت جزئیات عارضه
const ComplicationDetail = ({ complication, onClose }) => {
  if (!complication) return null;

  const getCategoryIcon = (category) => {
    const iconMap = {
      'قلبی': <FaHeartbeat className="text-red-600 text-3xl" />,
      'عضلانی': <GiMuscleUp className="text-orange-600 text-3xl" />,
      'گوارشی': <GiStomach className="text-green-600 text-3xl" />,
      'عصبی': <BiBrain className="text-purple-600 text-3xl" />,
      'آلرژیک': <FaAllergies className="text-pink-600 text-3xl" />,
      'تنفسی': <FaLungs className="text-blue-600 text-3xl" />,
      'الکترولیتی': <GiChemicalDrop className="text-cyan-600 text-3xl" />,
      'متابولیک': <FaTemperatureHigh className="text-amber-600 text-3xl" />,
      'دسترسی عروقی': <TbMedicalCross className="text-indigo-600 text-3xl" />,
      'هماتولوژیک': <MdBloodtype className="text-red-700 text-3xl" />,
      'پوستی': <GiBurningDot className="text-gray-600 text-3xl" />
    };
    return iconMap[category] || <MdOutlineSick className="text-gray-600 text-3xl" />;
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'بالا': return <FiAlertOctagon className="text-red-600 text-xl" />;
      case 'متوسط': return <FiAlertTriangle className="text-yellow-600 text-xl" />;
      case 'خفیف': return <FiActivity className="text-green-600 text-xl" />;
      default: return <BiMessageError className="text-gray-600 text-xl" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        {/* هدر مودال */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl sticky top-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                {getCategoryIcon(complication.category)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{complication.title}</h2>
                <p className="text-blue-100 text-sm mt-1">{complication.description}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors flex-shrink-0 p-1 hover:bg-white hover:bg-opacity-10 rounded"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* محتوای مودال */}
        <div className="p-4 space-y-4">
          {/* اطلاعات کلی */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                <IoMdMedical />
                دسته‌بندی
              </div>
              <div className="text-gray-700 text-sm mt-1 flex items-center gap-2">
                {getCategoryIcon(complication.category)}
                <span>{complication.category}</span>
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-600 font-semibold text-sm">
                {getSeverityIcon(complication.severity)}
                شدت عارضه
              </div>
              <div className="text-gray-700 text-sm mt-1">{complication.severity}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                <TbDropletFilled />
                میزان شیوع
              </div>
              <div className="text-gray-700 text-sm mt-1">{complication.prevalence}</div>
            </div>
          </div>

          {/* علائم بالینی */}
          <div className="bg-orange-50 rounded-lg p-3">
            <h3 className="text-base font-semibold text-orange-700 mb-2 flex items-center gap-2">
              <FiAlertTriangle />
              علائم بالینی
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed bg-white rounded p-3 shadow-sm">
              {complication.signs}
            </p>
          </div>

          {/* علل ایجاد */}
          <div className="bg-red-50 rounded-lg p-3">
            <h3 className="text-base font-semibold text-red-700 mb-2 flex items-center gap-2">
              <FiAlertOctagon />
              علل ایجاد عارضه
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed bg-white rounded p-3 shadow-sm">
              {complication.commonCause}
            </p>
          </div>

          {/* درمان فوری */}
          <div className="bg-green-50 rounded-lg p-3">
            <h3 className="text-base font-semibold text-green-700 mb-2 flex items-center gap-2">
              <TbMedicalCross />
              درمان فوری
            </h3>
            <div className="bg-white rounded p-3 shadow-sm">
              <pre className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {complication.treatment}
              </pre>
            </div>
          </div>

          {/* پیشگیری */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h3 className="text-base font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <MdOutlineSecurity />
              روش‌های پیشگیری
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed bg-white rounded p-3 shadow-sm">
              {complication.prevention}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// کامپوننت اصلی
export function ComplicationManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [selectedComplication, setSelectedComplication] = useState(null);

  // فیلتر کردن داده‌ها بر اساس جستجو و دسته‌بندی
  const filteredComplications = useMemo(() => {
    return complicationsData.filter(complication => {
      const matchesSearch = complication.title.includes(searchTerm) ||
                          complication.description.includes(searchTerm) ||
                          complication.signs.includes(searchTerm) ||
                          complication.commonCause.includes(searchTerm) ||
                          complication.treatment.includes(searchTerm);
      
      const matchesCategory = selectedCategory === 'همه' || complication.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <SearchFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        {/* نتایج */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FiFilter />
            لیست عوارض
          </h2>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FiSearch size={14} />
            <span>{filteredComplications.length} مورد یافت شد</span>
          </div>
        </div>

        {/* شبکه کارت‌ها */}
        {filteredComplications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filteredComplications.map(complication => (
              <ComplicationCard
                key={complication.id}
                complication={complication}
                onSelect={setSelectedComplication}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-center mb-3">
              <FiSearch className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center justify-center gap-2">
              <BiMessageError />
              موردی یافت نشد
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              هیچ عارضه‌ای با مشخصات جستجوی شما مطابقت ندارد. 
              لطفاً عبارت جستجو یا دسته‌بندی را تغییر دهید.
            </p>
          </div>
        )}

        {/* اطلاعات تکمیلی */}
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
            <MdOutlineSecurity />
            نکات مهم در مدیریت عوارض کودکان
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="text-center p-3">
              <div className="flex justify-center mb-2">
                <FaHeartbeat className="text-blue-500 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">ویژگی‌های کودکان</h4>
              <p className="text-gray-600 text-xs">حساسیت بیشتر به تغییرات حجم و الکترولیت</p>
            </div>
            <div className="text-center p-3">
              <div className="flex justify-center mb-2">
                <BiCapsule className="text-green-500 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">دوز دقیق</h4>
              <p className="text-gray-600 text-xs">محاسبه دقیق بر اساس وزن و سطح بدن</p>
            </div>
            <div className="text-center p-3">
              <div className="flex justify-center mb-2">
                <FiActivity className="text-purple-500 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">پایش مداوم</h4>
              <p className="text-gray-600 text-xs">نظارت دقیق بر علائم حیاتی و نورولوژیک</p>
            </div>
            <div className="text-center p-3">
              <div className="flex justify-center mb-2">
                <MdLocalHospital className="text-red-500 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">درگیرسازی خانواده</h4>
              <p className="text-gray-600 text-xs">آموزش والدین برای شناسایی علائم هشدار</p>
            </div>
          </div>
        </div>
      </main>

      {/* فوتر */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MdOutlineEmergency className="text-yellow-300" />
            <p className="text-sm">
              در صورت بروز عوارض شدید، بلافاصله با پزشک معالج تماس بگیرید
            </p>
          </div>
          <p className="text-xs text-gray-400">
            این راهنما تنها جنبه آموزشی دارد و جایگزین تشخیص و درمان پزشکی نیست
          </p>
        </div>
      </footer>

      {/* مودال جزئیات */}
      {selectedComplication && (
        <ComplicationDetail 
          complication={selectedComplication}
          onClose={() => setSelectedComplication(null)}
        />
      )}
    </div>
  );
}

export default ComplicationManagement;