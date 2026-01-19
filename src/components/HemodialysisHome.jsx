import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaChild,
  FaCalculator,
  FaBook,
  FaCog,
  FaExclamationTriangle,
  FaHeartbeat,
  FaClinicMedical,
  FaUserMd,
  FaClock,
  FaSignOutAlt,
 
  FaVial,
  FaTint,
  FaWeight,
  FaQuestionCircle,
  FaInfoCircle
} from "react-icons/fa";

export function HemodialysisHome() {
  const [currentTime, setCurrentTime] = useState("");
  const [medicalCode, setMedicalCode] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // تنظیم زمان فعلی
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    // خواندن کد نظام پزشکی از localStorage
    const savedCode = localStorage.getItem("medicalCode");
    if (savedCode) {
      setMedicalCode(savedCode);
    }

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("medicalCode");
    window.location.href = "/login";
  };

  const navItems = [
    {
      to: "/hemo/hemodialysisPediatrics",
      icon: <FaChild size={28} />,
      label: "همودیالیز در اطفال",
      description: "راهنمای کامل همودیالیز کودکان",
      color: "from-purple-500 to-indigo-600",
    },
    {
      to: "/hemo/ktv",
      icon: <FaCalculator size={28} />,
      label: "محاسبه Kt/V و UF",
      description: "بررسی کفایت همودیالیز",
      color: "from-green-500 to-emerald-600",
    },
    {
      to: "/hemo/hemodialsisTraining",
      icon: <FaBook size={28} />,
      label: "آموزش همودیالیز اطفال",
      description: "آموزش جامع همودیالیز کودکان",
      color: "from-blue-500 to-cyan-600",
    },
    {
      to: "/hemo/hemodialysisPrime",
      icon: <FaCog size={28} />,
      label: "پرایم کردن دستگاه",
      description: "راهنمای پرایم کردن دستگاه همودیالیز",
      color: "from-orange-500 to-amber-600",
    },
    {
      to: "/hemo/hemodialysisAlarms",
      icon: <FaExclamationTriangle size={28} />,
      label: "آلارم های دستگاه",
      description: "راهنمای عیب‌یابی آلارم‌ها",
      color: "from-red-500 to-pink-600",
    },
    {
      to: "/hemo/complications",
      icon: <FaHeartbeat size={28} />,
      label: "عوارض همودیالیز",
      description: "مدیریت عوارض حین همودیالیز",
      color: "from-teal-500 to-green-600",
    },
   
    {
      to: "#",
      icon: <FaVial size={28} />,
      label: "آزمایش‌های لازم",
      description: "درخواست و تفسیر آزمایشات",
      color: "from-yellow-500 to-orange-600",
      onClick: () => alert("این بخش به زودی اضافه خواهد شد")
    },
    {
      to: "#",
      icon: <FaTint size={28} />,
      label: "مدیریت مایعات",
      description: "برنامه مایع‌درمانی و محدودیت‌ها",
      color: "from-cyan-500 to-teal-600",
      onClick: () => alert("این بخش به زودی اضافه خواهد شد")
    },
    {
      to: "#",
      icon: <FaWeight size={28} />,
      label: "وزن‌گیری و تغذیه",
      description: "مدیریت وزن و برنامه تغذیه‌ای",
      color: "from-pink-500 to-rose-600",
      onClick: () => alert("این بخش به زودی اضافه خواهد شد")
    },
   
  ];

  // تاریخ شمسی
  const getPersianDate = () => {
    const date = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      calendar: "persian"
    };
    return date.toLocaleDateString("fa-IR", options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* هدر */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full">
                <FaClinicMedical className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  بخش همودیالیز کودکان
                </h1>
                <p className="text-gray-600 mt-1">سامانه تخصصی مراقبت و درمان نارسایی کلیه در اطفال</p>
              </div>
            </div>
            
            {/* اطلاعات کاربر و زمان */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <FaClock className="text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg font-bold text-gray-800">{currentTime}</p>
                  <p className="text-sm text-gray-500">{getPersianDate()}</p>
                </div>
              </div>
              
              <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
              
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaUserMd className="text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">کد نظام پزشکی</p>
                  <p className="font-mono font-bold text-blue-600">{medicalCode || "---"}</p>
                </div>
                
                {/* دکمه راهنما در بالای صفحه */}
                <button
                  onClick={() => setShowGuide(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-300"
                >
                  <FaQuestionCircle />
                  راهنما
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition duration-300"
                >
                  <FaSignOutAlt />
                  خروج
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* کارت‌های اصلی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {navItems.map((item, index) => (
            item.to === "#" ? (
              <button
                key={index}
                onClick={item.onClick}
                className="block group text-left"
              >
                <div className={`bg-gradient-to-r ${item.color} text-white rounded-xl shadow-lg p-6 transition-all duration-300 transform group-hover:scale-[1.02] group-hover:shadow-xl h-full relative overflow-hidden`}>
                  <div className="relative flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-white bg-opacity-20 p-3 rounded-full">
                        {item.icon}
                      </div>
                    </div>
                    
                    <h2 className="text-lg font-bold mb-2">{item.label}</h2>
                    <p className="text-white text-opacity-90 text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-white border-opacity-20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs opacity-75">برای مشاهده کلیک کنید</span>
                        <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ) : (
              <Link
                key={index}
                to={item.to}
                className="block group"
              >
                <div className={`bg-gradient-to-r ${item.color} text-white rounded-xl shadow-lg p-6 transition-all duration-300 transform group-hover:scale-[1.02] group-hover:shadow-xl h-full relative overflow-hidden`}>
                  <div className="relative flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-white bg-opacity-20 p-3 rounded-full">
                        {item.icon}
                      </div>
                    </div>
                    
                    <h2 className="text-lg font-bold mb-2">{item.label}</h2>
                    <p className="text-white text-opacity-90 text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-white border-opacity-20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs opacity-75">برای مشاهده کلیک کنید</span>
                        <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          ))}
        </div>

        {/* مودال راهنما */}
        {showGuide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FaInfoCircle className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">راهنمای استفاده از سیستم</h3>
                  </div>
                  <button
                    onClick={() => setShowGuide(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-700 mb-2"> نحوه استفاده</h4>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• برای دسترسی به هر ماژول روی کارت مربوطه کلیک کنید</li>
                      <li>• کد نظام پزشکی در بالای صفحه نمایش داده می‌شود</li>
                      <li>• زمان و تاریخ به صورت خودکار به روز می‌شود</li>
                      <li>• برای خروج از سیستم از دکمه قرمز رنگ استفاده کنید</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-700 mb-2"> ماژول‌های اصلی</h4>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• <span className="font-medium">همودیالیز در اطفال:</span> راهنمای جامع پروتکل‌ها</li>
                      <li>• <span className="font-medium">محاسبه Kt/V:</span> بررسی کفایت دیالیز</li>
                      <li>• <span className="font-medium">آموزش همودیالیز:</span> آموزش‌های تخصصی</li>
                      <li>• <span className="font-medium">آلارم‌های دستگاه:</span> راهنمای عیب‌یابی</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-bold text-yellow-700 mb-2"> نکات مهم</h4>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• قبل از اقدام پزشکی، اطلاعات را مجدداً بررسی کنید</li>
                      <li>• در صورت بروز مشکل فنی با پشتیبانی تماس بگیرید</li>
                      <li>• برای حفظ حریم خصوصی، پس از کار از سیستم خارج شوید</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setShowGuide(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    متوجه شدم
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* بخش footer */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <FaInfoCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">اطلاعات سیستم</h3>
                <p className="text-blue-100 text-sm mt-1">نسخه ۱.۰.۰ | آخرین بروزرسانی: ۱۴۰۲/۱۰/۱۵</p>
              </div>
            </div>
            
            <div className="text-sm text-blue-100">
              <p>تعداد ماژول‌های فعال: {navItems.length}</p>
              <p className="mt-1">پشتیبانی فنی:  09101868614</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}