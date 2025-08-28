// import React, { useState } from "react";
// import { IoWater } from "react-icons/io5";
// import { GrPowerCycle } from "react-icons/gr";
// import { GoStopwatch } from "react-icons/go";
// import { LuSyringe } from "react-icons/lu";
// import { GiChemicalTank } from "react-icons/gi";
// import { filters } from "../utils/filters";
// import { EducationalNotes } from "./EducationalNotes";

// export function DialysisAssistant() {
//   const [weight, setWeight] = useState("");
//   const [clinicalStatus, setClinicalStatus] = useState("none");
//   const [hemodynamicStatus, setHemodynamicStatus] = useState("stable");
//   const [plt, setPlt] = useState("");
//   const [inr, setInr] = useState("");
//   const [bpSystolic, setBpSystolic] = useState("");
//   const [bpDiastolic, setBpDiastolic] = useState("");
//   const [hb, setHb] = useState("");
//   const [pcAction, setPcAction] = useState("");
//   const [ffpAction, setFfpAction] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [showNotes, setShowNotes] = useState(false);

//   // تبدیل مقادیر ورودی به عدد
//   const numericWeight = parseFloat(weight.replace(/٫|٬|,/g, ".")) || 0;
//   const numericPlt = parseFloat(plt) || 0;
//   const numericInr = parseFloat(inr) || 0;
//   const numericBpS = parseInt(bpSystolic) || 0;
//   const numericBpD = parseInt(bpDiastolic) || 0;
//   const numericHb = parseFloat(hb) || 0;

//   // محاسبه Qb
//   const baseQb = numericWeight * 4;
//   const adjustment = clinicalStatus === "acute" ? 50 : clinicalStatus === "chronic" ? 100 : 0;
//   const hypotension = (numericBpS > 0 && numericBpS < 90) || (numericBpD > 0 && numericBpD < 50);
//   let standardQb = baseQb + adjustment;
//   if (hypotension) standardQb *= 0.75;

//   const qbRange = { min: numericWeight * 3, max: numericWeight * 5, standard: standardQb };
//   const qdSuggested = qbRange.standard * 2;
//   const ufrMin = numericWeight * 10;
//   const ufrMax = numericWeight * 15;

//   // هشدارها
//   const pltIsLow = numericPlt > 0 && numericPlt < 50000;
//   const inrIsHigh = numericInr > 1.5;
//   const canUseHeparin = !pltIsLow && !inrIsHigh;
//   const heparinMsg = pltIsLow && inrIsHigh
//     ? "PLT و INR هر دو مختل هستند."
//     : pltIsLow
//       ? "پلاکت مختل است ولی INR طبیعی است."
//       : inrIsHigh
//         ? "INR مختل است ولی پلاکت طبیعی است."
//         : null;

//   // فیلترهای پیشنهادی
//   const getMatchedFilters = () => {
//     const matched = filters.filter(f => numericWeight >= f.minWeight && numericWeight <= f.maxWeight);
//     if (matched.length === 0) return [];
//     if (hemodynamicStatus === "unstable") {
//       const unstable = matched.filter(f => f.preferredForUnstable);
//       if (unstable.length > 0) return unstable;
//     }
//     return matched;
//   };
//   const matchedFilters = getMatchedFilters();

//   // زمان پیشنهادی دیالیز
//   const dialysisTimeText = numericWeight <= 0 ? "" :
//     clinicalStatus === "acute" ? (hemodynamicStatus === "unstable" ? "۱ تا ۲ ساعت (اینتوبه / ناپایدار)" : "۱ تا ۲ ساعت - بستگی به وضعیت بالینی دارد") :
//     clinicalStatus === "chronic" ? (hemodynamicStatus === "unstable" ? "۲ تا ۳ ساعت (مزمن + ناپایدار)" : "۳ تا ۴ ساعت (مزمن + پایدار)") :
//     "۳ تا ۴ ساعت (ارزیابی بالینی نیاز است)";

//   const handleCalculate = () => setSubmitted(true);
//   const handleReset = () => {
//     setWeight(""); setClinicalStatus("none"); setHemodynamicStatus("stable");
//     setPlt(""); setInr(""); setBpSystolic(""); setBpDiastolic(""); setHb("");
//     setPcAction(""); setFfpAction(""); setSubmitted(false); setShowNotes(false);
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto space-y-6 font-sans">
//       <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">همیار دیالیز کودکان</h2>

