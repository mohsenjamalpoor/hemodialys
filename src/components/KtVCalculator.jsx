import { useState } from "react";

export function KtVCalculator() {
  const [ureaPre, setUreaPre] = useState("");
  const [ureaPost, setUreaPost] = useState("");
  const [dialysisTime, setDialysisTime] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const calculateKtV = () => {
    const pre = parseFloat(ureaPre);
    const post = parseFloat(ureaPost);
    const time = parseFloat(dialysisTime);

    if (isNaN(pre) || isNaN(post) || isNaN(time) || pre <= 0 || post <= 0 || time <= 0) {
      setResult(null);
      setMessage("لطفاً مقادیر معتبر وارد کنید.");
      return;
    }

    // فرمول ساده شده kt/v
    const ktv = -Math.log(post / pre - 0.008 * time);
    const ktvRounded = ktv.toFixed(2);
    setResult(ktvRounded);

    // تفسیر نتیجه بر اساس محدوده kt/v
    if (ktv < 1.2) setMessage("دیالیز ناکافی است و نیاز به بهبود دارد.");
    else if (ktv >= 1.2 && ktv <= 1.4) setMessage("محدوده هدف و بهینه دیالیز.");
    else if (ktv > 1.4) setMessage("دیالیز به خوبی انجام شده است.");
    else setMessage("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 text-right">
      <h2 className="text-xl font-bold text-center mb-4">محاسبه Kt/V</h2>

      <div className="space-y-2">
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

        {result !== null && (
          <div className="mt-4 text-center text-lg font-semibold">
            مقدار Kt/V: {result} — {message}
          </div>
        )}

        {/* اگر خطا باشد */}
        {result === null && message && (
          <div className="mt-4 text-center text-red-600 font-semibold">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
