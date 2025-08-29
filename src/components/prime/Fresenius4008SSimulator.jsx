// src/components/Fresenius4008SFullSimulator.jsx
// شبیه‌ساز پرایمینگ دستگاه Fresenius 4008S
// فقط برای تمرین و آموزش — مناسب تصمیم‌گیری بالینی نیست.

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

/* ---------- توابع کمکی ---------- */
const nowISO = () => new Date().toISOString();
const saveToLS = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};
const loadFromLS = (k, fallback) => {
  try {
    const s = localStorage.getItem(k);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
};

/* ---------- کامپوننت اصلی ---------- */
export default function Fresenius4008SFullSimulator() {
  // وضعیت دستگاه
  const [isRunning, setIsRunning] = useState(false);
  const [isPriming, setIsPriming] = useState(false);
  const [statusMsg, setStatusMsg] = useState("آماده. چک‌لیست پیش از پرایم را انجام دهید.");
  const [progress, setProgress] = useState(0);

  // کلمپ‌ها: true=بسته، false=باز
  const [clamps, setClamps] = useState(
    loadFromLS("f4_clamps", { arterial: true, venous: true, dialyzer: true })
  );

  // هشدارها
  const [alarms, setAlarms] = useState([]);

  // پرچم‌های ایمنی
  const [airDetectorOn, setAirDetectorOn] = useState(loadFromLS("f4_airDetector", true));
  const [pressureOK, setPressureOK] = useState(true);

  // تنظیمات (ذخیره‌شونده)
  const defaultSettings = {
    pumpSpeed: 200,       // ml/min
    dialysateFlow: 500,   // ml/min
    primeVolume: 500,     // ml
    temperature: 36.5,    // °C
    conductivity: 14.0,   // mS/cm
    alarmsEnabled: true,
  };
  const [settings, setSettings] = useState(loadFromLS("f4_settings", defaultSettings));
  useEffect(() => saveToLS("f4_settings", settings), [settings]);

  // پریست‌ها
  const presets = {
    "پدیاتریک": { pumpSpeed: 150, dialysateFlow: 400, primeVolume: 300, temperature: 36.0, conductivity: 13.5, alarmsEnabled: true },
    "بزرگسال":  { pumpSpeed: 250, dialysateFlow: 500, primeVolume: 600, temperature: 36.5, conductivity: 14.0, alarmsEnabled: true },
  };

  // کنترل‌های انیمیشن
  const pumpAnim = useAnimation();
  const dialyzerAnim = useAnimation();

  // وب‌آدیو برای بوق هشدار
  const audioCtxRef = useRef(null);
  useEffect(() => {
    try {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch {}
    return () => { try { audioCtxRef.current?.close(); } catch {} };
  }, []);

  function beep(freq = 700, dur = 240, vol = 0.14) {
    try {
      const ctx = audioCtxRef.current; if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = vol;
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => { try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch {} }, dur);
    } catch {}
  }

  // لاگ اپراتور
  const logRef = useRef(loadFromLS("f4_logs", [])); // [{time,text}]
  const pushLog = (text) => {
    const entry = { time: nowISO(), text };
    logRef.current = [entry, ...logRef.current].slice(0, 1000);
    saveToLS("f4_logs", logRef.current);
  };

  // افزودن هشدار (بدون تکرار)
  function pushAlarm(text) {
    if (!settings.alarmsEnabled) return;
    setAlarms(prev => {
      if (prev.includes(text)) return prev;
      beep(850, 360, 0.18);
      pushLog("ALARM: " + text);
      return [text, ...prev].slice(0, 20);
    });
  }
  function clearAlarms() { setAlarms([]); pushLog("هشدارها پاک شد"); }

  // تغییر وضعیت کلمپ
  function toggleClamp(which) {
    setClamps(prev => {
      const next = { ...prev, [which]: !prev[which] };
      pushLog(`کلمپ ${which} -> ${next[which] ? "بسته" : "باز"}`);
      if (!airDetectorOn && !next[which]) pushAlarm("باز کردن کلمپ درحالی‌که آشکارساز هوا خاموش است");
      saveToLS("f4_clamps", next);
      return next;
    });
  }

  // محاسبه مدت شستشو بر اساس تنظیمات
  function computeFlushDurationMs() {
    const flow = Math.max(50, Math.min(500, settings.pumpSpeed));
    const volume = Math.max(50, Math.min(2000, settings.primeVolume));
    const physicalMs = (volume / flow) * 60 * 1000;
    const compressed = Math.max(600, Math.min(6000, Math.round(physicalMs / 50))); // فشرده‌سازی برای UI
    return compressed;
  }

  // تاخیر
  const wait = (ms) => new Promise(res => setTimeout(res, ms));

  // اجرای انیمیشن پمپ/دیالایزر و افزایش تدریجی پیشرفت
  async function runPumpVisual(durationMs) {
    pumpAnim.start({ rotate: [0, 10, -10, 0], transition: { duration: 0.8, repeat: Infinity } });
    dialyzerAnim.start({ scale: [1, 1.02, 1, 1.02], transition: { duration: 1.2, repeat: Infinity } });
    const steps = Math.max(3, Math.floor(durationMs / 200));
    for (let i = 0; i < steps; i++) {
      setProgress(prev => Math.min(99, prev + Math.round((100 - prev) / (steps - i))));
      await wait(durationMs / steps);
      if (!isPriming) break;
    }
    pumpAnim.stop(); dialyzerAnim.stop();
  }

  // اجرای گام‌های هدایت‌شده‌ی پرایم
  async function startPrimingSequence() {
    clearAlarms();
    pushLog("پرایم آغاز شد");
    if (!settings) { setStatusMsg("تنظیمات در دسترس نیست"); return; }

    if (!loadFromLS("f4_salined_connected", true)) {
      const cont = window.confirm("به‌نظر می‌رسد سالین متصل نیست. ادامه می‌دهید؟");
      if (!cont) {
        pushAlarm("سالین متصل نیست");
        setStatusMsg("خطا: لطفاً سالین را متصل کنید.");
        return;
      }
    }

    // چک‌های سریع ایمنی
    if (settings.temperature < 34 || settings.temperature > 38.5) pushAlarm("دما خارج از محدوده‌ی رایج");
    if (settings.conductivity < 12 || settings.conductivity > 16) pushAlarm("هدایت الکتریکی خارج از محدوده‌ی مورد انتظار");

    setIsPriming(true); setIsRunning(true);
    setStatusMsg("گام ۱: کیسه سالین و اتصالات را تأیید کنید.");
    setProgress(2); await wait(900);

    // گام ۲: باز کردن کلمپ شریانی
    setStatusMsg("گام ۲: کلمپ شریانی را باز کنید.");
    let waited = 0;
    while (clamps.arterial) {
      await wait(400);
      waited += 400;
      if (waited > 6000) {
        pushAlarm("کلمپ شریانی هنوز بسته است — برای ادامه باز کنید.");
        setStatusMsg("در انتظار: لطفاً کلمپ شریانی را باز کنید.");
        waited = 0;
      }
      if (!isPriming) { pushLog("پرایم در انتظار کلمپ شریانی لغو شد"); return; }
    }
    setProgress(25);
    setStatusMsg("کلمپ شریانی باز شد. شستشوی پمپ آغاز می‌شود...");
    await wait(400);

    // گام ۳: شستشوی مسیر شریانی
    setStatusMsg("گام ۳: شستشوی مسیر شریانی به سمت دیالایزر.");
    const durA = computeFlushDurationMs();
    await runPumpVisual(durA);
    setProgress(55);

    // گام ۴: باز کردن کلمپ وریدی
    setStatusMsg("گام ۴: کلمپ وریدی را باز کنید تا دیالایزر شسته شود.");
    waited = 0;
    while (clamps.venous) {
      await wait(400);
      waited += 400;
      if (waited > 6000) {
        pushAlarm("کلمپ وریدی هنوز بسته است — برای ادامه باز کنید.");
        setStatusMsg("در انتظار: لطفاً کلمپ وریدی را باز کنید.");
        waited = 0;
      }
      if (!isPriming) { pushLog("پرایم در انتظار کلمپ وریدی لغو شد"); return; }
    }
    setProgress(80);
    setStatusMsg("کلمپ وریدی باز شد. شستشوی دیالایزر و مسیر وریدی...");
    const durV = Math.round(durA * 0.7);
    await runPumpVisual(durV);

    // گام ۵: پایان
    setStatusMsg("گام ۵: در صورت نیاز کلمپ‌ها را ببندید و بررسی نهایی. پرایم کامل شد.");
    setProgress(100);
    pushLog("پرایم با موفقیت پایان یافت");
    setIsPriming(false); setIsRunning(false);
    beep(900, 300, 0.18);
  }

  function abortPriming() {
    setIsPriming(false);
    setIsRunning(false);
    pushAlarm("پرایم توسط اپراتور لغو شد");
    setStatusMsg("پرایم لغو شد.");
    pushLog("پرایم لغو شد.");
  }

  // اکشن‌های سریع
  function connectSaline() {
    saveToLS("f4_salined_connected", true);
    pushLog("سالین متصل شد (از UI)");
    setStatusMsg("سالین متصل شد.");
  }
  function applyPreset(name) {
    if (!presets[name]) return;
    setSettings(presets[name]);
    pushLog(`پریست اعمال شد: ${name}`);
    setStatusMsg(`پریست «${name}» اعمال شد.`);
  }
  function saveSettingsNow() { saveToLS("f4_settings", settings); pushLog("تنظیمات ذخیره شد"); setStatusMsg("تنظیمات ذخیره شد."); }

  // هندلر کپی لاگ‌ها (به کودک پاس می‌دهیم)
  function handleCopyLogs() {
    try {
      navigator.clipboard?.writeText(JSON.stringify(logRef.current.slice(0, 100), null, 2));
      pushLog("لاگ‌ها در کلیپ‌برد کپی شد");
    } catch {}
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">شبیه‌ساز پرایمینگ — Fresenius 4008S</h1>
            <div className="text-xs text-slate-400">صرفاً برای آموزش — استفاده‌ی بالینی ندارد</div>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => { setSettings(defaultSettings); pushLog("بازگردانی به پیش‌فرض"); setStatusMsg("تنظیمات پیش‌فرض اعمال شد."); }}
              className="px-3 py-1 bg-slate-700 rounded text-sm"
            >
              بازنشانی تنظیمات
            </button>
            <button
              onClick={() => { saveToLS("f4_logs", logRef.current); alert("لاگ‌ها در localStorage ذخیره شد"); }}
              className="px-3 py-1 bg-slate-700 rounded text-sm"
            >
              ذخیره لاگ‌ها
            </button>
          </div>
        </header>

        <main className="grid grid-cols-12 gap-6">
          {/* سمت چپ: پنل دستگاه */}
          <section className="col-span-7 bg-slate-800 rounded-xl p-4 shadow">
            <DevicePanel
              isRunning={isRunning}
              isPriming={isPriming}
              statusMsg={statusMsg}
              progress={progress}
              pumpAnim={pumpAnim}
              dialyzerAnim={dialyzerAnim}
              clamps={clamps}
              toggleClamp={toggleClamp}
              settings={settings}
              airDetectorOn={airDetectorOn}
              setAirDetectorOn={setAirDetectorOn}
              pressureOK={pressureOK}
              setPressureOK={setPressureOK}
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={startPrimingSequence}
                disabled={isPriming}
                className="px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-700 disabled:opacity-60"
              >
                شروع پرایم
              </button>
              <button
                onClick={abortPriming}
                disabled={!isPriming}
                className="px-4 py-2 bg-rose-600 rounded hover:bg-rose-700 disabled:opacity-60"
              >
                لغو
              </button>
              <button
                onClick={connectSaline}
                className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
              >
                اتصال سالین
              </button>
              <button
                onClick={() => { setIsPriming(false); setIsRunning(false); setProgress(0); setStatusMsg("ریست توسط اپراتور"); pushLog("ریست شبیه‌ساز توسط اپراتور"); }}
                className="px-4 py-2 bg-slate-600 rounded"
              >
                ریست
              </button>
            </div>
          </section>

          {/* سمت راست: تنظیمات، هشدارها، لاگ‌ها */}
          <aside className="col-span-5 flex flex-col gap-4">
            <SettingsPanel
              settings={settings}
              setSettings={setSettings}
              presets={presets}
              applyPreset={applyPreset}
              saveSettingsNow={saveSettingsNow}
            />
            <AlarmsPanel alarms={alarms} clearAlarms={clearAlarms} />
            <LogsPanel logRef={logRef} onCopy={handleCopyLogs} />
          </aside>
        </main>
      </div>
    </div>
  );
}