//       {/* ورودی‌ها */}
//       <div>
//         <label>وزن بیمار (کیلوگرم):</label>
//         <input type="number" min={0} step="0.1" value={weight} onChange={e => setWeight(e.target.value)} className="w-full border rounded p-2"/>
//       </div>
//       <div>
//         <label>هموگلوبین (g/dL):</label>
//         <input type="number" min={0} step="0.1" value={hb} onChange={e => setHb(e.target.value)} className="w-full border rounded p-2"/>
//       </div>

//       {/* PC */}
//       {numericHb > 0 && numericHb < 7 && (
//         <div>
//           <label>PC (Packed Cell):</label>
//           <select value={pcAction} onChange={e => setPcAction(e.target.value)} className="w-full border rounded p-2 mt-2">
//             <option value="">انتخاب عملیات</option>
//             <option value="prime">پرایم</option>
//             <option value="inject">تزریق</option>
//           </select>
//         </div>
//       )}

//       {/* FFP */}
//       {numericInr > 3 && (
//         <div>
//           <label>FFP:</label>
//           <select value={ffpAction} onChange={e => setFfpAction(e.target.value)} className="w-full border rounded p-2 mt-2">
//             <option value="">انتخاب عملیات</option>
//             <option value="prime">پرایم</option>
//             <option value="inject">تزریق</option>
//           </select>
//         </div>
//       )}

//       <div>
//         <label>وضعیت بالینی:</label>
//         <select value={clinicalStatus} onChange={e => setClinicalStatus(e.target.value)} className="w-full border rounded p-2 mt-2">
//           <option value="none">انتخاب کنید</option>
//           <option value="acute">حاد</option>
//           <option value="chronic">مزمن</option>
//         </select>
//       </div>
//       <div>
//         <label>وضعیت همودینامیک:</label>
//         <select value={hemodynamicStatus} onChange={e => setHemodynamicStatus(e.target.value)} className="w-full border rounded p-2 mt-2">
//           <option value="stable">پایدار</option>
//           <option value="unstable">ناپایدار / اینتوبه</option>
//         </select>
//       </div>

//       {/* PLT و INR */}
//       <div className="grid grid-cols-2 gap-2 mt-2">
//         <input type="number" min={0} placeholder="PLT" value={plt} onChange={e => setPlt(e.target.value)} className="w-full border rounded p-2"/>
//         <input type="number" min={0} placeholder="INR" value={inr} onChange={e => setInr(e.target.value)} className="w-full border rounded p-2"/>
//       </div>

//       {/* فشار خون */}
//       <div className="grid grid-cols-2 gap-2 mt-2">
//         <input type="number" min={0} placeholder="سیستولیک" value={bpSystolic} onChange={e => setBpSystolic(e.target.value)} className="w-full border rounded p-2"/>
//         <input type="number" min={0} placeholder="دیاستولیک" value={bpDiastolic} onChange={e => setBpDiastolic(e.target.value)} className="w-full border rounded p-2"/>
//       </div>

//       {/* دکمه‌ها */}
//       <div className="flex gap-2 mt-4">
//         <button onClick={handleCalculate} className="flex-1 bg-blue-600 text-white rounded p-2">محاسبه</button>
//         <button onClick={handleReset} className="flex-1 bg-gray-400 text-white rounded p-2">پاک‌کردن</button>
//       </div>

//       {/* نتایج */}
//       {submitted && numericWeight > 0 && (
//         <div className="space-y-6 mt-6">

//           {/* PC */}
//           {pcAction && (
//             <div className="bg-red-50 border border-red-400 rounded p-4 text-red-800">
//               <h3>PC ({pcAction === "prime" ? "پرایم" : "تزریق"})</h3>
//               <p>حجم: <strong>{(numericWeight*5).toFixed(0)} سی‌سی</strong> (۵ سی‌سی به ازای هر کیلوگرم)</p>
//             </div>
//           )}

