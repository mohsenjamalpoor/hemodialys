// DialysisAssistant.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  IoWater,
  IoAlertCircle,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoWarningOutline,
} from "react-icons/io5";
import { GrPowerCycle } from "react-icons/gr";
import { GoStopwatch, GoAlert } from "react-icons/go";
import { LuSyringe, LuActivity } from "react-icons/lu";
import { GiChemicalTank, GiHeartBeats, GiBlood } from "react-icons/gi";
import {
  FaTint,
  FaExclamationTriangle,
  FaWeight,
  FaTemperatureHigh,
  FaVial,
} from "react-icons/fa";
import {
  MdBloodtype,
  MdBatteryAlert,
  MdOutlineMonitorHeart,
} from "react-icons/md";
import { TbDropletFilled, TbTemperature } from "react-icons/tb";
import { filters } from "../utils/filters";
import { EducationalNotes } from "./EducationalNotes";

export function DialysisAssistant({
  defaultHemodynamicStatus = "stable",
  isUnstable = false,
  showOnlyPediatric = true,
}) {
  // State برای ورودی‌ها
  const [weight, setWeight] = useState("");
  const [clinicalStatus, setClinicalStatus] = useState("none");
  const [hemodynamicStatus, setHemodynamicStatus] = useState(
    defaultHemodynamicStatus
  );
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
  const [pcAction, setPcAction] = useState("");
  const [ffpAction, setFfpAction] = useState("");
  const [albuminAction, setAlbuminAction] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previousSessionData, setPreviousSessionData] = useState(null);
  const [showWeightWarning, setShowWeightWarning] = useState(false);
  const [weightWarningConfirmed, setWeightWarningConfirmed] = useState(false);

  // Parse numbers safely
  const numericWeight = parseFloat(weight.replace(/٫|٬|,/g, ".")) || 0;
  const numericPlt = parseFloat(plt) || 0;
  const numericInr = parseFloat(inr) || 0;
  const numericPt = parseFloat(pt) || 0;
  const numericBpS = parseInt(bpSystolic) || 0;
  const numericBpD = parseInt(bpDiastolic) || 0;
  const numericHb = parseFloat(hb) || 0;
  const numericHct = parseFloat(hct) || 0;
  const numericTemp = parseFloat(temperature) || 0;
  const numericAlbumin = parseFloat(albumin) || 0;
  const numericAccessFlow = parseFloat(accessFlow) || 0;

  // اعتبارسنجی وزن
  useEffect(() => {
    if (weight && showOnlyPediatric) {
      const numWeight = parseFloat(weight.replace(/٫|٬|,/g, ".")) || 0;
      if (numWeight > 40 && !weightWarningConfirmed) {
        setShowWeightWarning(true);
      }
    }
  }, [weight, showOnlyPediatric, weightWarningConfirmed]);

  // محاسبات اصلی
  const calculateQb = useCallback(() => {
    if (numericWeight <= 0) return { min: 0, max: 0, standard: 0 };

    let baseMin = numericWeight * 3;
    let baseMax = numericWeight * 5;

    let adjustment = 0;
    if (clinicalStatus === "acute") {
      adjustment = 50;
    } else if (clinicalStatus === "chronic") {
      adjustment = 100;
    }

    let standardQb = baseMin + adjustment;
    if (hemodynamicStatus === "unstable") {
      standardQb *= 0.75;
      baseMax *= 0.8;
    }

    let ageFactor = 1;
    if (numericWeight < 5) {
      ageFactor = 0.9;
    } else if (numericWeight < 15) {
      ageFactor = 0.95;
    }

    let accessFactor = 1;
    if (accessType === "catheter" && numericAccessFlow > 0) {
      accessFactor = Math.min(numericAccessFlow / (standardQb * 1.5), 1);
    }

    const min = Math.round(baseMin * ageFactor);
    const max = Math.round(baseMax * ageFactor * accessFactor);
    const standard = Math.round(standardQb * ageFactor * accessFactor);

    return { min, max, standard };
  }, [
    numericWeight,
    clinicalStatus,
    hemodynamicStatus,
    accessType,
    numericAccessFlow,
  ]);

  const qbRange = calculateQb();

  const hypotension =
    (numericBpS > 0 && numericBpS < 90) || (numericBpD > 0 && numericBpD < 50);
  const hypertension = numericBpS > 140 || numericBpD > 90;
  const fever = numericTemp > 37.5;

  // محاسبه Qd
  const calculateQd = useCallback(() => {
    const ratio = hemodynamicStatus === "unstable" ? 1.5 : 2;
    return Math.round(qbRange.standard * ratio);
  }, [qbRange.standard, hemodynamicStatus]);

  const qdSuggested = calculateQd();

  // محاسبه UFR
  const calculateUFR = useCallback(() => {
    let baseMin = numericWeight * 10;
    let baseMax = numericWeight * 15;

    if (hemodynamicStatus === "unstable") {
      baseMin = numericWeight * 5;
      baseMax = numericWeight * 10;
    }

    if (hypotension) {
      baseMin *= 0.8;
      baseMax *= 0.8;
    }

    if (hypertension) {
      baseMax = Math.min(baseMax, numericWeight * 20);
    }

    return {
      min: Math.round(baseMin),
      max: Math.round(baseMax),
      recommended: Math.round((baseMin + baseMax) / 2),
    };
  }, [numericWeight, hemodynamicStatus, hypotension, hypertension]);

  const ufrRange = calculateUFR();

  // محاسبات هپارین
  const pltIsLow = numericPlt > 0 && numericPlt < 50000;
  const pltIsVeryLow = numericPlt > 0 && numericPlt < 20000;
  const inrIsHigh = numericInr > 1.5;
  const inrIsVeryHigh = numericInr > 3;
  const ptIsHigh = numericPt > 15;

  const canUseHeparin = !pltIsLow && !inrIsHigh && !ptIsHigh;
  const shouldUseRegionalCitrate = pltIsVeryLow || inrIsVeryHigh;
  const canUseNoAnticoagulation = pltIsVeryLow && inrIsVeryHigh;

  const heparinEligibilityMessage = (() => {
    if (pltIsVeryLow && inrIsVeryHigh) {
      return "پلاکت بسیار پایین و INR بسیار بالا - استفاده از هپارین ممنوع";
    }
    if (pltIsLow && inrIsHigh) {
      return "PLT و INR هر دو مختل هستند";
    }
    if (pltIsLow) {
      return "پلاکت مختل است";
    }
    if (inrIsHigh) {
      return "INR مختل است";
    }
    if (ptIsHigh) {
      return "PT بالا است";
    }
    return null;
  })();

  // محاسبات هپارین
  const calculateHeparin = useCallback(() => {
    if (!canUseHeparin) return null;

    let bolusMin = numericWeight * 15;
    let bolusMax = numericWeight * 20;
    let infusionMin = numericWeight * 20;
    let infusionMax = numericWeight * 30;

    if (numericWeight < 10) {
      bolusMin = numericWeight * 10;
      bolusMax = numericWeight * 15;
      infusionMin = numericWeight * 15;
      infusionMax = numericWeight * 25;
    }

    if (hemodynamicStatus === "unstable") {
      bolusMin *= 0.8;
      bolusMax *= 0.8;
      infusionMin *= 0.8;
      infusionMax *= 0.8;
    }

    return {
      bolus: `${Math.round(bolusMin)} - ${Math.round(bolusMax)} واحد`,
      infusion: `${Math.round(infusionMin)} - ${Math.round(
        infusionMax
      )} واحد/ساعت`,
      monitoring: "کنترل PTT هر 4-6 ساعت",
    };
  }, [numericWeight, canUseHeparin, hemodynamicStatus]);

  const heparinDose = calculateHeparin();

  // محاسبات سیترات
  const calculateCitrate = useCallback(() => {
    if (!shouldUseRegionalCitrate) return null;

    const acdaRate = numericWeight * 1.7;
    const calciumRate = numericWeight * 0.4;

    return {
      acdaRate: `${acdaRate.toFixed(1)} ml/hr`,
      calciumRate: `${calciumRate.toFixed(1)} mEq/hr`,
      monitoring: "کنترل کلسیم یونیزه هر 2 ساعت",
    };
  }, [numericWeight, shouldUseRegionalCitrate]);

  const citrateDose = calculateCitrate();

  // هشدارها
  const warnings = [];
  const criticalWarnings = [];

  if (pltIsVeryLow) {
    criticalWarnings.push({
      icon: <GiBlood className="text-red-600" />,
      text: "⚠️ پلاکت بسیار پایین (<20,000) - خطر خونریزی بالا",
    });
  } else if (pltIsLow) {
    warnings.push("⚠️ پلاکت پایین (<50,000) - خطر خونریزی افزایش یافته");
  }

  if (inrIsVeryHigh) {
    criticalWarnings.push({
      icon: <MdBloodtype className="text-red-600" />,
      text: "⚠️ INR بسیار بالا (>3) - ریسک خونریزی جدی",
    });
  } else if (inrIsHigh) {
    warnings.push("⚠️ INR بالا (>1.5) - احتیاط در ضد انعقاد");
  }

  if (hypotension) {
    criticalWarnings.push({
      icon: <MdOutlineMonitorHeart className="text-red-600" />,
      text: "⚠️ فشار خون پایین - ریسک افت فشار حین دیالیز",
    });
  } else if (numericBpS > 0 && numericBpS < 100) {
    warnings.push("⚠️ فشار خون سیستولیک در حد پایین");
  }

  if (hypertension) {
    warnings.push("⚠️ فشار خون بالا - تنظیم دقیق UF لازم است");
  }

  if (fever) {
    warnings.push("⚠️ تب بیمار - پایش دقیق علائم حیاتی");
  }

  if (numericHb > 0 && numericHb < 7) {
    criticalWarnings.push({
      icon: <FaTint className="text-red-600" />,
      text: "⚠️ هموگلوبین بسیار پایین - نیاز به تزریق خون",
    });
  } else if (numericHb > 0 && numericHb < 10) {
    warnings.push("⚠️ هموگلوبین پایین - پایش دقیق همودینامیک");
  }

  if (numericHct > 0 && numericHct < 25) {
    warnings.push("⚠️ هماتوکریت پایین - حجم پرایم مناسب انتخاب شود");
  }

  if (numericAlbumin > 0 && numericAlbumin < 2.5) {
    criticalWarnings.push({
      icon: <TbDropletFilled className="text-red-600" />,
      text: "⚠️ آلبومین بسیار پایین (<2.5 g/dL) - ریسک ادم و افت فشار",
    });
  } else if (numericAlbumin > 0 && numericAlbumin < 3.5) {
    warnings.push("⚠️ آلبومین پایین - احتیاط در تنظیم مایعات");
  }

  // فیلترهای پیشنهادی
  const getMatchedFilters = useCallback(() => {
    const matched = filters.filter(
      (f) => numericWeight >= f.minWeight && numericWeight <= f.maxWeight
    );

    if (matched.length === 0) return [];

    if (hemodynamicStatus === "unstable") {
      const unstableFilters = matched.filter((f) => f.preferredForUnstable);
      if (unstableFilters.length > 0) return unstableFilters;
    }

    if (clinicalStatus === "acute") {
      return matched.sort((a, b) => parseFloat(a.koa) - parseFloat(b.koa));
    }

    return matched;
  }, [numericWeight, hemodynamicStatus, clinicalStatus]);

  const matchedFilters = getMatchedFilters();

  // زمان دیالیز
  const calculateDialysisTime = useCallback(() => {
    if (numericWeight <= 0) return "";

    if (clinicalStatus === "acute") {
      if (hemodynamicStatus === "unstable") {
        return {
          time: "1-2 ساعت",
          note: "دیالیز کوتاه و آهسته با پایش دقیق",
          color: "text-red-600",
        };
      }
      return {
        time: "2-3 ساعت",
        note: "بسته به وضعیت بالینی",
        color: "text-orange-600",
      };
    }

    if (clinicalStatus === "chronic") {
      if (hemodynamicStatus === "unstable") {
        return {
          time: "2-3 ساعت",
          note: "مزمن + ناپایدار",
          color: "text-orange-600",
        };
      }
      return {
        time: "3-4 ساعت",
        note: "مزمن + پایدار",
        color: "text-green-600",
      };
    }

    return {
      time: "3-4 ساعت",
      note: "ارزیابی بالینی نیاز است",
      color: "text-blue-600",
    };
  }, [clinicalStatus, hemodynamicStatus, numericWeight]);

  const dialysisTime = calculateDialysisTime();

  // محاسبات دیگر
  const calculateCircuitVolume = useCallback(() => {
    if (numericWeight <= 0) return 0;

    let volume = 0;
    if (numericWeight < 5) {
      volume = 50;
    } else if (numericWeight < 15) {
      volume = 100;
    } else if (numericWeight < 30) {
      volume = 150;
    } else {
      volume = 200;
    }

    if (hemodynamicStatus === "unstable") {
      volume *= 0.8;
    }

    return Math.round(volume);
  }, [numericWeight, hemodynamicStatus]);

  const circuitVolume = calculateCircuitVolume();

  // دماهای دیالیزات
  const calculateDialysateTemp = useCallback(() => {
    if (fever) {
      return "35.5-36.5 °C";
    }
    if (hypotension) {
      return "36.5-37 °C";
    }
    return "36-37 °C";
  }, [fever, hypotension]);

  const dialysateTemperature = calculateDialysateTemp();

  // تصمیم‌گیری برای پروداکت‌های خونی
  useEffect(() => {
    if (numericWeight > 0 && numericHb > 0) {
      if (numericWeight < 10 || numericHb < 7) {
        setPcAction("prime");
      } else if (numericHb < 10) {
        setPcAction("inject");
      } else {
        setPcAction("none");
      }

      if (inrIsVeryHigh) {
        setFfpAction("prime");
      } else if (inrIsHigh) {
        setFfpAction("inject");
      } else {
        setFfpAction("none");
      }

      if (hypotension || numericAlbumin < 2.5) {
        setAlbuminAction("prime");
      } else {
        setAlbuminAction("none");
      }
    }
  }, [
    numericWeight,
    numericHb,
    inrIsVeryHigh,
    inrIsHigh,
    hypotension,
    numericAlbumin,
  ]);

  // هندلرها
  const handleCalculate = useCallback(() => {
    if (numericWeight <= 0) {
      alert("لطفاً وزن بیمار را وارد کنید");
      return;
    }

    if (showOnlyPediatric && numericWeight > 40 && !weightWarningConfirmed) {
      setShowWeightWarning(true);
      return;
    }

    setSubmitted(true);
    setPreviousSessionData({
      weight: numericWeight,
      qb: qbRange,
      ufr: ufrRange,
      timestamp: new Date().toLocaleString("fa-IR"),
    });
  }, [
    numericWeight,
    showOnlyPediatric,
    weightWarningConfirmed,
    qbRange,
    ufrRange,
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
    setClinicalStatus("none");
    setHemodynamicStatus(defaultHemodynamicStatus);
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
    setPcAction("");
    setFfpAction("");
    setAlbuminAction("");
    setSubmitted(false);
    setShowNotes(false);
    setShowAdvanced(false);
    setShowWeightWarning(false);
    setWeightWarningConfirmed(false);
  }, [defaultHemodynamicStatus]);

  const handleLoadPrevious = useCallback(() => {
    if (previousSessionData) {
      setWeight(previousSessionData.weight.toString());
    }
  }, [previousSessionData]);

  // محاسبه حجم تزریق
  const calculateTransfusionVolume = useCallback(
    (product) => {
      switch (product) {
        case "pc":
          return Math.round(numericWeight * 5);
        case "ffp":
          return Math.round(numericWeight * 10);
        case "albumin":
          return 100;
        default:
          return 0;
      }
    },
    [numericWeight]
  );

  // رندر وضعیت ایمنی
  const renderSafetyStatus = useCallback(() => {
    if (criticalWarnings.length > 0) {
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

    if (warnings.length > 0) {
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
  }, [criticalWarnings, warnings]);

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
                  وزن بیمار ({numericWeight} کیلوگرم) بیش از ۴۰ کیلوگرم است. این
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
                {isUnstable ? "وضعیت ناپایدار" : "وضعیت پایدار"}
              </span>
              {showOnlyPediatric && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  ویژه اطفال
                </span>
              )}
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
              وزن بیمار (کیلوگرم) *
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step="0.1"
                placeholder="مثال: 12.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <span className="absolute left-3 top-3 text-gray-500">kg</span>
            </div>
          </div>

          {/* وضعیت بالینی */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              وضعیت بالینی *
            </label>
            <select
              value={clinicalStatus}
              onChange={(e) => setClinicalStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="none">انتخاب کنید</option>
              <option value="acute">حاد (Acute)</option>
              <option value="chronic">مزمن (Chronic)</option>
            </select>
          </div>

          {/* وضعیت همودینامیک */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              وضعیت همودینامیک
            </label>
            <select
              value={hemodynamicStatus}
              onChange={(e) => setHemodynamicStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={isUnstable}
            >
              <option value="stable">پایدار</option>
              <option value="unstable">اینتوبه / ناپایدار</option>
            </select>
            {isUnstable && (
              <p className="text-xs text-gray-500 mt-1">
                بر اساس انتخاب وضعیت ناپایدار تنظیم شده است
              </p>
            )}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <span className="absolute left-3 top-3 text-gray-500">g/dL</span>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <span className="absolute left-3 top-3 text-gray-500">%</span>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <span className="absolute left-3 top-3 text-gray-500">g/dL</span>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <TbTemperature className="absolute left-3 top-3 text-gray-500" />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                  className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
            className="flex-1 py-3 px-6 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-bold transition-colors"
          >
            {showNotes ? "مخفی کردن نکات" : "نمایش نکات آموزشی"}
          </button>
        </div>
      </div>

      {/* نتایج */}
      {submitted && numericWeight > 0 && (
        <div className="space-y-6 mt-6">
          {/* هشدارهای بحرانی */}
          {criticalWarnings.length > 0 && (
            <div className="bg-red-50 border border-red-300 rounded-2xl p-5">
              <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
                <FaExclamationTriangle className="ml-2" />
                هشدارهای بحرانی
              </h3>
              <div className="space-y-3">
                {criticalWarnings.map((warning, idx) => (
                  <div
                    key={idx}
                    className="flex items-start p-3 bg-white rounded-lg border border-red-200"
                  >
                    {warning.icon}
                    <span className="mr-2 font-medium text-red-700">
                      {warning.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* هشدارهای معمولی */}
          {warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-yellow-800 mb-3">
                توصیه‌های احتیاطی
              </h3>
              <ul className="space-y-2">
                {warnings.map((warning, idx) => (
                  <li key={idx} className="flex items-center text-yellow-700">
                    <GoAlert className="ml-2" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* پروتکل‌های خونی */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* PC */}
            {pcAction && pcAction !== "none" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <MdBloodtype className="text-red-600 text-xl ml-2" />
                  <h4 className="font-bold text-red-800">PC (Packed Cell)</h4>
                </div>
                {pcAction === "prime" ? (
                  <p className="text-red-700">⚡ مدار را با PC پرایم کنید</p>
                ) : (
                  <div>
                    <p className="text-red-700 mb-1">تزریق حین دیالیز:</p>
                    <p className="text-lg font-bold text-red-800">
                      {calculateTransfusionVolume("pc")} سی‌سی
                    </p>
                    <p className="text-sm text-red-600">
                      (۵ سی‌سی به ازای هر کیلوگرم)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* FFP */}
            {ffpAction && ffpAction !== "none" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <GiChemicalTank className="text-yellow-600 text-xl ml-2" />
                  <h4 className="font-bold text-yellow-800">FFP</h4>
                </div>
                {ffpAction === "prime" ? (
                  <p className="text-yellow-700">
                    ⚡ مدار را با FFP پرایم کنید
                  </p>
                ) : (
                  <div>
                    <p className="text-yellow-700 mb-1">تزریق حین دیالیز:</p>
                    <p className="text-lg font-bold text-yellow-800">
                      {calculateTransfusionVolume("ffp")} سی‌سی
                    </p>
                    <p className="text-sm text-yellow-600">
                      (۱۰ سی‌سی به ازای هر کیلوگرم)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Albumin */}
            {albuminAction && albuminAction !== "none" && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <TbDropletFilled className="text-green-600 text-xl ml-2" />
                  <h4 className="font-bold text-green-800">Albumin</h4>
                </div>
                {albuminAction === "prime" ? (
                  <p className="text-green-700">⚡ پرایم با ۱۰ گرم آلبومین</p>
                ) : (
                  <div>
                    <p className="text-green-700 mb-1">تزریق حین دیالیز:</p>
                    <p className="text-lg font-bold text-green-800">۱۰ گرم</p>
                    <p className="text-sm text-green-600">
                      (تقریباً ۱۰۰ سی‌سی)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* پارامترهای اصلی دیالیز */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <GrPowerCycle className="ml-2" />
              تنظیمات اصلی دیالیز
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* سرعت پمپ خون */}
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h4 className="font-bold text-blue-700 mb-2 flex items-center">
                  <GrPowerCycle className="ml-1 text-blue-600" />
                  سرعت پمپ خون (Qb)
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">محدوده:</span>
                    <span className="font-bold">
                      {qbRange.min} - {qbRange.max} ml/min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">پیشنهادی:</span>
                    <span className="font-bold text-lg text-blue-700">
                      {qbRange.standard} ml/min
                    </span>
                  </div>
                  {hemodynamicStatus === "unstable" && (
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      ⚠️ کاهش یافته بخاطر وضعیت ناپایدار
                    </p>
                  )}
                  {hypotension && (
                    <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                      ⚠️ کاهش بخاطر فشار خون پایین
                    </p>
                  )}
                </div>
              </div>

              {/* سرعت دیالیزات */}
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h4 className="font-bold text-blue-700 mb-2 flex items-center">
                  <IoWater className="ml-1 text-blue-600" />
                  سرعت دیالیزات (Qd)
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">پیشنهادی:</span>
                    <span className="font-bold text-lg text-blue-700">
                      {qdSuggested} ml/min
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    نسبت Qd/Qb:{" "}
                    {hemodynamicStatus === "unstable" ? "1.5:1" : "2:1"}
                  </p>
                </div>
              </div>

              {/* نرخ اولترافیلتراسیون */}
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h4 className="font-bold text-blue-700 mb-2 flex items-center">
                  <IoWater className="ml-1 text-blue-600" />
                  نرخ اولترافیلتراسیون (UFR)
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">محدوده:</span>
                    <span className="font-bold">
                      {ufrRange.min} - {ufrRange.max} ml/hr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">پیشنهادی:</span>
                    <span className="font-bold text-lg text-blue-700">
                      {ufrRange.recommended} ml/hr
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {Math.round(ufrRange.recommended / numericWeight)} ml/kg/hr
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ضد انعقاد */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
              <LuSyringe className="ml-2" />
              پروتکل ضد انعقاد
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* توصیه ضد انعقاد */}
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h4 className="font-bold text-green-700 mb-3">
                  توصیه ضد انعقاد
                </h4>

                {shouldUseRegionalCitrate ? (
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <IoCheckmarkCircle className="text-green-600 ml-2" />
                      <span className="font-bold text-green-700">
                        سیترات منطقه‌ای توصیه می‌شود
                      </span>
                    </div>
                    {citrateDose && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>میزان ACD-A:</span>
                          <span className="font-bold">
                            {citrateDose.acdaRate}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>میزان کلسیم:</span>
                          <span className="font-bold">
                            {citrateDose.calciumRate}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : canUseHeparin ? (
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <IoCheckmarkCircle className="text-green-600 ml-2" />
                      <span className="font-bold text-green-700">
                        هپارین قابل استفاده است
                      </span>
                    </div>
                    {heparinDose && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Bolus اولیه:</span>
                          <span className="font-bold">{heparinDose.bolus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Infusion:</span>
                          <span className="font-bold">
                            {heparinDose.infusion}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <IoCloseCircle className="text-red-600 ml-2" />
                      <span className="font-bold text-red-700">
                        هپارین ممنوع است
                      </span>
                    </div>
                    {canUseNoAnticoagulation ? (
                      <p className="text-red-600">
                        بدون ضد انعقاد با پایش دقیق
                      </p>
                    ) : (
                      <p className="text-red-600">
                        سیترات منطقه‌ای یا بدون ضد انعقاد
                      </p>
                    )}
                  </div>
                )}

                {heparinEligibilityMessage && (
                  <p className="text-sm text-red-600 mt-3 bg-red-50 p-2 rounded">
                    {heparinEligibilityMessage}
                  </p>
                )}
              </div>

              {/* پایش */}
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h4 className="font-bold text-green-700 mb-3">
                  پایش حین دیالیز
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <LuActivity className="ml-2 text-green-600" />
                    فشار خون: هر ۱۵-۳۰ دقیقه
                  </li>
                  <li className="flex items-center">
                    <GiHeartBeats className="ml-2 text-green-600" />
                    علائم حیاتی: هر ۳۰ دقیقه
                  </li>
                  <li className="flex items-center">
                    <FaVial className="ml-2 text-green-600" />
                    آزمایش‌ها: بر اساس پروتکل ضد انعقاد
                  </li>
                  <li className="flex items-center">
                    <MdBatteryAlert className="ml-2 text-green-600" />
                    حجم UF: هر ساعت
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* فیلترهای پیشنهادی */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
              <GiChemicalTank className="ml-2" />
              صافی‌های پیشنهادی
            </h3>

            {matchedFilters.length === 0 ? (
              <div className="bg-white p-4 rounded-xl border">
                <p className="text-red-600 text-center">صافی مناسب یافت نشد</p>
              </div>
            ) : (
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
            )}
          </div>

          {/* تنظیمات تکمیلی */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* زمان دیالیز */}
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                <GoStopwatch className="ml-2 text-blue-600" />
                زمان دیالیز
              </h4>
              <p className={`text-lg font-bold mb-2 ${dialysisTime.color}`}>
                {dialysisTime.time}
              </p>
              <p className="text-sm text-gray-600">{dialysisTime.note}</p>
            </div>

            {/* حجم مدار */}
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <h4 className="font-bold text-blue-800 mb-3">حجم مدار</h4>
              <p className="text-lg font-bold text-blue-700 mb-2">
                {circuitVolume} ml
              </p>
              <p className="text-sm text-gray-600">
                {Math.round((circuitVolume / numericWeight) * 10) / 10} ml/kg
              </p>
            </div>

            {/* دمای دیالیزات */}
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                <FaTemperatureHigh className="ml-2 text-blue-600" />
                دمای دیالیزات
              </h4>
              <p className="text-lg font-bold text-blue-700 mb-2">
                {dialysateTemperature}
              </p>
              <p className="text-sm text-gray-600">
                {fever ? "کاهش یافته بخاطر تب" : "دمای استاندارد"}
              </p>
            </div>
          </div>

          {/* نکات آموزشی */}
          {showNotes && <EducationalNotes />}

          {/* دکمه نمایش نکات */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex-1 py-3 px-6 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-bold transition-colors"
          >
            {showNotes ? "مخفی کردن نکات" : "نمایش نکات آموزشی"}
          </button>
        </div>
      )}
    </div>
  );
}
