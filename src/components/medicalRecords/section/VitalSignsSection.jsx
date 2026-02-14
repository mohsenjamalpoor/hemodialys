import React, { useState, useMemo } from "react";
import {
  FiActivity,
  FiHeart,
  FiThermometer,
  FiTrendingUp,
  FiWind,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiInfo,
  FiFilter,
  FiSearch,
  FiEye,
  FiEyeOff,
  FiUser,
  FiCloud,
  FiBarChart2,
  FiTrendingUp as FiTrendingUpIcon,
  FiEye as FiEyeIcon,
  FiCheckSquare,
  FiSquare,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar,

} from "recharts";
import { convertToPersianDate } from "../../../utils/convertToPersianDate";

// تابع تبدیل تاریخ کوتاه برای نمودار
const convertToShortPersianDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const options = {
    month: "short",
    day: "numeric",
    calendar: "persian",
    numberingSystem: "arab",
  };

  return new Intl.DateTimeFormat("fa-IR", options).format(date);
};

// تابع تبدیل زمان به فارسی
const convertToPersianTime = (timeString) => {
  if (!timeString) return "";

  const [hours, minutes] = timeString.split(":");
  const persianHours = String(hours).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const persianMinutes = String(minutes).replace(
    /[0-9]/g,
    (d) => "۰۱۲۳۴۵۶۷۸۹"[d],
  );

  return `${persianHours}:${persianMinutes}`;
};

// تنظیمات هر علامت حیاتی برای نمایش در نمودار
const vitalSignsConfig = {
  systolic: {
    label: "فشار سیستولیک",
    unit: "mmHg",
    color: "#ef4444",
    icon: FiTrendingUp,
    minValue: 80,
    maxValue: 200,
    defaultChecked: true,
  },
  diastolic: {
    label: "فشار دیاستولیک",
    unit: "mmHg",
    color: "#f97316",
    icon: FiTrendingUp,
    minValue: 40,
    maxValue: 120,
    defaultChecked: true,
  },
  heartRate: {
    label: "ضربان قلب",
    unit: "bpm",
    color: "#3b82f6",
    icon: FiHeart,
    minValue: 40,
    maxValue: 140,
    defaultChecked: true,
  },
  respiratoryRate: {
    label: "تعداد تنفس",
    unit: "breaths/min",
    color: "#06b6d4",
    icon: FiCloud,
    minValue: 8,
    maxValue: 30,
    defaultChecked: true,
  },
  temperature: {
    label: "دمای بدن",
    unit: "°C",
    color: "#f59e0b",
    icon: FiThermometer,
    minValue: 35,
    maxValue: 40,
    defaultChecked: true,
  },
  oxygenSaturation: {
    label: "اکسیژن خون",
    unit: "%",
    color: "#10b981",
    icon: FiWind,
    minValue: 85,
    maxValue: 100,
    defaultChecked: true,
  },
};

