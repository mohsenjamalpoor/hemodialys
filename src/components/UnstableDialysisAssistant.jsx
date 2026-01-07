import React from "react";
import { Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaBed, 
  FaExclamationTriangle, 
  FaHeartbeat,
  FaShieldAlt 
} from "react-icons/fa";
import { DialysisAssistant } from "./DialysisAssistant";

export function UnstableDialysisAssistant() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
       
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <FaBed className="text-red-600" size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  همودیالیز اطفال - وضعیت ناپایدار / اینتوبه
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    وضعیت ناپایدار
                  </span>
                  <FaExclamationTriangle className="text-red-500" />
                  <span className="text-gray-600">نیاز به پایش دقیق</span>
                </div>
              </div>
            </div>
            <Link
              to="/hemo/hemodialysisPediatrics"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft />
              <span>بازگشت به انتخاب وضعیت</span>
            </Link>
          </div>
          
        
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <FaShieldAlt className="text-red-500 mt-1" />
              <div>
                <h3 className="font-bold text-red-800 mb-2">⚠️ پروتکل ویژه وضعیت ناپایدار:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <li className="flex items-center gap-2">
                    <FaHeartbeat className="text-red-400" />
                    <span>Qb کاهش یافته (حداکثر 3-4 ml/kg/min)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaHeartbeat className="text-red-400" />
                    <span>UF Rate محدود (5-10 ml/kg/hr)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaHeartbeat className="text-red-400" />
                    <span>زمان دیالیز کوتاه‌تر (1-3 ساعت)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaHeartbeat className="text-red-400" />
                    <span>پایش دقیق هر 15 دقیقه</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

   
        <DialysisAssistant 
          defaultHemodynamicStatus="unstable"
          isUnstable={true}
          showOnlyPediatric={true}
        />
      </div>
    </div>
  );
}