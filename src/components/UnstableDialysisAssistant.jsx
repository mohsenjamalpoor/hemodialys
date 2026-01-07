// UnstableDialysisAssistant.jsx
import React, { useState } from "react";
import { DialysisAssistant } from "./DialysisAssistant";
import { FaExclamationTriangle, FaBed, FaHeartbeat } from "react-icons/fa";

export function UnstableDialysisAssistant() {
  return (
    <div className="space-y-6">
      {/* هشدار ویژه برای Unstable */}
      <div className="bg-red-50 border border-red-300 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="bg-red-100 p-2 rounded-full mt-1">
            <FaExclamationTriangle className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-800">
              همودیالیز اطفال - وضعیت ناپایدار / اینتوبه
            </h2>
            <p className="text-red-700 mb-2">
              ⚠️ توجه: این تنظیمات برای بیماران بحرانی است
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                <FaBed className="text-red-500" />
                <span className="text-sm">تحت ونتیلاتور</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                <FaHeartbeat className="text-red-500" />
                <span className="text-sm">ناپایدار همودینامیک</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg">
                <span className="text-red-500 font-bold">!</span>
                <span className="text-sm">نیاز به پایش دقیق</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* کامپوننت اصلی با تنظیمات Unstable */}
      <DialysisAssistant 
        defaultHemodynamicStatus="unstable"
        isUnstable={true}
      />

      {/* پروتکل ویژه برای بیماران ناپایدار */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mt-6">
        <h3 className="font-bold text-yellow-800 mb-3">
          پروتکل ویژه بیماران ناپایدار:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg border">
            <h4 className="font-bold text-red-700 text-sm mb-2">تغییرات ضروری:</h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Qb کاهش یافته (حداکثر ۳-۴ ml/kg/min)</li>
              <li>• UF Rate محدود (۵-۱۰ ml/kg/hr)</li>
              <li>• زمان دیالیز کوتاه‌تر</li>
              <li>• پایش هر ۱۵ دقیقه</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <h4 className="font-bold text-red-700 text-sm mb-2">مراقبت‌ها:</h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• پایش مداوم فشار خون</li>
              <li>• تنظیم مایعات وریدی</li>
              <li>• آمادگی برای افت فشار</li>
              <li>• ارتباط با ICU</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}