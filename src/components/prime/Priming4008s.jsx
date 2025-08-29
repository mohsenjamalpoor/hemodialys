import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HiChevronRight } from "react-icons/hi";
import { HiChevronLeft } from "react-icons/hi";

// -------------------- Utility --------------------
const rateToDuration = (rate) => {
  const clamped = Math.max(20, Math.min(500, rate || 20));
  const t = 8 - (clamped - 20) * (6.8 / (500 - 20));
  return Math.max(1.2, Math.min(8, t));
};

// -------------------- Steps --------------------
const STEPS = [
  {
    key: "prep",
    titleFa: "آماده‌سازی: ست خون و صافی را نصب کنید",
    hintEn: "Load bloodlines & dialyzer on the machine.",
    detailsFa:
      "ست شریانی و وریدی را روی پمپ و پایه‌ها قرار دهید. صافی (دیالایزر) را عمودی نصب کنید. همه کلمپ‌ها بسته باشند.",
    highlights: ["dialyzer", "pump", "lines"],
  },
  {
    key: "saline",
    titleFa: "اتصال سالین: نرمال سالین را به لاین شریانی وصل کنید",
    hintEn: "Spike arterial line into NS bag; hang bag.",
    detailsFa:
      "ست شریانی را به سرم وصل و آویزان کنید. کلمپ نزدیک اسپایک را باز کنید. محفظه شریانی تا نصف پر شود.",
    highlights: ["saline", "arterial", "artChamber"],
  },
  {
    key: "primeArt",
    titleFa: "پرایم اولیه: پمپ خون را آرام راه‌اندازی کنید",
    hintEn: "Start blood pump ~150 mL/min to fill lines.",
    detailsFa:
      "پمپ خون را روی حدود 100 mL/min بگذارید. کلمپ‌های مسیر شریانی را باز کنید تا مسیر تا صافی پر شود و حباب‌ها خارج شوند.",
    highlights: ["pump", "arterial", "dialyzer"],
  },
  {
    key: "primeDialyzer",
    titleFa: "پرایم صافی: صافی را از پایین به بالا پر کنید",
    hintEn: "Fill dialyzer bottom→top; tap to release bubbles.",
    detailsFa:
      "اجازه دهید مایع از ورودی پایین صافی وارد و از بالا خارج شود. به بدنه صافی ضربه بزنید تا حباب‌ها جدا شوند.",
    highlights: ["dialyzer"],
  },
  {
    key: "primeVen",
    titleFa: "مسیر وریدی: محفظه وریدی را در محل خود و تا خط علامت پر کنید",
    hintEn: "Fill venous chamber to line; check for air.",
    detailsFa:
      "جریان را ادامه دهید تا محفظه وریدی تا خط مشخص پر شود. پیچ هواگیری را باز و بسته کنید تا حباب‌ها خارج شوند.",
    highlights: ["venous", "venChamber"],
  },
  {
    key: "recirc",
    titleFa: "سیرکولاسیون: انتهای وریدی را به سالین برگردانید",
    hintEn: "Recirculate venous return back to bag until clear.",
    detailsFa:
      "انتهای لاین وریدی را موقتاً به کیسه سالین برگردانید و چند دقیقه گردش دهید تا هیچ حبابی دیده نشود.",
    highlights: ["venous", "saline"],
  },
  {
    key: "ready",
    titleFa: "پایان پرایم: کلمپ‌ها را ببندید و آماده اتصال به بیمار",
    hintEn: "Clamp, stop pump, connect to patient per protocol.",
    detailsFa:
      "پمپ را متوقف و کلمپ‌ها را مطابق پروتکل ببندید/باز کنید. مسیرها را بررسی کنید. دستگاه برای اتصال آماده است.",
    highlights: ["all"],
  },
];

// -------------------- Legend Item --------------------
function LegendItem({ color, labelFa, labelEn }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-4 h-4 rounded"
        style={{ background: color, boxShadow: "0 0 6px rgba(0,0,0,0.06)" }}
      ></div>
      <div className="text-sm leading-tight">
        <div className="font-medium text-slate-800">{labelFa}</div>
        <div className="text-xs text-slate-500">{labelEn}</div>
      </div>
    </div>
  );
}