/* ---------- زیرکامپوننت‌ها ---------- */

function DevicePanel({
  isRunning,
  isPriming,
  statusMsg,
  progress,
  pumpAnim,
  dialyzerAnim,
  clamps,
  toggleClamp,
  settings,
  airDetectorOn,
  setAirDetectorOn,
  pressureOK,
  setPressureOK,
}) {
  return (
    <div>
      <div className="bg-black/30 rounded p-3 flex justify-between items-start">
        <div>
          <div className="text-xs text-slate-400">وضعیت</div>
          <div className="text-lg">{statusMsg}</div>
          <div className="text-xs text-slate-400 mt-1">
            پمپ: {settings.pumpSpeed} ml/min • جریان دیالیزیت: {settings.dialysateFlow} ml/min
          </div>
        </div>
        <div className="text-right">
          <div className={`px-2 py-1 rounded ${isRunning ? "bg-green-600" : "bg-slate-700"}`}>
            {isRunning ? "در حال اجرا" : "متوقف"}
          </div>
          <div className="text-xs text-slate-400 mt-2">پرایم: {isPriming ? "فعال" : "غیرفعال"}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-3">
        {/* نمای گرافیکی */}
        <div className="col-span-8 bg-slate-700 rounded p-4">
          <SVGWorkflow pumpAnim={pumpAnim} dialyzerAnim={dialyzerAnim} clamps={clamps} toggleClamp={toggleClamp} settings={settings} />
        </div>

        {/* کلمپ‌ها و نمایش‌های سریع */}
        <div className="col-span-4 flex flex-col gap-3">
          <div className="bg-slate-700 p-3 rounded">
            <div className="text-sm font-semibold">کلمپ‌ها</div>
            <div className="mt-2 flex flex-col gap-2">
              <ClampRow name="arterial" label="شریانی" stateClosed={clamps.arterial} onToggle={() => toggleClamp("arterial")} />
              <ClampRow name="venous" label="وریدی" stateClosed={clamps.venous} onToggle={() => toggleClamp("venous")} />
              <ClampRow name="dialyzer" label="دیالایزر" stateClosed={clamps.dialyzer} onToggle={() => toggleClamp("dialyzer")} />
            </div>
          </div>

          <div className="bg-slate-700 p-3 rounded">
            <div className="text-sm font-semibold">خوانش‌های لحظه‌ای (شبیه‌سازی)</div>
            <div className="mt-2 text-sm text-slate-300">فشار شریانی: {Math.round(120 - (settings.pumpSpeed / 5))} mmHg</div>
            <div className="text-sm text-slate-300">فشار وریدی: {Math.round(80 - (settings.dialysateFlow / 10))} mmHg</div>
            <div className="text-sm text-slate-300">TMP: {Math.round(settings.primeVolume / 5)} mmHg</div>
          </div>
        </div>
      </div>

      {/* پیشرفت */}
      <div className="mt-3 bg-slate-700 p-3 rounded">
        <div className="text-xs text-slate-400">پیشرفت پرایم</div>
        <div className="mt-2 w-full bg-slate-600 h-3 rounded">
          <div className="h-3 rounded bg-emerald-400" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs mt-1">{progress}%</div>
      </div>

      {/* کنترل‌های ایمنی */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="bg-slate-700 p-3 rounded">
          <div className="text-xs text-slate-400">آشکارساز هوا</div>
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" checked={airDetectorOn} onChange={() => setAirDetectorOn(v => !v)} />
            <span className="text-sm">{airDetectorOn ? "روشن" : "خاموش"}</span>
          </label>
        </div>

        <div className="bg-slate-700 p-3 rounded">
          <div className="text-xs text-slate-400">فشار</div>
          <div className="text-sm mt-2">{pressureOK ? "نرمال" : "نیاز به بررسی"}</div>
          <button onClick={() => setPressureOK(v => !v)} className="mt-2 px-2 py-1 bg-slate-600 rounded text-xs">تغییر وضعیت</button>
        </div>

        <div className="bg-slate-700 p-3 rounded">
          <div className="text-xs text-slate-400">یادآوری</div>
          <div className="text-xs text-slate-300 mt-2">این ابزار صرفاً برای تمرین است.</div>
        </div>
      </div>
    </div>
  );
}

function SettingsPanel({ settings, setSettings, presets, applyPreset, saveSettingsNow }) {
  // به‌روزرسانی ایمن (immutable)
  const update = (patch) => setSettings(s => ({ ...s, ...patch }));
  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <h3 className="font-semibold">تنظیمات دستگاه</h3>
      <div className="mt-3 space-y-3">
        <RangeField label="سرعت پمپ خون (ml/min)" min={50} max={500} value={settings.pumpSpeed} onChange={(v) => update({ pumpSpeed: v })} />
        <NumberField label="جریان دیالیزیت (ml/min)" value={settings.dialysateFlow} onChange={(v) => update({ dialysateFlow: v })} />
        <NumberField label="حجم پرایم (ml)" value={settings.primeVolume} onChange={(v) => update({ primeVolume: v })} />
        <NumberField label="دما (°C)" step={0.1} value={settings.temperature} onChange={(v) => update({ temperature: v })} />
        <NumberField label="هدایت الکتریکی (mS/cm)" step={0.1} value={settings.conductivity} onChange={(v) => update({ conductivity: v })} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={settings.alarmsEnabled} onChange={(e) => update({ alarmsEnabled: e.target.checked })} />
          فعال‌سازی هشدارها
        </label>

        <div className="flex flex-wrap gap-2">
          {Object.keys(presets).map(name => (
            <button key={name} onClick={() => applyPreset(name)} className="px-3 py-1 bg-indigo-600 rounded text-sm">
              پریست {name}
            </button>
          ))}
          <button onClick={saveSettingsNow} className="px-3 py-1 bg-green-600 rounded text-sm">ذخیره</button>
        </div>
      </div>
    </div>
  );
}

