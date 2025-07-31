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
  },
  {
    name: "PS10",
    suitableFor: "15–25 کیلوگرم",
    description: "مناسب برای کودکان با وزن متوسط رو به بالا",
    minWeight: 15,
    maxWeight: 20.5,
    koa: "6.8 mL/min",
    uf: "637 mL/min",
    tmp: "500 mmHg",
  },
  {
    name: "PS13",
    suitableFor: "20–40 کیلوگرم",
    description: "قابل استفاده برای کودکان بزرگ‌تر",
    minWeight: 20,
    maxWeight: 30,
    koa: "8.8 mL/min",
    uf: "746 mL/min",
    tmp: "500 mmHg",
  },
];
export function DialysisAssistant() {
  const [weight, setWeight] = useState("");
  const [condition, setCondition] = useState("none");

  // این دو برای نمایش نتیجه بعد از کلیک دکمه
  const [submittedWeight, setSubmittedWeight] = useState(null);
  const [submittedCondition, setSubmittedCondition] = useState("none");

  const numericWeight = parseFloat(submittedWeight) || 0;

  const matchedFilters = filters.filter(
    (f) => numericWeight >= f.minWeight && numericWeight <= f.maxWeight
  );

  const baseQb = numericWeight * 4;
  const adjustment = submittedCondition === "acute" ? 50 : submittedCondition === "chronic" ? 100 : 0;
  const qbRange = {
    min: numericWeight * 3,
    max: numericWeight * 5,
    standard: baseQb + adjustment,
  };

  function handleCalculate() {
    setSubmittedWeight(weight);
    setSubmittedCondition(condition);
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center text-blue-700">
        راهنمای انتخاب صافی، Qb و هپارین
      </h2>

      <div>
        <label className="block mb-1">وزن بیمار (کیلوگرم):</label>
        <input
          type="number"
          min={0}
          placeholder="وزن را وارد کنید..."
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg text-right"
        />
      </div>

      <div>
        <label className="block mb-1">وضعیت بیمار:</label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        >
          <option value="none">انتخاب کنید</option>
          <option value="acute">حاد (Acute)</option>
          <option value="chronic">مزمن (Chronic)</option>
        </select>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4"
      >
        محاسبه
      </button>

      {/* نتایج فقط وقتی محاسبه شده نمایش داده میشه */}
      {numericWeight > 0 && (
        <>
          <div className="bg-blue-50 border rounded-lg p-4">
            <h3 className="font-bold text-blue-800 mb-2">Qb پیشنهادی:</h3>
            <p>
              محدوده Qb:{" "}
              <span className="font-medium">{qbRange.min} – {qbRange.max}</span> ml/min
            </p>
            {submittedCondition !== "none" && (
              <p>
                Qb با در نظر گرفتن وضعیت بیمار ({submittedCondition === "acute" ? "حاد" : "مزمن"}):{" "}
                <span className="font-semibold">{qbRange.standard}</span> ml/min
              </p>
            )}
          </div>

          <div className="bg-green-50 border rounded-lg p-4">
            <h3 className="font-bold text-green-800 mb-2">دوز هپارین پیشنهادی:</h3>
            <p>
              💉 Bolus اولیه:{" "}
              <span className="font-medium">
                {Math.round(numericWeight * 15)} – {Math.round(numericWeight * 20)}
              </span>{" "}
              IU
            </p>
            <p>
              💧 Infusion مداوم:{" "}
              <span className="font-medium">
                {Math.round(numericWeight * 20)} – {Math.round(numericWeight * 30)}
              </span>{" "}
              IU/h
            </p>
            <p className="text-sm text-red-600 mt-2">
              ⚠️ تزریق باید نیم ساعت قبل از پایان همودیالیز قطع شود.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-800">صافی(فیلتر) پیشنهادی:</h3>

            {matchedFilters.length === 0 ? (
              <p className="text-red-600">❌ صافی مناسب برای این وزن یافت نشد.</p>
            ) : (
              matchedFilters.map((f, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border shadow bg-white hover:bg-blue-50 transition"
                >
                  <h3 className="text-lg font-bold text-blue-800">{f.name}</h3>
                  <p className="text-sm text-gray-700">
                    مناسب برای: <span className="font-medium">{f.suitableFor}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    KOA (پاکسازی): <span className="font-medium">{f.koa}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    UF (ظرفیت اولترافیلتراسیون): <span className="font-medium">{f.uf}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    TMP مجاز: <span className="font-medium">{f.tmp}</span>
                  </p>
                  <p className="text-sm text-gray-700 mt-1">{f.description}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}