// -------------------- Circuit SVG --------------------
function CircuitSVG({ running, highlights, fluidType, duration, style }) {
  const is = (part) => highlights.includes(part) || highlights.includes("all");
  const dim = (part) => (is(part) ? 1 : 0.25);

  // رنگ کیسه و جریان بر اساس نوع محلول
  const fluidColor =
    fluidType === "NS" ? "#d1fae5" : fluidType === "PC" ? "#ef4444" : "#fde68a"; // FFP و Alb زرد

  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" style={style}>
      <rect
        x={20}
        y={50}
        width={760}
        height={400}
        rx={20}
        fill="#f8fafc"
        stroke="#e6eef6"
      />

      {/* Fluid Bag */}
      <g transform="translate(620,0)">
        <rect
          x={20}
          y={20}
          width={60}
          height={100}
          rx={12}
          fill="#fff"
          stroke="#cbd5e1"
          opacity={dim("saline")}
        />
        <rect
          x={25}
          y={25}
          width={50}
          height={70}
          rx={8}
          fill={fluidColor}
          opacity={dim("saline")}
        />
        <text
          x={25 + 50 / 2}
          y={25 + 70 / 2}
          fontSize={11}
          fill="#064e3b"
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight="bold"
        >
          {fluidType === "NS"
            ? "N/S 0.9%"
            : fluidType === "FFP"
            ? "FFP"
            : fluidType === "Alb"
            ? "Albumin"
            : "Packed Cell"}
        </text>
        <line
          x1={50}
          y1={120}
          x2={50}
          y2={180}
          stroke={fluidColor}
          strokeWidth={4}
          opacity={dim("saline")}
        />
      </g>

      {/* Arterial line */}
      <line
        x1={670}
        y1={180}
        x2={300}
        y2={180}
        stroke={fluidColor}
        strokeWidth={6}
        opacity={dim("arterial")}
      />
      <line
        x1={670}
        y1={180}
        x2={300}
        y2={180}
        stroke={fluidColor}
        strokeWidth={2}
        strokeDasharray="6 8"
        style={{
          opacity: running ? 1 : 0.2,
          animation: "flowDash var(--flow-duration) linear infinite",
        }}
      />

      {/* Pump */}
      <g transform="translate(250,150)">
        <rect
          x={0}
          y={0}
          width={80}
          height={60}
          rx={8}
          fill="#fff"
          stroke="#cbd5e1"
          opacity={dim("pump")}
        />
        <motion.circle
          cx={40}
          cy={30}
          r={8}
          fill="#0ea5e9"
          animate={running ? { rotate: 360 } : { rotate: 0 }}
          transition={{
            loop: Infinity,
            ease: "linear",
            duration: running ? 0.6 : 0,
          }}
        />
        <text x={20} y={55} fontSize={10} fill="#334155">
          Pump
        </text>
      </g>

      {/* Dialyzer */}
      <g transform="translate(420,100)">
        <rect
          x={0}
          y={0}
          width={70}
          height={180}
          rx={10}
          fill="#fff"
          stroke="#94a3b8"
          opacity={dim("dialyzer")}
        />
        <rect
          x={15}
          y={10}
          width={10}
          height={160}
          rx={5}
          fill="#fef3c7"
          style={{
            opacity: running ? 0.9 : 0.2,
            animation: "verticalFlow var(--flow-duration) linear infinite",
          }}
        />
        <text x={5} y={100} fontSize={12} fill="#0f172a">
          Dialyzer
        </text>
      </g>

      {/* Venous line */}
      <line
        x1={490}
        y1={280}
        x2={200}
        y2={280}
        stroke={fluidColor}
        strokeWidth={6}
        opacity={dim("venous")}
      />
      <line
        x1={490}
        y1={280}
        x2={200}
        y2={280}
        stroke={fluidColor}
        strokeWidth={2}
        strokeDasharray="6 8"
        style={{
          opacity: running ? 1 : 0.2,
          animation: "flowDash var(--flow-duration) linear infinite reverse",
        }}
      />

      {/* Venous chamber */}
      <rect
        x={150}
        y={260}
        width={40}
        height={60}
        rx={8}
        fill="#fff"
        stroke="#cbd5e1"
        opacity={dim("venous")}
      />
      <text x={152} y={300} fontSize={10} fill="#2563eb">
        Ven
      </text>
    </svg>
  );
}

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
              <h2 className="text-lg font-semibold">
                Fresenius 4008S — Priming Trainer
              </h2>
              <div className="text-sm text-slate-500">
                این شبیه‌ساز آموزشی جایگزین آموزش بالینی یا دفترچه شرکت سازنده
                نیست.
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2 lg:mt-0">
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  alarmOn
                    ? "bg-rose-500 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {alarmOn ? "Alarm — هشدار" : "System OK"}
              </div>
              <div className="text-sm text-slate-500">
                Flow: {running ? "On" : "Paused"}
              </div>
            </div>
          </div>
          <div style={flowVars}>
            <CircuitSVG
              running={running}
              highlights={step.highlights}
              fluidType={fluidType}
              duration={duration}
              style={flowVars}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <LegendItem
              color="#ef4444"
              labelFa="لاین شریانی"
              labelEn="Arterial line"
            />
            <LegendItem
              color="#2563eb"
              labelFa="لاین وریدی"
              labelEn="Venous line"
            />
            <LegendItem color="#f59e0b" labelFa="صافی" labelEn="Dialyzer" />
            <LegendItem color="#10b981" labelFa="محلول" labelEn="Fluid" />
          </div>
        </div>

        {/* Sidebar Controls */}
        <aside className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={toggleRunning}
                className={`flex-1 px-4 py-2 rounded-xl shadow font-semibold transition active:scale-95 ${
                  running
                    ? "bg-rose-600 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {running ? "Pause / توقف" : "Start Flow / شروع"}
              </button>
              <button
                onClick={() => setAlarmOn((a) => !a)}
                className={`px-3 py-2 rounded-xl border ${
                  alarmOn ? "bg-rose-50 border-rose-400" : "bg-white"
                }`}
              >
                زنگ
              </button>
            </div>

            <div>
              <label className="text-sm font-medium">Flow Rate (mL/min)</label>
              <div className="text-xs text-slate-500 mb-2">
                سرعت جریان — animation speed maps to this value
              </div>
              <input
                type="range"
                min={20}
                max={500}
                value={rate}
                onChange={(e) => setRate(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-600">
                <div>20</div>
                <div>{rate} mL/min</div>
                <div>500</div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
             نوع محلول پرایم
              </label>
              <div className="flex gap-2 mt-3">
                {["NS", "FFP", "Alb", "PC"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFluidType(type)}
                    className={`px-3 py-1 rounded-full border text-sm ${
                      fluidType === type
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {type === "NS"
                      ? "N/S 0.9%"
                      : type === "FFP"
                      ? "FFP"
                      : type === "Alb"
                      ? "Albumin"
                      : "Packed Cell"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={clampsClosed}
                  onChange={() => setClampsClosed((c) => !c)}
                />
                <span>کلمپ‌ها بسته‌اند</span>
              </label>
              <button
                onClick={() => {
                  setRunning(false);
                  setClampsClosed(true);
                }}
                className="ml-auto text-sm px-3 py-1 rounded bg-slate-100"
              >
                Stop & Clamp
              </button>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-slate-500">مرحله</div>
                  <div className="font-semibold">{step.titleFa}</div>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95"
                  >
                    <HiChevronRight /> 
                  </button>
                  <button
                    onClick={() =>
                      setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))
                    }
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95"
                  >
                    <HiChevronLeft /> 
                  </button>
                </div>
              </div>
              <div className="text-sm text-slate-700 mb-3">
                {step.detailsFa}
              </div>
              <div className="flex gap-2 flex-wrap">
                {STEPS.map((s, idx) => (
                  <button
                    key={s.key}
                    onClick={() => setStepIndex(idx)}
                    className={`px-3 py-1 rounded-full border text-sm ${
                      idx === stepIndex
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-slate-500">
              تذکر: این شبیه‌ساز برای آموزش طراحی شده — همیشه از پروتکل محل کار
              تبعیت کنید.
            </div>
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
