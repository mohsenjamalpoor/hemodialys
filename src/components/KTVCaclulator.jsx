import React, { useState } from "react";
import { motion } from "framer-motion";

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
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        محاسبه‌گر دیالیز (UF + Kt/V)
      </h2>

      {/* تب انتخابی */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setActiveCalc("uf")}
          className={`py-2 px-6 rounded ${
            activeCalc === "uf" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          محاسبه UF
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

      {/* بخش UF */}
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
            <label className="block font-semibold">
              ورودی مایعات ۲۴ ساعته (ml):
            </label>
            <input
              type="number"
              value={fluidIntake}
              onChange={(e) => setFluidIntake(e.target.value)}
              className="w-full border p-2 rounded text-right"
            />
          </div>

          <div>
            <label className="block font-semibold">
              حجم ادرار ۲۴ ساعته (ml):
            </label>
            <input
              type="number"
              value={urineOutput}
              onChange={(e) => setUrineOutput(e.target.value)}
              className="w-full border p-2 rounded text-right"
            />
          </div>

          <div>
            <label className="block font-semibold">مایعات اضافی (ml):</label>
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

      {/* بخش Kt/V */}
      {activeCalc === "ktv" && (
        <div className="space-y-4 text-right">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="BUN قبل دیالیز"
              value={bunPre}
              onChange={(e) => setBunPre(e.target.value)}
              className="p-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="BUN بعد دیالیز"
              value={bunPost}
              onChange={(e) => setBunPost(e.target.value)}
              className="p-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="مدت دیالیز (ساعت)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="p-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="UF (لیتر)"
              value={uf}
              onChange={(e) => setUf(e.target.value)}
              className="p-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="وزن بعد دیالیز (کیلوگرم)"
              value={weightAfter}
              onChange={(e) => setWeightAfter(e.target.value)}
              className="p-2 border rounded-lg"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRU && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-blue-100 text-center shadow"
              >
                <h3 className="font-bold text-blue-800">PRU</h3>
                <p className="text-lg">{PRU} %</p>
              </motion.div>
            )}
            {ktvPRU1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-green-100 text-center shadow"
              >
                <h3 className="font-bold text-green-800">KT/V (PRU1)</h3>
                <p className="text-lg">{ktvPRU1}</p>
              </motion.div>
            )}
            {ktvPRU2 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-yellow-100 text-center shadow"
              >
                <h3 className="font-bold text-yellow-800">KT/V (PRU2)</h3>
                <p className="text-lg">{ktvPRU2}</p>
              </motion.div>
            )}
            {ktvDaugirdas && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-100 text-center shadow md:col-span-3"
              >
                <h3 className="font-bold text-red-800">KT/V (Daugirdas)</h3>
                <p className="text-lg">{ktvDaugirdas}</p>
              </motion.div>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
}
