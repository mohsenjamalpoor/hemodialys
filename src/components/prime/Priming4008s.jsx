import React, { useMemo, useState } from "react";

import { STEPS } from "./steps";
import { CircuitSVG } from "./CircuitSVG";

// -------------------- Utility --------------------
const rateToDuration = (rate) => {
  const clamped = Math.max(20, Math.min(500, rate || 20));
  const t = 8 - (clamped - 20) * (6.8 / (500 - 20));
  return Math.max(1.2, Math.min(8, t));
};



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


// -------------------- Main Component --------------------
export default function Priming4008S() {
  const [running, setRunning] = useState(false);
  const [rate, setRate] = useState(100);
  const [stepIndex, setStepIndex] = useState(0);
  const [clampsClosed, setClampsClosed] = useState(true);
  const [alarmOn, setAlarmOn] = useState(false);
  const [fluidType, setFluidType] = useState("NS"); // NS, FFP, Alb, PC

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
      <div className="flex flex-col lg:flex-row-reverse gap-6">
        {/* Simulation Panel */}
        <div className="flex-1 bg-white rounded-2xl shadow p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Fresenius 4008S — Priming Trainer</h2>
              <div className="text-sm text-slate-500">این شبیه‌ساز آموزشی جایگزین آموزش بالینی یا دفترچه شرکت سازنده نیست.</div>
            </div>
            <div className="flex items-center gap-3 mt-2 lg:mt-0">
              <div className={`px-3 py-1 rounded-full text-sm ${alarmOn ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-700"}`}>
                {alarmOn ? "Alarm — هشدار" : "System OK"}
              </div>
              <div className="text-sm text-slate-500">Flow: {running ? "On" : "Paused"}</div>
            </div>
          </div>
          <div style={flowVars}>
            <CircuitSVG running={running} highlights={step.highlights} fluidType={fluidType} duration={duration} style={flowVars} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <LegendItem color="#ef4444" labelFa="لاین شریانی" labelEn="Arterial line" />
            <LegendItem color="#2563eb" labelFa="لاین وریدی" labelEn="Venous line" />
            <LegendItem color="#f59e0b" labelFa="صافی" labelEn="Dialyzer" />
            <LegendItem color="#10b981" labelFa="محلول" labelEn="Fluid" />
          </div>
        </div>

        {/* Sidebar Controls */}
        <aside className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
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

            <div>
              <label className="text-sm font-medium">Fluid Type / نوع محلول</label>
              <div className="flex gap-2 mt-1">
                {["NS","FFP","Alb","PC"].map((type) => (
                  <button key={type} onClick={() => setFluidType(type)}
                    className={`px-3 py-1 rounded-full border text-sm ${fluidType===type?"bg-sky-600 text-white border-sky-600":"bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}>
                    {type === "NS" ? "N/S 0.9%" : type === "FFP" ? "FFP" : type === "Alb" ? "Albumin" : "Packed Cell"}
                  </button>
                ))}
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-slate-500">مرحله</div>
                  <div className="font-semibold">{step.titleFa}</div>
                  <div className="text-xs text-slate-400">{step.hintEn}</div>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
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
