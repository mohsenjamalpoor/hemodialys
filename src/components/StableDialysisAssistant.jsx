import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaHeartbeat, FaCheckCircle } from "react-icons/fa";
import { DialysisAssistant } from "./DialysisAssistant";

export function StableDialysisAssistant() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-6xl mx-auto">
     
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FaHeartbeat className="text-green-600" size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  همودیالیز اطفال - وضعیت پایدار
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    وضعیت پایدار
                  </span>
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-gray-600">همودینامیک مناسب</span>
                </div>
              </div>
            </div>
            <div className="lg:w-auto">
              <Link
                to="/hemo/hemodialysisPediatrics"
                className="flex items-center gap-3 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:shadow-lg group"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">بازگشت </span>
              </Link>
            </div>
          </div>
          
         
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="font-bold text-green-800 mb-2">تنظیمات ویژه وضعیت پایدار:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Qb کامل (3-5 ml/kg/min)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>UF Rate استاندارد (10-15 ml/kg/hr)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>زمان دیالیز کامل (3-4 ساعت)</span>
              </li>
            </ul>
          </div>
        </div>

   
        <DialysisAssistant 
          defaultHemodynamicStatus="stable"
          isUnstable={false}
          showOnlyPediatric={true}
        />
      </div>
    </div>
  );
}