const VitalSignsSection = ({
  vitalSigns = [],
  onAdd,
  onEdit,
  onRemove,
  showAddButton = true,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedVital, setSelectedVital] = useState("all");
  const [timeRange, setTimeRange] = useState("7days");
  const [expandedView, setExpandedView] = useState(false);
  const [showAllVitals, setShowAllVitals] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [chartType, setChartType] = useState("composed");
  const [selectedSigns, setSelectedSigns] = useState({
    systolic: true,
    diastolic: true,
    heartRate: true,
    respiratoryRate: true,
    temperature: true,
    oxygenSaturation: true,
  });
  const [showSignsSelector, setShowSignsSelector] = useState(false);

  // تنظیم تاریخ و زمان فعلی به فارسی
  const getCurrentPersianDate = () => {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      calendar: "persian",
      numberingSystem: "arab",
    };
    return new Intl.DateTimeFormat("fa-IR", options).format(now);
  };

  const getCurrentPersianTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    date: getCurrentPersianDate(),
    time: getCurrentPersianTime(),
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    respiratoryRate: "",
    temperature: "",
    oxygenSaturation: "",
    painScale: "",
    weight: "",
    height: "",
    notes: "",
    recordedBy: localStorage.getItem("doctorName") || "دکتر",
    status: "نرمال",
  });

  const safeVitals = Array.isArray(vitalSigns) ? vitalSigns : [];

  // فیلتر کردن علائم حیاتی
  const filteredVitals = safeVitals.filter((vital) => {
    const matchesFilter =
      activeFilter === "all" || vital.status === activeFilter;
    const matchesSearch =
      searchTerm === "" ||
      vital.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vital.recordedBy?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // نمایش 2 آیتم اول
  const initialVitals = filteredVitals.slice(0, 2);
  const displayedVitals = showAllVitals ? filteredVitals : initialVitals;

  // آمار علائم حیاتی
  const stats = useMemo(() => {
    if (safeVitals.length === 0) return null;

    const lastVital = safeVitals[safeVitals.length - 1];

    // بررسی وضعیت فشار خون
    let bpStatus = "نرمال";
    if (lastVital.bloodPressureSystolic && lastVital.bloodPressureDiastolic) {
      const systolic = parseInt(lastVital.bloodPressureSystolic);
      const diastolic = parseInt(lastVital.bloodPressureDiastolic);
      if (systolic > 140 || diastolic > 90) bpStatus = "بالا";
      else if (systolic < 90 || diastolic < 60) bpStatus = "پایین";
    }

    // بررسی ضربان قلب
    let hrStatus = "نرمال";
    if (lastVital.heartRate) {
      const hr = parseInt(lastVital.heartRate);
      if (hr > 100) hrStatus = "بالا";
      else if (hr < 60) hrStatus = "پایین";
    }

    // بررسی تعداد تنفس
    let rrStatus = "نرمال";
    if (lastVital.respiratoryRate) {
      const rr = parseInt(lastVital.respiratoryRate);
      if (rr > 20) rrStatus = "بالا";
      else if (rr < 12) rrStatus = "پایین";
    }

    // بررسی دما
    let tempStatus = "نرمال";
    if (lastVital.temperature) {
      const temp = parseFloat(lastVital.temperature);
      if (temp > 37.5) tempStatus = "بالا";
      else if (temp < 36.0) tempStatus = "پایین";
    }

    // بررسی اکسیژن خون
    let spo2Status = "نرمال";
    if (lastVital.oxygenSaturation) {
      const spo2 = parseInt(lastVital.oxygenSaturation);
      if (spo2 < 95) spo2Status = "پایین";
    }

    return {
      total: safeVitals.length,
      lastVital: lastVital,
      bpStatus,
      hrStatus,
      rrStatus,
      tempStatus,
      spo2Status,
      abnormal: safeVitals.filter((v) => v.status === "غیرنرمال").length,
      normal: safeVitals.filter((v) => v.status === "نرمال").length,
      critical: safeVitals.filter((v) => v.status === "بحرانی").length,
    };
  }, [safeVitals]);

  // ایجاد داده‌های نمودار از داده‌های واقعی
  const chartData = useMemo(() => {
    if (safeVitals.length === 0) return [];

    // گرفتن ثبت‌ها برای نمایش در نمودار بر اساس بازه زمانی
    let recentVitals;
    const now = new Date();

    switch (timeRange) {
      case "14days":
        const fourteenDaysAgo = new Date(now);
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        recentVitals = safeVitals.filter(
          (v) => new Date(v.timestamp || v.date) >= fourteenDaysAgo,
        );
        break;
      case "30days":
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        recentVitals = safeVitals.filter(
          (v) => new Date(v.timestamp || v.date) >= thirtyDaysAgo,
        );
        break;
      case "7days":
      default:
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        recentVitals = safeVitals.filter(
          (v) => new Date(v.timestamp || v.date) >= sevenDaysAgo,
        );
    }

    // اگر تعداد داده‌ها زیاد است، نمونه‌گیری کنیم
    if (recentVitals.length > 20) {
      const step = Math.ceil(recentVitals.length / 20);
      recentVitals = recentVitals.filter((_, index) => index % step === 0);
    }

    return recentVitals
      .map((vital) => {
        const date = new Date(vital.timestamp || vital.date);
        const dateLabel = convertToShortPersianDate(
          vital.timestamp || vital.date,
        );
        const timeLabel = convertToPersianTime(vital.time);

        return {
          id: vital.id,
          date: dateLabel,
          time: timeLabel,
          fullDate: date,
          systolic: vital.bloodPressureSystolic
            ? parseInt(vital.bloodPressureSystolic)
            : null,
          diastolic: vital.bloodPressureDiastolic
            ? parseInt(vital.bloodPressureDiastolic)
            : null,
          heartRate: vital.heartRate ? parseInt(vital.heartRate) : null,
          respiratoryRate: vital.respiratoryRate
            ? parseInt(vital.respiratoryRate)
            : null,
          temperature: vital.temperature ? parseFloat(vital.temperature) : null,
          oxygenSaturation: vital.oxygenSaturation
            ? parseInt(vital.oxygenSaturation)
            : null,
          status: vital.status,
          statusColor:
            vital.status === "بحرانی"
              ? "#ef4444"
              : vital.status === "غیرنرمال"
                ? "#f97316"
                : "#10b981",
        };
      })
      .sort((a, b) => a.fullDate - b.fullDate);
  }, [safeVitals, timeRange]);

  // ایجاد داده‌های نمونه در صورت نبود داده واقعی
  const sampleData = useMemo(() => {
    if (chartData.length > 0) return chartData;

    const now = new Date();
    const data = [];

    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateLabel = convertToShortPersianDate(date.toISOString());

      data.push({
        date: dateLabel,
        time: "۱۴:۳۰",
        systolic: Math.floor(120 + Math.random() * 20),
        diastolic: Math.floor(80 + Math.random() * 10),
        heartRate: Math.floor(70 + Math.random() * 20),
        respiratoryRate: Math.floor(16 + Math.random() * 6),
        temperature: (36.5 + Math.random() * 1.5).toFixed(1),
        oxygenSaturation: Math.floor(95 + Math.random() * 4),
        status: ["نرمال", "غیرنرمال", "بحرانی"][Math.floor(Math.random() * 3)],
        statusColor: ["#10b981", "#f97316", "#ef4444"][
          Math.floor(Math.random() * 3)
        ],
      });
    }

    return data.reverse();
  }, [chartData]);

  // تعداد علائم انتخاب شده
  const selectedCount = useMemo(() => {
    return Object.values(selectedSigns).filter(Boolean).length;
  }, [selectedSigns]);

  // تابع برای انتخاب/عدم انتخاب همه علائم
  const toggleAllSigns = () => {
    const allSelected = Object.values(selectedSigns).every(Boolean);
    const newSelection = {};
    Object.keys(selectedSigns).forEach((key) => {
      newSelection[key] = !allSelected;
    });
    setSelectedSigns(newSelection);
  };

  // تابع برای انتخاب/عدم انتخاب یک علامت خاص
  const toggleSign = (sign) => {
    setSelectedSigns((prev) => ({
      ...prev,
      [sign]: !prev[sign],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.date) {
      errors.date = "تاریخ الزامی است";
      isValid = false;
    }

    if (!formData.time) {
      errors.time = "ساعت الزامی است";
      isValid = false;
    }

    if (
      formData.bloodPressureSystolic &&
      isNaN(parseInt(formData.bloodPressureSystolic))
    ) {
      errors.bloodPressureSystolic = "مقدار باید عددی باشد";
      isValid = false;
    }

    if (
      formData.bloodPressureDiastolic &&
      isNaN(parseInt(formData.bloodPressureDiastolic))
    ) {
      errors.bloodPressureDiastolic = "مقدار باید عددی باشد";
      isValid = false;
    }

    if (formData.heartRate && isNaN(parseInt(formData.heartRate))) {
      errors.heartRate = "مقدار باید عددی باشد";
      isValid = false;
    }

    if (formData.respiratoryRate && isNaN(parseInt(formData.respiratoryRate))) {
      errors.respiratoryRate = "مقدار باید عددی باشد";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    let status = "نرمال";

    if (formData.bloodPressureSystolic && formData.bloodPressureDiastolic) {
      const systolic = parseInt(formData.bloodPressureSystolic);
      const diastolic = parseInt(formData.bloodPressureDiastolic);
      if (systolic > 180 || diastolic > 120) status = "بحرانی";
      else if (systolic > 140 || diastolic > 90) status = "غیرنرمال";
      else if (systolic < 90 || diastolic < 60) status = "غیرنرمال";
    }

    if (formData.heartRate) {
      const hr = parseInt(formData.heartRate);
      if (hr > 130 || hr < 40) status = "بحرانی";
      else if (hr > 100 || hr < 60) status = "غیرنرمال";
    }

    if (formData.respiratoryRate) {
      const rr = parseInt(formData.respiratoryRate);
      if (rr > 30 || rr < 8) status = "بحرانی";
      else if (rr > 20 || rr < 12) status = "غیرنرمال";
    }

    if (formData.temperature) {
      const temp = parseFloat(formData.temperature);
      if (temp > 39.0 || temp < 35.0) status = "بحرانی";
      else if (temp > 37.5 || temp < 36.0) status = "غیرنرمال";
    }

    if (formData.oxygenSaturation) {
      const spo2 = parseInt(formData.oxygenSaturation);
      if (spo2 < 90) status = "بحرانی";
      else if (spo2 < 95) status = "غیرنرمال";
    }

    const newVital = {
      id: editingId || Date.now(),
      ...formData,
      status: status,
      timestamp: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    if (editingId) {
      onEdit(editingId, newVital);
      setEditingId(null);
    } else {
      onAdd(newVital);
    }

    handleCloseModal();
    setShowAllVitals(true);
    setFormErrors({});
  };

  const handleEdit = (vital) => {
    setFormData({
      date: vital.date || getCurrentPersianDate(),
      time: vital.time || getCurrentPersianTime(),
      bloodPressureSystolic: vital.bloodPressureSystolic || "",
      bloodPressureDiastolic: vital.bloodPressureDiastolic || "",
      heartRate: vital.heartRate || "",
      respiratoryRate: vital.respiratoryRate || "",
      temperature: vital.temperature || "",
      oxygenSaturation: vital.oxygenSaturation || "",
      painScale: vital.painScale || "",
      weight: vital.weight || "",
      height: vital.height || "",
      notes: vital.notes || "",
      recordedBy:
        vital.recordedBy || localStorage.getItem("doctorName") || "دکتر",
      status: vital.status || "نرمال",
    });
    setEditingId(vital.id);
    setShowAddModal(true);
    setFormErrors({});
  };

  const handleCloseModal = () => {
    setFormData({
      date: getCurrentPersianDate(),
      time: getCurrentPersianTime(),
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      heartRate: "",
      respiratoryRate: "",
      temperature: "",
      oxygenSaturation: "",
      painScale: "",
      weight: "",
      height: "",
      notes: "",
      recordedBy: localStorage.getItem("doctorName") || "دکتر",
      status: "نرمال",
    });
    setEditingId(null);
    setShowAddModal(false);
    setFormErrors({});
  };

  const toggleItemExpansion = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // کامپوننت کارت اطلاعات علائم حیاتی
  const VitalCard = ({
    title,
    value,
    unit,
    icon: Icon,
    color,
    trend = "stable",
    status = "normal",
  }) => {
    const colors = {
      red: {
        bg: "bg-red-50",
        icon: "bg-red-100",
        text: "text-red-600",
        border: "border-red-200",
      },
      blue: {
        bg: "bg-blue-50",
        icon: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
      },
      green: {
        bg: "bg-green-50",
        icon: "bg-green-100",
        text: "text-green-600",
        border: "border-green-200",
      },
      orange: {
        bg: "bg-orange-50",
        icon: "bg-orange-100",
        text: "text-orange-600",
        border: "border-orange-200",
      },
      purple: {
        bg: "bg-purple-50",
        icon: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
      },
      teal: {
        bg: "bg-teal-50",
        icon: "bg-teal-100",
        text: "text-teal-600",
        border: "border-teal-200",
      },
      yellow: {
        bg: "bg-yellow-50",
        icon: "bg-yellow-100",
        text: "text-yellow-600",
        border: "border-yellow-200",
      },
      cyan: {
        bg: "bg-cyan-50",
        icon: "bg-cyan-100",
        text: "text-cyan-600",
        border: "border-cyan-200",
      },
      indigo: {
        bg: "bg-indigo-50",
        icon: "bg-indigo-100",
        text: "text-indigo-600",
        border: "border-indigo-200",
      },
    };

    const statusColors = {
      critical: "border-red-500 border-2",
      abnormal: "border-orange-500 border-2",
      normal: "",
    };

    const selectedColor = colors[color] || colors.blue;
    const statusBorder = statusColors[status] || "";

    return (
      <div
        className={`${selectedColor.bg} border ${selectedColor.border} ${statusBorder} rounded-xl p-3 md:p-4 hover:shadow-md transition-all duration-200`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`${selectedColor.icon} p-2 rounded-lg`}>
              <Icon className={`${selectedColor.text} w-4 h-4 md:w-5 md:h-5`} />
            </div>
            <span className="text-xs md:text-sm text-gray-700 font-medium">
              {title}
            </span>
          </div>
          {trend !== "stable" && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${trend === "up" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
            >
              {trend === "up" ? "↑" : "↓"}
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg md:text-xl font-bold text-gray-800">
            {value || "---"}
          </p>
          {unit && (
            <p className="text-xs md:text-sm text-gray-500 mt-1">{unit}</p>
          )}
        </div>
      </div>
    );
  };

  // تابع محاسبه رنگ بر اساس وضعیت
  const getStatusColor = (status) => {
    switch (status) {
      case "بحرانی":
        return "bg-red-100 text-red-800 border-red-200";
      case "غیرنرمال":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "نرمال":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // کامپوننت Tooltip سفارشی برای نمودار
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white  p-4 border border-gray-200 rounded-xl shadow-lg min-w-[250px]">
          <div className="text-gray-800 font-bold mb-2 text-center">
            {label}
          </div>
          <div className="space-y-2">
            {payload.map((entry, index) => {
              const config = vitalSignsConfig[entry.dataKey];
              if (!config || !entry.value) return null;

              const Icon = config.icon;

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ color: entry.color }}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <span className="text-gray-600 text-sm">
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">
                      {entry.value}
                    </span>
                    <span className="text-gray-500 text-sm">{config.unit}</span>
                  </div>
                </div>
              );
            })}

            {payload[0]?.payload?.status && (
              <div className="mt-2 pt-1 border-t border-gray-100">
                <div
                  className={`text-xs px-3 py-1 rounded-full text-center ${
                    payload[0].payload.status === "بحرانی"
                      ? "bg-red-100 text-red-800"
                      : payload[0].payload.status === "غیرنرمال"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  وضعیت: {payload[0].payload.status}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // کامپوننت انتخاب علائم
  const SignsSelector = () => (
    <div
      className={`absolute top-full right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-2xl z-50 min-w-[300px] transition-all duration-200 ${showSignsSelector ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-gray-800">انتخاب علائم برای نمودار</h4>
          <button
            onClick={() => setShowSignsSelector(false)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <FiX className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {selectedCount} علامت از {Object.keys(selectedSigns).length} علامت
          انتخاب شده است
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          <button
            onClick={toggleAllSigns}
            className="flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded-lg transition"
          >
            {Object.values(selectedSigns).every(Boolean) ? (
              <FiCheckSquare className="w-5 h-5 text-purple-600" />
            ) : (
              <FiSquare className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-sm font-medium">
              {Object.values(selectedSigns).every(Boolean)
                ? "لغو انتخاب همه"
                : "انتخاب همه علائم"}
            </span>
          </button>

          {Object.entries(vitalSignsConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => toggleSign(key)}
                className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-800">
                      {config.label}
                    </span>
                    <p className="text-xs text-gray-500">{config.unit}</p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center ${selectedSigns[key] ? "bg-purple-600 border-purple-600" : "border-gray-300"}`}
                >
                  {selectedSigns[key] && (
                    <FiCheck className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <button
          onClick={() => setShowSignsSelector(false)}
          className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg transition font-medium"
        >
          تأیید و بستن
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 mb-6">
      {/* هدر */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 md:p-4 rounded-xl shadow-lg">
              <FiActivity className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              علائم حیاتی
            </h2>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">
              <div className="flex items-center gap-1 text-xs md:text-sm">
                <span className="text-green-600 font-bold">
                  {stats?.normal || 0}
                </span>
                <span className="text-gray-600">نرمال</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1 text-xs md:text-sm">
                <span className="text-orange-600 font-bold">
                  {stats?.abnormal || 0}
                </span>
                <span className="text-gray-600">غیرنرمال</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1 text-xs md:text-sm">
                <span className="text-red-600 font-bold">
                  {stats?.critical || 0}
                </span>
                <span className="text-gray-600">بحرانی</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* دکمه نمایش/پنهان لیست */}
          {safeVitals.length > 0 && (
            <button
              onClick={() => setShowAllVitals(!showAllVitals)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl ${
                showAllVitals
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
              }`}
            >
              {showAllVitals ? (
                <>
                  <FiEyeOff className="w-4 h-4" />
                  <span>بستن لیست</span>
                </>
              ) : (
                <>
                  <FiEye className="w-4 h-4" />
                  <span>مشاهده لیست</span>
                </>
              )}
            </button>
          )}
          {/* دکمه افزودن */}
          {showAddButton && !showAddModal && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium min-w-[140px]"
            >
              <FiPlus className="w-4 h-4" />
              <span>افزودن علائم</span>
            </button>
          )}
        </div>
      </div>

      {/* خلاصه علائم حیاتی */}
      {safeVitals.length > 0 && !showAllVitals && stats?.lastVital && (
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-5 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FiActivity className="text-purple-600 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-gray-800 font-bold text-lg">
                  آخرین علائم حیاتی
                </h3>
                <p className="text-gray-600 text-sm">مقادیر آخرین ثبت</p>
              </div>
            </div>
            <button
              onClick={() => setShowAllVitals(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg transition-all duration-200 shadow hover:shadow-md"
            >
              <FiEye className="w-4 h-4" />
              <span>مشاهده همه</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white rounded-lg p-3 text-center border border-red-100">
              <div className="text-2xl font-bold text-gray-800">
                {stats.lastVital.bloodPressureSystolic &&
                stats.lastVital.bloodPressureDiastolic
                  ? `${stats.lastVital.bloodPressureSystolic}/${stats.lastVital.bloodPressureDiastolic}`
                  : "---"}
              </div>
              <div className="text-xs text-gray-500 mt-1">فشار خون</div>
              <div
                className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                  stats.bpStatus === "بالا"
                    ? "bg-red-100 text-red-800"
                    : stats.bpStatus === "پایین"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {stats.bpStatus}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
              <div className="text-2xl font-bold text-gray-800">
                {stats.lastVital.heartRate || "---"}
              </div>
              <div className="text-xs text-gray-500 mt-1">ضربان قلب</div>
              <div
                className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                  stats.hrStatus === "بالا"
                    ? "bg-red-100 text-red-800"
                    : stats.hrStatus === "پایین"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {stats.hrStatus}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 text-center border border-cyan-100">
              <div className="text-2xl font-bold text-gray-800">
                {stats.lastVital.respiratoryRate || "---"}
              </div>
              <div className="text-xs text-gray-500 mt-1">تعداد تنفس</div>
              <div
                className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                  stats.rrStatus === "بالا"
                    ? "bg-red-100 text-red-800"
                    : stats.rrStatus === "پایین"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {stats.rrStatus}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 text-center border border-orange-100">
              <div className="text-2xl font-bold text-gray-800">
                {stats.lastVital.temperature || "---"}
              </div>
              <div className="text-xs text-gray-500 mt-1">دمای بدن</div>
              <div
                className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                  stats.tempStatus === "بالا"
                    ? "bg-red-100 text-red-800"
                    : stats.tempStatus === "پایین"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {stats.tempStatus}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 text-center border border-green-100">
              <div className="text-2xl font-bold text-gray-800">
                {stats.lastVital.oxygenSaturation || "---"}
              </div>
              <div className="text-xs text-gray-500 mt-1">اکسیژن خون</div>
              <div
                className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                  stats.spo2Status === "پایین"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {stats.spo2Status}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* فیلتر و جستجو */}
      {showAllVitals && safeVitals.length > 0 && (
        <>
          {/* دکمه‌های فیلتر */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${
                  activeFilter === "all"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FiFilter className="w-4 h-4" />
                همه
              </button>
              <button
                onClick={() => setActiveFilter("نرمال")}
                className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${
                  activeFilter === "نرمال"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                نرمال
              </button>
              <button
                onClick={() => setActiveFilter("غیرنرمال")}
                className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${
                  activeFilter === "غیرنرمال"
                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                غیرنرمال
              </button>
              <button
                onClick={() => setActiveFilter("بحرانی")}
                className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${
                  activeFilter === "بحرانی"
                    ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                بحرانی
              </button>
            </div>
          </div>

          {/* نوار جستجو */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجوی یادداشت یا ثبت کننده..."
                className="w-full px-4 py-3 pr-12 bg-white border-2 border-gray-200 rounded-xl text-right focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm shadow-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FiSearch className="text-gray-400 w-4 h-4" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {filteredVitals.length} مورد از {safeVitals.length} ثبت یافت شد
              </p>
              {(searchTerm || activeFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilter("all");
                  }}
                  className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  <FiX className="w-3 h-3" />
                  پاکسازی فیلترها
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* دکمه نمایش/پنهان نمودار کلی */}
      {safeVitals.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setExpandedView(!expandedView)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                {expandedView ? (
                  <FiChevronUp className="w-5 h-5" />
                ) : (
                  <FiChevronDown className="w-5 h-5" />
                )}
                {expandedView
                  ? "بستن نمودار کلی"
                  : "نمایش نمودار کلی علائم حیاتی"}
              </button>

              {expandedView && (
                <div className="relative">
                  <button
                    onClick={() => setShowSignsSelector(!showSignsSelector)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl transition duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    <FiEyeIcon className="w-4 h-4" />
                    <span>انتخاب علائم ({selectedCount})</span>
                  </button>
                  <SignsSelector />
                </div>
              )}
            </div>

            {expandedView && (
              <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <span className="font-medium">
                  {selectedCount} علامت انتخاب شده
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* نمودار کلی */}
      {expandedView && safeVitals.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                نمودار علائم حیاتی
              </h3>
              <p className="text-gray-600 text-sm">
                روند تغییرات علائم انتخاب شده در طول زمان
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* انتخاب بازه زمانی */}
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm font-medium">
                  بازه زمانی:
                </span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {["7days", "14days", "30days"].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 text-sm rounded-md transition ${
                        timeRange === range
                          ? "bg-white text-purple-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {range === "7days"
                        ? "۷ روز"
                        : range === "14days"
                          ? "۱۴ روز"
                          : "۳۰ روز"}
                    </button>
                  ))}
                </div>
              </div>

              {/* انتخاب نوع نمودار */}
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm font-medium">
                  نوع نمودار:
                </span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setChartType("composed")}
                    className={`p-2 rounded-md transition flex items-center gap-1 ${chartType === "composed" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`}
                    title="نمودار ترکیبی"
                  >
                    <FiBarChart2 className="w-4 h-4" />
                    <span className="text-xs hidden sm:inline">ترکیبی</span>
                  </button>
                  <button
                    onClick={() => setChartType("line")}
                    className={`p-2 rounded-md transition flex items-center gap-1 ${chartType === "line" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`}
                    title="نمودار خطی"
                  >
                    <FiTrendingUpIcon className="w-4 h-4" />
                    <span className="text-xs hidden sm:inline">خطی</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* کارت‌های علائم انتخاب شده */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-sm text-gray-700 font-medium">
                علائم انتخاب شده:
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(vitalSignsConfig).map(([key, config]) => {
                  if (!selectedSigns[key]) return null;
                  const Icon = config.icon;
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                      style={{
                        backgroundColor: `${config.color}20`,
                        border: `1px solid ${config.color}40`,
                      }}
                    >
                      <Icon
                        className="w-3 h-3"
                        style={{ color: config.color }}
                      />
                      <span style={{ color: config.color }}>
                        {config.label}
                      </span>
                      <button
                        onClick={() => toggleSign(key)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* هشدار اگر تعداد علائم انتخاب شده زیاد باشد */}
            {selectedCount > 3 && (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">
                      تعداد علائم انتخاب شده زیاد است ({selectedCount} علامت)
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      برای وضوح بیشتر، توصیه می‌شود ۱ تا ۳ علامت را انتخاب کنید.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* هشدار اگر هیچ علامتی انتخاب نشده باشد */}
            {selectedCount === 0 && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-800 font-medium">
                      هیچ علامتی برای نمایش انتخاب نشده است
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      لطفاً حداقل یک علامت را از دکمه «انتخاب علائم» انتخاب
                      کنید.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* نمودار ترکیبی */}
          {selectedCount > 0 && chartType === "composed" && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 mb-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={sampleData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      fontSize={12}
                      tick={{ fill: "#6b7280" }}
                    />
                    <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ paddingBottom: "20px" }}
                    />

                    {/* فشار خون سیستولیک (میله‌ای) */}
                    {selectedSigns.systolic && (
                      <Bar
                        yAxisId="left"
                        dataKey="systolic"
                        name="فشار سیستولیک"
                        fill="#ef4444"
                        barSize={20}
                        radius={[4, 4, 0, 0]}
                      />
                    )}

                    {/* فشار خون دیاستولیک (میله‌ای) */}
                    {selectedSigns.diastolic && (
                      <Bar
                        yAxisId="left"
                        dataKey="diastolic"
                        name="فشار دیاستولیک"
                        fill="#f97316"
                        barSize={20}
                        radius={[4, 4, 0, 0]}
                      />
                    )}

                    {/* ضربان قلب (خطی) */}
                    {selectedSigns.heartRate && (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="heartRate"
                        name="ضربان قلب"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          strokeWidth: 2,
                          stroke: "#3b82f6",
                          fill: "white",
                        }}
                        activeDot={{
                          r: 6,
                          strokeWidth: 2,
                          stroke: "#3b82f6",
                          fill: "white",
                        }}
                      />
                    )}

                    {/* تعداد تنفس (خطی) */}
                    {selectedSigns.respiratoryRate && (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="respiratoryRate"
                        name="تعداد تنفس"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{
                          r: 4,
                          strokeWidth: 2,
                          stroke: "#06b6d4",
                          fill: "white",
                        }}
                      />
                    )}

                    {/* اکسیژن خون (ناحیه‌ای) */}
                    {selectedSigns.oxygenSaturation && (
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="oxygenSaturation"
                        name="اکسیژن خون"
                        stroke="#10b981"
                        fill="url(#colorOxygen)"
                        strokeWidth={2}
                      />
                    )}

                    {/* دما (خطی در محور دوم) */}
                    {selectedSigns.temperature && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="temperature"
                        name="دمای بدن"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          strokeWidth: 2,
                          stroke: "#f59e0b",
                          fill: "white",
                        }}
                      />
                    )}

                    {/* گرادیانت برای Area */}
                    <defs>
                      <linearGradient
                        id="colorOxygen"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* راهنمای نمودار */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
                  {selectedSigns.systolic && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-gray-700">فشار سیستولیک</span>
                    </div>
                  )}
                  {selectedSigns.diastolic && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span className="text-gray-700">فشار دیاستولیک</span>
                    </div>
                  )}
                  {selectedSigns.heartRate && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">ضربان قلب</span>
                    </div>
                  )}
                  {selectedSigns.respiratoryRate && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                      <span className="text-gray-700">تعداد تنفس</span>
                    </div>
                  )}
                  {selectedSigns.oxygenSaturation && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">اکسیژن خون</span>
                    </div>
                  )}
                  {selectedSigns.temperature && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-700">دمای بدن</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* نمودار خطی ساده */}
          {selectedCount > 0 && chartType === "line" && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4  mb-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sampleData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />

                    {/* خطوط برای هر علامت حیاتی */}
                    {selectedSigns.systolic && (
                      <Line
                        type="monotone"
                        dataKey="systolic"
                        name="فشار سیستولیک"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {selectedSigns.diastolic && (
                      <Line
                        type="monotone"
                        dataKey="diastolic"
                        name="فشار دیاستولیک"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )}
                    {selectedSigns.heartRate && (
                      <Line
                        type="monotone"
                        dataKey="heartRate"
                        name="ضربان قلب"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )}
                    {selectedSigns.respiratoryRate && (
                      <Line
                        type="monotone"
                        dataKey="respiratoryRate"
                        name="تعداد تنفس"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )}
                    {selectedSigns.temperature && (
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        name="دمای بدن"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )}
                    {selectedSigns.oxygenSaturation && (
                      <Line
                        type="monotone"
                        dataKey="oxygenSaturation"
                        name="اکسیژن خون"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* خلاصه آماری برای علائم انتخاب شده */}
          {selectedCount > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedSigns.heartRate && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">میانگین ضربان قلب</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {Math.round(
                          sampleData.reduce(
                            (sum, item) => sum + (item.heartRate || 0),
                            0,
                          ) / sampleData.filter((d) => d.heartRate).length,
                        ) || "--"}
                        <span className="text-sm font-normal mr-1">bpm</span>
                      </p>
                    </div>
                    <FiHeart className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
              )}

              {selectedSigns.oxygenSaturation && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        میانگین اکسیژن خون
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {Math.round(
                          sampleData.reduce(
                            (sum, item) => sum + (item.oxygenSaturation || 0),
                            0,
                          ) /
                            sampleData.filter((d) => d.oxygenSaturation).length,
                        ) || "--"}
                        %
                      </p>
                    </div>
                    <FiWind className="w-8 h-8 text-green-500" />
                  </div>
                </div>
              )}

              {selectedSigns.temperature && (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">میانگین دما</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {(
                          sampleData.reduce(
                            (sum, item) => sum + (item.temperature || 0),
                            0,
                          ) / sampleData.filter((d) => d.temperature).length
                        ).toFixed(1) || "--"}
                        °C
                      </p>
                    </div>
                    <FiThermometer className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              )}

              {selectedSigns.respiratoryRate && (
                <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        میانگین تعداد تنفس
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {Math.round(
                          sampleData.reduce(
                            (sum, item) => sum + (item.respiratoryRate || 0),
                            0,
                          ) /
                            sampleData.filter((d) => d.respiratoryRate).length,
                        ) || "--"}
                      </p>
                    </div>
                    <FiCloud className="w-8 h-8 text-cyan-500" />
                  </div>
                </div>
              )}

              {selectedSigns.systolic && selectedSigns.diastolic && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">میانگین فشار خون</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {Math.round(
                          sampleData.reduce(
                            (sum, item) =>
                              sum +
                              ((item.systolic || 0) + (item.diastolic || 0)) /
                                2,
                            0,
                          ) /
                            sampleData.filter((d) => d.systolic && d.diastolic)
                              .length,
                        ) || "--"}
                        <span className="text-sm font-normal mr-1">mmHg</span>
                      </p>
                    </div>
                    <FiTrendingUp className="w-8 h-8 text-red-500" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* لیست ثبت‌های علائم حیاتی */}
      {showAllVitals ? (
        displayedVitals.length > 0 ? (
          <div className="space-y-4 animate-fadeIn">
            {displayedVitals.map((vital) => (
              <div
                key={vital.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="p-4 md:p-5">
                  {/* هدر آیتم */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${getStatusColor(vital.status)}`}
                      >
                        {vital.status === "بحرانی" ? (
                          <FiAlertCircle className="w-5 h-5 text-red-500" />
                        ) : vital.status === "غیرنرمال" ? (
                          <FiInfo className="w-5 h-5 text-orange-500" />
                        ) : (
                          <FiCheck className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg md:text-xl">
                            ثبت علائم حیاتی
                          </h3>
                          <span
                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(vital.status)}`}
                          >
                            {vital.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <FiCalendar className="text-gray-400 w-4 h-4" />
                            <span className="text-gray-700 font-medium">
                              {convertToPersianDate(vital.timestamp)}
                            </span>
                          </div>
                          <div className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></div>
                          <div className="flex items-center gap-1">
                            <FiClock className="text-gray-400 w-4 h-4" />
                            <span className="text-gray-700 font-medium">
                              {convertToPersianTime(vital.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleItemExpansion(vital.id)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                          title={
                            expandedItems.has(vital.id)
                              ? "بستن جزئیات"
                              : "مشاهده جزئیات"
                          }
                        >
                          {expandedItems.has(vital.id) ? (
                            <FiChevronUp className="w-4 h-4" />
                          ) : (
                            <FiChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(vital)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="ویرایش علائم"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemove(vital.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="حذف علائم"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* اطلاعات اصلی */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    {vital.bloodPressureSystolic &&
                      vital.bloodPressureDiastolic && (
                        <div className="bg-red-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <FiTrendingUp className="text-red-500 w-4 h-4" />
                            <span className="text-gray-700 text-sm font-medium">
                              فشار خون
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900 text-lg">
                              {vital.bloodPressureSystolic}/
                              {vital.bloodPressureDiastolic}
                              <span className="text-sm font-normal mr-1">
                                mmHg
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                    {vital.heartRate && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FiHeart className="text-blue-500 w-4 h-4" />
                          <span className="text-gray-700 text-sm font-medium">
                            ضربان قلب
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 text-lg">
                            {vital.heartRate}
                            <span className="text-sm font-normal mr-1">
                              bpm
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {vital.respiratoryRate && (
                      <div className="bg-cyan-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FiCloud className="text-cyan-500 w-4 h-4" />
                          <span className="text-gray-700 text-sm font-medium">
                            تعداد تنفس
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 text-lg">
                            {vital.respiratoryRate}
                            <span className="text-sm font-normal mr-1">
                              breaths/min
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {vital.temperature && (
                      <div className="bg-orange-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FiThermometer className="text-orange-500 w-4 h-4" />
                          <span className="text-gray-700 text-sm font-medium">
                            دمای بدن
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 text-lg">
                            {vital.temperature}
                            <span className="text-sm font-normal mr-1">°C</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {vital.oxygenSaturation && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FiWind className="text-green-500 w-4 h-4" />
                          <span className="text-gray-700 text-sm font-medium">
                            اکسیژن خون
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 text-lg">
                            {vital.oxygenSaturation}
                            <span className="text-sm font-normal mr-1">%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* اطلاعات اضافی */}
                  {expandedItems.has(vital.id) && (
                    <div className="border-t border-gray-100 pt-4 mt-4 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          {vital.painScale && (
                            <div className="flex items-center gap-2">
                              <FiAlertCircle className="text-red-400 w-4 h-4" />
                              <span className="text-gray-600 text-sm">
                                مقیاس درد:
                              </span>
                              <span className="font-bold text-red-900">
                                {vital.painScale}/10
                              </span>
                            </div>
                          )}

                          {vital.weight && (
                            <div className="flex items-center gap-2">
                              <FiActivity className="text-purple-400 w-4 h-4" />
                              <span className="text-gray-600 text-sm">
                                وزن:
                              </span>
                              <span className="font-medium text-gray-900">
                                {vital.weight} kg
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <FiUser className="text-gray-400 w-4 h-4" />
                            <span className="text-gray-600 text-sm">
                              ثبت کننده:
                            </span>
                            <span className="font-medium text-gray-900">
                              {vital.recordedBy}
                            </span>
                          </div>
                        </div>

                        <div>
                          {vital.notes && (
                            <div className="flex items-start gap-2">
                              <FiInfo className="text-blue-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div className="text-right">
                                <div className="text-gray-600 text-sm mb-1">
                                  یادداشت:
                                </div>
                                <div className="text-gray-800 text-sm bg-blue-50 p-3 rounded-lg">
                                  {vital.notes}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* نوار وضعیت پایین */}
                <div
                  className={`h-1 ${
                    vital.status === "بحرانی"
                      ? "bg-gradient-to-r from-red-400 to-rose-500"
                      : vital.status === "غیرنرمال"
                        ? "bg-gradient-to-r from-orange-400 to-amber-500"
                        : "bg-gradient-to-r from-green-400 to-emerald-500"
                  }`}
                ></div>
              </div>
            ))}

            {/* دکمه نمایش همه */}
            {safeVitals.length > 2 && !showAllVitals && (
              <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col items-center">
                <p className="text-gray-600 text-sm mb-4">
                  نمایش {initialVitals.length} مورد از {safeVitals.length} ثبت
                </p>
                <button
                  onClick={() => setShowAllVitals(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                >
                  <FiChevronDown className="w-5 h-5" />
                  <span>مشاهده همه ({safeVitals.length})</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FiActivity className="w-10 h-10 text-purple-400" />
            </div>
            <h4 className="text-gray-700 font-bold text-lg mb-2">
              موردی یافت نشد
            </h4>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              هیچ ثبت علائم حیاتی با فیلترهای انتخاب شده مطابقت ندارد.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
              }}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-all font-medium"
            >
              پاکسازی فیلترها
            </button>
          </div>
        )
      ) : null}

      {/* وقتی هیچ علائمی ثبت نشده */}
      {!showAllVitals && safeVitals.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <FiActivity className="w-10 h-10 text-purple-400" />
          </div>
          <h4 className="text-gray-700 font-bold text-lg mb-2">
            هنوز علائم حیاتی ثبت نشده است
          </h4>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            ثبت منظم علائم حیاتی برای نظارت بر سلامت بیمار ضروری است
          </p>
          {showAddButton && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FiPlus className="w-5 h-5" />
              ثبت اولین علائم حیاتی
            </button>
          )}
        </div>
      )}

      {/* مودال افزودن/ویرایش */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FiActivity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {editingId
                        ? "ویرایش علائم حیاتی"
                        : "ثبت علائم حیاتی جدید"}
                    </h3>
                    <p className="text-purple-100 text-sm">
                      تمام مقادیر را با دقت وارد کنید
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-gray-800 font-medium mb-2 flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    تاریخ
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 ${formErrors.date ? "border-red-300" : "border-gray-300"} rounded-xl text-right focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all`}
                      placeholder="۱۴۰۳/۰۱/۰۱"
                    />
                    <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {formErrors.date && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {formErrors.date}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-gray-800 font-medium mb-2 flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    ساعت
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 ${formErrors.time ? "border-red-300" : "border-gray-300"} rounded-xl text-right focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all`}
                      placeholder="۱۴:۳۰"
                    />
                    <FiClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {formErrors.time && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {formErrors.time}
                    </p>
                  )}
                </div>
              </div>

              {/* فشار خون */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    فشار خون سیستولیک
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="bloodPressureSystolic"
                      value={formData.bloodPressureSystolic}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 ${formErrors.bloodPressureSystolic ? "border-red-300" : "border-red-200"} rounded-xl text-right focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all pr-12`}
                      placeholder="120"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      mmHg
                    </span>
                  </div>
                  {formErrors.bloodPressureSystolic && (
                    <p className="text-red-600 text-sm mt-2">
                      {formErrors.bloodPressureSystolic}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    فشار خون دیاستولیک
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="bloodPressureDiastolic"
                      value={formData.bloodPressureDiastolic}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 ${formErrors.bloodPressureDiastolic ? "border-red-300" : "border-red-200"} rounded-xl text-right focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all pr-12`}
                      placeholder="80"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      mmHg
                    </span>
                  </div>
                  {formErrors.bloodPressureDiastolic && (
                    <p className="text-red-600 text-sm mt-2">
                      {formErrors.bloodPressureDiastolic}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    ضربان قلب
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="heartRate"
                      value={formData.heartRate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 ${formErrors.heartRate ? "border-red-300" : "border-blue-200"} rounded-xl text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12`}
                      placeholder="72"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      bpm
                    </span>
                  </div>
                  {formErrors.heartRate && (
                    <p className="text-red-600 text-sm mt-2">
                      {formErrors.heartRate}
                    </p>
                  )}
                </div>
              </div>

              {/* سایر علائم */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    تعداد تنفس
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="respiratoryRate"
                      value={formData.respiratoryRate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 ${formErrors.respiratoryRate ? "border-red-300" : "border-cyan-200"} rounded-xl text-right focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all pr-12`}
                      placeholder="16"
                    />
                    <FiCloud className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-500" />
                    <span className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500">
                      breaths/min
                    </span>
                  </div>
                  {formErrors.respiratoryRate && (
                    <p className="text-red-600 text-sm mt-2">
                      {formErrors.respiratoryRate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    دمای بدن
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl text-right focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all pr-12"
                      placeholder="36.6"
                    />
                    <FiThermometer className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500" />
                    <span className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500">
                      °C
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    اشباع اکسیژن
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="oxygenSaturation"
                      value={formData.oxygenSaturation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl text-right focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all pr-12"
                      placeholder="98"
                      min="0"
                      max="100"
                    />
                    <FiWind className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500" />
                    <span className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* مقیاس درد و وزن */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    مقیاس درد (0-10)
                  </label>
                  <input
                    type="range"
                    name="painScale"
                    value={formData.painScale}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    step="1"
                    className="w-full h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>بدون درد (0)</span>
                    <span className="font-bold">
                      {formData.painScale || "0"}
                    </span>
                    <span>شدید (10)</span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-800 font-medium mb-2">
                    وزن
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl text-right focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all pr-12"
                      placeholder="70"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      kg
                    </span>
                  </div>
                </div>
              </div>

              {/* یادداشت‌ها */}
              <div>
                <label className="block text-gray-800 font-medium mb-2">
                  یادداشت‌ها
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
                  placeholder="هرگونه توضیح اضافی درباره علائم حیاتی..."
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiAlertCircle className="w-4 h-4" />
                <span>فیلدهای ستاره‌دار (*) الزامی هستند</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-all font-medium"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl transition-all font-medium flex items-center gap-2"
                >
                  <FiCheck className="w-5 h-5" />
                  {editingId ? "ذخیره تغییرات" : "ثبت علائم حیاتی"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalSignsSection;
