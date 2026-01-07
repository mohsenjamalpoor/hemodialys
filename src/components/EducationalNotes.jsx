// EducationalNotes.jsx
import React, { useState } from "react";
import { FaBook, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

export function EducationalNotes() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections = [
    {
      id: 1,
      title: "مقدمات دیالیز اطفال",
      content: `• وزن بیمار مهمترین فاکتور در تنظیمات دیالیز است
• حجم مدار نباید بیش از ۱۰٪ حجم خون بیمار باشد (حداکثر ۸-۱۰ میلی‌لیتر به ازای هر کیلوگرم)
• پرایم با آلبومین ۵٪ برای بیماران ناپایدار یا هیپوآلبومینمی توصیه می‌شود
• در صورت هموگلوبین زیر ۷ g/dL، پرایم با پکت سل در نظر گرفته شود`,
      icon: "🏥"
    },
    {
      id: 2,
      title: "تنظیمات اصلی",
      content: `• سرعت پمپ خون (Qb): ۳-۵ میلی‌لیتر به ازای هر کیلوگرم در دقیقه
• سرعت دیالیزات (Qd): معمولاً دو برابر Qb (۱.۵ برابر در بیماران ناپایدار)
• نرخ اولترافیلتراسیون (UFR): ۱۰-۱۵ میلی‌لیتر به ازای هر کیلوگرم در ساعت
• زمان دیالیز: بر اساس وضعیت بالینی (حاد: ۲-۳ ساعت، مزمن: ۳-۴ ساعت)`,
      icon: "⚙️"
    },
    {
      id: 3,
      title: "پایش حین دیالیز",
      content: `• فشار خون: هر ۱۵-۳۰ دقیقه در ساعت اول، سپس هر ۳۰-۶۰ دقیقه
• علائم حیاتی: هر ۳۰ دقیقه ثبت شود
• در صورت افت فشار: کاهش Qb به ۵۰٪، بررسی حجم UF، تزریق نرمال سالین
• علائم بالینی: رنگ پوست، سطح هوشیاری، ادم احتمالی`,
      icon: "📊"
    },
    {
      id: 4,
      title: "پروتکل ضد انعقاد",
      content: `• هپارین استاندارد: در صورت PLT > 50,000 و INR < 1.5
• هپارین کاهش یافته: در بیماران ناپایدار یا ریسک خونریزی
• سیترات منطقه‌ای: در موارد PLT < 20,000 یا INR > 3
• بدون ضد انعقاد: در خونریزی فعال یا ریسک بسیار بالا`,
      icon: "💉"
    },
    {
      id: 5,
      title: "عوارض شایع و مدیریت",
      content: `• افت فشار: کاهش UF، تزریق نرمال سالین، پایش دقیق
• کرامپ عضلانی: تنظیم سدیم دیالیزات، ماساژ ملایم
• تهوع و استفراغ: بررسی UF، آنتی‌امتیک در صورت نیاز
• واکنش به ممبران: آنتی‌هیستامین، استروئید در موارد شدید`,
      icon: "⚠️"
    }
  ];

  if (!isOpen) {
    return (
      <div className="mt-6">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <FaBook className="text-xl" />
          <span className="text-lg font-bold">نمایش نکات آموزشی دیالیز اطفال</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FaBook className="text-2xl" />
          <h3 className="text-xl font-bold">نکات آموزشی دیالیز اطفال</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>
      
      <div className="p-5 space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 text-right hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{section.icon}</span>
                <h4 className="font-bold text-gray-800">{section.title}</h4>
              </div>
              {expandedSections[section.id] ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </button>
            
            {expandedSections[section.id] && (
              <div className="p-4 pt-0 border-t border-gray-100">
                <div className="whitespace-pre-line text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {section.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-purple-100 p-4 text-center">
        <button
          onClick={() => setIsOpen(false)}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          بستن نکات آموزشی
        </button>
      </div>
    </div>
  );
}