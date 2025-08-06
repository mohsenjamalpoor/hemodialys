import React, { useState } from "react";

const filters = [
  {
    name: "F4",
    suitableFor: "<15 کیلوگرم",
    description: "صافی کوچک مناسب برای نوزاد و کودک کم‌وزن",
    minWeight: 0,
    maxWeight: 14.9,
    koa: "2.8 mL/min",
    uf: "364 mL/min",
    tmp: "600 mmHg",
    preferredForUnstable: true,
  },
  {
    name: "F6",
    suitableFor: "15–20 کیلوگرم",
    description: "توان پاکسازی متوسط؛ فشار مناسب",
    minWeight: 15,
    maxWeight: 20,
    koa: "5.5 mL/min",
    uf: "630 mL/min",
    tmp: "600 mmHg",
    preferredForUnstable: true,
  },
  {
    name: "PS10",
    suitableFor: "15–25 کیلوگرم",
    description: "مناسب برای کودکان با وزن متوسط رو به بالا",
    minWeight: 15,
    maxWeight: 25,
    koa: "6.8 mL/min",
    uf: "637 mL/min",
    tmp: "500 mmHg",
    preferredForUnstable: false,
  },
  {
    name: "PS13",
    suitableFor: "20–40 کیلوگرم",
    description: "قابل استفاده برای کودکان بزرگ‌تر",
    minWeight: 20,
    maxWeight: 40,
    koa: "8.8 mL/min",
    uf: "746 mL/min",
    tmp: "500 mmHg",
    preferredForUnstable: false,
  },
];

