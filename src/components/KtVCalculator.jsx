// import { useState } from "react";

// export function KtVCalculator() {
//   const [ureaPre, setUreaPre] = useState("");
//   const [ureaPost, setUreaPost] = useState("");
//   const [dialysisTime, setDialysisTime] = useState("");
//   const [result, setResult] = useState(null);
//   const [message, setMessage] = useState("");

//   const calculateKtV = () => {
//     const pre = parseFloat(ureaPre);
//     const post = parseFloat(ureaPost);
//     const time = parseFloat(dialysisTime);

//     if (isNaN(pre) || isNaN(post) || isNaN(time) || pre <= 0 || post <= 0 || time <= 0) {
//       setResult(null);
//       setMessage("لطفاً مقادیر معتبر وارد کنید.");
//       return;
//     }

//     // فرمول ساده شده kt/v
//     const ktv = -Math.log(post / pre - 0.008 * time);
//     const ktvRounded = ktv.toFixed(2);
//     setResult(ktvRounded);

//     // تفسیر نتیجه بر اساس محدوده kt/v
//     if (ktv < 1.2) setMessage("دیالیز ناکافی است و نیاز به بهبود دارد.");
//     else if (ktv >= 1.2 && ktv <= 1.4) setMessage("محدوده هدف و بهینه دیالیز.");
//     else if (ktv > 1.4) setMessage("دیالیز به خوبی انجام شده است.");
//     else setMessage("");
//   };

//   return (
//     <div className="p-4 max-w-xl mx-auto space-y-4 text-right">
//       <h2 className="text-xl font-bold text-center mb-4">محاسبه Kt/V</h2>

//       <div className="space-y-2">
//         <label className="block">اوره قبل از دیالیز (mg/dL)</label>
//         <input
//           type="number"
//           value={ureaPre}
//           onChange={(e) => setUreaPre(e.target.value)}
//           className="w-full p-2 border rounded"
//         />

//         <label className="block">اوره بعد از دیالیز (mg/dL)</label>
//         <input
//           type="number"
//           value={ureaPost}
//           onChange={(e) => setUreaPost(e.target.value)}
//           className="w-full p-2 border rounded"
//         />

//         <label className="block">مدت زمان دیالیز (ساعت)</label>
//         <input
//           type="number"
//           value={dialysisTime}
//           onChange={(e) => setDialysisTime(e.target.value)}
//           className="w-full p-2 border rounded"
//         />

//         <button
//           onClick={calculateKtV}
//           className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
//         >
//           محاسبه
//         </button>
        

//         {result !== null && (
//           <div className="mt-4 text-center text-lg font-semibold">
//             مقدار Kt/V: {result} — {message}
//           </div>
//         )}

//         {/* اگر خطا باشد */}
//         {result === null && message && (
//           <div className="mt-4 text-center text-red-600 font-semibold">
//             {message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";

