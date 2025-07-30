import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function QbCalculator() {
  const [weight, setWeight] = useState(10);
  const navigate = useNavigate();

  const qbRange = {
    min: weight * 3,
    max: weight * 5,
    standard: weight * 4 + (weight >= 15 ? 50 : 0),
  };

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <button onClick={() => navigate("/hemo")} className="text-sm text-blue-500">← بازگشت</button>
      <h2 className="text-xl font-bold">💉 محاسبه Qb بر اساس وزن</h2>
      <label className="block">وزن کودک (کیلوگرم):</label>
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
        className="border px-3 py-2 rounded-md w-32"
      />
      <p>🔹 Qb مناسب: {qbRange.min}–{qbRange.max} ml/min</p>
      {weight >= 15 && <p>🔸 Qb تجربی: {qbRange.standard} ml/min</p>}
    </div>
  );
}