export function DialysisAssistant() {
  const [weight, setWeight] = useState("");
  const [clinicalStatus, setClinicalStatus] = useState("none");
  const [hemodynamicStatus, setHemodynamicStatus] = useState("stable");
  const [plt, setPlt] = useState("");
  const [inr, setInr] = useState("");
  const [bpSystolic, setBpSystolic] = useState("");
  const [bpDiastolic, setBpDiastolic] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const numericWeight = parseFloat(weight.replace(/٫|٬|,/g, ".")) || 0;
  const numericPlt = parseFloat(plt) || 0;
  const numericInr = parseFloat(inr) || 0;
  const numericBpS = parseInt(bpSystolic) || 0;
  const numericBpD = parseInt(bpDiastolic) || 0;

  const baseQb = numericWeight * 4;
  const adjustment =
    clinicalStatus === "acute" ? 50 : clinicalStatus === "chronic" ? 100 : 0;
  const qbRange = {
    min: numericWeight * 3,
    max: numericWeight * 5,
    standard: baseQb + adjustment,
  };

  // پیشنهاد Qd (Dialysate flow rate): معمولاً 2 برابر Qb در کودکان
  const qdSuggested = qbRange.standard * 2;

  // پیشنهاد Ultrafiltration Rate (UFR): معمولاً 10-15 mL/kg/hr در کودکان
  const ufrMin = numericWeight * 10;
  const ufrMax = numericWeight * 15;

  const canUseHeparin = numericInr <= 1.5 && numericPlt >= 50000;

  // هشدارهای ایمنی
  const pltWarning =
    numericPlt > 0 && numericPlt < 50000
      ? "⚠️ PLT پایین است، خطر خونریزی افزایش می‌یابد."
      : null;
  const inrWarning =
    numericInr > 1.5
      ? "⚠️ INR بالا است، ممکن است ریسک خونریزی وجود داشته باشد."
      : null;

  const bpWarning =
    numericBpS > 0 && numericBpS < 90
      ? "⚠️ فشار خون سیستولیک پایین است، احتمال افت فشار حین دیالیز وجود دارد."
      : null;

  // پیدا کردن فیلتر مناسب با منطق کامل
  const getMatchedFilters = () => {
    const matched = filters.filter(
      (f) => numericWeight >= f.minWeight && numericWeight <= f.maxWeight
    );

    if (matched.length === 0) return [];

    if (hemodynamicStatus === "unstable") {
      const unstableFilters = matched.filter((f) => f.preferredForUnstable);
      if (unstableFilters.length > 0) return unstableFilters;
    }
    return matched;
  };

  const matchedFilters = getMatchedFilters();

  // زمان پیشنهادی دیالیز بر اساس وزن (مثلاً 4 ساعت ثابت برای کودک معمولی)
  const dialysisTimeHours =
    numericWeight > 0 ? Math.min(Math.max(3, numericWeight / 5), 5) : 0;

  function handleCalculate() {
    setSubmitted(true);
  }

  function handleReset() {
    setWeight("");
    setClinicalStatus("none");
    setHemodynamicStatus("stable");
    setPlt("");
    setInr("");
    setBpSystolic("");
    setBpDiastolic("");
    setSubmitted(false);
    setShowNotes(false);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 font-sans">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        دستیار دیالیز کودکان
      </h2>

      {/* ورودی وزن */}
      <div>
        <label className="block mb-1 font-semibold">وزن بیمار (کیلوگرم):</label>
        <input
          type="number"
          min={0}
          step="0.1"
          placeholder="مثال: 12.5"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg text-right"
        />
      </div>

      {/* وضعیت بالینی */}
      <div>
        <label className="block mb-1 font-semibold">وضعیت بالینی:</label>
        <select
          value={clinicalStatus}
          onChange={(e) => setClinicalStatus(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="none">انتخاب کنید</option>
          <option value="acute">حاد (Acute)</option>
          <option value="chronic">مزمن (Chronic)</option>
        </select>
      </div>

      {/* وضعیت همودینامیک */}
      <div>
        <label className="block mb-1 font-semibold">وضعیت همودینامیک:</label>
        <select
          value={hemodynamicStatus}
          onChange={(e) => setHemodynamicStatus(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="stable">پایدار</option>
          <option value="unstable">اینتوبه / ناپایدار</option>
        </select>
      </div>

      {/* آزمایشات PLT و INR */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">PLT (میلیون بر میلی‌لیتر):</label>
          <input
            type="number"
            min={0}
            step="1000"
            placeholder="مثال: 150000"
            value={plt}
            onChange={(e) => setPlt(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-right"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">INR:</label>
          <input
            type="number"
            min={0}
            step="0.1"
            placeholder="مثال: 1.2"
            value={inr}
            onChange={(e) => setInr(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-right"
          />
        </div>
      </div>

      {/* فشار خون */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">فشار خون سیستولیک (mmHg):</label>
          <input
            type="number"
            min={0}
            placeholder="مثال: 110"
            value={bpSystolic}
            onChange={(e) => setBpSystolic(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-right"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">فشار خون دیاستولیک (mmHg):</label>
          <input
            type="number"
            min={0}
            placeholder="مثال: 70"
            value={bpDiastolic}
            onChange={(e) => setBpDiastolic(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-right"
          />
        </div>
      </div>

      {/* دکمه محاسبه */}
      <div className="flex space-x-2 rtl:space-x-reverse">
        <button
          onClick={handleCalculate}
          className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4"
        >
          محاسبه
        </button>
        <button
          onClick={handleReset}
          className="flex-grow bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md mt-4"
        >
          پاک‌کردن
        </button>
      </div>

      {/* نتایج */}
      {submitted && numericWeight > 0 && (
        <div className="space-y-6 mt-6">
          {/* Qb */}
          <div className="bg-blue-50 border rounded-lg p-4">
            <h3 className="font-bold text-blue-800 mb-2">🔄 Qb</h3>
            <p>
              محدوده Qb: <strong>{qbRange.min.toFixed(1)} – {qbRange.max.toFixed(1)}</strong> ml/min
            </p>
            {clinicalStatus !== "none" && (
              <p>Qb پیشنهادی: <strong>{qbRange.standard.toFixed(1)}</strong> ml/min</p>
            )}
          </div>

          {/* Qd */}
          <div className="bg-blue-100 border rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">💧 Qd (Dialysate Flow Rate)</h3>
            <p>Qd پیشنهادی: <strong>{qdSuggested.toFixed(1)}</strong> ml/min</p>
            <p className="text-sm text-gray-700">معمولاً دو برابر Qb در کودکان</p>
          </div>

          {/* Ultrafiltration Rate */}
          <div className="bg-blue-100 border rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">💧 Ultrafiltration Rate (UFR)</h3>
            <p>
              محدوده پیشنهادی: <strong>{ufrMin.toFixed(0)} – {ufrMax.toFixed(0)}</strong> mL/hr
            </p>
            <p className="text-sm text-gray-700">معمولاً 10-15 mL/kg/hr</p>
          </div>

          {/* دوز هپارین */}
          <div className="bg-green-50 border rounded-lg p-4">
            <h3 className="font-bold text-green-800 mb-2">💉 دوز هپارین</h3>
            {canUseHeparin ? (
              <>
                <p>
                  Bolus اولیه:{" "}
                  <strong>
                    {Math.round(numericWeight * 15)} – {Math.round(numericWeight * 20)}
                  </strong>{" "}
                  IU
                </p>
                <p>
                  Infusion مداوم:{" "}
                  <strong>
                    {Math.round(numericWeight * 20)} – {Math.round(numericWeight * 30)}
                  </strong>{" "}
                  IU/h
                </p>
              </>
            ) : (
              <p className="text-red-600 font-semibold">
                ❌ بیمار برای هپارین مناسب نیست (INR یا PLT غیرمجاز)
              </p>
            )}
          </div>

          {/* هشدارهای ایمنی */}
          {(pltWarning || inrWarning || bpWarning) && (
            <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4 text-yellow-800 font-semibold">
              <h3 className="mb-2">⚠️ هشدارهای ایمنی</h3>
              <ul className="list-disc list-inside space-y-1">
                {pltWarning && <li>{pltWarning}</li>}
                {inrWarning && <li>{inrWarning}</li>}
                {bpWarning && <li>{bpWarning}</li>}
              </ul>
            </div>
          )}

          {/* فیلتر */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-800">🧪 صافی پیشنهادی</h3>
            {matchedFilters.length === 0 ? (
              <p className="text-red-600">صافی مناسب یافت نشد</p>
            ) : (
              matchedFilters.map((f, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border shadow bg-white"
                >
                  <h4 className="text-lg font-bold text-blue-800">{f.name}</h4>
                  <p>
                    مناسب برای: <strong>{f.suitableFor}</strong>
                  </p>
                  <p>KOA: {f.koa}</p>
                  <p>UF: {f.uf}</p>
                  <p>TMP: {f.tmp}</p>
                  <p className="text-sm mt-1">{f.description}</p>
                </div>
              ))
            )}
          </div>

          {/* زمان پیشنهادی دیالیز */}
          <div className="bg-blue-50 border rounded-lg p-4 mt-6">
            <h3 className="font-bold text-blue-800 mb-2">⏱️ زمان پیشنهادی دیالیز</h3>
            <p>
              حدود <strong>{dialysisTimeHours.toFixed(1)}</strong> ساعت
            </p>
            <p className="text-sm text-gray-700">
              این مقدار تقریبی است و باید بر اساس وضعیت بیمار تنظیم شود.
            </p>
          </div>

          {/* نکات آموزشی */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="mt-4 underline text-blue-700"
          >
            {showNotes ? "پنهان کردن نکات آموزشی" : "نمایش نکات آموزشی"}
          </button>
          {showNotes && (
            <div className="bg-gray-100 border rounded-lg p-4 mt-2 text-sm text-gray-800 space-y-2">
              <p>
                • Qb جریان خون است که بر اساس وزن بیمار تعیین می‌شود و باید با دقت تنظیم شود.
              </p>
              <p>
                • Qd یا جریان دیالیز معمولاً دو برابر Qb است تا پاکسازی مناسب انجام شود.
              </p>
              <p>
                • دوز هپارین بر اساس وزن تعیین می‌شود و باید حتما وضعیت PLT و INR بررسی شود.
              </p>
              <p>
                • در بیماران ناپایدار، فیلترهایی که مناسب وضعیت همودینامیک هستند اولویت دارند.
              </p>
              <p>
                • فشار خون پایین می‌تواند خطر افت فشار حین دیالیز را افزایش دهد؛ مراقبت‌های ویژه لازم است.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
