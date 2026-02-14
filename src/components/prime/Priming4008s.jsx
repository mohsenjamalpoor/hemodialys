import { useState } from "react";
import { motion } from "framer-motion";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import { 
  FaArrowLeft,
  FaPlay,
  FaPause,
  FaRedo,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTint,
  FaCog,
  FaSyringe,
  FaShieldAlt,
  FaImage,
  FaSyncAlt
} from "react-icons/fa";

// -------------------- Steps with Real Images --------------------
const STEPS = [
  {
    key: "prep",
    titleFa: "آماده‌سازی اولیه",
    hintEn: "Prepare machine and disposables",
    detailsFa: "دستگاه Fresenius 4008S را روشن کرده و تمام کلمپ‌ها را ببندید. ست خون و دیالایزر را آماده کنید.",
    highlights: ["machine", "clamps"],
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    backupImage: "https://cdn.pixabay.com/photo/2017/08/02/11/54/hemodialysis-2571536_1280.jpg",
    icon: <FaCog className="text-blue-500" />,
    color: "from-blue-500 to-cyan-500",
    timeEstimate: "2 دقیقه"
  },
  {
    key: "saline",
    titleFa: "نصب سالین",
    hintEn: "Connect normal saline bag",
    detailsFa: "کیسه نرمال سالین 1000ml را روی پایه آویزان کرده و لاین شریانی را به آن وصل کنید.",
    highlights: ["saline_bag", "arterial_line"],
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    backupImage: "https://cdn.pixabay.com/photo/2016/11/22/23/13/blood-1851250_1280.jpg",
    icon: <FaTint className="text-purple-500" />,
    color: "from-purple-500 to-pink-500",
    timeEstimate: "3 دقیقه"
  },
  {
    key: "primeArt",
    titleFa: "پرایم لاین شریانی",
    hintEn: "Prime arterial line",
    detailsFa: "کلمپ شریانی را باز کرده و پمپ خون را روی 100-150 mL/min تنظیم کنید تا لاین پر شود.",
    highlights: ["arterial_chamber", "blood_pump"],
    image: "https://images.unsplash.com/photo-1584467735871-8db9ac8c6d67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    backupImage: "https://cdn.pixabay.com/photo/2017/08/02/11/53/hemodialysis-2571535_1280.jpg",
    icon: <FaTint className="text-red-500" />,
    color: "from-red-500 to-orange-500",
    timeEstimate: "3 دقیقه"
  },
  {
    key: "primeDialyzer",
    titleFa: "پرایم دیالایزر",
    hintEn: "Prime dialyzer",
    detailsFa: "دیالایزر را به صورت عمودی نصب کنید. اجازه دهید مایع از ورودی پایین وارد و از خروجی بالا خارج شود.",
    highlights: ["dialyzer"],
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    backupImage: "https://cdn.pixabay.com/photo/2016/11/29/08/24/artificial-kidney-1868422_1280.jpg",
    icon: <FaSyringe className="text-cyan-500" />,
    color: "from-cyan-500 to-teal-500",
    timeEstimate: "4 دقیقه"
  },
  {
    key: "primeVen",
    titleFa: "پرایم لاین وریدی",
    hintEn: "Prime venous line",
    detailsFa: "محفظه وریدی را در جای خود قرار دهید. اجازه دهید مایع تا خط نشان‌گر پر شود.",
    highlights: ["venous_chamber", "venous_line"],
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    backupImage: "https://cdn.pixabay.com/photo/2016/11/29/08/24/blood-1868421_1280.jpg",
    icon: <FaTint className="text-green-500" />,
    color: "from-green-500 to-emerald-500",
    timeEstimate: "3 دقیقه"
  },
  {
    key: "recirc",
    titleFa: "سیرکولاسیون",
    hintEn: "Recirculation",
    detailsFa: "انتهای لاین وریدی را به کیسه سالین برگردانید و 3-5 دقیقه گردش دهید.",
    highlights: ["recirculation_line", "saline_bag"],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    backupImage: "https://cdn.pixabay.com/photo/2017/08/02/11/53/hemodialysis-2571535_1280.jpg",
    icon: <FaSyncAlt className="text-orange-500" />,
    color: "from-orange-500 to-amber-500",
    timeEstimate: "5 دقیقه"
  },
  {
    key: "ready",
    titleFa: "آماده اتصال",
    hintEn: "Ready for patient connection",
    detailsFa: "پمپ را متوقف کنید. تمام کلمپ‌ها را مطابق پروتکل ببندید. دستگاه برای اتصال به بیمار آماده است.",
    highlights: ["all_components"],
    image: "https://images.unsplash.com/photo-1586773860418-dc22f8b874bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    backupImage: "https://cdn.pixabay.com/photo/2017/08/02/11/53/medical-2571534_1280.jpg",
    icon: <FaShieldAlt className="text-emerald-500" />,
    color: "from-emerald-500 to-green-500",
    timeEstimate: "2 دقیقه"
  },
];