//           {/* FFP */}
//           {ffpAction && (
//             <div className="bg-yellow-50 border border-yellow-400 rounded p-4 text-yellow-800">
//               <h3>FFP ({ffpAction === "prime" ? "پرایم" : "تزریق"})</h3>
//               <p>حجم: <strong>{(numericWeight*5).toFixed(0)} سی‌سی</strong> (۵ سی‌سی به ازای هر کیلوگرم)</p>
//             </div>
//           )}

//           {/* Qb */}
//           <div className="bg-blue-50 border rounded p-4">
//             <h3 className="flex items-center"><GrPowerCycle className="mr-2"/> سرعت پمپ خون (Qb)</h3>
//             <p>محدوده: {qbRange.min.toFixed(1)} - {qbRange.max.toFixed(1)} ml/min</p>
//             <p>پیشنهادی: {qbRange.standard.toFixed(1)} ml/min</p>
//             {hypotension && <p className="text-red-600">⚠️ فشار خون پایین، کاهش Qb</p>}
//           </div>

//           {/* Qd */}
//           <div className="bg-blue-100 border rounded p-4">
//             <h3 className="flex items-center"><IoWater className="mr-2"/> Qd</h3>
//             <p>پیشنهادی: {qdSuggested.toFixed(1)} ml/min</p>
//             <p className="text-sm text-gray-700">معمولاً دو برابر Qb</p>
//           </div>

//           {/* UFR */}
//           <div className="bg-blue-100 border rounded p-4">
//             <h3 className="flex items-center"><IoWater className="mr-2"/> UFR</h3>
//             <p>محدوده: {ufrMin.toFixed(0)} - {ufrMax.toFixed(0)} mL/hr</p>
//           </div>

//           {/* Heparin */}
//           <div className="bg-green-50 border rounded p-4">
//             <h3 className="flex items-center"><LuSyringe className="mr-2"/> دوز هپارین</h3>
//             {!canUseHeparin ? <p className="text-red-600">{heparinMsg}</p> :
//               <>
//                 <p>Bolus: {Math.round(numericWeight*15)} - {Math.round(numericWeight*20)} IU</p>
//                 <p>Infusion: {Math.round(numericWeight*20)} - {Math.round(numericWeight*30)} IU/h</p>
//               </>}
//           </div>

//           {/* هشدارها */}
//           {(pltIsLow || inrIsHigh || numericBpS < 90 || numericBpD < 50) && (
//             <div className="bg-yellow-50 border border-yellow-400 rounded p-4 text-yellow-800">
//               <h3>هشدارهای ایمنی</h3>
//               <ul className="list-disc list-inside">
//                 {pltIsLow && <li>⚠️ PLT پایین است</li>}
//                 {inrIsHigh && <li>⚠️ INR بالا است</li>}
//                 {numericBpS < 90 && <li>⚠️ فشار خون سیستولیک پایین است</li>}
//                 {numericBpD < 50 && <li>⚠️ فشار خون دیاستولیک پایین است</li>}
//               </ul>
//             </div>
//           )}

//           {/* صافی پیشنهادی */}
//           <div>
//             <h3 className="flex items-center"><GiChemicalTank className="mr-2"/> صافی پیشنهادی</h3>
//             {matchedFilters.length === 0 ? <p className="text-red-600">صافی مناسب یافت نشد</p> :
//               matchedFilters.map((f, idx) => (
//                 <div key={idx} className="p-4 border rounded shadow bg-white mt-2">
//                   <h4>{f.name}</h4>
//                   <p>مناسب برای: {f.suitableFor}</p>
//                   <p>KOA: {f.koa}</p>
//                   <p>UF: {f.uf}</p>
//                   <p>TMP: {f.tmp}</p>
//                   <p className="text-sm">{f.description}</p>
//                 </div>
//               ))}
//           </div>

//           {/* زمان دیالیز */}
//           <div className="bg-blue-50 border rounded p-4">
//             <h3 className="flex items-center"><GoStopwatch className="mr-2"/> زمان پیشنهادی دیالیز</h3>
//             <p>{dialysisTimeText}</p>
//           </div>

//           {/* نکات آموزشی */}
//           <EducationalNotes showNotes={showNotes} setShowNotes={setShowNotes}/>
//         </div>
//       )}
//     </div>
//   );
// }
