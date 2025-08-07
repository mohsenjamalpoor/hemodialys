// import React, { useState } from "react";

// export function MedicationDosage() {
//   const [weight, setWeight] = useState("");
//   const [selectedDrug, setSelectedDrug] = useState("");
//   const [dose, setDose] = useState(null);

//   const drugData = {
//     "هپارین": {
//       calc: (w) => `${w * 10} - ${w * 20} واحد بولوس`,
//       note: "دوز استاندارد: 10 تا 20 واحد به ازای هر کیلوگرم به صورت بولوس در شروع دیالیز. قابل تنظیم با توجه به شرایط انعقادی.",
//     },
//     "EPO (اپویتین)": {
//       calc: (w) => `${w * 50} - ${w * 150} واحد ۳ بار در هفته`,
//       note: "دوز معمول: 50 تا 150 واحد به ازای هر کیلوگرم، زیر جلدی یا وریدی، سه بار در هفته.",
//     },
//     "آهن (Iron Sucrose)": {
//       calc: (w) => `${w * 3} - ${w * 6} میلی‌گرم در هفته`,
//       note: "دوز معمول: 3 تا 6 mg/kg/week. وضعیت فریتین و TSAT باید بررسی شود.",
//     },
//     "ونکومایسین": {
//       calc: (w) => `${w * 10} - ${w * 15} میلی‌گرم در کیلوگرم`,
//       note: "دوز بارگیری: 10-15 mg/kg قبل از دیالیز. سطح سرمی باید بررسی شود.",
//     },
//     "سفتریاکسون": {
//       calc: (w) => `${w * 50} - ${w * 75} میلی‌گرم روزانه`,
//       note: "دوز: 50-75 mg/kg/day، حداکثر 2 گرم در روز.",
//     },
//   };

//   const calculateDose = () => {
//     const w = parseFloat(weight);
//     if (!w || !selectedDrug) return;
//     setDose(drugData[selectedDrug].calc(w));
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow" dir="rtl">
//       <h2 className="text-2xl font-bold text-center text-rose-700 mb-4">محاسبه دوز داروها</h2>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <input
//           type="number"
//           value={weight}
//           onChange={(e) => setWeight(e.target.value)}
//           className="border p-2 rounded"
//           placeholder="وزن کودک (kg)"
//         />

//         <select
//           value={selectedDrug}
//           onChange={(e) => setSelectedDrug(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="">انتخاب دارو</option>
//           {Object.keys(drugData).map((drug, idx) => (
//             <option key={idx} value={drug}>{drug}</option>
//           ))}
//         </select>

//         <button
//           onClick={calculateDose}
//           className="bg-rose-600 hover:bg-rose-700 text-white rounded px-4 py-2"
//         >
//           محاسبه دوز
//         </button>
//       </div>

//       {dose && (
//         <div className="bg-rose-100 border border-rose-300 text-rose-900 p-4 rounded space-y-2">
//           <p><strong>دوز پیشنهادی:</strong> {dose}</p>
//           <p className="text-sm text-gray-700">{drugData[selectedDrug].note}</p>
//         </div>
//       )}
//     </div>
//   );
// }