function AlarmsPanel({ alarms, clearAlarms }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">هشدارها</h3>
        <button onClick={clearAlarms} className="text-xs underline">پاک‌سازی</button>
      </div>
      <div className="mt-2 min-h-[80px] text-sm">
        {alarms.length === 0
          ? <div className="text-slate-400">هشداری فعال نیست</div>
          : alarms.map((a, i) => <div key={i} className="text-rose-300">• {a}</div>)
        }
      </div>
    </div>
  );
}

function LogsPanel({ logRef, onCopy }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 flex-1 flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">لاگ اپراتور</h3>
        <div className="text-xs text-slate-400">آخرین رویدادها</div>
      </div>
      <div className="mt-2 overflow-auto flex-1">
        <ul className="text-xs">
          {logRef.current.length === 0
            ? <li className="text-slate-400">لاگی ثبت نشده است</li>
            : logRef.current.slice(0, 200).map((l, i) => (
                <li key={i} className="py-1 border-b border-slate-700">
                  <div className="text-[11px] text-slate-400">{new Date(l.time).toLocaleString()}</div>
                  <div className="text-sm">{l.text}</div>
                </li>
              ))
          }
        </ul>
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={onCopy} className="flex-1 px-3 py-2 bg-slate-700 rounded">کپی</button>
        <button onClick={() => downloadLogsCSV(logRef.current)} className="flex-1 px-3 py-2 bg-indigo-700 rounded">دانلود CSV</button>
      </div>
    </div>
  );
}

