import React, { useState } from "react";
import { IoWater } from "react-icons/io5";
import { GrPowerCycle } from "react-icons/gr";
import { GoStopwatch } from "react-icons/go";
import { LuSyringe } from "react-icons/lu";
import { GiChemicalTank } from "react-icons/gi";
import { filters } from "../utils/filters";
import { EducationalNotes } from "./EducationalNotes";

export function DialysisAssistant() {
  const [weight, setWeight] = useState("");
  const [clinicalStatus, setClinicalStatus] = useState("none");
  const [hemodynamicStatus, setHemodynamicStatus] = useState("stable");
  const [plt, setPlt] = useState("");
  const [inr, setInr] = useState("");
  const [bpSystolic, setBpSystolic] = useState("");
  const [bpDiastolic, setBpDiastolic] = useState("");
  const [hb, setHb] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [pcAction, setPcAction] = useState("");
  const [ffpAction, setFfpAction] = useState("");
  const [albuminAction, setAlbuminAction] = useState("");


  // Parse numbers safely
  const numericWeight = parseFloat(weight.replace(/٫|٬|,/g, ".")) || 0;
  const numericPlt = parseFloat(plt) || 0;
  const numericInr = parseFloat(inr) || 0;
  const numericBpS = parseInt(bpSystolic) || 0;
  const numericBpD = parseInt(bpDiastolic) || 0;
  const numericHb = parseFloat(hb) || 0;

  // Calculations
  const baseQb = numericWeight * 4;
  const adjustment =
    clinicalStatus === "acute" ? 50 : clinicalStatus === "chronic" ? 100 : 0;
  const hypotension =
    (numericBpS > 0 && numericBpS < 90) || (numericBpD > 0 && numericBpD < 50);

  let standardQb = baseQb + adjustment;
  if (hypotension) {
    standardQb *= 0.75;
  }

  const qbRange = {
    min: numericWeight * 3,
    max: numericWeight * 5,
    standard: standardQb,
  };

  const qdSuggested = qbRange.standard * 2;
  const ufrMin = numericWeight * 10;
  const ufrMax = numericWeight * 15;

  const pltIsLow = numericPlt > 0 && numericPlt < 50000;
  const inrIsHigh = numericInr > 1.5;
  const canUseHeparin = !pltIsLow && !inrIsHigh;

  const heparinEligibilityMessage = (() => {
    if (pltIsLow && inrIsHigh) {
      return "PLT و INR هر دو مختل هستند.";
    } else if (pltIsLow) {
      return "پلاکت مختل است ولی INR طبیعی است.";
    } else if (inrIsHigh) {
      return "INR مختل است ولی پلاکت طبیعی است.";
    }
    return null;
  })();

  const pltWarning =
    numericPlt > 0 && numericPlt < 50000
      ? "⚠️ PLT پایین است، خطر خونریزی افزایش می‌یابد."
      : null;
  const inrWarning =
    numericInr > 1.5
      ? "⚠️ INR بالا است، ممکن است ریسک خونریزی وجود داشته باشد."
      : null;
  const bpSystolicWarning =
    numericBpS > 0 && numericBpS < 90
      ? "⚠️ فشار خون سیستولیک پایین است، احتمال افت فشار حین دیالیز وجود دارد."
      : null;
  const bpDiastolicWarning =
    numericBpD > 0 && numericBpD < 50
      ? "⚠️ فشار خون دیاستولیک پایین است، نیاز به پایش دقیق‌تر دارد."
      : null;

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

  const dialysisTimeText = (() => {
    if (numericWeight <= 0) return "";
    if (clinicalStatus === "acute") {
      return hemodynamicStatus === "unstable"
        ? "۱ تا ۲ ساعت (اینتوبه / ناپایدار)"
        : "۱ تا ۲ ساعت - بستگی به وضعیت بالینی دارد";
    }
    if (clinicalStatus === "chronic") {
      return hemodynamicStatus === "unstable"
        ? "۲ تا ۳ ساعت (مزمن + ناپایدار)"
        : "۳ تا ۴ ساعت (مزمن + پایدار)";
    }
    return "۳ تا ۴ ساعت (ارزیابی بالینی نیاز است)";
  })();

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
    setHb("");
    setPcAction("");
    setFfpAction("");
    setSubmitted(false);
    setShowNotes(false);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 font-sans">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        همیار دیالیز کودکان
      </h2>

      {/* وزن */}
      <div>
        <label className="block mb-1 font-semibold">وزن بیمار (کیلوگرم):</label>
        <input
          type="number"
          min={0}
          step="0.1"
          placeholder="مثال: 10"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg text-right"
        />
      </div>

      {/* هموگلوبین */}
      <div>
        <label className="block mb-1 font-semibold">هموگلوبین (g/dL):</label>
        <input
          type="number"
          min={0}
          step="0.1"
          placeholder="مثال: 8"
          value={hb}
          onChange={(e) => setHb(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg text-right"
        />
      </div>

      {/* PC */}
      {((weight !== "" && numericWeight < 10) || (numericHb > 0 && numericHb < 7)) && (
  <div>
    <label className="block mb-1 font-semibold">PC (Packed Cell):</label>
    <select
      value={pcAction}
      onChange={(e) => setPcAction(e.target.value)}
      className="w-full border rounded p-2 mt-2"
    >
      <option value="">انتخاب کنید</option>
      <option value="prime">پرایم</option>
      <option value="inject">تزریق</option>
      <option value="none">هیچ‌کدام</option>
    </select>
  </div>
)}


      

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

      {/* PLT و INR */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">PLT:</label>
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
      {/* FFP */}
      {numericInr > 3 && (
        <div>
          <label className="block mb-1 font-semibold">FFP:</label>
          <select
            value={ffpAction}
            onChange={(e) => setFfpAction(e.target.value)}
            className="w-full border rounded p-2 mt-2"
          >
            <option value="">انتخاب کنید</option>
            <option value="prime">پرایم</option>
            <option value="inject">تزریق</option>
            <option value="none">هیچ‌کدام</option>
          </select>
        </div>
      )}

      {/* فشار خون */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">فشار خون سیستولیک:</label>
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
          <label className="block mb-1 font-semibold">فشار خون دیاستولیک:</label>
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
      {/* Albumin */}
{numericBpS > 0 && numericBpS < 100 && (
  <div>
    <label className="block mb-1 font-semibold">Albumin:</label>
    <select
      value={albuminAction}
      onChange={(e) => setAlbuminAction(e.target.value)}
      className="w-full border rounded p-2 mt-2"
    >
      <option value="">انتخاب کنید</option>
      <option value="prime">پرایم</option>
      <option value="inject">تزریق</option>
      <option value="none">هیچ‌کدام</option>
    </select>
  </div>
)}


      {/* دکمه‌ها */}
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
         {/* PC */}
{pcAction && pcAction !== "none" && (
  <div className="bg-red-50 border border-red-400 rounded p-4 text-red-800">
    <h3>PC</h3>
    {pcAction === "prime" ? (
      <p>⚡ با PC پرایم شود</p>
    ) : (
      <p>
        تزریق: حجم <strong>{(numericWeight * 5).toFixed(0)} سی‌سی</strong> (۵ سی‌سی به ازای هر کیلوگرم)
      </p>
    )}
  </div>
)}
{/* Albumin */}
{albuminAction && albuminAction !== "none" && (
  <div className="bg-green-50 border border-green-400 rounded p-4 text-green-800">
    <h3>Albumin</h3>
    {albuminAction === "prime" ? (
      <p>⚡ پرایم با ۱۰ گرم آلبومین</p>
    ) : (
      <p>تزریق: ۱۰ گرم آلبومین</p>
    )}
  </div>
)}



{/* FFP */}
{ffpAction && ffpAction !== "none" && (
  <div className="bg-yellow-50 border border-yellow-400 rounded p-4 text-yellow-800">
    <h3>FFP</h3>
    {ffpAction === "prime" ? (
      <p>⚡ با FFP پرایم شود</p>
    ) : (
      <p>
        تزریق: حجم <strong>{(numericWeight * 5).toFixed(0)} سی‌سی</strong> (۵ سی‌سی به ازای هر کیلوگرم)
      </p>
    )}
  </div>
)}


          {/* سرعت پمپ خون */}
          <div className="bg-blue-50 border rounded-lg p-4">
            <h3 className="font-bold flex text-blue-800 mb-2">
              <GrPowerCycle className="text-blue-800 ml-1 mt-1.5" />
              سرعت پمپ خون (Qb)
            </h3>
            <p>
              محدوده Qb: <strong>{qbRange.min.toFixed(1)} – {qbRange.max.toFixed(1)}</strong> ml/min
            </p>
            {clinicalStatus !== "none" && (
              <p>
                Qb پیشنهادی: <strong>{qbRange.standard.toFixed(1)}</strong> ml/min
              </p>
            )}
            {hypotension && (
              <p className="text-red-600 text-sm mt-1">
                ⚠️ به دلیل فشار خون پایین، Qb پیشنهادی کاهش یافته است.
              </p>
            )}
          </div>

          {/* Qd */}
          <div className="bg-blue-100 border rounded-lg p-4">
            <h3 className="font-bold flex text-blue-900 mb-2">
              <IoWater className="text-blue-500 mt-1" /> Qd (Dialysate Flow Rate)
            </h3>
            <p>
              Qd پیشنهادی: <strong>{qdSuggested.toFixed(1)}</strong> ml/min
            </p>
            <p className="text-sm text-gray-700">معمولاً دو برابر Qb در کودکان</p>
          </div>

          {/* Ultrafiltration */}
          <div className="bg-blue-100 border rounded-lg p-4">
            <h3 className="font-bold flex text-blue-900 mb-2">
              <IoWater className="text-blue-500 mt-1" /> Ultrafiltration Rate (UFR)
            </h3>
            <p>
              محدوده پیشنهادی: <strong>{ufrMin.toFixed(0)} – {ufrMax.toFixed(0)}</strong> mL/hr
            </p>
            <p className="text-sm text-gray-700">معمولاً 10-15 mL/kg/hr</p>
          </div>

          {/* Heparin */}
          <div className="bg-green-50 border rounded-lg p-4">
            <h3 className="font-bold text-green-800 flex mb-2">
              <LuSyringe className="text-green-800 ml-1 mt-1" /> دوز هپارین
            </h3>
            {!canUseHeparin ? (
              <>
                <p className="text-red-600 font-bold">❌ هپارین تزریق نشود</p>
                {heparinEligibilityMessage && (
                  <p className="text-red-500 mt-1">{heparinEligibilityMessage}</p>
                )}
              </>
            ) : (
              <>
                <p>
                  Bolus اولیه: <strong>{Math.round(numericWeight * 15)} – {Math.round(numericWeight * 20)}</strong> IU
                </p>
                <p>
                  Infusion مداوم: <strong>{Math.round(numericWeight * 20)} – {Math.round(numericWeight * 30)}</strong> IU/h
                </p>
              </>
            )}
          </div>

          {/* هشدارها */}
          {(pltWarning || inrWarning || bpSystolicWarning || bpDiastolicWarning) && (
            <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4 text-yellow-800 font-semibold">
              <h3 className="mb-2">⚠️ هشدارهای ایمنی</h3>
              <ul className="list-disc list-inside space-y-1">
                {pltWarning && <li>{pltWarning}</li>}
                {inrWarning && <li>{inrWarning}</li>}
                {bpSystolicWarning && <li>{bpSystolicWarning}</li>}
                {bpDiastolicWarning && <li>{bpDiastolicWarning}</li>}
              </ul>
            </div>
          )}

          {/* فیلتر پیشنهادی */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex text-blue-800">
              <GiChemicalTank className="text-blue-800 mt-1.5" /> صافی پیشنهادی
            </h3>
            {matchedFilters.length === 0 ? (
              <p className="text-red-600">صافی مناسب یافت نشد</p>
            ) : (
              matchedFilters.map((f, idx) => (
                <div key={idx} className="p-4 rounded-xl border shadow bg-white">
                  <h4 className="text-lg font-bold text-blue-800">{f.name}</h4>
                  <p>مناسب برای: <strong>{f.suitableFor}</strong></p>
                  <p>KOA: {f.koa}</p>
                  <p>UF: {f.uf}</p>
                  <p>TMP: {f.tmp}</p>
                  <p className="text-sm mt-1">{f.description}</p>
                </div>
              ))
            )}
          </div>

          {/* زمان دیالیز */}
          <div className="bg-blue-50 border rounded-lg p-4 mt-6">
            <h3 className="font-bold text-blue-800 flex mb-2">
              <GoStopwatch className="text-blue-800 ml-1 mt-1.5" /> زمان پیشنهادی دیالیز
            </h3>
            <p>زمان پیشنهادی: <strong>{dialysisTimeText}</strong></p>
            <p className="text-sm text-gray-700">این مقدار تقریبی است و باید بر اساس وضعیت بیمار تنظیم شود.</p>
          </div>

          {/* نکات آموزشی */}
          <EducationalNotes setShowNotes={setShowNotes} showNotes={showNotes} />
        </div>
      )}
    </div>
  );
}
