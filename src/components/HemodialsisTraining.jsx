import React, { useState, useEffect } from "react";
import { 
  FiX, 
  FiSearch, 
  FiBookOpen, 
  FiChevronRight,
  FiStar,
  FiBookmark,
  FiShare2
} from "react-icons/fi";
import { 
  FaFilter, 
  FaVial, 
  FaFlask, 
  FaExclamationTriangle, 
  FaHeartbeat, 
  FaAppleAlt,
  FaGraduationCap,
  FaArrowLeft,
  FaBook,
  FaUserMd,
  FaNotesMedical
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function HemodialysisTraining() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarkedTopics, setBookmarkedTopics] = useState([]);
  const [recentViewed, setRecentViewed] = useState([]);
  const [activeCategory, setActiveCategory] = useState("همه");

  const categories = [
    { id: "همه", name: "همه موضوعات", icon: <FiBookOpen />, count: 8 },
    { id: "تجهیزات", name: "تجهیزات", icon: <FaFilter />, count: 1 },
    { id: "محلول", name: "محلول‌ها", icon: <FaVial />, count: 4 },
    { id: "ایمنی", name: "ایمنی و مراقبت", icon: <FaExclamationTriangle />, count: 3 },
    { id: "تغذیه", name: "تغذیه", icon: <FaAppleAlt />, count: 1 },
  ];

  const topics = [
    {
      id: 1,
      title: "انواع غشاء صافی",
      description: "آشنایی با انواع مختلف غشاء صافی و کاربرد هر کدام",
      icon: <FaFilter size={28} />,
      content: `# انواع غشاء صافی

## Low-flux (جریان پایین)
- **نفوذپذیری کمتر**: برای بیماران با اورمی ساده
- **مزایا**: هزینه کمتر، مناسب برای دیالیز معمولی
- **کاربرد**: بیماران با شرایط پایدار

## High-flux (جریان بالا)
- **نفوذپذیری بالا**: قادر به حذف سموم با وزن مولکولی بالا
- **مزایا**: بهبود کیفیت زندگی بیمار
- **کاربرد**: بیماران با مشکلات استخوانی و عروقی

## High-efficiency (بازدهی بالا)
- **سطح بیشتر**: حذف سریع‌تر مواد زائد
- **مزایا**: کاهش زمان دیالیز
- **کاربرد**: بیماران با حجم بالای سموم

## MCO / Super High-Flux
- **برای مولکول‌های متوسط**: نزدیک به عملکرد کلیه طبیعی
- **مزایا**: حذف بهتر پروتئین‌های زائد
- **کاربرد**: بیماران با علائم پیشرفته اورمی`,
      color: "from-purple-500 to-indigo-600",
      gradient: "bg-gradient-to-r from-purple-500 to-indigo-600",
      category: "تجهیزات",
      difficulty: "متوسط",
      duration: "۱۰ دقیقه مطالعه",
      tags: ["صافی", "تجهیزات", "فیلتر"]
    },
    {
      id: 2,
      title: "محلول پتاسیم ۱ (پتاسیم صفر)",
      description: "کاربرد و نحوه استفاده از محلول پتاسیم صفر",
      icon: <FaVial size={28} />,
      content: `# محلول پتاسیم ۱ (K0)

## مشخصات
- **میزان پتاسیم**: صفر یا بسیار کم
- **pH**: 7.0-7.4
- **دمای نگهداری**: دمای اتاق

## موارد مصرف
- **هیپرکالمی شدید**: بیماران با پتاسیم بالای 5.5 mEq/L
- **بیماران قلبی**: افرادی با مشکلات ریتم قلب
- **اورژانس**: کاهش سریع پتاسیم

## احتیاط‌ها
- پایش مکرر سطح پتاسیم خون
- جلوگیری از هیپوکالمی
- توجه به علائم قلبی

## اقدامات پرستاری
- ثبت دقیق سطح پتاسیم
- پایش علائم حیاتی
- آموزش به بیمار`,
      color: "from-green-500 to-emerald-600",
      gradient: "bg-gradient-to-r from-green-500 to-emerald-600",
      category: "محلول",
      difficulty: "آسان",
      duration: "۵ دقیقه مطالعه",
      tags: ["پتاسیم", "الکترولیت", "محلول"]
    },
    {
      id: 3,
      title: "محلول پتاسیم ۲ (پتاسیم متوسط)",
      description: "استاندارد پتاسیم برای اکثر بیماران",
      icon: <FaVial size={28} />,
      content: `# محلول پتاسیم ۲ (K2)

## مشخصات
- **میزان پتاسیم**: 2.0 mEq/L
- **pH**: 7.0-7.4
- **دمای نگهداری**: دمای اتاق

## موارد مصرف
- **پتاسیم نرمال**: بیماران با سطح 3.5-5.0 mEq/L
- **دیالیز روتین**: بیشتر بیماران
- **حفظ تعادل**: جلوگیری از نوسانات

## مزایا
- حفظ تعادل الکترولیتی
- کاهش خطر هیپوکالمی
- مناسب برای اکثر بیماران

## پایش
- چک ماهیانه پتاسیم
- توجه به داروهای موثر بر پتاسیم`,
      color: "from-blue-500 to-cyan-600",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-600",
      category: "محلول",
      difficulty: "آسان",
      duration: "۵ دقیقه مطالعه",
      tags: ["پتاسیم", "محلول", "دیالیز"]
    },
    {
      id: 4,
      title: "محلول پتاسیم ۳ (پتاسیم بالا)",
      description: "مورد استفاده در بیماران با هیپوکالمی",
      icon: <FaVial size={28} />,
      content: `# محلول پتاسیم ۳ (K3)

## مشخصات
- **میزان پتاسیم**: 3.0 mEq/L
- **pH**: 7.0-7.4
- **دمای نگهداری**: دمای اتاق

## موارد مصرف
- **هیپوکالمی**: بیماران با پتاسیم زیر 3.5 mEq/L
- **دفع بالا**: بیماران با دفع زیاد پتاسیم
- **پیشگیری**: جلوگیری از کاهش بیشتر

## اقدامات احتیاطی
- پایش دقیق پتاسیم
- توجه به داروهای مدر
- بررسی تغذیه بیمار

## آموزش بیمار
- مصرف منابع پتاسیم
- شناسایی علائم کمبود
- گزارش تغییرات`,
      color: "from-orange-500 to-amber-600",
      gradient: "bg-gradient-to-r from-orange-500 to-amber-600",
      category: "محلول",
      difficulty: "متوسط",
      duration: "۵ دقیقه مطالعه",
      tags: ["پتاسیم", "الکترولیت", "درمان"]
    },
    {
      id: 5,
      title: "پودر بی‌کربنات در دیالیز",
      description: "نقش و اهمیت بی‌کربنات در محلول دیالیز",
      icon: <FaFlask size={28} />,
      content: `# پودر بی‌کربنات (NaHCO3)

## نقش اصلی
- **تنظیم اسید-باز**: خنثی کردن اسیدهای اضافی خون
- **پیشگیری از اسیدوز**: عارضه شایع در نارسایی کلیه
- **بهبود عملکرد**: افزایش کیفیت دیالیز

## محلول‌های استاندارد
- **محلول A**: شامل اسید استیک
- **محلول B**: بی‌کربنات خالص
- **نسبت اختلاط**: بر اساس وضعیت بیمار

## پایش و کنترل
- بررسی سطح بی‌کربنات خون
- توجه به pH بیمار
- ثبت پاسخ به درمان

## نکات مهم
- نگهداری مناسب
- اختلاط صحیح
- تاریخ مصرف`,
      color: "from-teal-500 to-green-600",
      gradient: "bg-gradient-to-r from-teal-500 to-green-600",
      category: "محلول",
      difficulty: "متوسط",
      duration: "۸ دقیقه مطالعه",
      tags: ["بی‌کربنات", "محلول", "اسیدوز"]
    },
    {
      id: 6,
      title: "علائم اورژانسی در دیالیز",
      description: "شناسایی و اقدام فوری در موارد اضطراری",
      icon: <FaExclamationTriangle size={28} />,
      content: `# علائم اورژانسی دیالیز

## علائم حیاتی خطرناک
1. **افت فشار خون (هیپوتانسیون)**
   - سیستولیک زیر 90 mmHg
   - سرگیجه، تاری دید
   - اقدام: کاهش UF، تزریق نرمال سالین

2. **واکنش آنافیلاکسی**
   - کهیر، خارش، تنگی نفس
   - اقدام: قطع دیالیز، اپی نفرین

3. **کرامپ عضلانی شدید**
   - درد شدید در پاها یا شکم
   - اقدام: ماساژ، تنظیم محلول

## اقدامات سریع
- حفظ آرامش و اطمینان‌بخشی
- بررسی دستگاه و اتصالات
- تماس با پزشک فوراً
- ثبت دقیق وقایع

## تجهیزات اضطراری
- کیت احیای قلبی ریوی
- داروهای اورژانسی
- دستگاه ساکشن`,
      color: "from-red-500 to-pink-600",
      gradient: "bg-gradient-to-r from-red-500 to-pink-600",
      category: "ایمنی",
      difficulty: "پیشرفته",
      duration: "۱۲ دقیقه مطالعه",
      tags: ["اورژانس", "ایمنی", "احیا"]
    },
    {
      id: 7,
      title: "مراقبت از دسترسی عروقی",
      description: "نگهداری و مراقبت از فیستول و کاتتر",
      icon: <FaHeartbeat size={28} />,
      content: `# مراقبت از دسترسی عروقی

## فیستول شریانی-وریدی
### مراقبت روزانه
- **لمس بروجی**: بررسی لرزش (Thrill)
- **گوش دادن**: صدا (Bruit) باید واضح باشد
- **تغییرات**: قرمزی، تورم، درد

### قبل از سوزن‌گذاری
- شستشوی صحیح با بتادین
- استفاده از بی‌حسی موضعی
- انتخاب صحیح اندازه سوزن

### بعد از دیالیز
- فشار صحیح (نه زیاد، نه کم)
- بانداژ استریل
- آموزش به بیمار

## کاتتر دیالیز
### نکات مهم
- پانسمان استریل هفتگی
- بررسی علائم عفونت
- عملکرد صحیح هر دو لومن

## آموزش بیمار
- عدم خوابیدن روی دست
- عدم فشار و بلند کردن اجسام
- گزارش فوری مشکلات`,
      color: "from-pink-500 to-rose-600",
      gradient: "bg-gradient-to-r from-pink-500 to-rose-600",
      category: "ایمنی",
      difficulty: "متوسط",
      duration: "۱۰ دقیقه مطالعه",
      tags: ["فیستول", "کاتتر", "مراقبت"]
    },
    {
      id: 8,
      title: "توصیه‌های تغذیه‌ای",
      description: "رژیم غذایی مناسب برای بیماران دیالیزی",
      icon: <FaAppleAlt size={28} />,
      content: `# تغذیه در همودیالیز

## محدودیت‌های اصلی

### 1. مایعات
- **محدودیت**: 500-800cc + ادرار 24 ساعته
- **نکات**: وزن بین دو دیالیز زیر 3% وزن خشک

### 2. سدیم (نمک)
- **محدودیت**: زیر 2 گرم روزانه
- **تاثیر**: تشنگی، فشار خون، احتباس مایع

### 3. پتاسیم
- **محدودیت**: 2-3 گرم روزانه
- **مواد پرپتاسیم**: موز، پرتقال، سیب زمینی

### 4. فسفر
- **محدودیت**: 800-1000mg روزانه
- **مهارکننده‌ها**: کلسیم استات، لانتانوم

## پروتئین‌های مجاز
- **توصیه**: 1.2 گرم به ازای هر کیلو وزن
- **منابع**: مرغ، ماهی، سفیده تخم مرغ
- **پرهیز**: لبنیات پرچرب، گوشت قرمز زیاد

## ویتامین‌ها
- ویتامین‌های محلول در آب از دست می‌روند
- مکمل ویتامین B و C
- ویتامین D فعال`,
      color: "from-indigo-500 to-blue-600",
      gradient: "bg-gradient-to-r from-indigo-500 to-blue-600",
      category: "تغذیه",
      difficulty: "آسان",
      duration: "۸ دقیقه مطالعه",
      tags: ["تغذیه", "رژیم", "درمان"]
    },
  ];

  // فیلتر کردن موضوعات بر اساس جستجو و دسته‌بندی
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.includes(searchTerm) || 
                         topic.description.includes(searchTerm) ||
                         topic.tags.some(tag => tag.includes(searchTerm));
    const matchesCategory = activeCategory === "همه" || topic.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // افزودن به نشان شده‌ها
  const toggleBookmark = (topicId) => {
    setBookmarkedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  // باز کردن مودال و اضافه کردن به تاریخچه
  const openTopicModal = (topic) => {
    setSelectedTopic(topic);
    setRecentViewed(prev => {
      const filtered = prev.filter(id => id !== topic.id);
      return [topic.id, ...filtered.slice(0, 4)];
    });
  };

  // پیدا کردن موضوعات نشان شده و اخیراً دیده شده
  const bookmarkedTopicsData = topics.filter(t => bookmarkedTopics.includes(t.id));
  const recentTopicsData = topics.filter(t => recentViewed.includes(t.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* هدر اصلی */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg">
                <FaGraduationCap className="text-white" size={36} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                  آموزش جامع همودیالیز
                </h1>
                <p className="text-gray-600 text-lg">
                  مرجع کامل آموزش‌های تخصصی همودیالیز کودکان
                </p>
              </div>
            </div>
            
            <Link
              to="/hemo"
              className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-md"
            >
              <FaArrowLeft />
              <span>بازگشت به صفحه اصلی</span>
            </Link>
          </div>

          {/* جستجو */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="جستجوی موضوع آموزش..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-300"
            />
          </div>

          {/* دسته‌بندی‌ها */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeCategory === cat.id 
                    ? "bg-white/20" 
                    : "bg-gray-200 text-gray-700"
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* بخش کارت‌های آموزشی */}
        <div className="mb-10">
          {filteredTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTopics.map((topic) => (
                <div key={topic.id} className="group relative">
                  {/* کارت */}
                  <div className={`${topic.gradient} rounded-2xl shadow-lg overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 h-full`}>
                    <div className="p-6">
                      {/* هدر کارت */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                          {topic.icon}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(topic.id);
                            }}
                            className={`p-2 rounded-full transition-all ${
                              bookmarkedTopics.includes(topic.id)
                                ? "bg-yellow-500 text-white"
                                : "bg-white/20 text-white/60 hover:text-white"
                            }`}
                          >
                            {bookmarkedTopics.includes(topic.id) ? 
                              <FiStar fill="currentColor" /> : 
                              <FiStar />
                            }
                          </button>
                          <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
                            {topic.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* محتوای کارت */}
                      <div className="mb-6">
                        <h3 className="text-white font-bold text-xl mb-3 leading-tight">
                          {topic.title}
                        </h3>
                        <p className="text-white/90 text-sm mb-4 leading-relaxed">
                          {topic.description}
                        </p>
                        
                        {/* تگ‌ها */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {topic.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* فوتر کارت */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/30">
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <FaBook className="text-sm" />
                          <span>{topic.duration}</span>
                        </div>
                        <button
                          onClick={() => openTopicModal(topic)}
                          className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 group-hover:scale-105"
                        >
                          مطالعه
                          <FiChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <FiSearch className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">موضوعی یافت نشد</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                هیچ موضوع آموزشی با جستجوی شما مطابقت ندارد.
                لطفاً عبارت دیگری را امتحان کنید.
              </p>
            </div>
          )}
        </div>

        {/* بخش نشان شده‌ها */}
        {bookmarkedTopicsData.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <FiStar className="text-yellow-500" fill="currentColor" />
              موضوعات نشان شده
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedTopicsData.map((topic) => (
                <div key={topic.id} className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl text-white">
                      {topic.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">{topic.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{topic.description}</p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => openTopicModal(topic)}
                      className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2"
                    >
                      مطالعه
                      <FiChevronRight />
                    </button>
                    <button
                      onClick={() => toggleBookmark(topic.id)}
                      className="p-2 text-amber-600 hover:text-amber-700"
                    >
                      <FiStar fill="currentColor" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* مودال جزئیات موضوع */}
        {selectedTopic && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
              
              {/* هدر مودال */}
              <div className={`bg-gradient-to-r ${selectedTopic.color} text-white p-6 md:p-8`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                      {selectedTopic.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{selectedTopic.title}</h2>
                      <p className="text-white/90">{selectedTopic.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="text-white hover:text-gray-200 transition-colors p-3 hover:bg-white/10 rounded-xl"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                    <FaBook className="text-sm" />
                    <span className="text-sm">{selectedTopic.category}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                    <FaUserMd className="text-sm" />
                    <span className="text-sm">{selectedTopic.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                    <FaNotesMedical className="text-sm" />
                    <span className="text-sm">{selectedTopic.duration}</span>
                  </div>
                </div>
              </div>

              {/* محتوای مودال */}
              <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="prose prose-lg max-w-none text-right">
                  {selectedTopic.content.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="text-2xl font-bold text-gray-800 mb-6">{line.substring(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-xl font-bold text-blue-600 mb-4 mt-6">{line.substring(3)}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-lg font-bold text-gray-700 mb-3 mt-4">{line.substring(4)}</h3>;
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      return <strong key={index} className="text-gray-800">{line.substring(2, line.length-2)}</strong>;
                    } else if (line.startsWith('- ')) {
                      return (
                        <div key={index} className="flex items-start gap-3 mb-2 mr-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <span className="text-gray-700">{line.substring(2)}</span>
                        </div>
                      );
                    } else if (line.startsWith('1. ')) {
                      return (
                        <div key={index} className="flex items-start gap-3 mb-3 mr-4">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-bold">
                            {line.match(/^\d+/)[0]}
                          </span>
                          <span className="text-gray-700">{line.substring(line.indexOf('.') + 2)}</span>
                        </div>
                      );
                    } else if (line.trim() === '') {
                      return <div key={index} className="mb-4"></div>;
                    } else {
                      return <p key={index} className="text-gray-700 mb-4 leading-relaxed">{line}</p>;
                    }
                  })}
                </div>
              </div>

              {/* فوتر مودال */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleBookmark(selectedTopic.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        bookmarkedTopics.includes(selectedTopic.id)
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <FiStar fill={bookmarkedTopics.includes(selectedTopic.id) ? "currentColor" : "none"} />
                      {bookmarkedTopics.includes(selectedTopic.id) ? "حذف نشان" : "نشان کردن"}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                      <FiShare2 />
                      اشتراک گذاری
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300"
                  >
                    بستن
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* فوتر */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p className="mb-2">این آموزش‌ها به‌منظور ارتقای دانش پرسنل پرستاری بخش همودیالیز تهیه شده است</p>
          <p className="text-gray-500">© 2024 سیستم آموزش همودیالیز کودکان</p>
        </footer>
      </div>
    </div>
  );
}