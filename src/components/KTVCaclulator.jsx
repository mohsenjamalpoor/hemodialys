import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaCalculator, 
  FaTint, 
  FaSyncAlt, 
  FaWeight, 
  FaCheckCircle,
  FaRegCircle,
  FaInfoCircle,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft
} from "react-icons/fa";
import { Link } from "react-router-dom";

export function KTVCaclulator() {
  const [activeCalc, setActiveCalc] = useState("uf");
  const [selectedFormula, setSelectedFormula] = useState("");
  const [showAllFormulas, setShowAllFormulas] = useState(false);
  const [showKtvInfo, setShowKtvInfo] = useState(false); // کنترل نمایش/عدم نمایش توضیحات Kt/V

  // ==== UF Calculator states ====
  const [weight, setWeight] = useState("");
  const [fluidIntake, setFluidIntake] = useState("");
  const [urineOutput, setUrineOutput] = useState("");
  const [extraFluid, setExtraFluid] = useState("");
  const [targetUf, setTargetUf] = useState(null);

  // ==== Kt/V Calculator states ====
  const [bunPre, setBunPre] = useState("");
  const [bunPost, setBunPost] = useState("");
  const [time, setTime] = useState("");
  const [ufKtv, setUfKtv] = useState("");
  const [weightAfter, setWeightAfter] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [dialysisSessions, setDialysisSessions] = useState("3");

  // انتخاب/لغو انتخاب فرمول (toggle behavior)
  const handleFormulaSelect = (formulaId) => {
    if (formulaId === "allFormulas") {
      if (showAllFormulas) {
        setShowAllFormulas(false);
        setSelectedFormula("");
      } else {
        setShowAllFormulas(true);
        setSelectedFormula("allFormulas");
      }
    } else {
      if (selectedFormula === formulaId) {
        setSelectedFormula("");
        setShowAllFormulas(false);
      } else {
        setSelectedFormula(formulaId);
        setShowAllFormulas(false);
      }
    }
  };

  // بررسی اینکه آیا فرمول انتخاب شده است
  const isFormulaSelected = (formulaId) => {
    if (showAllFormulas) return true;
    return selectedFormula === formulaId;
  };

  // دکمه حذف انتخاب فرمول
  const handleClearFormula = () => {
    setSelectedFormula("");
    setShowAllFormulas(false);
  };

  // ---- UF Calculation ----
  const handleCalculateUF = () => {
    const numericWeight = parseFloat(weight) || 0;
    const intake = parseFloat(fluidIntake) || 0;
    const urine = parseFloat(urineOutput) || 0;
    const other = parseFloat(extraFluid) || 0;

    const netFluid = intake - urine + other;
    const maxUF = numericWeight * 10;
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

  // ---- Kt/V Calculations ----
  const PRU = bunPre && bunPost ? ((1 - bunPost / bunPre) * 100).toFixed(2) : null;

  // Single-pool Kt/V (spKt/V)
  let spKtV = null;
  if ((isFormulaSelected("spKtV") || showAllFormulas) && bunPre && bunPost && time && ufKtv && weightAfter) {
    const R = bunPost / bunPre;
    spKtV = (
      -Math.log(R - 0.008 * time) +
      (4 - 3.5 * R) * (ufKtv / weightAfter)
    ).toFixed(2);
  }

  // Equilibrated Kt/V (eKt/V)
  let eKtV = null;
  if ((isFormulaSelected("eKtV") || showAllFormulas) && spKtV && time) {
    eKtV = (parseFloat(spKtV) - 0.6 * (parseFloat(spKtV) / time) + 0.03).toFixed(2);
  }

  // Standard Kt/V (stdKt/V)
  let stdKtV = null;
  if ((isFormulaSelected("stdKtV") || showAllFormulas) && spKtV && dialysisSessions) {
    const N = parseFloat(dialysisSessions);
    const spKtVNum = parseFloat(spKtV);
    stdKtV = ((spKtVNum * N) / (1 + spKtVNum / 2)).toFixed(2);
  }

  // Urea Distribution Volume (V) - Watson Formula
  let ureaVolume = null;
  if ((isFormulaSelected("ureaVolume") || showAllFormulas) && age && height && weightAfter) {
    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weightAfter);
    
    if (gender === "male") {
      ureaVolume = (2.447 - 0.09516 * ageNum + 0.1074 * heightNum + 0.3362 * weightNum).toFixed(1);
    } else {
      ureaVolume = (-2.097 + 0.1069 * heightNum + 0.2466 * weightNum).toFixed(1);
    }
  }

  // فرمول‌ها
  const formulas = [
    {
      id: "spKtV",
      title: "Single-pool Kt/V (spKt/V)",
      formula: "spKt/V = −ln(R − 0.008t) + (4 − 3.5R) × (UF / W)",
      description: "فرمول استاندارد Daugirdas برای محاسبه کفایت دیالیز\nR = BUN بعد / BUN قبل\nt = زمان دیالیز (ساعت)\nUF = حجم اولترافیلتراسیون (لیتر)\nW = وزن بعد دیالیز (kg)",
      reference: "Daugirdas JT. Journal of the American Society of Nephrology. 1993;4(5):1205–1213."
    },
    {
      id: "eKtV",
      title: "Equilibrated Kt/V (eKt/V)",
      formula: "eKt/V = spKt/V − 0.6 × (spKt/V / t) + 0.03",
      description: "برای تصحیح rebound اوره بعد از دیالیز\nنیاز به محاسبه spKt/V دارد\n(t بر حسب ساعت)",
      reference: "Daugirdas JT, Schneditz D. ASAIO Journal. 1995;41(3):M719–M724."
    },
    {
      id: "stdKtV",
      title: "Standard Kt/V (stdKt/V)",
      formula: "stdKt/V = (spKt/V × N) / (1 + spKt/V / 2)",
      description: "برای مقایسه کفایت دیالیز در فرکانس‌های مختلف درمان\nN = تعداد جلسات دیالیز در هفته",
      reference: "Gotch FA. Nephrology Dialysis Transplantation. 1998;13(Suppl 6):10–14."
    },
    {
      id: "ureaVolume",
      title: "حجم توزیع اوره (فرمول واتسون)",
      formula: gender === "male" 
        ? "V = 2.447 − 0.09516A + 0.1074H + 0.3362W" 
        : "V = −2.097 + 0.1069H + 0.2466W",
      description: "محاسبه حجم کل آب بدن\nA = سن (سال)\nH = قد (سانتی‌متر)\nW = وزن بعد دیالیز (کیلوگرم)",
      reference: "Watson PE et al. American Journal of Clinical Nutrition. 1980;33(1):27–39."
    }
  ];

  // تعیین اینکه کدام فیلدها باید نمایش داده شوند
  const shouldShowBasicInputs = 
    isFormulaSelected("spKtV") || 
    isFormulaSelected("eKtV") || 
    isFormulaSelected("stdKtV") || 
    showAllFormulas;

  const shouldShowWatsonInputs = 
    isFormulaSelected("ureaVolume") || showAllFormulas;

  // تعیین اینکه آیا فرمولی انتخاب شده است
  const hasSelectedFormula = selectedFormula !== "" || showAllFormulas;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* هدر */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaCalculator className="text-blue-600" size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  محاسبه‌گر تخصصی همودیالیز
                </h1>
                <p className="text-gray-600 mt-1">محاسبات UF و Kt/V برای ارزیابی کفایت دیالیز</p>
              </div>
            </div>
              <div className="lg:w-auto">
              <Link
                to="/hemo"
                className="flex items-center gap-3 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:shadow-lg group"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">بازگشت </span>
              </Link>
            </div>
          </div>
        </div>

        {/* تب‌های انتخابی */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            onClick={() => setActiveCalc("uf")}
            className={`bg-gradient-to-r cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-xl shadow-lg p-6 ${
              activeCalc === "uf" 
                ? "from-blue-500 to-cyan-600 ring-4 ring-blue-200" 
                : "from-gray-400 to-gray-500"
            } text-white`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-white bg-opacity-20 p-3 rounded-full mb-4">
                <FaTint size={28} />
              </div>
              <h2 className="text-lg font-bold mb-2">محاسبه UF</h2>
              <p className="text-white text-opacity-90 text-sm leading-relaxed">
                محاسبه حجم مایع مورد نیاز برای خارج کردن
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveCalc("ktv")}
            className={`bg-gradient-to-r cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-xl shadow-lg p-6 ${
              activeCalc === "ktv" 
                ? "from-green-500 to-emerald-600 ring-4 ring-green-200" 
                : "from-gray-400 to-gray-500"
            } text-white`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-white bg-opacity-20 p-3 rounded-full mb-4">
                <FaWeight size={28} />
              </div>
              <h2 className="text-lg font-bold mb-2">محاسبه Kt/V</h2>
              <p className="text-white text-opacity-90 text-sm leading-relaxed">
                بررسی کفایت همودیالیز با فرمول‌های مختلف
              </p>
            </div>
          </div>
        </div>

        {/* بخش محاسبات */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          
          {/* بخش UF */}
          {activeCalc === "uf" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
                محاسبه حجم مایع خارجی (UF)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-semibold text-gray-700 text-right">
                    وزن بیمار (کیلوگرم):
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: 25"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold text-gray-700 text-right">
                    ورودی مایعات ۲۴ ساعته (ml):
                  </label>
                  <input
                    type="number"
                    value={fluidIntake}
                    onChange={(e) => setFluidIntake(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: 800"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold text-gray-700 text-right">
                    حجم ادرار ۲۴ ساعته (ml):
                  </label>
                  <input
                    type="number"
                    value={urineOutput}
                    onChange={(e) => setUrineOutput(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: 300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold text-gray-700 text-right">
                    مایعات اضافی (ml):
                  </label>
                  <input
                    type="number"
                    value={extraFluid}
                    onChange={(e) => setExtraFluid(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ادم، تزریق‌ها، تغذیه و..."
                  />
                </div>
              </div>

              <div className="flex gap-4 rtl:space-x-reverse pt-4">
                <button
                  onClick={handleCalculateUF}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  محاسبه UF
                </button>
                <button
                  onClick={handleResetUF}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FaSyncAlt />
             پاک کردن
                </button>
              </div>

              {targetUf !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg mt-6"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      {targetUf.toFixed(0)} ml
                    </div>
                    <p className="text-green-100">
                       UF پیشنهادی برای خارج کردن
                    </p>
                    <p className="text-green-200 text-sm mt-2">
                       بر اساس تعادل مایعات و حداکثر مجاز برای وزن وارد شده
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* بخش Kt/V */}
          {activeCalc === "ktv" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* توضیح Kt/V - قابل گسترش/جمع شدن */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => setShowKtvInfo(!showKtvInfo)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaInfoCircle className="text-blue-600 flex-shrink-0" size={24} />
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Kt/V چیست؟</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {showKtvInfo ? "برای بستن کلیک کنید" : "برای مشاهده اطلاعات کلیک کنید"}
                        </p>
                      </div>
                    </div>
                    <div className="text-blue-600">
                      {showKtvInfo ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                </div>
                
                {/* محتوای قابل گسترش */}
                {showKtvInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-6 pb-6 border-t border-blue-200 pt-4"
                  >
                    <div className="space-y-4">
                      <p className="text-gray-700 text-justify leading-relaxed">
                        <strong>Kt/V</strong> شاخص استاندارد برای اندازه‌گیری کفایت دیالیز همودیالیز است که نشان می‌دهد 
                        چه مقدار از فضای توزیع اوره (V) در مدت زمان دیالیز (t) توسط کلیرانس دیالیز (K) پاک‌سازی شده است.
                      </p>
                      
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">فرمول پایه:</p>
                        <div className="bg-gray-100 p-3 rounded text-center">
                          <p className="text-lg font-mono text-gray-800 font-bold">
                            Kt/V = (K × t) / V
                          </p>
                        </div>
                        <div className="mt-3 space-y-1 text-sm text-gray-600">
                          <p><strong>K:</strong> کلیرانس اوره دیالایزر (ml/min)</p>
                          <p><strong>t:</strong> مدت زمان دیالیز (دقیقه)</p>
                          <p><strong>V:</strong> حجم توزیع اوره (تقریباً برابر با آب کل بدن)</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-sm font-semibold text-blue-700 mb-2">مقادیر هدف KDOQI:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">spKt/V:</span>
                            <span className="font-bold text-green-600 ml-8">≥ 1.2</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">eKt/V:</span>
                            <span className="font-bold text-green-600">≥ 1.05</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">PRU:</span>
                            <span className="font-bold text-green-600 ml-8">≥ 65%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">منبع:</p>
                        <p className="text-sm text-gray-700">
                          Daugirdas JT et al. Handbook of Dialysis. 5th ed. Wolters Kluwer; 2015.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* انتخاب فرمول */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-right">
                    <h3 className="text-xl font-bold text-gray-800">انتخاب فرمول محاسبه</h3>
                    <p className="text-gray-600 mt-2">روی فرمول کلیک کنید تا انتخاب/لغو انتخاب شود</p>
                  </div>
                  
                  {/* دکمه حذف انتخاب */}
                  {hasSelectedFormula && (
                    <button
                      onClick={handleClearFormula}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors duration-200"
                    >
                      <FaTimes />
                      حذف انتخاب
                    </button>
                  )}
                </div>

                {/* پیام زمانی که هیچ فرمولی انتخاب نشده */}
                {!hasSelectedFormula && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center"
                  >
                    <p className="text-yellow-700 font-medium">
                       هیچ فرمولی انتخاب نشده است. روی فرمول مورد نظر کلیک کنید.
                    </p>
                  </motion.div>
                )}

                {/* نمایش فرمول انتخاب شده */}
                {hasSelectedFormula && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-700 font-semibold">
                          {showAllFormulas ? "✅ همه فرمول‌ها انتخاب شده‌اند" : `✅ "${formulas.find(f => f.id === selectedFormula)?.title}" انتخاب شده است`}
                        </p>
                        <p className="text-green-600 text-sm mt-1">
                          برای لغو انتخاب، دوباره روی فرمول کلیک کنید یا از دکمه "حذف انتخاب" استفاده کنید.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-4">
                  {formulas.map((formula) => (
                    <div
                      key={formula.id}
                      className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 relative ${
                        isFormulaSelected(formula.id)
                          ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handleFormulaSelect(formula.id)}
                    >
                      {/* نشانه انتخاب در گوشه بالا چپ */}
                      {isFormulaSelected(formula.id) && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                          <FaCheckCircle size={14} />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {isFormulaSelected(formula.id) ? (
                            <FaCheckCircle className="text-green-600" size={22} />
                          ) : (
                            <FaRegCircle className="text-gray-400" size={22} />
                          )}
                          <div className="text-right flex-1">
                            <h4 className="font-bold text-gray-800">{formula.title}</h4>
                            <p className="text-gray-600 text-sm mt-1 font-mono">{formula.formula}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* نمایش توضیحات و رفرنس وقتی فرمول انتخاب شده */}
                      {isFormulaSelected(formula.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <div className="bg-blue-50 p-3 rounded-lg mb-2">
                            <p className="text-gray-700 text-sm whitespace-pre-line">{formula.description}</p>
                          </div>
                          <div className="bg-gray-100 p-2 rounded">
                            <p className="text-xs text-gray-600">
                              <strong>منبع:</strong> {formula.reference}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}

                  {/* گزینه "همه فرمول‌ها" */}
                  <div
                    className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 relative ${
                      showAllFormulas
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleFormulaSelect("allFormulas")}
                  >
                    {/* نشانه انتخاب در گوشه بالا چپ */}
                    {showAllFormulas && (
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <FaCheckCircle size={14} />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {showAllFormulas ? (
                          <FaCheckCircle className="text-blue-600" size={22} />
                        ) : (
                          <FaRegCircle className="text-gray-400" size={22} />
                        )}
                        <div className="text-right">
                          <h4 className="font-bold text-gray-800">همه فرمول‌ها</h4>
                          <p className="text-gray-600 text-sm mt-1">محاسبه تمام پارامترهای Kt/V</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* نمایش توضیحات وقتی "همه فرمول‌ها" انتخاب شده */}
                    {showAllFormulas && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <div className="bg-blue-50 p-3 rounded-lg mb-2">
                          <p className="text-gray-700 text-sm">
                            تمام فرمول‌های Kt/V به همراه فرمول حجم توزیع اوره محاسبه خواهند شد.
                            نیاز به ورودی‌های کامل برای هر فرمول دارد.
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>برای لغو انتخاب، دوباره کلیک کنید</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearFormula();
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            حذف سریع
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* بخش ورودی‌ها - فقط وقتی فرمولی انتخاب شده است */}
              {hasSelectedFormula && (
                <>
                  {/* ورودی‌های پایه */}
                  {shouldShowBasicInputs && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-200 rounded-xl p-6"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                        اطلاعات مورد نیاز
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="block font-semibold text-gray-700 text-right">
                            BUN قبل دیالیز (mg/dL):
                          </label>
                          <input
                            type="number"
                            placeholder="مثال: 65"
                            value={bunPre}
                            onChange={(e) => setBunPre(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          {(isFormulaSelected("spKtV") || showAllFormulas) && (
                            <p className="text-xs text-green-600 mt-1 text-right">مورد نیاز برای spKt/V</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block font-semibold text-gray-700 text-right">
                            BUN بعد دیالیز (mg/dL):
                          </label>
                          <input
                            type="number"
                            placeholder="مثال: 25"
                            value={bunPost}
                            onChange={(e) => setBunPost(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          {(isFormulaSelected("spKtV") || showAllFormulas) && (
                            <p className="text-xs text-green-600 mt-1 text-right">مورد نیاز برای spKt/V</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block font-semibold text-gray-700 text-right">
                            مدت دیالیز (ساعت):
                          </label>
                          <input
                            type="number"
                            placeholder="مثال: 4"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          {(isFormulaSelected("spKtV") || isFormulaSelected("eKtV") || showAllFormulas) && (
                            <p className="text-xs text-green-600 mt-1 text-right">مورد نیاز برای spKt/V و eKt/V</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block font-semibold text-gray-700 text-right">
                            UF (لیتر):
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="مثال: 1.2"
                            value={ufKtv}
                            onChange={(e) => setUfKtv(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          {(isFormulaSelected("spKtV") || showAllFormulas) && (
                            <p className="text-xs text-green-600 mt-1 text-right">مورد نیاز برای spKt/V</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block font-semibold text-gray-700 text-right">
                            وزن بعد دیالیز (کیلوگرم):
                          </label>
                          <input
                            type="number"
                            placeholder="مثال: 24.5"
                            value={weightAfter}
                            onChange={(e) => setWeightAfter(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          {(isFormulaSelected("spKtV") || isFormulaSelected("ureaVolume") || showAllFormulas) && (
                            <p className="text-xs text-green-600 mt-1 text-right">مورد نیاز برای spKt/V و حجم اوره</p>
                          )}
                        </div>

                        {(isFormulaSelected("stdKtV") || showAllFormulas) && (
                          <div className="space-y-2">
                            <label className="block font-semibold text-gray-700 text-right">
                              جلسات دیالیز در هفته:
                            </label>
                            <select
                              value={dialysisSessions}
                              onChange={(e) => setDialysisSessions(e.target.value)}
                              className="w-full border border-gray-300 p-3 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="2">2 جلسه</option>
                              <option value="3">3 جلسه</option>
                              <option value="4">4 جلسه</option>
                              <option value="5">5 جلسه</option>
                              <option value="6">6 جلسه</option>
                            </select>
                            <p className="text-xs text-green-600 mt-1 text-right">مورد نیاز برای stdKt/V</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* ورودی‌های فرمول واتسون */}
                  {shouldShowWatsonInputs && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-200 rounded-xl p-6"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                        اطلاعات برای فرمول واتسون
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="block font-semibold text-gray-700 text-right">
                            جنسیت:
                          </label>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="male">مرد</option>
                            <option value="female">زن</option>
                          </select>
                          <p className="text-xs text-green-600 mt-1 text-right">مورد نیاز برای حجم اوره</p>
                        </div>

                        <div className="space-y-2">
                          <label className="block font-semibold text-gray-700 text-right">
                            سن (سال):
                          </label>
                          <input
                            type="number"
                            placeholder="مثال: 45"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          <p className="text-xs text-green-600 mt-1 text-right">مورد نیاز برای حجم اوره</p>
                        </div>

                        <div className="space-y-2">
                          <label className="block font-semibold text-gray-700 text-right">
                            قد (سانتی‌متر):
                          </label>
                          <input
                            type="number"
                            placeholder="مثال: 170"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          <p className="text-xs text-green-600 mt-1 text-right">مورد نیاز برای حجم اوره</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* نتایج محاسبات */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
                      نتایج محاسبات
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {PRU && (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-4 rounded-xl text-center shadow-lg"
                        >
                          <h3 className="font-bold text-blue-100">PRU</h3>
                          <p className="text-2xl font-bold mt-2">{PRU}%</p>
                          <p className="text-xs mt-1 opacity-90">کاهش نسبی اوره</p>
                        </motion.div>
                      )}

                      {spKtV && (isFormulaSelected("spKtV") || showAllFormulas) && (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-xl text-center shadow-lg ${
                            parseFloat(spKtV) >= 1.2
                              ? "bg-gradient-to-r from-green-500 to-emerald-600"
                              : "bg-gradient-to-r from-amber-500 to-orange-500"
                          } text-white`}
                        >
                          <h3 className="font-bold">spKt/V</h3>
                          <p className="text-3xl font-bold mt-2">{spKtV}</p>
                          <p className="text-xs mt-1 opacity-90">
                            {parseFloat(spKtV) >= 1.2 ? " مناسب" : " نیاز به بهبود"}
                          </p>
                          <p className="text-xs mt-2 opacity-80">حداقل: 1.2</p>
                        </motion.div>
                      )}

                      {eKtV && (isFormulaSelected("eKtV") || showAllFormulas) && (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-xl text-center shadow-lg ${
                            parseFloat(eKtV) >= 1.05
                              ? "bg-gradient-to-r from-green-500 to-emerald-600"
                              : "bg-gradient-to-r from-amber-500 to-orange-500"
                          } text-white`}
                        >
                          <h3 className="font-bold">eKt/V</h3>
                          <p className="text-3xl font-bold mt-2">{eKtV}</p>
                          <p className="text-xs mt-1 opacity-90">
                            {parseFloat(eKtV) >= 1.05 ? " مناسب" : " نیاز به بهبود"}
                          </p>
                          <p className="text-xs mt-2 opacity-80">حداقل: 1.05</p>
                        </motion.div>
                      )}

                      {stdKtV && (isFormulaSelected("stdKtV") || showAllFormulas) && (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-xl text-center shadow-lg"
                        >
                          <h3 className="font-bold">stdKt/V</h3>
                          <p className="text-3xl font-bold mt-2">{stdKtV}</p>
                          <p className="text-xs mt-1 opacity-90">هفتگی استاندارد شده</p>
                        </motion.div>
                      )}

                      {ureaVolume && (isFormulaSelected("ureaVolume") || showAllFormulas) && (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4 rounded-xl text-center shadow-lg"
                        >
                          <h3 className="font-bold">حجم اوره (V)</h3>
                          <p className="text-3xl font-bold mt-2">{ureaVolume} لیتر</p>
                          <p className="text-xs mt-1 opacity-90">فرمول واتسون</p>
                        </motion.div>
                      )}
                    </div>

                    {/* پیام زمانی که فرمولی انتخاب شده اما داده‌ای وارد نشده */}
                    {hasSelectedFormula && !spKtV && !eKtV && !stdKtV && !ureaVolume && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center"
                      >
                        <p className="text-blue-700">
                          لطفاً اطلاعات مورد نیاز را وارد کنید تا نتایج محاسبه شوند.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}