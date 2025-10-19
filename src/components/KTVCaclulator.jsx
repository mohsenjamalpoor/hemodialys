import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCalculator, FaTint, FaSyncAlt, FaWeight } from "react-icons/fa";

export function KTVCaclulator() {
  const [activeCalc, setActiveCalc] = useState("uf");

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
  const [uf, setUf] = useState("");
  const [weightAfter, setWeightAfter] = useState("");

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
  const PRU =
    bunPre && bunPost ? ((1 - bunPost / bunPre) * 100).toFixed(2) : null;

  const ktvPRU1 = PRU ? (0.026 * PRU - 0.46).toFixed(2) : null;
  const ktvPRU2 = PRU ? (0.024 * PRU - 0.276).toFixed(2) : null;

  let ktvDaugirdas = null;
  if (bunPre && bunPost && time && uf && weightAfter) {
    const ratio = bunPost / bunPre;
    ktvDaugirdas = (
      -Math.log(ratio - 0.008 * time) +
      (4 - 3.5 * ratio) * (uf / weightAfter)
    ).toFixed(2);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        
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
                ارزیابی کفایت دیالیز
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
                    className="w-full border border-gray-300 p-3 rounded-xl text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 p-3 rounded-xl text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 p-3 rounded-xl text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 p-3 rounded-xl text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  پاک‌سازی
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
                      💧 UF پیشنهادی برای خارج کردن
                    </p>
                    <p className="text-green-200 text-sm mt-2">
                      * بر اساس تعادل مایعات و حداکثر مجاز برای وزن وارد شده
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
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
                محاسبه Kt/V (شاخص کفایت دیالیز)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block font-semibold text-gray-700 text-right">
                    BUN قبل دیالیز:
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 65"
                    value={bunPre}
                    onChange={(e) => setBunPre(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold text-gray-700 text-right">
                    BUN بعد دیالیز:
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 25"
                    value={bunPost}
                    onChange={(e) => setBunPost(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
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
                    className="w-full border border-gray-300 p-3 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold text-gray-700 text-right">
                    UF (لیتر):
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 1.2"
                    value={uf}
                    onChange={(e) => setUf(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
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
                    className="w-full border border-gray-300 p-3 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* نتایج Kt/V */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PRU && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-4 rounded-xl text-center shadow-lg"
                  >
                    <h3 className="font-bold text-blue-100">PRU</h3>
                    <p className="text-2xl font-bold mt-2">{PRU}%</p>
                  </motion.div>
                )}
                {ktvPRU1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl text-center shadow-lg"
                  >
                    <h3 className="font-bold text-green-100">KT/V (PRU1)</h3>
                    <p className="text-2xl font-bold mt-2">{ktvPRU1}</p>
                  </motion.div>
                )}
                {ktvPRU2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-xl text-center shadow-lg"
                  >
                    <h3 className="font-bold text-amber-100">KT/V (PRU2)</h3>
                    <p className="text-2xl font-bold mt-2">{ktvPRU2}</p>
                  </motion.div>
                )}
                {ktvDaugirdas && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl text-center shadow-lg md:col-span-2 ${
                      parseFloat(ktvDaugirdas) >= 1.2
                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                        : "bg-gradient-to-r from-red-500 to-pink-600"
                    } text-white`}
                  >
                    <h3 className="font-bold">KT/V (Daugirdas)</h3>
                    <p className="text-3xl font-bold mt-2">{ktvDaugirdas}</p>
                    <p className="text-sm mt-2 opacity-90">
                      {parseFloat(ktvDaugirdas) >= 1.2 ? "✅ کفایت مناسب" : "⚠️ نیاز به بهبود"}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}