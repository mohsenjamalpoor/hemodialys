// HemodialysisPediatrics.jsx
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaArrowRight, FaArrowLeft, FaChild, FaHeartbeat, FaBed } from "react-icons/fa";

export function HemodialysisPediatrics() {
  const location = useLocation();
  const isStable = location.pathname.includes("/stable");
  const isUnstable = location.pathname.includes("/unstable");

  const menuItems = [
    {
      to: "/hemo/dialysisAssistant/stable",
      icon: <FaHeartbeat className="text-green-500" size={24} />,
      label: "پایدار (Stable)",
      description: "بیماران همودینامیک پایدار",
      color: "border-green-500 hover:bg-green-50",
      isActive: isStable
    },
    {
      to: "/hemo/dialysisAssistant/unstable",
      icon: <FaBed className="text-red-500" size={24} />,
      label: "ناپایدار/اینتوبه (Unstable)",
      description: "بیماران همودینامیک ناپایدار یا اینتوبه",
      color: "border-red-500 hover:bg-red-50",
      isActive: isUnstable
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaChild className="text-blue-600" size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  همودیالیز اطفال
                </h1>
                <p className="text-gray-600 mt-1">
                  انتخاب وضعیت بیمار
                </p>
              </div>
            </div>
            <Link
              to="/hemo"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowRight />
              <span>بازگشت</span>
            </Link>
          </div>
        </div>

        {/* انتخاب وضعیت بیمار */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className={`block bg-white rounded-xl shadow-lg p-6 border-2 ${item.color} ${item.isActive ? "ring-2 ring-offset-2" : ""
                } transition-all duration-300 transform hover:scale-[1.02]`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full mb-4">
                  {item.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {item.label}
                </h2>
                <p className="text-gray-600 mb-4">
                  {item.description}
                </p>
                <div className={`px-4 py-2 rounded-lg ${item.isActive
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                  }`}>
                  {item.isActive ? "در حال مشاهده" : "انتخاب"}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* محتوای داینامیک */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <Outlet />
        </div>

        {/* راهنما */}
        {!isStable && !isUnstable && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
              <FaArrowLeft />
              راهنمای انتخاب وضعیت
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-bold text-green-700 mb-2">پایدار (Stable)</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• بیمار همودینامیک پایدار</li>
                  <li>• بدون نیاز به ونتیلاتور</li>
                  <li>• فشار خون مناسب</li>
                  <li>• دیالیز انتخابی یا برنامه‌ریزی شده</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-bold text-red-700 mb-2">ناپایدار/اینتوبه (Unstable)</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• بیمار تحت ونتیلاتور</li>
                  <li>• همودینامیک ناپایدار</li>
                  <li>• نیاز به اینوتروپ یا وازوپرسور</li>
                  <li>• دیالیز اورژانسی</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}