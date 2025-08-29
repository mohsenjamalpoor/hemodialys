import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

// -------------------- Utility --------------------
const rateToDuration = (rate) => {
  const clamped = Math.max(20, Math.min(500, rate || 20));
  const t = 8 - (clamped - 20) * (6.8 / (500 - 20));
  return Math.max(1.2, Math.min(8, t));
};

// -------------------- Steps --------------------
const STEPS = [
  { key: "prep", titleFa: "آماده‌سازی: ست خون و صافی را نصب کنید", hintEn: "Load bloodlines & dialyzer on the machine.", detailsFa: "ست شریانی و وریدی را روی پمپ و پایه‌ها قرار دهید. صافی (دیالایزر) را عمودی نصب کنید. همه کلمپ‌ها بسته باشند.", highlights: ["dialyzer", "pump", "lines"] },
  { key: "saline", titleFa: "اتصال سالین: لاین شریانی را به سرم نرمال‌سالین وصل کنید", hintEn: "Spike arterial line into NS bag; hang bag.", detailsFa: "ست شریانی را به سرم وصل و آویزان کنید. کلمپ نزدیک اسپایک را باز کنید. محفظه شریانی تا نصف پر شود.", highlights: ["saline", "arterial", "artChamber"] },
  { key: "primeArt", titleFa: "پرایم اولیه: پمپ خون را آرام راه‌اندازی کنید", hintEn: "Start blood pump ~150 mL/min to fill lines.", detailsFa: "پمپ خون را روی حدود ۱۵۰ mL/min بگذارید. کلمپ‌های مسیر شریانی را باز کنید تا مسیر تا صافی پر شود و حباب‌ها خارج شوند.", highlights: ["pump", "arterial", "dialyzer"] },
  { key: "primeDialyzer", titleFa: "پرایم صافی: صافی را از پایین به بالا پر کنید", hintEn: "Fill dialyzer bottom→top; tap to release bubbles.", detailsFa: "اجازه دهید مایع از ورودی پایین صافی وارد و از بالا خارج شود. به بدنه صافی ضربه بزنید تا حباب‌ها جدا شوند.", highlights: ["dialyzer"] },
  { key: "primeVen", titleFa: "مسیر وریدی: محفظه وریدی را تا خط علامت پر کنید", hintEn: "Fill venous chamber to line; check for air.", detailsFa: "جریان را ادامه دهید تا محفظه وریدی تا خط مشخص پر شود. پیچ هواگیری را باز و بسته کنید تا حباب‌ها خارج شوند.", highlights: ["venous", "venChamber"] },
  { key: "recirc", titleFa: "سیرکولاسیون: انتهای وریدی را به سالین برگردانید", hintEn: "Recirculate venous return back to bag until clear.", detailsFa: "انتهای لاین وریدی را موقتاً به کیسه سالین برگردانید و چند دقیقه گردش دهید تا هیچ حبابی دیده نشود.", highlights: ["venous", "saline"] },
  { key: "ready", titleFa: "پایان پرایم: کلمپ‌ها را ببندید و آماده اتصال به بیمار", hintEn: "Clamp, stop pump, connect to patient per protocol.", detailsFa: "پمپ را متوقف و کلمپ‌ها را مطابق پروتکل ببندید/باز کنید. مسیرها را بررسی کنید. دستگاه برای اتصال آماده است.", highlights: ["all"] },
];

// -------------------- Legend Item --------------------
function LegendItem({ color, labelFa, labelEn }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 rounded" style={{ background: color, boxShadow: "0 0 6px rgba(0,0,0,0.06)" }}></div>
      <div className="text-sm leading-tight">
        <div className="font-medium text-slate-800">{labelFa}</div>
        <div className="text-xs text-slate-500">{labelEn}</div>
      </div>
    </div>
  );
}