/* ---------- اجزای کوچک ---------- */

function RangeField({ label, min = 0, max = 500, value, onChange }) {
  return (
    <div>
      <div className="text-sm text-slate-300">{label}</div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
      <div className="text-xs mt-1">{value}</div>
    </div>
  );
}

function NumberField({ label, value, onChange, step = 1 }) {
  return (
    <div>
      <div className="text-sm text-slate-300">{label}</div>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full p-1 rounded bg-slate-900 text-slate-100"
      />
    </div>
  );
}

function SVGWorkflow({ pumpAnim, dialyzerAnim, clamps, toggleClamp, settings }) {
  return (
    <div className="w-full h-64 relative">
      <svg viewBox="0 0 720 260" className="w-full h-full">
        {/* کیسه سالین */}
        <rect x="20" y="20" width="80" height="120" rx="8" fill="#f8fafc" stroke="#cbd5e1" />
        <text x="60" y="80" textAnchor="middle" fontSize="12" fill="#0f172a">سالین</text>

        {/* مسیر شریانی */}
        <path d="M100 80 C180 80, 240 40, 320 40 L420 40" stroke="#ef4444" strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* کلمپ شریانی */}
        <g className="cursor-pointer" onClick={() => toggleClamp("arterial")}>
          <rect x="300" y="28" width="28" height="16" rx="3" fill={clamps.arterial ? "#0f172a" : "#10b981"} stroke="#000" />
          <text x="314" y="40" fontSize="8" fill="#fff" textAnchor="middle">{clamps.arterial ? "بسته" : "باز"}</text>
        </g>

        {/* پمپ (انیمیت) */}
        <g transform="translate(460,20)">
          <motion.g animate={pumpAnim}>
            <circle cx="0" cy="20" r="20" fill="#0b1220" stroke="#94a3b8" />
            <text x="0" y="46" fontSize="10" textAnchor="middle" fill="#e2e8f0">پمپ</text>
          </motion.g>
        </g>

        {/* دیالایزر */}
        <g transform="translate(520,0)">
          <motion.rect animate={dialyzerAnim} x="0" y="18" width="80" height="70" rx="10" fill="#f8fafc" stroke="#94a3b8" />
          <text x="40" y="60" fontSize="10" textAnchor="middle" fill="#0f172a">دیالایزر</text>
        </g>

        {/* مسیر وریدی */}
        <path d="M600 70 L680 70 C700 70,700 170,680 170 L420 170" stroke="#3b82f6" strokeWidth="8" fill="none" strokeLinecap="round" />
        <g className="cursor-pointer" onClick={() => toggleClamp("venous")}>
          <rect x="660" y="58" width="28" height="16" rx="3" fill={clamps.venous ? "#0f172a" : "#10b981"} stroke="#000" />
          <text x="674" y="70" fontSize="8" fill="#fff" textAnchor="middle">{clamps.venous ? "بسته" : "باز"}</text>
        </g>

        {/* بازگشت به بیمار (نمادین) */}
        <circle cx="220" cy="170" r="8" fill="#ef4444" />

        {/* تلماتری */}
        <text x="20" y="170" fontSize="12" fill="#e2e8f0">دما: {settings.temperature}°C</text>
        <text x="20" y="188" fontSize="12" fill="#e2e8f0">هدایت: {settings.conductivity} mS/cm</text>
      </svg>
    </div>
  );
}

function ClampRow({ name, label, stateClosed, onToggle }) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm">{label}</div>
      <div className="flex items-center gap-2">
        <div className="text-xs text-slate-400">{stateClosed ? "بسته" : "باز"}</div>
        <button
          onClick={onToggle}
          className={`px-2 py-1 rounded ${stateClosed ? "bg-rose-600" : "bg-emerald-600"} text-xs`}
        >
          {stateClosed ? "باز کردن" : "بستن"}
        </button>
      </div>
    </div>
  );
}

/* ---------- دانلود CSV ---------- */
function downloadLogsCSV(rows) {
  const safe = (s) => String(s ?? "").replace(/"/g, '""');
  const lines = rows.map(r => `"${safe(r.time)}","${safe(r.text)}"`);
  const csv = "time,message\n" + lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fresenius4008s_logs_${nowISO().slice(0,19)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
