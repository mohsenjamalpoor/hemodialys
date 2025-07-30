import React, { useState } from "react";

const complicationsData = [
  {
    complication: "افت فشار خون (Hypotension)",
    signs: "بی‌حالی، تهوع، تعریق، کاهش سطح هوشیاری",
    commonCause: "برداشت زیاد UF، Qb بالا، وزن خشک اشتباه",
    treatment:
      "🔹 توقف UF\n🔹 تزریق سالین 5–10 mL/kg IV\n🔹 ترندلنبرگ\n🔹 کاهش Qb و بازبینی وزن خشک",
  },
  {
    complication: "کرامپ عضلانی",
    signs: "درد و گرفتگی پاها یا دست‌ها",
    commonCause: "برداشت مایع زیاد، هایپوناترمی، کاهش کلسیم",
    treatment:
      "🔹 توقف UF\n🔹 5–10 mL/kg نرمال سالین\n🔹 گرمای موضعی، آرام‌سازی کودک",
  },
  {
    complication: "تهوع و استفراغ",
    signs: "استفراغ حین دیالیز، بی‌قراری",
    commonCause: "افت فشار، اورمی شدید",
    treatment: "🔹 کاهش UF یا توقف موقت\n🔹 اندانسترون 0.1–0.15 mg/kg IV",
  },
  {
    complication: "سندرم عدم تعادل دیالیز (DDS)",
    signs: "سردرد، گیجی، تشنج، خواب‌آلودگی",
    commonCause: "کاهش سریع اوره در اولین جلسات",
    treatment:
      "🔹 کاهش Qb و زمان دیالیز\n🔹 مانیتور نورولوژیک\n🔹 دیالیز کوتاه با UF کم\n🔹 در موارد شدید: مانیتول 0.25 g/kg IV",
  },
  {
    complication: "واکنش حساسیتی به صافی",
    signs: "کهیر، خارش، تنگی نفس، افت فشار",
    commonCause: "حساسیت به جنس غشاء (معمولاً صافی نو)",
    treatment:
      "🔹 قطع فوری دیالیز\n🔹 آنتی‌هیستامین: دکسا 0.15–0.3 mg/kg یا کلرفنیرامین\n🔹 اپی‌نفرین IM (0.01 mg/kg) در موارد شدید",
  },
  {
    complication: "تنگی نفس",
    signs: "تنفس سریع، کاهش O₂، سیانوز",
    commonCause: "UF زیاد، ادم ریه، آنافیلاکسی",
    treatment: "🔹 قطع UF\n🔹 اکسیژن، ارزیابی ریه\n🔹 اطمینان از عدم واکنش به صافی",
  },
  {
    complication: "هیپوکالمی/هیپوکلسمی",
    signs: "ضعف، آریتمی، تحریک‌پذیری، تشنج",
    commonCause: "دیالیز شدید، محلول اشتباه",
    treatment: "🔹 چک فوری الکترولیت‌ها\n🔹 اصلاح سریع با Ca Gluconate یا KCl",
  },
  {
    complication: "هیپوترمی",
    signs: "لرز، پوست سرد، کاهش دما",
    commonCause: "دیالیز طولانی با مایع سرد",
    treatment:
      "🔹 گرم‌کردن محیط\n🔹 استفاده از مایع دیالیز گرم‌شده (37°C)",
  },
  {
    complication: "مشکل در کاتتر یا سوزن فیستول",
    signs: "کاهش فشار دستگاه، هشدارهای دستگاه",
    commonCause: "جابجایی سوزن، کاتتر مسدود شده",
    treatment:
      "🔹 تغییر پوزیشن\n🔹 شست‌وشو با سالین\n🔹 در موارد شدید: هپارین قفل، تماس با تیم عروق",
  },
];

export function ComplicationManagement() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = complicationsData.filter(
    (c) =>
      c.complication.includes(search) ||
      c.signs.includes(search) ||
      c.commonCause.includes(search)
  );

  return (
    <div className="p-4 max-w-3xl mx-auto text-right">
      <h2 className="text-2xl font-bold text-center mb-6">
         عوارض شایع دیالیز کودکان
      </h2>

      <input
        type="text"
        placeholder="جستجوی عارضه، علائم یا علت..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-2 border rounded-lg text-right"
      />

      <div className="grid gap-4">
        {filtered.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelected(item)}
            className="cursor-pointer bg-white p-4 border rounded-xl shadow hover:bg-blue-50 transition"
          >
            <h3 className="text-lg font-bold text-blue-700">
              {item.complication}
            </h3>
            <p className="text-sm text-gray-600">علائم: {item.signs}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500">نتیجه‌ای یافت نشد.</p>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-lg relative text-right">
            <button
              className="absolute top-2 left-2 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setSelected(null)}
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-3 text-blue-700">
              {selected.complication}
            </h3>
            <p className="mb-2 whitespace-pre-wrap">
              <strong> علائم بالینی:</strong>
              <br />
              {selected.signs}
            </p>
            <p className="mb-2 whitespace-pre-wrap">
              <strong> علت شایع:</strong>
              <br />
              {selected.commonCause}
            </p>
            <p className="mb-2 whitespace-pre-wrap">
              <strong> درمان فوری:</strong>
              <br />
              {selected.treatment}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