// -------------------- Circuit SVG --------------------
function CircuitSVG({ running, style, highlights }) {
  const is = (part) => highlights.includes(part) || highlights.includes("all");
  const dim = (part) => (is(part) ? 1 : 0.25);

  return (
    <svg viewBox="0 0 800 420" className="w-full h-auto" style={style}>
      <rect x={12} y={10} width={240} height={380} rx={14} fill="#f8fafc" stroke="#e6eef6" />
      <g transform="translate(40,36) scale(0.9)">
        <rect x={0} y={0} width={42} height={64} rx={6} fill="#fff" stroke="#cbd5e1" />
        <circle cx={21} cy={12} r={4} fill="#edf2ff" stroke="#c7d2fe" />
        <rect x={19} y={68} width={4} height={130} rx={2} fill="#94a3b8" />
        <text x={-10} y={88} fontSize={10} fill="#334155">NS</text>
      </g>
      <line x1={82} y1={90} x2={220} y2={90} stroke="#ef4444" strokeWidth={6} opacity={dim("arterial")} />
      <line x1={82} y1={90} x2={220} y2={90} stroke="#fb7185" strokeWidth={2} strokeDasharray="6 8" style={{ opacity: running ? 1 : 0.2, animation: "flowDash var(--flow-duration) linear infinite" }} />
      <rect x={214} y={70} width={34} height={40} rx={8} fill="#fff" stroke="#cbd5e1" opacity={dim("artChamber")} />
      <text x={216} y={96} fontSize={10} fill="#ef4444">Art</text>
      <g transform="translate(270,74)">
        <rect x={0} y={0} width={80} height={52} rx={8} fill="#fff" stroke="#cbd5e1" opacity={dim("pump")} />
        <circle cx={26} cy={26} r={8} fill="#f8fafc" stroke="#94a3b8" />
        <circle cx={54} cy={26} r={8} fill="#f8fafc" stroke="#94a3b8" />
        <motion.circle cx={40} cy={26} r={3} fill="#0ea5e9" animate={running ? { rotate: 360 } : { rotate: 0 }} transition={{ loop: Infinity, ease: "linear", duration: running ? 0.6 : 0 }} />
      </g>
      <g transform="translate(370,36)">
        <rect x={0} y={20} width={70} height={160} rx={10} fill="#fff" stroke="#94a3b8" opacity={dim("dialyzer")} />
        <text x={6} y={110} fontSize={12} fill="#0f172a">Dialyzer</text>
        <rect x={12} y={28} width={8} height={120} rx={4} fill="#fef3c7" style={{ opacity: running ? 0.9 : 0.2, animation: "verticalFlow var(--flow-duration) linear infinite" }} />
      </g>
      <line x1={455} y1={200} x2={610} y2={200} stroke="#2563eb" strokeWidth={6} opacity={dim("venous")} />
      <line x1={455} y1={200} x2={610} y2={200} stroke="#60a5fa" strokeWidth={2} strokeDasharray="6 8" style={{ opacity: running ? 1 : 0.2, animation: "flowDash var(--flow-duration) linear infinite reverse" }} />
      <rect x={602} y={176} width={36} height={48} rx={8} fill="#fff" stroke="#cbd5e1" opacity={dim("venChamber")} />
      <text x={606} y={206} fontSize={10} fill="#2563eb">Ven</text>
      <rect x={660} y={160} width={70} height={90} rx={8} fill="#fff" stroke="#cbd5e1" />
      <text x={680} y={210} fontSize={11} fill="#334155">Return / Bag</text>
    </svg>
  );
}

