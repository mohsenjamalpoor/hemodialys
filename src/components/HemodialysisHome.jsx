import React from "react";
import { Link } from "react-router-dom";
import {
  FaChild,
  FaCalculator,
  FaBook,
  FaCog,
  FaExclamationTriangle,
  FaHeartbeat,
  FaClinicMedical,
 
} from "react-icons/fa";

export function HemodialysisHome() {
  const navItems = [
    { 
      to: "/hemo/dialysisAssistant", 
      icon: <FaChild size={28} />, 
      label: "همودیالیز در اطفال",
      description: "راهنمای کامل همودیالیز کودکان",
      color: "from-purple-500 to-indigo-600"
    },
    {
      to: "/hemo/ktv",
      icon: <FaCalculator size={28} />,
      label: "محاسبه Kt/V و UF",
      description: "بررسی کفایت همودیالیز",
      color: "from-green-500 to-emerald-600"
    },
    { 
      to: "/hemo/hemodialsisTraining", 
      icon: <FaBook size={28} />, 
      label: "آموزش همودیالیز اطفال",
      description: "آموزش جامع همودیالیز کودکان",
      color: "from-blue-500 to-cyan-600"
    },
    {
      to: "/hemo/priming4008S",
      icon: <FaCog size={28} />,
      label: "پرایم کردن دستگاه",
      description: "راهنمای پرایم کردن دستگاه همودیالیز",
      color: "from-orange-500 to-amber-600"
    },
    { 
      to: "/hemo/hemodialysisAlarms", 
      icon: <FaExclamationTriangle size={28} />, 
      label: "آلارم های دستگاه",
      description: "راهنمای عیب‌یابی آلارم‌ها",
      color: "from-red-500 to-pink-600"
    },
    {
      to: "/hemo/complications",
      icon: <FaHeartbeat size={28} />,
      label: "عوارض همودیالیز",
      description: "مدیریت عوارض حین همودیالیز",
      color: "from-teal-500 to-green-600"
    },

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* هدر */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaClinicMedical className="text-blue-600" size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  بخش همودیالیز کودکان
                </h1>
                <p className="text-gray-600 mt-1">راهنمای تخصصی همودیالیز اطفال و نوزادان</p>
              </div>
            </div>
          </div>
        </div>

        {/* کارت‌های اصلی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="block group"
            >
              <div className={`bg-gradient-to-r ${item.color} text-white rounded-xl shadow-lg p-6 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl h-full`}>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-full mb-4">
                    {item.icon}
                  </div>
                  <h2 className="text-lg font-bold mb-2">{item.label}</h2>
                  <p className="text-white text-opacity-90 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}