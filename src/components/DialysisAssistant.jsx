// DialysisAssistant.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoWarningOutline,
} from "react-icons/io5";
import { GiChemicalTank } from "react-icons/gi";
import {
  FaExclamationTriangle,
  FaWeight,
  FaVial,
  FaBook,
} from "react-icons/fa";
import {
  MdOutlineMonitorHeart,
} from "react-icons/md";
import { TbTemperature } from "react-icons/tb";
import { filters } from "../utils/filters";
import { EducationalNotes } from "./EducationalNotes";
import { useDialysisCalculations, DialysisCalculationsDisplay } from "./DialysisCalculations";

export function DialysisAssistant({
  defaultHemodynamicStatus = "stable",
  isUnstable = false,
  showOnlyPediatric = true,
}) {
  // State برای ورودی‌ها
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [ageUnit, setAgeUnit] = useState("year");
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [clinicalStatus, setClinicalStatus] = useState("none");
  const [plt, setPlt] = useState("");
  const [inr, setInr] = useState("");
  const [pt, setPt] = useState("");
  const [ptt, setPtt] = useState("");
  const [bpSystolic, setBpSystolic] = useState("");
  const [bpDiastolic, setBpDiastolic] = useState("");
  const [hb, setHb] = useState("");
  const [hct, setHct] = useState("");
  const [temperature, setTemperature] = useState("");
  const [albumin, setAlbumin] = useState("");
  const [accessType, setAccessType] = useState("none");
  const [accessFlow, setAccessFlow] = useState("");
  const [dialysateCa, setDialysateCa] = useState("1.5");
  const [dialysateK, setDialysateK] = useState("3.0");
  const [dialysateNa, setDialysateNa] = useState("140");
  const [dialysateHCO3, setDialysateHCO3] = useState("35");

  // State برای خروجی‌ها و وضعیت‌ها
  const [submitted, setSubmitted] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previousSessionData, setPreviousSessionData] = useState(null);
  const [showWeightWarning, setShowWeightWarning] = useState(false);
  const [weightWarningConfirmed, setWeightWarningConfirmed] = useState(false);

  // تبدیل سن به سال برای محاسبات
  const calculateAgeInYears = () => {
    const numAge = parseFloat(age) || 0;
    if (ageUnit === "year") return numAge;
    if (ageUnit === "month") return numAge / 12;
    if (ageUnit === "day") return numAge / 365;
    return numAge;
  };

  // تبدیل قد به سانتی‌متر
  const calculateHeightInCm = () => {
    const numHeight = parseFloat(height) || 0;
    if (heightUnit === "cm") return numHeight;
    if (heightUnit === "meter") return numHeight * 100;
    return numHeight;
  };

  // استفاده از hook محاسبات
  const calculations = useDialysisCalculations({
    weight,
    age: calculateAgeInYears(),
    height: calculateHeightInCm(),
    clinicalStatus,
    hemodynamicStatus: defaultHemodynamicStatus,
    plt,
    inr,
    pt,
    ptt,
    bpSystolic,
    bpDiastolic,
    hb,
    hct,
    temperature,
    albumin,
    accessType,
    accessFlow,
    dialysateCa,
    dialysateK,
    dialysateNa,
    dialysateHCO3,
    showOnlyPediatric,
  });

  // اعتبارسنجی وزن
  useEffect(() => {
    if (weight && showOnlyPediatric) {
      const numWeight = parseFloat(weight.replace(/٫|٬|,/g, ".")) || 0;
      if (numWeight > 40 && !weightWarningConfirmed) {
        setShowWeightWarning(true);
      }
    }
  }, [weight, showOnlyPediatric, weightWarningConfirmed]);

  // فیلترهای پیشنهادی
  const getMatchedFilters = useCallback(() => {
    const matched = filters.filter(
      (f) => calculations.numericWeight >= f.minWeight && calculations.numericWeight <= f.maxWeight
    );

    if (matched.length === 0) return [];

    if (defaultHemodynamicStatus === "unstable") {
      const unstableFilters = matched.filter((f) => f.preferredForUnstable);
      if (unstableFilters.length > 0) return unstableFilters;
    }

    if (clinicalStatus === "acute") {
      return matched.sort((a, b) => parseFloat(a.koa) - parseFloat(b.koa));
    }

    return matched;
  }, [calculations.numericWeight, defaultHemodynamicStatus, clinicalStatus]);

  const matchedFilters = getMatchedFilters();

  // هندلرها
  const handleCalculate = useCallback(() => {
    if (calculations.numericWeight <= 0) {
      alert("لطفاً وزن بیمار را وارد کنید");
      return;
    }

    if (showOnlyPediatric && calculations.numericWeight > 40 && !weightWarningConfirmed) {
      setShowWeightWarning(true);
      return;
    }

    setSubmitted(true);
    setPreviousSessionData({
      weight: calculations.numericWeight,
      age: age,
      ageUnit: ageUnit,
      height: height,
      heightUnit: heightUnit,
      qb: calculations.qbRange,
      ufr: calculations.ufrRange,
      bloodVolume: calculations.calculateBloodVolume,
      hemodynamicStatus: defaultHemodynamicStatus,
      timestamp: new Date().toLocaleString("fa-IR"),
    });
  }, [
    calculations.numericWeight,
    calculations.qbRange,
    calculations.ufrRange,
    calculations.calculateBloodVolume,
    showOnlyPediatric,
    weightWarningConfirmed,
    age,
    ageUnit,
    height,
    heightUnit,
    defaultHemodynamicStatus,
  ]);

  const handleWeightWarningConfirm = useCallback(() => {
    setWeightWarningConfirmed(true);
    setShowWeightWarning(false);
    handleCalculate();
  }, [handleCalculate]);

  const handleWeightWarningCancel = useCallback(() => {
    setShowWeightWarning(false);
    setWeight("");
    setWeightWarningConfirmed(false);
  }, []);

  const handleReset = useCallback(() => {
    setWeight("");
    setAge("");
    setAgeUnit("year");
    setHeight("");
    setHeightUnit("cm");
    setClinicalStatus("none");
    setPlt("");
    setInr("");
    setPt("");
    setPtt("");
    setBpSystolic("");
    setBpDiastolic("");
    setHb("");
    setHct("");
    setTemperature("");
    setAlbumin("");
    setAccessType("none");
    setAccessFlow("");
    setDialysateCa("1.5");
    setDialysateK("3.0");
    setDialysateNa("140");
    setDialysateHCO3("35");
    setSubmitted(false);
    setShowNotes(false);
    setShowAdvanced(false);
    setShowWeightWarning(false);
    setWeightWarningConfirmed(false);
  }, []);

  const handleLoadPrevious = useCallback(() => {
    if (previousSessionData) {
      setWeight(previousSessionData.weight.toString());
      setAge(previousSessionData.age || "");
      setAgeUnit(previousSessionData.ageUnit || "year");
      setHeight(previousSessionData.height || "");
      setHeightUnit(previousSessionData.heightUnit || "cm");
    }
  }, [previousSessionData]);

  // رندر وضعیت ایمنی
  const renderSafetyStatus = useCallback(() => {
    if (calculations.criticalWarnings.length > 0) {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <IoAlertCircle className="text-red-600 text-xl ml-2" />
            <span className="font-bold text-red-700">وضعیت بحرانی</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            نیاز به پایش ICU و اقدامات ویژه
          </p>
        </div>
      );
    }

    if (calculations.warnings.length > 0) {
      return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <div className="flex items-center">
            <IoWarningOutline className="text-yellow-600 text-xl ml-2" />
            <span className="font-bold text-yellow-700">نیاز به احتیاط</span>
          </div>
          <p className="text-yellow-600 text-sm mt-1">
            پایش دقیق حین دیالیز ضروری است
          </p>
        </div>
      );
    }

    return (
      <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
        <div className="flex items-center">
          <IoCheckmarkCircle className="text-green-600 text-xl ml-2" />
          <span className="font-bold text-green-700">وضعیت ایمن</span>
        </div>
        <p className="text-green-600 text-sm mt-1">
          شرایط برای دیالیز مناسب است
        </p>
      </div>
    );
  }, [calculations.criticalWarnings, calculations.warnings]);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 font-sans">
      {/* Modal هشدار وزن */}
      {showWeightWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FaExclamationTriangle className="text-yellow-500 text-2xl ml-3" />
                <h3 className="text-xl font-bold text-gray-800">هشدار وزن</h3>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-3">
                  وزن بیمار ({calculations.numericWeight} کیلوگرم) بیش از ۴۰ کیلوگرم است. این
                  ابزار برای بیماران اطفال طراحی شده است.
                </p>
                <p className="text-gray-700">
                  آیا مایل به ادامه با این وزن هستید؟
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleWeightWarningConfirm}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                >
                  بله، ادامه می‌دهم
                </button>
                <button
                  onClick={handleWeightWarningCancel}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors"
                >
                  لغو و اصلاح وزن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* هدر */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">
              همیار دیالیز کودکان
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isUnstable
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                وضعیت {isUnstable ? "ناپایدار" : "پایدار"}
              </span>
              {showOnlyPediatric && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  ویژه اطفال
                </span>
              )}
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                وضعیت همودینامیک: <span className="font-bold text-gray-800">
                  {defaultHemodynamicStatus === "unstable" ? "ناپایدار" : "پایدار"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {previousSessionData && (
              <button
                onClick={handleLoadPrevious}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                بارگذاری جلسه قبل
              </button>
            )}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-sm font-medium transition-colors"
            >
              {showAdvanced ? "تنظیمات ساده" : "تنظیمات پیشرفته"}
            </button>
          </div>
        </div>
      </div>

      {/* وضعیت ایمنی */}
      {renderSafetyStatus()}

      {/* فرم ورودی‌ها */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <FaWeight className="ml-2 text-blue-600" />
          اطلاعات پایه بیمار
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* وزن */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              وزن بیمار (کیلوگرم) 
                <span className="text-red-500 mr-1">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step="0.1"
                placeholder="مثال: 12.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <span className="absolute left-8 top-3 text-gray-500">kg</span>
            </div>
          </div>

          {/* سن */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              سن بیمار
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="مثال: 5"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <select
                value={ageUnit}
                onChange={(e) => setAgeUnit(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="year">سال</option>
                <option value="month">ماه</option>
                <option value="day">روز</option>
              </select>
            </div>
          </div>

          {/* قد */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              قد بیمار
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder={heightUnit === "cm" ? "مثال: 110" : "مثال: 1.10"}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <select
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="cm">سانتی‌متر</option>
                <option value="meter">متر</option>
              </select>
            </div>
          </div>

          {/* وضعیت بالینی */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              وضعیت بالینی
            </label>
            <select
              value={clinicalStatus}
              onChange={(e) => setClinicalStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="none">انتخاب کنید</option>
              <option value="acute">حاد (Acute)</option>
              <option value="chronic">مزمن (Chronic)</option>
            </select>
          </div>

          {/* هموگلوبین */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              هموگلوبین (g/dL)
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step="0.1"
                placeholder="مثال: 8.5"
                value={hb}
                onChange={(e) => setHb(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <span className="absolute left-8 top-3 text-gray-500">g/dL</span>
            </div>
          </div>

          {/* هماتوکریت */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              هماتوکریت (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={100}
                step="0.1"
                placeholder="مثال: 25"
                value={hct}
                onChange={(e) => setHct(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <span className="absolute left-8 top-3 text-gray-500">%</span>
            </div>
          </div>

          {/* آلبومین */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              آلبومین (g/dL)
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step="0.1"
                placeholder="مثال: 3.5"
                value={albumin}
                onChange={(e) => setAlbumin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <span className="absolute left-8 top-3 text-gray-500">g/dL</span>
            </div>
          </div>

          {/* دما */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              دمای بدن (°C)
            </label>
            <div className="relative">
              <input
                type="number"
                min={30}
                max={45}
                step="0.1"
                placeholder="مثال: 37.2"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <TbTemperature className="absolute left-8 top-3 text-gray-500" />
            </div>
          </div>
        </div>

        {/* فشار خون */}
        <div className="mt-6">
          <h4 className="text-md font-bold text-gray-800 mb-3 flex items-center">
            <MdOutlineMonitorHeart className="ml-2 text-red-600" />
            فشار خون (mmHg)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm text-gray-600">
                سیستولیک
              </label>
              <input
                type="number"
                min={0}
                max={300}
                placeholder="مثال: 110"
                value={bpSystolic}
                onChange={(e) => setBpSystolic(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-600">
                دیاستولیک
              </label>
              <input
                type="number"
                min={0}
                max={200}
                placeholder="مثال: 70"
                value={bpDiastolic}
                onChange={(e) => setBpDiastolic(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* تنظیمات پیشرفته */}
        {showAdvanced && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <FaVial className="ml-2 text-purple-600" />
              تنظیمات پیشرفته آزمایشگاهی
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block mb-2 text-sm text-gray-600">
                  PLT (×10³/µL)
                </label>
                <input
                  type="number"
                  min={0}
                  step="1000"
                  placeholder="مثال: 150000"
                  value={plt}
                  onChange={(e) => setPlt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-600">INR</label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="مثال: 1.2"
                  value={inr}
                  onChange={(e) => setInr(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-600">
                  PT (ثانیه)
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="مثال: 13"
                  value={pt}
                  onChange={(e) => setPt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-600">
                  PTT (ثانیه)
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="مثال: 35"
                  value={ptt}
                  onChange={(e) => setPtt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* نوع دسترسی */}
            <div className="mt-6">
              <h4 className="text-md font-bold text-gray-800 mb-3">
                نوع دسترسی عروقی
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value)}
                  className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="none">انتخاب کنید</option>
                  <option value="catheter">کاتتر مرکزی</option>
                  <option value="avf">فیستول آرتریوونوس</option>
                  <option value="graft">گرافت</option>
                </select>

                {accessType === "catheter" && (
                  <div>
                    <label className="block mb-2 text-sm text-gray-600">
                      جریان دسترسی (ml/min)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="10"
                      placeholder="مثال: 200"
                      value={accessFlow}
                      onChange={(e) => setAccessFlow(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* تنظیمات دیالیزات */}
            <div className="mt-6">
              <h4 className="text-md font-bold text-gray-800 mb-3">
                تنظیمات دیالیزات
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block mb-2 text-sm text-gray-600">
                    کلسیم (mmol/L)
                  </label>
                  <select
                    value={dialysateCa}
                    onChange={(e) => setDialysateCa(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="1.25">1.25</option>
                    <option value="1.5">1.5</option>
                    <option value="1.75">1.75</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-600">
                    پتاسیم (mmol/L)
                  </label>
                  <select
                    value={dialysateK}
                    onChange={(e) => setDialysateK(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="2.0">2.0</option>
                    <option value="2.5">2.5</option>
                    <option value="3.0">3.0</option>
                    <option value="3.5">3.5</option>
                    <option value="4.0">4.0</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-600">
                    سدیم (mmol/L)
                  </label>
                  <input
                    type="number"
                    min={130}
                    max={150}
                    step="1"
                    value={dialysateNa}
                    onChange={(e) => setDialysateNa(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-600">
                    بی‌کربنات (mmol/L)
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={40}
                    step="1"
                    value={dialysateHCO3}
                    onChange={(e) => setDialysateHCO3(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* دکمه‌های عمل */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={handleCalculate}
            disabled={!weight}
            className={`flex-1 py-3 px-6 rounded-lg font-bold text-white transition-all ${
              !weight
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            محاسبه تنظیمات
          </button>

          <button
            onClick={handleReset}
            className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-colors"
          >
            پاک‌کردن فرم
          </button>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex-1 py-3 px-6 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
          >
            <FaBook />
            {showNotes ? "مخفی کردن نکات" : "نمایش نکات آموزشی"}
          </button>
        </div>
      </div>

      {/* نتایج */}
      {submitted && calculations.numericWeight > 0 && (
        <div className="space-y-6 mt-6">
          {/* نمایش محاسبات اصلی */}
          <DialysisCalculationsDisplay calculations={calculations} />

          {/* فیلترهای پیشنهادی */}
          {matchedFilters.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5">
              <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                <GiChemicalTank className="ml-2" />
                صافی‌های پیشنهادی
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {matchedFilters.map((f, idx) => (
                  <div
                    key={idx}
                    className={`bg-white p-4 rounded-xl border shadow-sm ${
                      f.preferredForUnstable ? "ring-2 ring-purple-300" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-purple-800 text-lg">
                        {f.name}
                      </h4>
                      {f.preferredForUnstable && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                          مناسب ناپایدار
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">وزن:</span>
                        <span className="font-medium">
                          {f.minWeight}-{f.maxWeight} kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">KOA:</span>
                        <span className="font-medium">{f.koa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">UF:</span>
                        <span className="font-medium">{f.uf}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">TMP:</span>
                        <span className="font-medium">{f.tmp}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mt-3">
                      {f.description}
                    </p>

                    <div className="mt-4 pt-3 border-t">
                      <p className="text-xs font-medium text-purple-700">
                        {f.suitableFor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* نکات آموزشی - همیشه در پایین صفحه نمایش داده می‌شود */}
      {showNotes && (
        <div className="mt-6">
          <EducationalNotes onClose={() => setShowNotes(false)} />
        </div>
      )}
    </div>
  );
}