// StableDialysisAssistant.jsx
import React, { useState } from "react";
import { DialysisAssistant } from "./DialysisAssistant";

export function StableDialysisAssistant() {
  const [weight, setWeight] = useState("");

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <span className="text-green-700 font-bold">✓</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-800">
              همودیالیز اطفال - وضعیت پایدار
            </h2>
            <p className="text-green-700 text-sm">
              تنظیمات مخصوص بیماران همودینامیک پایدار
            </p>
          </div>
        </div>
      </div>

      {/* کامپوننت اصلی با تنظیمات Stable */}
      <DialysisAssistant 
        defaultHemodynamicStatus="stable"
        isUnstable={false}
      />
      
       {/* نکات اضافی برای بیماران Stable  */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
        <h3 className="font-bold text-blue-800 mb-2">نکات ویژه وضعیت پایدار:</h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>می‌توان از زمان دیالیز استاندارد استفاده کرد</li>
          <li>UF Rate می‌تواند به آرامی افزایش یابد</li>
          <li>پایش هر 30 دقیقه یکبار کافی است</li>
          <li>می‌توان از حداکثر Qb مجاز استفاده کرد</li>
        </ul>
      </div>
    </div>
  );
}