// -------------------- Image Display with Fallback --------------------
function StepImage({ step, running }) {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    }
  };
  
  return (
    <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden">
      <img
        src={imageError ? step.backupImage : step.image}
        alt={step.titleFa}
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      {running && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">جریان فعال</span>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 right-4 text-white">
        <div className="flex items-center gap-2">
          <FaImage />
          <span className="text-sm">Fresenius 4008S</span>
        </div>
      </div>
    </div>
  );
}

// -------------------- Circuit Diagram Component --------------------
function CircuitDiagram({ stepIndex, running }) {
  const currentStep = STEPS[stepIndex];
  const isHighlighted = (component) => currentStep.highlights.includes(component) || currentStep.highlights.includes("all_components");
  
  return (
    <div className="relative w-full h-96 md:h-120 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden p-6">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #4b5563 1px, transparent 1px),
                           linear-gradient(to bottom, #4b5563 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}></div>
      </div>
      
      {/* Saline Bag */}
      <motion.div 
        className={`absolute top-4 right-8 w-16 h-24 rounded-lg ${isHighlighted('saline_bag') ? 'bg-gradient-to-b from-blue-400 to-blue-600' : 'bg-gray-700'} border-2 ${isHighlighted('saline_bag') ? 'border-blue-400' : 'border-gray-600'} shadow-lg`}
        animate={running && isHighlighted('saline_bag') ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-gray-600"></div>
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold">
          NS
        </div>
      </motion.div>
      
      {/* Arterial Line */}
      <motion.div 
        className={`absolute top-32 right-24 w-40 h-1 ${isHighlighted('arterial_line') ? 'bg-gradient-to-r from-red-500 to-red-300' : 'bg-gray-600'}`}
        animate={running && isHighlighted('arterial_line') ? {
          background: ['linear-gradient(to right, #ef4444, #f87171)', 'linear-gradient(to right, #f87171, #ef4444)']
        } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      ></motion.div>
      
      {/* Arterial Chamber */}
      <div className={`absolute top-24 right-64 w-12 h-20 rounded-lg ${isHighlighted('arterial_chamber') ? 'bg-gradient-to-b from-red-300 to-red-500' : 'bg-gray-700'} border-2 ${isHighlighted('arterial_chamber') ? 'border-red-400' : 'border-gray-600'} shadow-lg`}>
        {running && isHighlighted('arterial_chamber') && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-red-400"
            animate={{ height: ['0%', '60%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
        )}
      </div>
      
      {/* Blood Pump */}
      <motion.div 
        className={`absolute top-20 right-80 w-20 h-20 rounded-full flex items-center justify-center ${isHighlighted('blood_pump') ? 'bg-gradient-to-br from-purple-600 to-purple-800' : 'bg-gray-800'} border-4 ${isHighlighted('blood_pump') ? 'border-purple-500' : 'border-gray-700'} shadow-xl`}
        animate={running && isHighlighted('blood_pump') ? { rotate: 360 } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="text-white text-sm font-bold">Pump</div>
      </motion.div>
      
      {/* Dialyzer */}
      <div className={`absolute top-16 left-64 w-32 h-40 rounded-lg ${isHighlighted('dialyzer') ? 'bg-gradient-to-b from-cyan-400 to-cyan-600' : 'bg-gray-700'} border-2 ${isHighlighted('dialyzer') ? 'border-cyan-400' : 'border-gray-600'} shadow-lg`}>
        {running && isHighlighted('dialyzer') && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-8 bg-white/30 rounded-full"
                style={{ left: `${20 + i * 20}%`, top: '20%' }}
                animate={{ y: [0, 40, 0] }}
                transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
          </>
        )}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold">
          Dialyzer
        </div>
      </div>
      
      {/* Venous Chamber */}
      <div className={`absolute top-32 left-32 w-12 h-20 rounded-lg ${isHighlighted('venous_chamber') ? 'bg-gradient-to-b from-green-300 to-green-500' : 'bg-gray-700'} border-2 ${isHighlighted('venous_chamber') ? 'border-green-400' : 'border-gray-600'} shadow-lg`}>
        {running && isHighlighted('venous_chamber') && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-green-400"
            animate={{ height: ['0%', '80%', '0%'] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          ></motion.div>
        )}
      </div>
      
      {/* Venous Line */}
      <motion.div 
        className={`absolute top-32 left-16 w-24 h-1 ${isHighlighted('venous_line') ? 'bg-gradient-to-r from-green-500 to-green-300' : 'bg-gray-600'}`}
        animate={running && isHighlighted('venous_line') ? {
          background: ['linear-gradient(to right, #10b981, #34d399)', 'linear-gradient(to right, #34d399, #10b981)']
        } : {}}
        transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
      ></motion.div>
      
      {/* Flow Animation */}
      {running && (
        <>
          <motion.div 
            className="absolute w-3 h-3 bg-blue-400 rounded-full"
            style={{ top: '40px', right: '60px' }}
            animate={{
              x: [-200, -400],
              y: [0, 100, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute w-3 h-3 bg-blue-400 rounded-full"
            style={{ top: '40px', right: '60px' }}
            animate={{
              x: [-200, -400],
              y: [0, 100, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
          />
        </>
      )}
      
      {/* Labels */}
      <div className="absolute top-4 left-4 text-white text-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>سالین</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>شریانی</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>وریدی</span>
        </div>
      </div>
    </div>
  );
}

// -------------------- Main Component --------------------
export default function Priming4008S() {
  const [running, setRunning] = useState(false);
  const [rate, setRate] = useState(100);
  const [stepIndex, setStepIndex] = useState(0);
  const [clampsClosed, setClampsClosed] = useState(true);
  const [alarmOn, setAlarmOn] = useState(false);
  const [fluidType, setFluidType] = useState("NS");
  const [showDetails, setShowDetails] = useState(true);

  const step = STEPS[stepIndex];

  const toggleRunning = () => {
    setRunning((r) => {
      if (!r) setAlarmOn(false);
      return !r;
    });
  };

  const resetPriming = () => {
    setRunning(false);
    setStepIndex(0);
    setRate(100);
    setClampsClosed(true);
    setAlarmOn(false);
    setFluidType("NS");
  };

  // تعریف انواع محلول‌های پرایم
  const fluidTypes = [
    { value: "NS", label: "نرمال سالین", color: "from-blue-500 to-cyan-500", activeColor: "from-blue-600 to-cyan-600" },
    { value: "FFP", label: "FFP", color: "from-purple-500 to-pink-500", activeColor: "from-purple-600 to-pink-600" },
    { value: "Alb", label: "آلبومین", color: "from-amber-500 to-orange-500", activeColor: "from-amber-600 to-orange-600" },
    { value: "PC", label: "پک‌سل", color: "from-red-500 to-rose-500", activeColor: "from-red-600 to-rose-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 -right-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <Link
                to="/hemo/hemodialysisPrime"
                className="flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-300 border border-blue-200 hover:border-blue-300 group"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">بازگشت</span>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  آموزش پرایم دستگاه همودیالیز Fresenius 4008S
                </h1>
                <p className="text-gray-600">
                  آموزش مرحله‌به‌مرحله پرایم کردن دستگاه با تصاویر واقعی
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <FaInfoCircle />
                <span>{showDetails ? 'مخفی کردن جزئیات' : 'نمایش جزئیات'}</span>
              </button>
              <button
                onClick={resetPriming}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
              >
                <FaRedo />
                <span>شروع مجدد</span>
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border ${running ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
              <div className={`text-sm mb-1 ${running ? 'text-green-600' : 'text-amber-600'}`}>
                وضعیت پمپ
              </div>
              <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
                {running ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    در حال کار ({rate} mL/min)
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    متوقف شده
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-600 mb-1">مرحله فعلی</div>
              <div className="text-lg font-bold text-gray-800">{stepIndex + 1} از {STEPS.length}</div>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <div className="text-sm text-emerald-600 mb-1">زمان تخمینی</div>
              <div className="text-lg font-bold text-gray-800">{step.timeEstimate}</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="text-sm text-purple-600 mb-1">کلمپ‌ها</div>
              <div className="text-lg font-bold text-gray-800">
                {clampsClosed ? 'بسته' : 'باز'}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Image and Diagram */}
          <div className="flex-1 space-y-6">
            {/* Step Image */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${step.color}`}>
                      {step.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{step.titleFa}</h2>
                      <p className="text-gray-600 text-sm">{step.hintEn}</p>
                    </div>
                  </div>
                  {alarmOn && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-600 rounded-full animate-pulse">
                      <FaExclamationTriangle />
                      <span className="font-medium">Alarm Active</span>
                    </div>
                  )}
                </div>
              </div>
              
              <StepImage 
                step={step} 
                running={running}
              />
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">📋 دستورالعمل مرحله:</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{step.detailsFa}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>تصویر واقعی دستگاه</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaInfoCircle />
                    <span>برای تصویر بزرگتر کلیک کنید</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Circuit Diagram */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 شماتیک مدار پرایم</h3>
              <CircuitDiagram stepIndex={stepIndex} running={running} />
              <div className="mt-4 text-sm text-gray-600">
                <p>رنگ‌های روشن نشان‌دهنده بخش‌های فعال در مرحله فعلی هستند.</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Controls */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-blue-100 space-y-6">
              {/* Pump Control */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">⏱️ کنترل پمپ خون</h3>
                <div className="space-y-4">
                  <button
                    onClick={toggleRunning}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
                      running
                        ? "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg"
                        : "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {running ? (
                        <>
                          <FaPause />
                          توقف پمپ
                        </>
                      ) : (
                        <>
                          <FaPlay />
                          شروع پمپ
                        </>
                      )}
                    </div>
                  </button>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      سرعت جریان: <span className="font-bold text-blue-600">{rate} mL/min</span>
                    </label>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="20"
                        max="500"
                        step="5"
                        value={rate}
                        onChange={(e) => setRate(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-cyan-500 [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setRate(r => Math.max(20, r - 5))}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors active:scale-95"
                        >
                          کاهش ۵
                        </button>
                        <button
                          onClick={() => setRate(r => Math.min(500, r + 5))}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors active:scale-95"
                        >
                          افزایش ۵
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prime Settings */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">⚙️ تنظیمات پرایم</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع محلول پرایم
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {fluidTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setFluidType(type.value)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all bg-gradient-to-r ${
                            fluidType === type.value ? type.activeColor : type.color
                          } ${
                            fluidType === type.value
                              ? 'text-white shadow-lg ring-2 ring-white/50'
                              : 'text-white/90 hover:text-white hover:shadow-md'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-300">
                    <span className="font-medium text-gray-700">وضعیت کلمپ‌ها</span>
                    <button
                      onClick={() => setClampsClosed(!clampsClosed)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        clampsClosed
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {clampsClosed ? '🔒 بسته' : '🔓 باز'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Steps Navigation */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">📋 مراحل پرایم</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {STEPS.map((s, idx) => (
                    <motion.button
                      key={s.key}
                      onClick={() => setStepIndex(idx)}
                      className={`w-full p-4 rounded-xl text-right transition-all ${
                        idx === stepIndex
                          ? `bg-gradient-to-r ${s.color} text-white shadow-lg transform scale-105`
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          idx === stepIndex
                            ? 'bg-white/20'
                            : 'bg-gray-300 text-gray-700'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 mr-3">
                          <div className={`font-medium ${idx === stepIndex ? 'text-white' : 'text-gray-800'}`}>
                            {s.titleFa}
                          </div>
                          <div className={`text-sm ${idx === stepIndex ? 'text-blue-100' : 'text-gray-500'}`}>
                            {s.timeEstimate} • {s.hintEn}
                          </div>
                        </div>
                        <div className={`${idx === stepIndex ? 'text-white' : 'text-gray-400'}`}>
                          {s.icon}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Step Controls */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStepIndex(i => Math.max(0, i - 1))}
                    disabled={stepIndex === 0}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
                      stepIndex === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <HiChevronRight />
                    مرحله قبل
                  </button>
                  <button
                    onClick={() => setStepIndex(i => Math.min(STEPS.length - 1, i + 1))}
                    disabled={stepIndex === STEPS.length - 1}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
                      stepIndex === STEPS.length - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    مرحله بعد
                    <HiChevronLeft />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Notes */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <FaExclamationTriangle className="text-red-600" />
              </div>
              <h4 className="text-lg font-bold text-red-800">⚠️ نکات ایمنی</h4>
            </div>
            <ul className="space-y-3 text-red-700 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                <span>قبل از شروع، تمام کلمپ‌ها را بررسی کنید</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                <span>از نبود حباب هوا در سیستم اطمینان حاصل کنید</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                <span>دستگاه را تنها زمانی روشن کنید که آماده است</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaCog className="text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-blue-800">🎯 پروتکل استاندارد</h4>
            </div>
            <p className="text-blue-700 text-sm leading-relaxed">
              این آموزش بر اساس آخرین پروتکل‌های Fresenius برای دستگاه 4008S تهیه شده است. تمام مراحل مطابق با دستورالعمل‌های شرکت سازنده و استانداردهای بین‌المللی هستند.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <FaShieldAlt className="text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-green-800">⏱️ زمان‌بندی</h4>
            </div>
            <div className="text-green-700 text-sm space-y-2">
              <div className="flex justify-between">
                <span>کل زمان پرایم:</span>
                <span className="font-bold">۲۲-۲۰ دقیقه</span>
              </div>
              <div className="flex justify-between">
                <span>سیرکولاسیون:</span>
                <span className="font-bold">۵-۳ دقیقه</span>
              </div>
              <div className="flex justify-between">
                <span>بررسی نهایی:</span>
                <span className="font-bold">۲ دقیقه</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}