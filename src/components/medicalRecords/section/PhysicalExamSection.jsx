import React, { useState } from 'react';
import { 
  FiEye, FiActivity, FiHeart, 
  FiEdit, FiTrash2, FiPlus, 
  FiCheck, FiX, FiUser,  
  FiCalendar, FiClock, FiAlertCircle,
  FiInfo, FiFilter, FiSearch,
  FiEyeOff, FiChevronDown, FiChevronUp,
 FiAlertTriangle,
  FiThumbsUp,

} from 'react-icons/fi';

// تابع تبدیل تاریخ به فارسی (مشابه کامپوننت علائم حیاتی)
const convertToPersianDate = (dateString) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    calendar: "persian",
    numberingSystem: "arab",
  };
  
  return new Intl.DateTimeFormat("fa-IR", options).format(date);
};

// تابع تبدیل تاریخ کوتاه برای نمایش
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
  const persianMinutes = String(minutes).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  
  return `${persianHours}:${persianMinutes}`;
};

// تابع دریافت تاریخ و زمان فعلی به فارسی
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

const PhysicalExamSection = ({ 
  physicalExams = [], 
  onAdd, 
  onEdit, 
  onRemove,
  showAddButton = true 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAllExams, setShowAllExams] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [expandedItems, setExpandedItems] = useState(new Set());

  // تابع کمکی برای استخراج متن از آبجکت یا رشته
  const extractText = (value) => {
    if (!value) return '';
    
    if (typeof value === 'string') return value;
    
    if (typeof value === 'object') {
      if (Object.keys(value).length === 0) return '';
      
      if (value.text) return value.text;
      if (value.findings) return value.findings;
      if (value.content) return value.content;
      if (value.description) return value.description;
      if (value.value) return value.value;
      
      try {
        return Object.values(value).filter(v => v && typeof v === 'string').join(' - ');
      } catch {
        return 'اطلاعات ثبت شده';
      }
    }
    
    return String(value);
  };

  // تابع کمکی برای نمایش امن مقادیر
  const safeDisplay = (value, defaultValue = '---') => {
    if (value === null || value === undefined) return defaultValue;
    
    const extracted = extractText(value);
    return extracted || defaultValue;
  };

  // تابع برای تشخیص و نمایش آبجکت‌های خاص
  const displayObject = (obj) => {
    if (!obj) return '---';
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'object') {
      if (obj.keyFindings !== undefined) {
        return obj.keyFindings || '---';
      }
      if (obj.differentialDiagnosis !== undefined) {
        return obj.differentialDiagnosis || '---';
      }
      if (obj.workingDiagnosis !== undefined) {
        return obj.workingDiagnosis || '---';
      }
      if (obj.redFlags !== undefined) {
        return obj.redFlags || '---';
      }
      
      const firstValue = Object.values(obj).find(v => v && typeof v === 'string');
      return firstValue || 'اطلاعات ثبت شده';
    }
    return String(obj);
  };

  const [formData, setFormData] = useState({
    date: getCurrentPersianDate(),
    time: getCurrentPersianTime(),
    generalAppearance: '',
    headAndNeck: '',
    chestAndLungs: '',
    cardiovascular: '',
    abdomen: '',
    extremities: '',
    neurological: '',
    skin: '',
    findings: '',
    recommendations: '',
    examiner: localStorage.getItem("doctorName") || "دکتر",
    status: 'نرمال'
  });

  const safeExams = Array.isArray(physicalExams) ? physicalExams : [];

  // فیلتر کردن معاینات
  const filteredExams = safeExams.filter(exam => {
    const matchesFilter = activeFilter === 'all' || exam.status === activeFilter;
    
    const findingsText = extractText(exam.findings);
    const recommendationsText = extractText(exam.recommendations);
    const examinerText = extractText(exam.examiner);
    
    const matchesSearch = searchTerm === '' || 
      findingsText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recommendationsText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      examinerText.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // نمایش 2 آیتم اول
  const initialExams = filteredExams.slice(0, 2);
  const displayedExams = showAllExams ? filteredExams : initialExams;

  // آمار معاینات
  const stats = {
    total: safeExams.length,
    normal: safeExams.filter(exam => exam.status === 'نرمال').length,
    abnormal: safeExams.filter(exam => exam.status === 'غیرنرمال').length,
    critical: safeExams.filter(exam => exam.status === 'بحرانی').length,
    lastExam: safeExams.length > 0 ? safeExams[safeExams.length - 1] : null
  };

  const systemExamFields = [
    { id: 'generalAppearance', label: 'ظاهر عمومی', icon: FiUser, color: 'blue', shortLabel: 'ظاهر' },
    { id: 'headAndNeck', label: 'سر و گردن', icon: FiUser, color: 'green', shortLabel: 'سر/گردن' },
    { id: 'chestAndLungs', label: 'قفسه سینه و ریه', icon: FiActivity, color: 'red', shortLabel: 'ریه' },
    { id: 'cardiovascular', label: 'قلب و عروق', icon: FiHeart, color: 'pink', shortLabel: 'قلب' },
    { id: 'abdomen', label: 'شکم', icon: FiActivity, color: 'orange', shortLabel: 'شکم' },
    { id: 'extremities', label: 'اندام‌ها', icon: FiActivity, color: 'purple', shortLabel: 'اندام' },
    { id: 'neurological', label: 'اعصاب', icon: FiActivity, color: 'indigo', shortLabel: 'اعصاب' },
    { id: 'skin', label: 'پوست', icon: FiActivity, color: 'teal', shortLabel: 'پوست' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    if (!formData.date) {
      errors.date = 'تاریخ الزامی است';
      isValid = false;
    }
    
    if (!formData.time) {
      errors.time = 'ساعت الزامی است';
      isValid = false;
    }
    
    if (!formData.examiner.trim()) {
      errors.examiner = 'نام معاینه کننده الزامی است';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // تعیین وضعیت بر اساس یافته‌ها
    let status = "نرمال";
    
    // اگر یافته‌های بحرانی وجود داشته باشد
    if (formData.findings && formData.findings.toLowerCase().includes("بحرانی")) {
      status = "بحرانی";
    } else if (formData.findings && formData.findings.toLowerCase().includes("غیرطبیعی")) {
      status = "غیرنرمال";
    }

    // اطمینان از اینکه findings و recommendations رشته هستند
    const processedData = {
      ...formData,
      findings: typeof formData.findings === 'string' ? formData.findings : JSON.stringify(formData.findings),
      recommendations: typeof formData.recommendations === 'string' ? formData.recommendations : JSON.stringify(formData.recommendations),
      timestamp: new Date().toISOString(), // اضافه کردن timestamp برای استفاده در نمودارها
    };

    const newExam = {
      id: editingId || Date.now(),
      ...processedData,
      status: status,
      lastModified: new Date().toISOString()
    };

    if (editingId) {
      onEdit(editingId, newExam);
      setEditingId(null);
    } else {
      onAdd(newExam);
    }

    handleCloseModal();
    setShowAllExams(true);
    setFormErrors({});
  };

  const handleEdit = (exam) => {
    const findingsValue = extractText(exam.findings);
    const recommendationsValue = extractText(exam.recommendations);
    
    setFormData({
      date: exam.date || getCurrentPersianDate(),
      time: exam.time || getCurrentPersianTime(),
      generalAppearance: exam.generalAppearance || '',
      headAndNeck: exam.headAndNeck || '',
      chestAndLungs: exam.chestAndLungs || '',
      cardiovascular: exam.cardiovascular || '',
      abdomen: exam.abdomen || '',
      extremities: exam.extremities || '',
      neurological: exam.neurological || '',
      skin: exam.skin || '',
      findings: findingsValue,
      recommendations: recommendationsValue,
      examiner: exam.examiner || localStorage.getItem("doctorName") || "دکتر",
      status: exam.status || 'نرمال'
    });
    setEditingId(exam.id);
    setShowAddModal(true);
    setFormErrors({});
  };

  const handleCloseModal = () => {
    setFormData({
      date: getCurrentPersianDate(),
      time: getCurrentPersianTime(),
      generalAppearance: '',
      headAndNeck: '',
      chestAndLungs: '',
      cardiovascular: '',
      abdomen: '',
      extremities: '',
      neurological: '',
      skin: '',
      findings: '',
      recommendations: '',
      examiner: localStorage.getItem("doctorName") || "دکتر",
      status: 'نرمال'
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'بحرانی': return 'bg-red-100 text-red-800 border border-red-200';
      case 'غیرنرمال': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'نرمال': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getSystemColor = (colorName) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      pink: 'bg-pink-50 border-pink-200 text-pink-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      teal: 'bg-teal-50 border-teal-200 text-teal-800'
    };
    return colors[colorName] || colors.blue;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 mb-6">
      {/* هدر */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 md:p-4 rounded-xl shadow-lg">
              <FiEye className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">معاینه فیزیکی</h2>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">
              <div className="flex items-center gap-1 text-xs md:text-sm">
                <span className="text-green-600 font-bold">{stats.normal}</span>
                <span className="text-gray-600">نرمال</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1 text-xs md:text-sm">
                <span className="text-orange-600 font-bold">{stats.abnormal}</span>
                <span className="text-gray-600">غیرنرمال</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1 text-xs md:text-sm">
                <span className="text-red-600 font-bold">{stats.critical}</span>
                <span className="text-gray-600">بحرانی</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {safeExams.length > 0 && (
            <button
              onClick={() => setShowAllExams(!showAllExams)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl ${
                showAllExams 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white'
              }`}
            >
              {showAllExams ? (
                <>
                  <FiEyeOff className="w-4 h-4" />
                  <span>بستن لیست</span>
                </>
              ) : (
                <>
                  <FiEye className="w-4 h-4" />
                  <span>مشاهده لیست کامل</span>
                </>
              )}
            </button>
          )}
          
          {showAddButton && !showAddModal && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium min-w-[140px]"
            >
              <FiPlus className="w-4 h-4" />
              <span>افزودن معاینه</span>
            </button>
          )}
        </div>
      </div>

      {/* خلاصه آخرین معاینه */}
      {safeExams.length > 0 && !showAllExams && stats.lastExam && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-5 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FiEye className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-gray-800 font-bold text-lg">آخرین معاینه فیزیکی</h3>
                <p className="text-gray-600 text-sm">مختصری از آخرین معاینه</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
  <FiCalendar className="w-4 h-4" />
  <span>تاریخ: {convertToShortPersianDate(stats.lastExam.timestamp || stats.lastExam.date)}</span>
</div>
            </div>
            <button
              onClick={() => setShowAllExams(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg transition-all duration-200 shadow hover:shadow-md"
            >
              <FiEye className="w-4 h-4" />
              <span>مشاهده همه</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {systemExamFields.slice(0, 4).map(field => (
              <div key={field.id} className={`${getSystemColor(field.color)} border rounded-lg p-3`}>
                <div className="flex items-center gap-2 mb-2">
                  <field.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{field.shortLabel}</span>
                </div>
                <p className="text-xs truncate">{safeDisplay(stats.lastExam[field.id])}</p>
              </div>
            ))}
          </div>
          
          {stats.lastExam.findings && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FiAlertCircle className="text-amber-600 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">یافته مهم:</span>
              </div>
              <p className="text-sm text-gray-800 line-clamp-2">{displayObject(stats.lastExam.findings)}</p>
            </div>
          )}
        </div>
      )}

      {/* فیلتر و جستجو */}
      {showAllExams && safeExams.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${activeFilter === 'all' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <FiFilter className="w-4 h-4" />
                همه
              </button>
              <button
                onClick={() => setActiveFilter('نرمال')}
                className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${activeFilter === 'نرمال' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                نرمال
              </button>
              <button
                onClick={() => setActiveFilter('غیرنرمال')}
                className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${activeFilter === 'غیرنرمال' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                غیرنرمال
              </button>
              <button
                onClick={() => setActiveFilter('بحرانی')}
                className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${activeFilter === 'بحرانی' 
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                بحرانی
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجو در یافته‌ها، توصیه‌ها یا معاینه کننده..."
                className="w-full px-4 py-3 pr-12 bg-white border-2 border-gray-200 rounded-xl text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm shadow-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FiSearch className="text-gray-400 w-4 h-4" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {filteredExams.length} مورد از {safeExams.length} معاینه یافت شد
              </p>
              {(searchTerm || activeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('all');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <FiX className="w-3 h-3" />
                  پاکسازی فیلترها
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* لیست معاینات */}
      {showAllExams ? (
        displayedExams.length > 0 ? (
          <div className="space-y-4 animate-fadeIn">
            {displayedExams.map((exam, index) => (
              <div key={exam.id} className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="p-4 md:p-5">
                  {/* هدر آیتم */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(exam.status)}`}>
                        {exam.status === 'بحرانی' ? <FiAlertTriangle className="w-5 h-5 text-red-500" /> :
                         exam.status === 'غیرنرمال' ? <FiInfo className="w-5 h-5 text-orange-500" /> :
                         <FiThumbsUp className="w-5 h-5 text-green-500" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg md:text-xl">
                            معاینه فیزیکی #{safeExams.length - index}
                          </h3>
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(exam.status)}`}>
                            {exam.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <FiCalendar className="text-gray-400 w-4 h-4" />
                            <span className="text-gray-700 font-medium">
                              {convertToPersianDate(exam.timestamp || exam.date)}
                            </span>
                          </div>
                          <div className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></div>
                          <div className="flex items-center gap-1">
                            <FiClock className="text-gray-400 w-4 h-4" />
                            <span className="text-gray-700 font-medium">
                              {convertToPersianTime(exam.time)}
                            </span>
                          </div>
                          <div className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></div>
                          <div className="flex items-center gap-1">
                            <FiUser className="text-gray-400 w-4 h-4" />
                            <span className="text-gray-700 font-medium">{safeDisplay(exam.examiner)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleItemExpansion(exam.id)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                          title={expandedItems.has(exam.id) ? "بستن جزئیات" : "مشاهده جزئیات"}
                        >
                          {expandedItems.has(exam.id) ? (
                            <FiChevronUp className="w-4 h-4" />
                          ) : (
                            <FiChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(exam)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="ویرایش معاینه"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemove(exam.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="حذف معاینه"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* نتایج معاینه سیستم‌ها */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 mb-4">
                    {systemExamFields.map(field => {
                      const value = exam[field.id];
                      const displayValue = safeDisplay(value);
                      
                      return (
                        <div key={field.id} className={`${getSystemColor(field.color)} border rounded-lg p-2`}>
                          <div className="flex items-center gap-1 mb-1">
                            <field.icon className="w-3 h-3" />
                            <span className="text-xs font-medium">{field.shortLabel}</span>
                          </div>
                          <p className="text-xs truncate" title={displayValue}>
                            {displayValue}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* اطلاعات اضافی */}
                  {expandedItems.has(exam.id) ? (
                    <div className="border-t border-gray-100 pt-4 mt-4 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* یافته‌های مهم */}
                        {exam.findings && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <FiAlertCircle className="text-amber-600 w-4 h-4" />
                              <span className="text-sm font-medium text-amber-800">یافته‌های مهم</span>
                            </div>
                            <p className="text-sm text-amber-900 whitespace-pre-wrap">
                              {displayObject(exam.findings)}
                            </p>
                          </div>
                        )}
                        
                        {/* توصیه‌ها */}
                        {exam.recommendations && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <FiCheck className="text-emerald-600 w-4 h-4" />
                              <span className="text-sm font-medium text-emerald-800">توصیه‌ها</span>
                            </div>
                            <p className="text-sm text-emerald-900 whitespace-pre-wrap">
                              {displayObject(exam.recommendations)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (exam.findings || exam.recommendations) ? (
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="flex items-center gap-2">
                        <FiInfo className="text-blue-500 w-4 h-4" />
                        <p className="text-sm text-gray-700 truncate">
                          {displayObject(exam.findings || exam.recommendations)}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
                
                {/* نوار وضعیت پایین */}
                <div className={`h-1 ${
                  exam.status === 'بحرانی' ? 'bg-gradient-to-r from-red-400 to-rose-500' :
                  exam.status === 'غیرنرمال' ? 'bg-gradient-to-r from-orange-400 to-amber-500' :
                  'bg-gradient-to-r from-green-400 to-emerald-500'
                }`}></div>
              </div>
            ))}
            
            {/* دکمه نمایش همه */}
            {safeExams.length > 2 && !showAllExams && (
              <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col items-center">
                <p className="text-gray-600 text-sm mb-4">
                  نمایش {initialExams.length} مورد از {safeExams.length} معاینه
                </p>
                <button
                  onClick={() => setShowAllExams(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                >
                  <FiChevronDown className="w-5 h-5" />
                  <span>مشاهده همه ({safeExams.length})</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FiEye className="w-10 h-10 text-blue-400" />
            </div>
            <h4 className="text-gray-700 font-bold text-lg mb-2">موردی یافت نشد</h4>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              هیچ معاینه‌ای با فیلترهای انتخاب شده مطابقت ندارد.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-all font-medium"
            >
              پاکسازی فیلترها
            </button>
          </div>
        )
      ) : null}

      {/* وقتی هیچ معاینه‌ای ثبت نشده */}
      {!showAllExams && safeExams.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <FiEye className="w-10 h-10 text-blue-400" />
          </div>
          <h4 className="text-gray-700 font-bold text-lg mb-2">هنوز معاینه‌ای ثبت نشده است</h4>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            ثبت نتایج معاینه فیزیکی برای پیگیری وضعیت سلامت بیمار ضروری است
          </p>
          {showAddButton && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FiPlus className="w-5 h-5" />
              افزودن اولین معاینه
            </button>
          )}
        </div>
      )}

      {/* مودال افزودن/ویرایش */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-200">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FiEye className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {editingId ? 'ویرایش معاینه فیزیکی' : 'ثبت معاینه فیزیکی جدید'}
                    </h3>
                    <p className="text-blue-100 text-sm">لطفا تمام فیلدها را با دقت پر کنید</p>
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
                  <label className=" text-gray-800 font-medium mb-2 flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    تاریخ معاینه
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 ${formErrors.date ? 'border-red-300' : 'border-gray-300'} rounded-xl text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
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
                  <label className=" text-gray-800 font-medium mb-2 flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    ساعت معاینه
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 ${formErrors.time ? 'border-red-300' : 'border-gray-300'} rounded-xl text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
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

              {/* وضعیت کلی */}
              <div className="mb-6">
                <label className="block text-gray-800 font-medium mb-2">وضعیت کلی معاینه</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="نرمال">نرمال</option>
                  <option value="غیرنرمال">غیرنرمال</option>
                  <option value="بحرانی">بحرانی</option>
                </select>
              </div>

              {/* سیستم‌های بدن */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">معاینه سیستم‌های بدن</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {systemExamFields.map(field => (
                    <div key={field.id}>
                      <label className="block text-gray-700 font-medium mb-2">{field.label}</label>
                      <textarea
                        name={field.id}
                        value={formData[field.id]}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder={`نتایج معاینه ${field.label}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* یافته‌ها و توصیه‌ها */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-800 font-medium mb-2">یافته‌های مهم</label>
                  <textarea
                    name="findings"
                    value={formData.findings}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl text-right focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-none"
                    placeholder="یافته‌های کلیدی و مهم معاینه..."
                  />
                </div>
                <div>
                  <label className="block text-gray-800 font-medium mb-2">توصیه‌ها و اقدامات</label>
                  <textarea
                    name="recommendations"
                    value={formData.recommendations}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl text-right focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                    placeholder="توصیه‌های درمانی و پیگیری..."
                  />
                </div>
              </div>

              {/* معاینه کننده */}
              <div>
                <label className=" text-gray-800 font-medium mb-2 flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  معاینه کننده
                </label>
                <input
                  type="text"
                  name="examiner"
                  value={formData.examiner}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 ${formErrors.examiner ? 'border-red-300' : 'border-gray-300'} rounded-xl text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  placeholder="نام پزشک معاینه کننده"
                />
                {formErrors.examiner && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {formErrors.examiner}
                  </p>
                )}
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiAlertCircle className="w-4 h-4" />
                <span>فیلدهای ستاره‌دار (*) الزامی هستند</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-all font-medium"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl transition-all font-medium flex items-center gap-2"
                >
                  <FiCheck className="w-5 h-5" />
                  {editingId ? 'ذخیره تغییرات' : 'ثبت معاینه'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PhysicalExamSection;