// DialysisCalculations.jsx
import React, { useMemo } from "react";

export const useDialysisCalculations = ({
  weight,
  age,
  height,
  clinicalStatus,
  hemodynamicStatus,
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
  showOnlyPediatric = true,
}) => {
  // Parse numbers safely
  const numericWeight = parseFloat(weight?.replace(/٫|٬|,/g, ".")) || 0;
  const numericAge = parseFloat(age) || 0;
  const numericHeight = parseFloat(height) || 0;
  const numericPlt = parseFloat(plt) || 0;
  const numericInr = parseFloat(inr) || 0;
  const numericPt = parseFloat(pt) || 0;
  const numericPtt = parseFloat(ptt) || 0;
  const numericBpS = parseInt(bpSystolic) || 0;
  const numericBpD = parseInt(bpDiastolic) || 0;
  const numericHb = parseFloat(hb) || 0;
  const numericHct = parseFloat(hct) || 0;
  const numericTemp = parseFloat(temperature) || 0;
  const numericAlbumin = parseFloat(albumin) || 0;
  const numericAccessFlow = parseFloat(accessFlow) || 0;

  // شرایط بالینی
  const hypotension = useMemo(
    () => (numericBpS > 0 && numericBpS < 90) || (numericBpD > 0 && numericBpD < 50),
    [numericBpS, numericBpD]
  );

  const hypertension = useMemo(
    () => numericBpS > 140 || numericBpD > 90,
    [numericBpS, numericBpD]
  );

  const fever = useMemo(() => numericTemp > 37.5, [numericTemp]);

  // شرایط انعقادی
  const pltIsLow = useMemo(() => numericPlt > 0 && numericPlt < 50000, [numericPlt]);
  const pltIsVeryLow = useMemo(() => numericPlt > 0 && numericPlt < 20000, [numericPlt]);
  const inrIsHigh = useMemo(() => numericInr > 1.5, [numericInr]);
  const inrIsVeryHigh = useMemo(() => numericInr > 3, [numericInr]);
  const ptIsHigh = useMemo(() => numericPt > 15, [numericPt]);

  // محاسبه حجم خون کل (بر اساس وزن، سن و قد)
  const calculateBloodVolume = useMemo(() => {
    if (numericWeight <= 0) return 0;
    
    let bloodVolume = 0;
    
    if (numericAge < 1) { // نوزادان
      bloodVolume = numericWeight * 85; // ml/kg
    } else if (numericAge >= 1 && numericAge < 10) { // کودکان
      bloodVolume = numericWeight * 75; // ml/kg
    } else if (numericAge >= 10 && numericAge < 18) { // نوجوانان
      // محاسبه بر اساس وزن و قد برای نوجوانان
      const bsa = Math.sqrt((numericHeight * numericWeight) / 3600); // فرمول دوبوئیس
      bloodVolume = bsa * 2800; // ml/m²
    } else { // بالغین
      bloodVolume = numericWeight * 70; // ml/kg
    }
    
    return Math.round(bloodVolume);
  }, [numericWeight, numericAge, numericHeight]);

  // محاسبه Qb
  const calculateQb = useMemo(() => {
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
  }, [numericWeight, clinicalStatus, hemodynamicStatus, accessType, numericAccessFlow]);

  const qbRange = calculateQb;

  // محاسبه Qd
  const calculateQd = useMemo(() => {
    const ratio = hemodynamicStatus === "unstable" ? 1.5 : 2;
    return Math.round(qbRange.standard * ratio);
  }, [qbRange.standard, hemodynamicStatus]);

  const qdSuggested = calculateQd;

  // محاسبه UFR
  const calculateUFR = useMemo(() => {
    if (numericWeight <= 0) return { min: 0, max: 0, recommended: 0 };

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

  const ufrRange = calculateUFR;

  // محاسبات هپارین
  const canUseHeparin = useMemo(
    () => !pltIsLow && !inrIsHigh && !ptIsHigh,
    [pltIsLow, inrIsHigh, ptIsHigh]
  );

  const shouldUseRegionalCitrate = useMemo(
    () => pltIsVeryLow || inrIsVeryHigh,
    [pltIsVeryLow, inrIsVeryHigh]
  );

  const canUseNoAnticoagulation = useMemo(
    () => pltIsVeryLow && inrIsVeryHigh,
    [pltIsVeryLow, inrIsVeryHigh]
  );

  const heparinEligibilityMessage = useMemo(() => {
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
  }, [pltIsVeryLow, pltIsLow, inrIsVeryHigh, inrIsHigh, ptIsHigh]);

  const calculateHeparin = useMemo(() => {
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
      infusion: `${Math.round(infusionMin)} - ${Math.round(infusionMax)} واحد/ساعت`,
      monitoring: "کنترل PTT هر 4-6 ساعت",
    };
  }, [numericWeight, canUseHeparin, hemodynamicStatus]);

  const heparinDose = calculateHeparin;

  // محاسبات سیترات
  const calculateCitrate = useMemo(() => {
    if (!shouldUseRegionalCitrate) return null;

    const acdaRate = numericWeight * 1.7;
    const calciumRate = numericWeight * 0.4;

    return {
      acdaRate: `${acdaRate.toFixed(1)} ml/hr`,
      calciumRate: `${calciumRate.toFixed(1)} mEq/hr`,
      monitoring: "کنترل کلسیم یونیزه هر 2 ساعت",
    };
  }, [numericWeight, shouldUseRegionalCitrate]);

  const citrateDose = calculateCitrate;

  // محاسبه حجم PC مورد نیاز بر اساس حجم خون
  const calculatePcVolume = useMemo(() => {
    const bloodVolume = calculateBloodVolume;
    
    if (bloodVolume <= 0 || numericHct <= 0) return 0;
    
    // فرمول محاسبه حجم PC برای رسیدن به Hb هدف
    const targetHct = 30; // هدف هماتوکریت (درصد)
    const currentHct = numericHct;
    
    if (currentHct >= targetHct) return 0;
    
    // حجم PC مورد نیاز (ml) = (هدف Hct - Hct فعلی) × حجم خون ÷ (Hct واحد PC)
    const pcHct = 65; // هماتوکریت واحد PC (تقریباً 65%)
    const pcVolumeNeeded = ((targetHct - currentHct) * bloodVolume) / pcHct;
    
    return Math.round(pcVolumeNeeded);
  }, [calculateBloodVolume, numericHct]);

  // محاسبه FFP مورد نیاز بر اساس حجم خون
  const calculateFfpVolume = useMemo(() => {
    const bloodVolume = calculateBloodVolume;
    
    if (bloodVolume <= 0 || numericInr <= 0) return 0;
    
    // اگر INR بالا نباشد نیاز به FFP نیست
    if (numericInr <= 1.5) return 0;
    
    // حجم پایه FFP بر اساس وزن
    let baseVolume = numericWeight * 10; // ml/kg
    
    // تنظیم بر اساس شدت INR
    if (numericInr > 3) {
      baseVolume *= 1.5;
    } else if (numericInr > 2) {
      baseVolume *= 1.2;
    }
    
    // تنظیم بر اساس حجم خون
    const maxVolume = bloodVolume * 0.15; // حداکثر 15% حجم خون
    return Math.min(Math.round(baseVolume), Math.round(maxVolume));
  }, [calculateBloodVolume, numericWeight, numericInr]);

  // محاسبه albumin مورد نیاز
  const calculateAlbuminVolume = useMemo(() => {
    const bloodVolume = calculateBloodVolume;
    
    if (bloodVolume <= 0) return 0;
    
    // دوز آلبومین: 1-2 گرم به ازای هر کیلوگرم وزن
    const albuminGrams = numericWeight * 1.5; // گرم
    const albuminVolume = (albuminGrams / 20) * 100; // 20 گرم در 100 میلی لیتر
    
    // حداکثر 5% حجم خون
    const maxVolume = bloodVolume * 0.05;
    return Math.min(Math.round(albuminVolume), Math.round(maxVolume));
  }, [calculateBloodVolume, numericWeight]);

  // تصمیم‌گیری برای تزریق PC
  const decidePcTransfusion = useMemo(() => {
    if (numericWeight <= 0 || numericHb <= 0) return { need: false, reason: "", volume: 0 };
    
    const bloodVolume = calculateBloodVolume;
    const pcVolumeNeeded = calculatePcVolume;
    
    // معیارهای تزریق PC
    const criteria = [];
    
    if (numericHb < 7) {
      criteria.push("Hb < 7 g/dL (نیاز مطلق)");
    } else if (numericHb < 10 && hemodynamicStatus === "unstable") {
      criteria.push("Hb < 10 g/dL + وضعیت ناپایدار");
    } else if (numericHct < 25) {
      criteria.push("Hct < 25%");
    } else if (bloodVolume > 0 && pcVolumeNeeded > bloodVolume * 0.1) {
      criteria.push("نیاز به PC > 10% حجم خون");
    }
    
    const needTransfusion = criteria.length > 0;
    
    return {
      need: needTransfusion,
      reason: needTransfusion ? criteria.join("، ") : "نیاز به تزریق PC نیست",
      volume: pcVolumeNeeded,
      bloodVolume: bloodVolume,
    };
  }, [numericWeight, numericHb, numericHct, hemodynamicStatus, calculateBloodVolume, calculatePcVolume]);

  // تصمیم‌گیری برای تزریق FFP
  const decideFfpTransfusion = useMemo(() => {
    if (numericWeight <= 0 || numericInr <= 0) return { need: false, reason: "", volume: 0 };
    
    const ffpVolumeNeeded = calculateFfpVolume;
    
    const criteria = [];
    
    if (numericInr > 3) {
      criteria.push("INR > 3 (خطر خونریزی بالا)");
    } else if (numericInr > 1.5 && (pltIsLow || clinicalStatus === "acute")) {
      criteria.push("INR > 1.5 + ریسک فاکتور اضافه");
    } else if (numericPt > 20) {
      criteria.push("PT > 20 ثانیه");
    }
    
    const needTransfusion = criteria.length > 0;
    
    return {
      need: needTransfusion,
      reason: needTransfusion ? criteria.join("، ") : "نیاز به تزریق FFP نیست",
      volume: ffpVolumeNeeded,
    };
  }, [numericWeight, numericInr, pltIsLow, clinicalStatus, numericPt, calculateFfpVolume]);

  // تصمیم‌گیری برای تزریق Albumin
  const decideAlbuminTransfusion = useMemo(() => {
    if (numericWeight <= 0 || numericAlbumin <= 0) return { need: false, reason: "", volume: 0 };
    
    const albuminVolumeNeeded = calculateAlbuminVolume;
    
    const criteria = [];
    
    if (numericAlbumin < 2.5) {
      criteria.push("آلبومین < 2.5 g/dL");
    } else if (hypotension) {
      criteria.push("فشار خون پایین");
    } else if (numericAlbumin < 3.5 && clinicalStatus === "acute") {
      criteria.push("آلبومین < 3.5 g/dL + وضعیت حاد");
    }
    
    const needTransfusion = criteria.length > 0;
    
    return {
      need: needTransfusion,
      reason: needTransfusion ? criteria.join("، ") : "نیاز به تزریق آلبومین نیست",
      volume: albuminVolumeNeeded,
    };
  }, [numericWeight, numericAlbumin, hypotension, clinicalStatus, calculateAlbuminVolume]);

  // هشدارها
  const warnings = useMemo(() => {
    const w = [];
    
    if (pltIsLow && !pltIsVeryLow) {
      w.push("⚠️ پلاکت پایین (<50,000) - خطر خونریزی افزایش یافته");
    }
    
    if (inrIsHigh && !inrIsVeryHigh) {
      w.push("⚠️ INR بالا (>1.5) - احتیاط در ضد انعقاد");
    }
    
    if (numericBpS > 0 && numericBpS < 100 && !hypotension) {
      w.push("⚠️ فشار خون سیستولیک در حد پایین");
    }
    
    if (hypertension) {
      w.push("⚠️ فشار خون بالا - تنظیم دقیق UF لازم است");
    }
    
    if (fever) {
      w.push("⚠️ تب بیمار - پایش دقیق علائم حیاتی");
    }
    
    if (numericHb > 0 && numericHb < 10 && numericHb >= 7) {
      w.push("⚠️ هموگلوبین پایین - پایش دقیق همودینامیک");
    }
    
    if (numericHct > 0 && numericHct < 25) {
      w.push("⚠️ هماتوکریت پایین - حجم پرایم مناسب انتخاب شود");
    }
    
    if (numericAlbumin > 0 && numericAlbumin < 3.5 && numericAlbumin >= 2.5) {
      w.push("⚠️ آلبومین پایین - احتیاط در تنظیم مایعات");
    }
    
    return w;
  }, [
    pltIsLow,
    pltIsVeryLow,
    inrIsHigh,
    inrIsVeryHigh,
    numericBpS,
    hypotension,
    hypertension,
    fever,
    numericHb,
    numericHct,
    numericAlbumin,
  ]);

  const criticalWarnings = useMemo(() => {
    const cw = [];
    
    if (pltIsVeryLow) {
      cw.push({
        icon: "GiBlood",
        text: "⚠️ پلاکت بسیار پایین (<20,000) - خطر خونریزی بالا",
      });
    }
    
    if (inrIsVeryHigh) {
      cw.push({
        icon: "MdBloodtype",
        text: "⚠️ INR بسیار بالا (>3) - ریسک خونریزی جدی",
      });
    }
    
    if (hypotension) {
      cw.push({
        icon: "MdOutlineMonitorHeart",
        text: "⚠️ فشار خون پایین - ریسک افت فشار حین دیالیز",
      });
    }
    
    if (numericHb > 0 && numericHb < 7) {
      cw.push({
        icon: "FaTint",
        text: "⚠️ هموگلوبین بسیار پایین - نیاز به تزریق خون",
      });
    }
    
    if (numericAlbumin > 0 && numericAlbumin < 2.5) {
      cw.push({
        icon: "TbDropletFilled",
        text: "⚠️ آلبومین بسیار پایین (<2.5 g/dL) - ریسک ادم و افت فشار",
      });
    }
    
    return cw;
  }, [pltIsVeryLow, inrIsVeryHigh, hypotension, numericHb, numericAlbumin]);

  // محاسبه زمان دیالیز
  const calculateDialysisTime = useMemo(() => {
    if (numericWeight <= 0) return { time: "", note: "", color: "text-gray-600" };

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

  const dialysisTime = calculateDialysisTime;

  // محاسبه حجم مدار
  const calculateCircuitVolume = useMemo(() => {
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

  const circuitVolume = calculateCircuitVolume;

  // محاسبه دمای دیالیزات
  const calculateDialysateTemp = useMemo(() => {
    if (fever) {
      return "35.5-36.5 °C";
    }
    if (hypotension) {
      return "36.5-37 °C";
    }
    return "36-37 °C";
  }, [fever, hypotension]);

  const dialysateTemperature = calculateDialysateTemp;

  return {
    // مقادیر عددی
    numericWeight,
    numericAge,
    numericHeight,
    numericPlt,
    numericInr,
    numericPt,
    numericPtt,
    numericBpS,
    numericBpD,
    numericHb,
    numericHct,
    numericTemp,
    numericAlbumin,
    numericAccessFlow,
    
    // شرایط بالینی
    hypotension,
    hypertension,
    fever,
    
    // شرایط انعقادی
    pltIsLow,
    pltIsVeryLow,
    inrIsHigh,
    inrIsVeryHigh,
    ptIsHigh,
    
    // محاسبات اصلی
    qbRange,
    qdSuggested,
    ufrRange,
    
    // ضد انعقاد
    canUseHeparin,
    shouldUseRegionalCitrate,
    canUseNoAnticoagulation,
    heparinEligibilityMessage,
    heparinDose,
    citrateDose,
    
    // محاسبات حجم خون و تزریق
    calculateBloodVolume,
    calculatePcVolume,
    calculateFfpVolume,
    calculateAlbuminVolume,
    decidePcTransfusion,
    decideFfpTransfusion,
    decideAlbuminTransfusion,
    
    // هشدارها
    warnings,
    criticalWarnings,
    
    // محاسبات تکمیلی
    dialysisTime,
    circuitVolume,
    dialysateTemperature,
    
    // پارامترهای خام
    rawValues: {
      weight: numericWeight,
      age: numericAge,
      height: numericHeight,
      clinicalStatus,
      hemodynamicStatus,
      accessType,
      dialysateCa,
      dialysateK,
      dialysateNa,
      dialysateHCO3,
    },
  };
};

// Component نمایش نتایج محاسبات
export const DialysisCalculationsDisplay = ({ calculations }) => {
  if (!calculations || calculations.numericWeight <= 0) {
    return null;
  }

  const {
    qbRange,
    qdSuggested,
    ufrRange,
    heparinDose,
    citrateDose,
    heparinEligibilityMessage,
    canUseHeparin,
    shouldUseRegionalCitrate,
    canUseNoAnticoagulation,
    dialysisTime,
    circuitVolume,
    dialysateTemperature,
    calculateBloodVolume,
    decidePcTransfusion,
    decideFfpTransfusion,
    decideAlbuminTransfusion,
    warnings,
    criticalWarnings,
  } = calculations;

  // بررسی آیا نیاز به تزریق وجود دارد
  const needsTransfusion = decidePcTransfusion.need || decideFfpTransfusion.need || decideAlbuminTransfusion.need;

  return (
    <div className="space-y-6 mt-6">
      {/* هشدارهای بحرانی */}
      {criticalWarnings.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-2xl p-5">
          <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
            <span className="mr-2">⚠️</span>
            هشدارهای بحرانی
          </h3>
          <div className="space-y-3">
            {criticalWarnings.map((warning, idx) => (
              <div
                key={idx}
                className="flex items-start p-3 bg-white rounded-lg border border-red-200"
              >
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
                <span className="mr-2">⚠️</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* محاسبات حجم خون */}
      {calculateBloodVolume > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5">
          <h3 className="text-xl font-bold text-purple-800 mb-4">
            محاسبات حجم خون
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* حجم خون کل - همیشه نشان داده شود */}
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <h4 className="font-bold text-purple-700 mb-2">
                حجم خون تخمینی
              </h4>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-800">
                    {calculateBloodVolume.toLocaleString()} ml
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    ≈ {Math.round(calculateBloodVolume / 1000)} لیتر
                  </p>
                </div>
                <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  حجم کل
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                محاسبه بر اساس وزن، سن و قد بیمار
              </p>
            </div>

            {/* PC مورد نیاز - فقط اگر نیاز باشد */}
            {decidePcTransfusion.need && (
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h4 className="font-bold text-red-700 mb-2">
                  Packed Cell (PC)
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">وضعیت:</span>
                    <span className="font-bold text-red-700">
                      نیاز به تزریق
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">حجم پیشنهادی:</span>
                    <span className="font-bold text-lg text-red-700">
                      {decidePcTransfusion.volume} ml
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {decidePcTransfusion.reason}
                  </p>
                </div>
              </div>
            )}

            {/* FFP مورد نیاز - فقط اگر نیاز باشد */}
            {decideFfpTransfusion.need && (
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h4 className="font-bold text-yellow-700 mb-2">
                  FFP
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">وضعیت:</span>
                    <span className="font-bold text-yellow-700">
                      نیاز به تزریق
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">حجم پیشنهادی:</span>
                    <span className="font-bold text-lg text-yellow-700">
                      {decideFfpTransfusion.volume} ml
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {decideFfpTransfusion.reason}
                  </p>
                </div>
              </div>
            )}

            {/* Albumin مورد نیاز - فقط اگر نیاز باشد */}
            {decideAlbuminTransfusion.need && (
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h4 className="font-bold text-green-700 mb-2">
                  آلبومین
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">وضعیت:</span>
                    <span className="font-bold text-green-700">
                      نیاز به تزریق
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">حجم پیشنهادی:</span>
                    <span className="font-bold text-lg text-green-700">
                      {decideAlbuminTransfusion.volume} ml
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {decideAlbuminTransfusion.reason}
                  </p>
                </div>
              </div>
            )}

            {/* اگر هیچ تزریقی نیاز نباشد، کارت خالی بگذار یا نشان نده */}
            {!needsTransfusion && (
              <div className="md:col-span-3 bg-white p-4 rounded-xl border shadow-sm">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-green-600 text-xl mb-2">✓</div>
                    <h4 className="font-bold text-green-700 mb-1">وضعیت مطلوب</h4>
                    <p className="text-sm text-gray-600">
                      در حال حاضر نیاز به تزریق خون یا فرآورده‌های خونی وجود ندارد
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* پارامترهای اصلی دیالیز */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="text-xl font-bold text-blue-800 mb-4">
          تنظیمات اصلی دیالیز
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* سرعت پمپ خون */}
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <h4 className="font-bold text-blue-700 mb-2">
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
            </div>
          </div>

          {/* سرعت دیالیزات */}
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <h4 className="font-bold text-blue-700 mb-2">
              سرعت دیالیزات (Qd)
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">پیشنهادی:</span>
                <span className="font-bold text-lg text-blue-700">
                  {qdSuggested} ml/min
                </span>
              </div>
            </div>
          </div>

          {/* نرخ اولترافیلتراسیون */}
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <h4 className="font-bold text-blue-700 mb-2">
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
            </div>
          </div>
        </div>
      </div>

      {/* ضد انعقاد */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
        <h3 className="text-xl font-bold text-green-800 mb-4">
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
                  <span className="text-green-600 ml-2">✓</span>
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
                  <span className="text-green-600 ml-2">✓</span>
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
                  <span className="text-red-600 ml-2">✗</span>
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
        </div>
      </div>

      {/* تنظیمات تکمیلی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* زمان دیالیز */}
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <h4 className="font-bold text-blue-800 mb-3">
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
        </div>

        {/* دمای دیالیزات */}
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <h4 className="font-bold text-blue-800 mb-3">
            دمای دیالیزات
          </h4>
          <p className="text-lg font-bold text-blue-700 mb-2">
            {dialysateTemperature}
          </p>
        </div>
      </div>
    </div>
  );
};