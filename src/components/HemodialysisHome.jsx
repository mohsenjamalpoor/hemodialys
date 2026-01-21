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
  FaInfoCircle,
  FaIdCard,
  FaShieldAlt,
  FaNotesMedical,
  FaPrescriptionBottleAlt,
  FaSyringe,
  FaBed,
  FaChartLine,
  FaFileMedical,
  FaUserInjured,
  FaProcedures
} from "react-icons/fa";

export function HemodialysisHome() {
  const [currentTime, setCurrentTime] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");
  const [doctorCode, setDoctorCode] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [activeStats, setActiveStats] = useState({
    patients: 12,
    activeSessions: 3,
    todayAppointments: 8,
    monthlyDialyses: 156
  });

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

    // خواندن اطلاعات پزشک از localStorage
    const savedName = localStorage.getItem("doctorName");
    const savedSpecialty = localStorage.getItem("doctorSpecialty");
    const savedCode = localStorage.getItem("doctorCode");
    
    if (savedName) {
      setDoctorName(savedName);
    }
    if (savedSpecialty) {
      setDoctorSpecialty(savedSpecialty);
    }
    if (savedCode) {
      setDoctorCode(savedCode);
    }

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("doctorName");
    localStorage.removeItem("doctorSpecialty");
    localStorage.removeItem("doctorCode");
    localStorage.removeItem("doctorId");
    window.location.href = "/login";
  };

  const navItems = [
    {
      to: "/hemo/hemodialysisPediatrics",
      icon: <FaChild size={28} />,
      label: "همودیالیز در اطفال",
      description: "راهنمای کامل همودیالیز کودکان",
      color: "from-purple-500 to-indigo-600",
      status: "active"
    },
    {
      to: "/hemo/ktv",
      icon: <FaCalculator size={28} />,
      label: "محاسبه Kt/V و UF",
      description: "بررسی کفایت همودیالیز",
      color: "from-green-500 to-emerald-600",
      status: "active"
    },
    {
      to: "/hemo/hemodialsisTraining",
      icon: <FaBook size={28} />,
      label: "آموزش همودیالیز اطفال",
      description: "آموزش جامع همودیالیز کودکان",
      color: "from-blue-500 to-cyan-600",
      status: "active"
    },
    {
      to: "/hemo/hemodialysisPrime",
      icon: <FaCog size={28} />,
      label: "پرایم کردن دستگاه",
      description: "راهنمای پرایم کردن دستگاه همودیالیز",
      color: "from-orange-500 to-amber-600",
      status: "active"
    },
    {
      to: "/hemo/hemodialysisAlarms",
      icon: <FaExclamationTriangle size={28} />,
      label: "آلارم های دستگاه",
      description: "راهنمای عیب‌یابی آلارم‌ها",
      color: "from-red-500 to-pink-600",
      status: "active"
    },
    {
      to: "/hemo/complications",
      icon: <FaHeartbeat size={28} />,
      label: "عوارض همودیالیز",
      description: "مدیریت عوارض حین همودیالیز",
      color: "from-teal-500 to-green-600",
      status: "active"
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
        
        {/* هدر اصلی */}
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
                  <p className="text-sm text-gray-500">{doctorSpecialty || "پزشک"}</p>
                  <p className="font-bold text-blue-600">{doctorName || "---"}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <FaIdCard className="text-gray-400 text-xs" />
                    <p className="text-xs text-gray-500 font-mono">{doctorCode || "---"}</p>
                  </div>
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
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="block group"
              >
                <div className={`bg-gradient-to-r ${item.color} text-white rounded-xl shadow-lg p-6 transition-all duration-300 transform group-hover:scale-[1.02] group-hover:shadow-xl h-full relative overflow-hidden`}>
                
                  
                  <div className="relative flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-white bg-opacity-20 p-3 rounded-full mt-6">
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
                        <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-30 transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      

        {/* مودال راهنما */}
        {showGuide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full">
                      <FaInfoCircle className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">راهنمای جامع سیستم</h3>
                      <p className="text-sm text-gray-600">آشنایی با امکانات سامانه همودیالیز اطفال</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGuide(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-3 text-lg"> نحوه استفاده از سیستم</h4>
                    <ul className="text-gray-700 space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-0.5">۱</div>
                        <span>برای دسترسی به هر ماژول روی کارت مربوطه کلیک کنید</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-0.5">۲</div>
                        <span>اطلاعات پزشک و زمان در بالای صفحه نمایش داده می‌شود</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-0.5">۳</div>
                        <span>از دکمه‌های اقدام سریع برای دسترسی فوری استفاده کنید</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-0.5">۴</div>
                        <span>برای حفظ حریم خصوصی، پس از کار از سیستم خارج شوید</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200">
                    <h4 className="font-bold text-green-800 mb-3 text-lg"> ماژول‌های اصلی و کاربردی</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-800 mb-1">همودیالیز در اطفال</p>
                        <p className="text-xs text-gray-600">پروتکل‌های کامل درمانی ویژه کودکان</p>
                      </div>
                      <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-800 mb-1">محاسبه Kt/V</p>
                        <p className="text-xs text-gray-600">بررسی دقیق کفایت جلسه دیالیز</p>
                      </div>
                      <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-800 mb-1">مدیریت عوارض</p>
                        <p className="text-xs text-gray-600">راهکارهای کنترل عوارض حین دیالیز</p>
                      </div>
                      <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-800 mb-1">اورژانس</p>
                        <p className="text-xs text-gray-600">مدیریت شرایط بحرانی در حین دیالیز</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-200">
                    <h4 className="font-bold text-amber-800 mb-3 text-lg"> نکات ایمنی و مهم</h4>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <FaExclamationTriangle className="text-amber-600 mt-0.5" />
                        <span>قبل از اقدام پزشکی، اطلاعات بیمار را مجدداً بررسی کنید</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaShieldAlt className="text-amber-600 mt-0.5" />
                        <span>اطلاعات ورود به سیستم را در اختیار دیگران قرار ندهید</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaHeartbeat className="text-amber-600 mt-0.5" />
                        <span>در شرایط اورژانس از ماژول مربوطه استفاده کنید</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaNotesMedical className="text-amber-600 mt-0.5" />
                        <span>گزارش‌های روزانه را به دقت ثبت کنید</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 text-lg"> پشتیبانی فنی</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">شماره پشتیبانی:</span>
                        <span className="font-mono font-bold text-blue-600">۰۹۱۰۱۸۶۸۶۱۴</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">ساعات پاسخگویی:</span>
                        <span className="text-sm">۸ صبح تا ۸ شب</span>
                      </div>
                      
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
                  <button
                    onClick={() => setShowGuide(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                  >
                    بستن راهنما
                  </button>
                
                </div>
              </div>
            </div>
          </div>
        )}

        {/* بخش footer */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <FaClinicMedical size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold">سیستم مدیریت همودیالیز کودکان</h3>
                <p className="text-blue-100 text-sm mt-1">توسعه‌یافته برای ارتقای کیفیت درمان نارسایی کلیه در اطفال</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <p className="text-blue-200">تعداد ماژول‌ها</p>
                  <p className="font-bold text-xl">{navItems.length}</p>
                </div>
                <div className="h-8 w-px bg-white bg-opacity-30"></div>
                <div>
                  <p className="text-blue-200">نسخه سیستم</p>
                  <p className="font-bold">۱.۲.۰</p>
                </div>
                <div className="h-8 w-px bg-white bg-opacity-30"></div>
                <div>
                  <p className="text-blue-200">پشتیبانی فنی</p>
                  <p className="font-mono font-bold">۰۹۱۰۱۸۶۸۶۱۴</p>
                </div>
              </div>
              <p className="text-xs text-blue-200 mt-3">کلیه حقوق این نرم‌افزار محفوظ است © ۱۴۰۲</p>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}

