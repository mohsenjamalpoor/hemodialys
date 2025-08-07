import React, { useState } from "react";

export function NutritionAssistant() {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [ageUnit, setAgeUnit] = useState("months"); // واحد سن: months یا years
  const [calories, setCalories] = useState(null);
  const [protein, setProtein] = useState(null);

  // محاسبه نیازهای تغذیه‌ای
  const calculateNutrition = () => {
    const w = parseFloat(weight);
    let ageMonths = parseInt(age);

    if (isNaN(w) || w <= 0 || isNaN(ageMonths) || ageMonths < 0) {
      setCalories(null);
      setProtein(null);
      return;
    }

    // اگر واحد سال است، تبدیل به ماه
    if (ageUnit === "years") {
      ageMonths = ageMonths * 12;
    }

    // کالری تقریبی بر اساس وزن (کالری بر کیلوگرم)
    // مثلاً: کودکان زیر 1 سال: 100 کالری/kg، بالای 1 سال: 85 کالری/kg
    let calPerKg = ageMonths < 12 ? 100 : 85;
    const calNeeded = w * calPerKg;

    // پروتئین روزانه بر اساس وزن (گرم بر کیلوگرم)
    // برای کودکان دیالیزی معمولا 1.2 تا 1.5 گرم بر کیلوگرم
    const proteinPerKg = 1.4;
    const proteinNeeded = w * proteinPerKg;

    setCalories(calNeeded);
    setProtein(proteinNeeded);
  };

  const handleReset = () => {
    setWeight("");
    setAge("");
    setAgeUnit("months");
    setCalories(null);
    setProtein(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow text-right">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">دستیار تغذیه کودکان دیالیزی</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">وزن کودک (کیلوگرم):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full border rounded p-2 text-right"
          min="0"
          step="0.1"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">سن کودک:</label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="flex-grow border rounded p-2 text-right"
            min="0"
          />
          <select
            value={ageUnit}
            onChange={(e) => setAgeUnit(e.target.value)}
            className="border rounded p-2"
          >
            <option value="months">ماه</option>
            <option value="years">سال</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={calculateNutrition}
          className="flex-grow bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          محاسبه
        </button>
        <button
          onClick={handleReset}
          className="flex-grow bg-gray-400 hover:bg-gray-500 text-white py-2 rounded"
        >
          پاک‌کردن
        </button>
      </div>

      {calories !== null && protein !== null && (
        <div className="bg-blue-50 p-4 rounded border">
          <p>
            🔥 نیاز کالری روزانه: <strong>{calories.toFixed(0)} کیلوکالری</strong>
          </p>
          <p>
            🍗 نیاز پروتئین روزانه: <strong>{protein.toFixed(1)} گرم</strong>
          </p>
          <hr className="my-2" />
          <p className="text-sm text-gray-700">
            * توجه: این مقادیر تقریبی هستند و باید با پزشک یا متخصص تغذیه مشورت شود.
          </p>
          <p className="text-sm mt-2">
            نکات تغذیه‌ای:
            <ul className="list-disc pr-5 mt-1">
              <li>مصرف کافی پروتئین برای جلوگیری از سوء تغذیه.</li>
              <li>کنترل دریافت مایعات و الکترولیت‌ها (سدیم، پتاسیم، فسفر).</li>
              <li>توجه به جذب کالری از منابع مختلف (کربوهیدرات، چربی).</li>
              <li>استفاده از مکمل‌ها در صورت نیاز با تجویز پزشک.</li>
            </ul>
          </p>
        </div>
      )}
    </div>
  );
}
