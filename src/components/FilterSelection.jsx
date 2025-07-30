import React, { useState } from "react";


const filters = [
  {
    name: "PS6",
    surface: "~0.6 m²",
    membrane: "Polysulfone",
    flux: "Low-flux",
    priming: "50–60 mL",
    suitableFor: "نوزادان / کمتر از 10 کیلوگرم",
    minWeight: 0,
    maxWeight: 10,
  },
  {
    name: "PS10",
    surface: "~1.0 m²",
    membrane: "Polysulfone",
    flux: "High-flux",
    priming: "65–70 mL",
    suitableFor: "10–15 کیلوگرم",
    minWeight: 10,
    maxWeight: 15,
  },
  {
    name: "PS13",
    surface: "~1.3 m²",
    membrane: "Polysulfone",
    flux: "High-flux",
    priming: "75–80 mL",
    suitableFor: "15–25 کیلوگرم",
    minWeight: 15,
    maxWeight: 25,
  },
  {
    name: "F4",
    surface: "0.7 m²",
    membrane: "Polysulfone",
    flux: "Low-flux",
    priming: "56 mL",
    suitableFor: "~10 کیلوگرم",
    minWeight: 9,
    maxWeight: 11,
  },
  {
    name: "F5",
    surface: "1.0 m²",
    membrane: "Polysulfone",
    flux: "High-flux",
    priming: "72 mL",
    suitableFor: "10–20 کیلوگرم",
    minWeight: 10,
    maxWeight: 20,
  },
  {
    name: "FX40",
    surface: "1.4 m²",
    membrane: "PES",
    flux: "High-flux",
    priming: "~80 mL",
    suitableFor: ">25 کیلوگرم / نوجوان",
    minWeight: 25,
    maxWeight: 200,
  },
];

export function FilterSelection() {
  const [weight, setWeight] = useState("");
  const numericWeight = parseFloat(weight);

  const matched = filters.filter(
    (f) => numericWeight >= f.minWeight && numericWeight <= f.maxWeight
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
         انتخاب صافی مناسب بر اساس وزن
      </h2>

      <div className="flex items-center gap-2 mb-6">
        
        <input
          type="number"
          min={0}
          placeholder="وزن بیمار را وارد کنید (کیلوگرم)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg text-right"
        />
      </div>

      {weight && matched.length === 0 && (
        <p className="text-red-600 text-center">❌ صافی مناسب برای این وزن یافت نشد.</p>
      )}

      <div className="grid gap-4">
        {matched.map((f, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border shadow bg-white hover:bg-blue-50 transition"
          >
            <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
               {f.name}
            </h3>
            <p className="mt-1 text-sm text-gray-600 flex items-center gap-1">
               نوع غشاء: <span className="font-medium">{f.membrane}</span>
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
               Flux: <span className="font-medium">{f.flux}</span>
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
               مناسب برای: <span className="font-medium">{f.suitableFor}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1"> سطح غشاء: {f.surface}</p>
            <p className="text-sm text-gray-600"> حجم پرایمینگ: {f.priming}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