export function KtVCalculator() {
  // حالت فعال: 'uf' یا 'ktv'
  const [activeCalc, setActiveCalc] = useState("uf");

  // ==== UF Calculator states ====
  const [weight, setWeight] = useState("");
  const [fluidIntake, setFluidIntake] = useState("");
  const [urineOutput, setUrineOutput] = useState("");
  const [extraFluid, setExtraFluid] = useState("");
  const [targetUf, setTargetUf] = useState(null);

  // ==== Kt/V Calculator states ====
  const [ureaPre, setUreaPre] = useState("");
  const [ureaPost, setUreaPost] = useState("");
  const [dialysisTime, setDialysisTime] = useState("");
  const [ktvResult, setKtvResult] = useState(null);
  const [ktvMessage, setKtvMessage] = useState("");

  // محاسبات UF
  const handleCalculateUF = () => {
    const numericWeight = parseFloat(weight) || 0;
    const intake = parseFloat(fluidIntake) || 0;
    const urine = parseFloat(urineOutput) || 0;
    const other = parseFloat(extraFluid) || 0;

    const netFluid = intake - urine + other;
    const maxUF = numericWeight * 10; // حداکثر UF مجاز در ساعت بر حسب kg
    const result = Math.min(netFluid, maxUF);
    setTargetUf(result);
  };

  const handleResetUF = () => {
    setWeight("");
    setFluidIntake("");
    setUrineOutput("");
    setExtraFluid("");
    setTargetUf(null);
  };

  // محاسبه Kt/V
  const calculateKtV = () => {
    const pre = parseFloat(ureaPre);
    const post = parseFloat(ureaPost);
    const time = parseFloat(dialysisTime);

    if (isNaN(pre) || isNaN(post) || isNaN(time) || pre <= 0 || post <= 0 || time <= 0) {
      setKtvResult(null);
      setKtvMessage("لطفاً مقادیر معتبر وارد کنید.");
      return;
    }

    const ktv = -Math.log(post / pre - 0.008 * time);
    const ktvRounded = ktv.toFixed(2);
    setKtvResult(ktvRounded);

    if (ktv < 1.2) setKtvMessage("دیالیز ناکافی است.");
    else if (ktv >= 1.2 && ktv <= 1.4) setKtvMessage("محدوده هدف و بهینه دیالیز.");
    else if (ktv > 1.4) setKtvMessage("دیالیز به خوبی انجام شده است.");
    else setKtvMessage("");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* دکمه انتخاب حالت */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setActiveCalc("uf")}
          className={`py-2 px-6 rounded ${
            activeCalc === "uf" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          محاسبه UF هدف‌دار
        </button>
        <button
          onClick={() => setActiveCalc("ktv")}
          className={`py-2 px-6 rounded ${
            activeCalc === "ktv" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          محاسبه Kt/V
        </button>
      </div>

      {/* محاسبه UF */}
      {activeCalc === "uf" && (
        <div className="space-y-4 text-right">
          <div>
            <label className="block font-semibold">وزن بیمار (کیلوگرم):</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full border p-2 rounded text-right"
            />
          </div>

          <div>
            <label className="block font-semibold">ورودی مایعات در ۲۴ ساعت اخیر (ml):</label>
            <input
              type="number"
              value={fluidIntake}
              onChange={(e) => setFluidIntake(e.target.value)}
              className="w-full border p-2 rounded text-right"
            />
          </div>

          <div>
            <label className="block font-semibold">حجم ادرار در ۲۴ ساعت اخیر (ml):</label>
            <input
              type="number"
              value={urineOutput}
              onChange={(e) => setUrineOutput(e.target.value)}
              className="w-full border p-2 rounded text-right"
            />
          </div>

          <div>
            <label className="block font-semibold">مایعات اضافی (ادم، تزریق‌ها، تغذیه و...):</label>
            <input
              type="number"
              value={extraFluid}
              onChange={(e) => setExtraFluid(e.target.value)}
              className="w-full border p-2 rounded text-right"
            />
          </div>

          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={handleCalculateUF}
              className="flex-grow bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              محاسبه
            </button>
            <button
              onClick={handleResetUF}
              className="flex-grow bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
            >
              پاک‌کردن
            </button>
          </div>

          {targetUf !== null && (
            <div className="bg-blue-50 p-4 rounded border mt-4">
              <p>
                💧 UF پیشنهادی: <strong>{targetUf.toFixed(0)} میلی‌لیتر</strong>
              </p>
              <p className="text-sm text-gray-700 mt-1">
                * بر اساس تعادل مایعات و حداکثر مجاز برای وزن وارد شده
              </p>
            </div>
          )}
        </div>
      )}

      {/* محاسبه Kt/V */}
      {activeCalc === "ktv" && (
        <div className="space-y-4 text-right">
          <label className="block">اوره قبل از دیالیز (mg/dL)</label>
          <input
            type="number"
            value={ureaPre}
            onChange={(e) => setUreaPre(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block">اوره بعد از دیالیز (mg/dL)</label>
          <input
            type="number"
            value={ureaPost}
            onChange={(e) => setUreaPost(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block">مدت زمان دیالیز (ساعت)</label>
          <input
            type="number"
            value={dialysisTime}
            onChange={(e) => setDialysisTime(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <button
            onClick={calculateKtV}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
          >
            محاسبه
          </button>

          {ktvResult !== null && (
            <div className="mt-4 text-center text-lg font-semibold">
              مقدار Kt/V: {ktvResult} — {ktvMessage}
            </div>
          )}

          {ktvResult === null && ktvMessage && (
            <div className="mt-4 text-center text-red-600 font-semibold">
              {ktvMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