// -------------------- Main Component --------------------
export default function Priming4008S() {
  const [running, setRunning] = useState(false);
  const [rate, setRate] = useState(150);
  const [stepIndex, setStepIndex] = useState(0);
  const [clampsClosed, setClampsClosed] = useState(true);
  const [alarmOn, setAlarmOn] = useState(false);

  const step = STEPS[stepIndex];
  const duration = useMemo(() => rateToDuration(rate), [rate]);

  const flowVars = {
    ["--flow-duration"]: `${duration}s`,
    ["--flow-opacity"]: running ? 1 : 0.25,
  };

  const toggleRunning = () => {
    setRunning((r) => {
      if (!r) setAlarmOn(false);
      return !r;
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex gap-6">
        <div className="flex-1 bg-white rounded-2xl shadow p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Fresenius 4008S — Priming Trainer</h2>
              <div className="text-sm text-slate-500">این شبیه‌ساز آموزشی جایگزین آموزش بالینی یا دفترچه شرکت سازنده نیست.</div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-sm ${alarmOn ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-700"}`}>
                {alarmOn ? "Alarm — هشدار" : "System OK"}
              </div>
              <div className="text-sm text-slate-500">Flow: {running ? "On" : "Paused"}</div>
            </div>
          </div>
          <div style={flowVars}>
            <CircuitSVG running={running} highlights={step.highlights} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <LegendItem color="#ef4444" labelFa="لاین شریانی" labelEn="Arterial line" />
            <LegendItem color="#2563eb" labelFa="لاین وریدی" labelEn="Venous line" />
            <LegendItem color="#f59e0b" labelFa="صافی" labelEn="Dialyzer" />
            <LegendItem color="#10b981" labelFa="سرم (سالین)" labelEn="Normal saline" />
          </div>
        </div>
        <aside className="w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-4 space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={toggleRunning} className={`flex-1 px-4 py-2 rounded-xl shadow font-semibold transition active:scale-95 ${running ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"}`}>
                {running ? "Pause / توقف" : "Start Flow / شروع"}
              </button>
              <button onClick={() => setAlarmOn((a) => !a)} className={`px-3 py-2 rounded-xl border ${alarmOn ? "bg-rose-50 border-rose-400" : "bg-white"}`}>زنگ</button>
            </div>
            <div>
              <label className="text-sm font-medium">Flow Rate (mL/min)</label>
              <div className="text-xs text-slate-500 mb-2">سرعت جریان — animation speed maps to this value</div>
              <input type="range" min={20} max={500} value={rate} onChange={(e) => setRate(parseInt(e.target.value))} className="w-full" />
              <div className="flex justify-between text-sm text-slate-600">
                <div>20</div>
                <div>{rate} mL/min</div>
                <div>500</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={clampsClosed} onChange={() => setClampsClosed((c) => !c)} />
                <span>کلمپ‌ها بسته‌اند</span>
              </label>
              <button onClick={() => { setRunning(false); setClampsClosed(true); }} className="ml-auto text-sm px-3 py-1 rounded bg-slate-100">Stop & Clamp</button>
            </div>
            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-slate-500">مرحله</div>
                  <div className="font-semibold">{step.titleFa}</div>
                  <div className="text-xs text-slate-400">{step.hintEn}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStepIndex((i) => Math.max(0, i - 1))} className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95">◀︎ قبلی</button>
                  <button onClick={() => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))} className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95">بعدی ▶︎</button>
                </div>
              </div>
              <div className="text-sm text-slate-700 mb-3">{step.detailsFa}</div>
              <div className="flex gap-2 flex-wrap">
                {STEPS.map((s, idx) => (
                  <button key={s.key} onClick={() => setStepIndex(idx)} className={`px-3 py-1 rounded-full border text-sm ${idx === stepIndex ? "bg-sky-600 text-white border-sky-600" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}>{idx + 1}</button>
                ))}
              </div>
            </div>
            <div className="text-xs text-slate-500">تذکر: این شبیه‌ساز برای آموزش طراحی شده — همیشه از پروتکل محل کار تبعیت کنید.</div>
          </div>
        </aside>
      </div>
      <style>{`
        @keyframes flowDash {
          from { stroke-dashoffset: 0 }
          to { stroke-dashoffset: 28 }
        }
        @keyframes verticalFlow {
          0% { transform: translateY(0) }
          100% { transform: translateY(-24px) }
        }
      `}</style>
    </div>
  );
}
