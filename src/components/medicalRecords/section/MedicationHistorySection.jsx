import React, { useState, useEffect } from 'react';
import { 
  FiPackage, 
  FiCalendar, 
  FiEdit, 
  FiTrash2, 
  FiPlus, 
  FiCheck, 
  FiX, 
  FiClock, 
  FiEye, 
  FiEyeOff,
  FiUser,
  FiInfo,
  FiAlertCircle,
  FiFilter,
  FiSearch,
  FiCheckCircle,
  FiAlertTriangle,
  FiMinusCircle,
  FiActivity,
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw
} from 'react-icons/fi';

const MedicationHistorySection = ({ 
  medicationHistory = [], 
  onAdd, 
  onEdit, 
  onRemove, 
  showAddButton = true 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMedicationList, setShowMedicationList] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [showSummary, setShowSummary] = useState(true);
  
  // حالت جدید برای نوع دوزبندی
  const [dosageType, setDosageType] = useState('daily'); // daily, weekly, monthly, prn, custom
  
  const [formData, setFormData] = useState({
    drugName: '',
    dosage: '',
    dosageUnit: 'mg',
    dosageType: 'daily', // نوع دوزبندی
    frequency: {
      daily: {
        times: 1, // تعداد دفعات در روز
        schedule: [], // ساعات مصرف
        withMeal: 'none' // before, after, with, none
      },
      weekly: {
        days: [], // روزهای هفته
        times: 1 // تعداد دفعات در روز
      },
      monthly: {
        days: [], // روزهای ماه
        times: 1 // تعداد دفعات در روز
      },
      prn: {
        maxDaily: '', // حداکثر در روز
        minInterval: '', // حداقل فاصله
        reason: '' // موارد مصرف
      },
      custom: {
        instruction: '' // دستور خاص
      }
    },
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    duration: '', // مدت زمان درمان
    purpose: '',
    prescribingDoctor: localStorage.getItem("doctorName") || "دکتر",
    status: 'در حال مصرف',
    notes: '',
    drugCode: '',
    route: 'خوراکی',
    warnings: '',
    refills: '', // تعداد دفعات مجاز برای تکرار نسخه
    lastRefillDate: '' // تاریخ آخرین تکرار
  });

  const safeItems = Array.isArray(medicationHistory) ? medicationHistory : [];
  
  // فیلتر کردن داروها بر اساس وضعیت و جستجو
  const filteredItems = safeItems.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.status === activeFilter;
    const matchesSearch = searchTerm === '' || 
      item.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // آمار داروها
  const stats = {
    total: safeItems.length,
    active: safeItems.filter(item => item.status === 'در حال مصرف').length,
    stopped: safeItems.filter(item => item.status === 'قطع شده').length,
    oneTime: safeItems.filter(item => item.status === 'تک‌دوز').length,
    periodic: safeItems.filter(item => item.status === 'دوره‌ای').length,
    prn: safeItems.filter(item => item.status === 'PRN').length
  };

  // وضعیت نمایش خلاصه
  useEffect(() => {
    if (safeItems.length > 0) {
      setShowSummary(true);
    }
  }, [safeItems.length]);

  // تابع تبدیل مقدار مصرف به متن خوانا
  const formatDosageSchedule = (item) => {
    if (!item.frequency || !item.dosageType) return 'مشخص نشده';
    
    switch (item.dosageType) {
      case 'daily':
        const daily = item.frequency.daily;
        if (daily.times === 1) return 'روزی یکبار';
        if (daily.times === 2) return 'روزی دوبار';
        if (daily.times === 3) return 'روزی سه بار';
        if (daily.times === 4) return 'روزی چهار بار';
        if (daily.schedule && daily.schedule.length > 0) {
          return `روزی ${daily.times} بار (ساعات: ${daily.schedule.join('، ')})`;
        }
        return `روزی ${daily.times} بار`;
        
      case 'weekly':
        const weekly = item.frequency.weekly;
        const dayNames = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
        const days = weekly.days.map(d => dayNames[d]).join('، ');
        return `هفته‌ای ${weekly.times} بار در روزهای ${days}`;
        
      case 'monthly':
        return `ماهیانه ${item.frequency.monthly.times} بار در روزهای ${item.frequency.monthly.days.join('، ')} ماه`;
        
      case 'prn':
        return `در صورت نیاز - ${item.frequency.prn.reason || 'موارد مصرف مشخص نشده'}`;
        
      case 'custom':
        return item.frequency.custom.instruction || 'دستور خاص';
        
      default:
        return 'نامشخص';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // اگر فیلد مربوط به فرکانس است
    if (name.startsWith('frequency.')) {
      const parts = name.split('.');
      const category = parts[1]; // daily, weekly, etc.
      const field = parts[2]; // times, days, etc.
      
      setFormData(prev => ({
        ...prev,
        frequency: {
          ...prev.frequency,
          [category]: {
            ...prev.frequency[category],
            [field]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // پاک کردن خطا هنگام تایپ
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // مدیریت انتخاب روزهای هفته
  const handleWeeklyDayToggle = (dayIndex) => {
    setFormData(prev => ({
      ...prev,
      frequency: {
        ...prev.frequency,
        weekly: {
          ...prev.frequency.weekly,
          days: prev.frequency.weekly.days.includes(dayIndex)
            ? prev.frequency.weekly.days.filter(d => d !== dayIndex)
            : [...prev.frequency.weekly.days, dayIndex].sort()
        }
      }
    }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    if (!formData.drugName.trim()) {
      errors.drugName = 'نام دارو الزامی است';
      isValid = false;
    }
    
    if (!formData.dosage.trim()) {
      errors.dosage = 'دوز دارو الزامی است';
      isValid = false;
    } else if (isNaN(parseFloat(formData.dosage))) {
      errors.dosage = 'دوز باید عددی باشد';
      isValid = false;
    }
    
    if (!formData.startDate) {
      errors.startDate = 'تاریخ شروع الزامی است';
      isValid = false;
    }
    
    if (formData.endDate && formData.endDate < formData.startDate) {
      errors.endDate = 'تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد';
      isValid = false;
    }
    
    // اعتبارسنجی بر اساس نوع دوزبندی
    if (dosageType === 'weekly' && formData.frequency.weekly.days.length === 0) {
      errors.weeklyDays = 'حداقل یک روز از هفته را انتخاب کنید';
      isValid = false;
    }
    
    if (dosageType === 'monthly' && formData.frequency.monthly.days.length === 0) {
      errors.monthlyDays = 'حداقل یک روز از ماه را انتخاب کنید';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newItem = {
      id: editingId || Date.now(),
      ...formData,
      dosageType: dosageType,
      dosage: `${formData.dosage} ${formData.dosageUnit}`,
      dosageSchedule: formatDosageSchedule({ ...formData, dosageType }),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      source: 'دستی'
    };

    if (editingId) {
      onEdit(editingId, newItem);
      setEditingId(null);
    } else {
      onAdd(newItem);
    }

    handleCloseModal();
    setShowMedicationList(true);
    setFormErrors({});
  };

  const handleEdit = (item) => {
    // استخراج دوز و واحد از رشته
    const dosageParts = item.dosage?.split(' ') || ['', ''];
    
    setFormData({
      drugName: item.drugName || '',
      dosage: dosageParts[0] || '',
      dosageUnit: dosageParts[1] || 'mg',
      dosageType: item.dosageType || 'daily',
      frequency: item.frequency || {
        daily: { times: 1, schedule: [], withMeal: 'none' },
        weekly: { days: [], times: 1 },
        monthly: { days: [], times: 1 },
        prn: { maxDaily: '', minInterval: '', reason: '' },
        custom: { instruction: '' }
      },
      startDate: item.startDate || new Date().toISOString().split('T')[0],
      endDate: item.endDate || '',
      duration: item.duration || '',
      purpose: item.purpose || '',
      prescribingDoctor: item.prescribingDoctor || localStorage.getItem("doctorName") || "دکتر",
      status: item.status || 'در حال مصرف',
      notes: item.notes || '',
      drugCode: item.drugCode || '',
      route: item.route || 'خوراکی',
      warnings: item.warnings || '',
      refills: item.refills || '',
      lastRefillDate: item.lastRefillDate || ''
    });
    setDosageType(item.dosageType || 'daily');
    setEditingId(item.id);
    setShowAddModal(true);
    setFormErrors({});
  };

  const handleCloseModal = () => {
    setFormData({
      drugName: '',
      dosage: '',
      dosageUnit: 'mg',
      dosageType: 'daily',
      frequency: {
        daily: { times: 1, schedule: [], withMeal: 'none' },
        weekly: { days: [], times: 1 },
        monthly: { days: [], times: 1 },
        prn: { maxDaily: '', minInterval: '', reason: '' },
        custom: { instruction: '' }
      },
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      duration: '',
      purpose: '',
      prescribingDoctor: localStorage.getItem("doctorName") || "دکتر",
      status: 'در حال مصرف',
      notes: '',
      drugCode: '',
      route: 'خوراکی',
      warnings: '',
      refills: '',
      lastRefillDate: ''
    });
    setDosageType('daily');
    setEditingId(null);
    setShowAddModal(false);
    setFormErrors({});
  };

  const handleRemove = (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmRemove = () => {
    onRemove(showDeleteConfirm);
    setShowDeleteConfirm(null);
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
      case 'در حال مصرف': return 'bg-green-100 text-green-800 border border-green-200';
      case 'قطع شده': return 'bg-red-100 text-red-800 border border-red-200';
      case 'تک‌دوز': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'دوره‌ای': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'PRN': return 'bg-amber-100 text-amber-800 border border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'در حال مصرف': return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'قطع شده': return <FiMinusCircle className="w-5 h-5 text-red-500" />;
      case 'تک‌دوز': return <FiActivity className="w-5 h-5 text-blue-500" />;
      case 'دوره‌ای': return <FiRefreshCw className="w-5 h-5 text-purple-500" />;
      case 'PRN': return <FiAlertCircle className="w-5 h-5 text-amber-500" />;
      default: return <FiActivity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRouteColor = (route) => {
    switch (route) {
      case 'خوراکی': return 'text-blue-600 bg-blue-50';
      case 'تزریقی': return 'text-red-600 bg-red-50';
      case 'موضعی': return 'text-green-600 bg-green-50';
      case 'استنشاقی': return 'text-purple-600 bg-purple-50';
      case 'زیرزبانی': return 'text-pink-600 bg-pink-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-xl">
      {/* هدر اصلی */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="relative">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 md:p-4 rounded-xl shadow-lg">
              <FiPackage className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>سوابق دارویی</span>
              {safeItems.length > 0 && (
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm px-3 py-1 rounded-full">
                  {safeItems.length} دارو
                </span>
              )}
            </h2>
           
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* دکمه نمایش/پنهان لیست */}
          {safeItems.length > 0 && (
            <button
              onClick={() => setShowMedicationList(!showMedicationList)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl ${
                showMedicationList 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white' 
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white'
              }`}
            >
              {showMedicationList ? (
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
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium min-w-[140px]"
            >
              <FiPlus className="w-4 h-4" />
              <span>افزودن دارو</span>
            </button>
          )}
        </div>
      </div>

      {/* خلاصه وضعیت داروها (همیشه نمایش داده می‌شود) */}
      {safeItems.length > 0 && showSummary && !showMedicationList && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FiPackage className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-gray-800 font-bold text-lg">داروهای ثبت شده</h3>
                <p className="text-gray-600 text-sm">خلاصه وضعیت داروهای بیمار</p>
              </div>
            </div>
            <button
              onClick={() => setShowSummary(false)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 text-center border border-green-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium">فعال</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-gray-500 mt-1">دارو</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center border border-red-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">قطع شده</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.stopped}</div>
              <div className="text-xs text-gray-500 mt-1">دارو</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center border border-blue-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">تک‌دوز</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.oneTime}</div>
              <div className="text-xs text-gray-500 mt-1">دارو</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center border border-purple-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">دوره‌ای</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.periodic + stats.prn}</div>
              <div className="text-xs text-gray-500 mt-1">دارو</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-blue-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiInfo className="w-4 h-4" />
              <span>برای مشاهده جزئیات کامل، روی دکمه "مشاهده لیست" کلیک کنید</span>
            </div>
            <button
              onClick={() => setShowMedicationList(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow hover:shadow-md"
            >
              <FiEye className="w-4 h-4" />
              <span>مشاهده لیست کامل</span>
            </button>
          </div>
        </div>
      )}

      {/* پیام وقتی خلاصه بسته شده */}
      {!showSummary && safeItems.length > 0 && !showMedicationList && (
        <div className="mb-6 text-center py-4">
          <button
            onClick={() => setShowSummary(true)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mx-auto"
          >
            <FiChevronDown className="w-4 h-4" />
            <span>نمایش خلاصه داروها</span>
          </button>
        </div>
      )}

      {/* فیلتر و جستجو (فقط وقتی لیست باز است) */}
      {showMedicationList && safeItems.length > 0 && (
        <>
          {/* دکمه‌های فیلتر */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${activeFilter === 'all' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <FiFilter className="w-4 h-4" />
                همه
              </button>
              <button
                onClick={() => setActiveFilter('در حال مصرف')}
                className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${activeFilter === 'در حال مصرف' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                فعال
              </button>
              <button
                onClick={() => setActiveFilter('قطع شده')}
                className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${activeFilter === 'قطع شده' 
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                قطع شده
              </button>
              <button
                onClick={() => setActiveFilter('تک‌دوز')}
                className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${activeFilter === 'تک‌دوز' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                تک‌دوز
              </button>
              <button
                onClick={() => setActiveFilter('PRN')}
                className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${activeFilter === 'PRN' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                PRN
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
                placeholder="جستجوی دارو، هدف درمان یا یادداشت..."
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
                {filteredItems.length} مورد از {safeItems.length} دارو یافت شد
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

      {/* لیست داروها */}
      {showMedicationList ? (
        filteredItems.length > 0 ? (
          <div className="space-y-4 animate-fadeIn">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="p-4 md:p-5">
                  {/* هدر آیتم */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg md:text-xl">{item.drugName}</h3>
                          {item.drugCode && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              کد: {item.drugCode}
                            </span>
                          )}
                          {item.route === 'تزریقی' && (
                            <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full flex items-center gap-1">
                              <FiAlertTriangle className="w-3 h-3" />
                              تزریقی
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <FiPackage className="text-gray-400 w-4 h-4" />
                            <span className="text-gray-700 font-medium">{item.dosage}</span>
                          </div>
                          <div className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRouteColor(item.route)}`}>
                            {item.route}
                          </span>
                          {item.status === 'در حال مصرف' && (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              فعال
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleItemExpansion(item.id)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                          title={expandedItems.has(item.id) ? "بستن جزئیات" : "مشاهده جزئیات"}
                        >
                          {expandedItems.has(item.id) ? (
                            <FiChevronUp className="w-4 h-4" />
                          ) : (
                            <FiChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="ویرایش دارو"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="حذف دارو"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* اطلاعات اصلی (همیشه نمایش) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FiCalendar className="text-gray-500 w-4 h-4" />
                        <span className="text-gray-700 text-sm font-medium">دوره درمان</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-right">
                          <div className="text-xs text-gray-500">شروع</div>
                          <div className="font-bold text-gray-900">{item.startDate}</div>
                        </div>
                        <div className="w-6 h-px bg-gray-300 mx-2"></div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">پایان</div>
                          <div className="font-bold text-gray-900">
                            {item.endDate ? item.endDate : 'تاکنون'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FiClock className="text-gray-500 w-4 h-4" />
                        <span className="text-gray-700 text-sm font-medium">مقدار مصرف</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-lg">
                          {item.dosageSchedule || formatDosageSchedule(item)}
                        </div>
                        {item.frequency?.prn?.reason && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.frequency.prn.reason}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="mb-2">
                        <span className="text-gray-700 text-sm font-medium">هدف درمان</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 line-clamp-1">
                          {item.purpose || '---'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* اطلاعات اضافی (فقط وقتی expand شده) */}
                  {expandedItems.has(item.id) && (
                    <div className="border-t border-gray-100 pt-4 mt-4 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <FiUser className="text-gray-400 w-4 h-4" />
                            <span className="text-gray-600 text-sm">تجویز کننده:</span>
                            <span className="font-medium text-gray-900">{item.prescribingDoctor}</span>
                          </div>
                          
                          {item.refills && (
                            <div className="flex items-center gap-2">
                              <FiRefreshCw className="text-gray-400 w-4 h-4" />
                              <span className="text-gray-600 text-sm">تکرار نسخه:</span>
                              <span className="font-medium text-gray-900">{item.refills} بار</span>
                              {item.lastRefillDate && (
                                <span className="text-xs text-gray-500">
                                  (آخرین: {item.lastRefillDate})
                                </span>
                              )}
                            </div>
                          )}
                          
                          {item.notes && (
                            <div className="flex items-start gap-2">
                              <FiInfo className="text-blue-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div className="text-right">
                                <div className="text-gray-600 text-sm mb-1">یادداشت:</div>
                                <div className="text-gray-800 text-sm bg-blue-50 p-3 rounded-lg">
                                  {item.notes}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          {item.warnings && (
                            <div className="flex items-start gap-2">
                              <FiAlertCircle className="text-amber-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div className="text-right">
                                <div className="text-gray-600 text-sm mb-1">هشدارها:</div>
                                <div className="text-amber-700 text-sm bg-amber-50 p-3 rounded-lg">
                                  {item.warnings}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {item.frequency?.daily?.withMeal && item.frequency.daily.withMeal !== 'none' && (
                            <div className="flex items-start gap-2 mt-3">
                              <FiInfo className="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div className="text-right">
                                <div className="text-gray-600 text-sm mb-1">نحوه مصرف:</div>
                                <div className="text-green-700 text-sm bg-green-50 p-3 rounded-lg">
                                  {item.frequency.daily.withMeal === 'before' && 'ناشتا مصرف شود'}
                                  {item.frequency.daily.withMeal === 'after' && 'بعد از غذا مصرف شود'}
                                  {item.frequency.daily.withMeal === 'with' && 'همراه با غذا مصرف شود'}
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
                <div className={`h-1 ${
                  item.status === 'در حال مصرف' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                  item.status === 'قطع شده' ? 'bg-gradient-to-r from-red-400 to-rose-500' :
                  item.status === 'تک‌دوز' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                  item.status === 'PRN' ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                  'bg-gradient-to-r from-purple-400 to-violet-500'
                }`}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner">
              <FiSearch className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
            </div>
            <h4 className="text-gray-700 font-bold text-lg md:text-xl mb-2 md:mb-3">دارویی یافت نشد</h4>
            <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto mb-6 md:mb-8">
              هیچ دارویی با فیلترهای انتخاب شده مطابقت ندارد. فیلترها را تغییر دهید یا داروی جدیدی اضافه کنید.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                }}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-all font-medium"
              >
                پاکسازی فیلترها
              </button>
              {showAddButton && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl transition-all font-medium"
                >
                  افزودن داروی جدید
                </button>
              )}
            </div>
          </div>
        )
      ) : safeItems.length === 0 ? (
        // وقتی هیچ دارویی ثبت نشده
        <div className="text-center py-12 md:py-16 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner">
            <FiPackage className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
          </div>
          <h4 className="text-gray-700 font-bold text-lg md:text-xl mb-2 md:mb-3">هنوز دارویی ثبت نشده است</h4>
          <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto mb-6 md:mb-8">
            ثبت دقیق سوابق دارویی بیمار، نقش کلیدی در درمان و پیشگیری از تداخلات دارویی دارد
          </p>
          {showAddButton && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
            >
              <FiPlus className="w-5 h-5" />
              افزودن اولین داروی بیمار
            </button>
          )}
        </div>
      ) : null}

      {/* مودال افزودن/ویرایش */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200">
            {/* هدر مودال */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-green-700 text-white p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FiPackage className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold">
                      {editingId ? 'ویرایش اطلاعات دارو' : 'ثبت داروی جدید'}
                    </h3>
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
            
            {/* بدنه مودال */}
            <div className="p-5 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {/* ستون اول */}
                <div className="space-y-5">
                  {/* نام دارو */}
                  <div>
                    <label className="text-gray-800 font-medium mb-2 flex items-center gap-2">
                      <span className="text-red-500">*</span>
                      نام دارو
                    </label>
                    <input
                      type="text"
                      name="drugName"
                      value={formData.drugName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 ${formErrors.drugName ? 'border-red-300' : 'border-gray-300'} rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-lg placeholder:text-gray-400`}
                      placeholder="مثال: آتورواستاتین"
                      dir="rtl"
                    />
                    {formErrors.drugName && (
                      <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4" />
                        {formErrors.drugName}
                      </p>
                    )}
                  </div>
                  
                  {/* دوز و واحد */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-800 font-medium mb-2 flex items-center gap-2">
                        <span className="text-red-500">*</span>
                        دوز
                      </label>
                      <input
                        type="number"
                        name="dosage"
                        value={formData.dosage}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 ${formErrors.dosage ? 'border-red-300' : 'border-gray-300'} rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
                        placeholder="20"
                        step="0.1"
                        min="0"
                      />
                      {formErrors.dosage && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                          <FiAlertCircle className="w-4 h-4" />
                          {formErrors.dosage}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">واحد</label>
                      <select
                        name="dosageUnit"
                        value={formData.dosageUnit}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      >
                        <option value="mg">میلی‌گرم (mg)</option>
                        <option value="mcg">میکروگرم (mcg)</option>
                        <option value="g">گرم (g)</option>
                        <option value="ml">میلی‌لیتر (ml)</option>
                        <option value="IU">واحد بین‌المللی (IU)</option>
                        <option value="unit">واحد</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* کد دارو و راه مصرف */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">کد دارو</label>
                      <input
                        type="text"
                        name="drugCode"
                        value={formData.drugCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        placeholder="ATC Code"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">راه مصرف</label>
                      <select
                        name="route"
                        value={formData.route}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      >
                        <option value="خوراکی">خوراکی</option>
                        <option value="تزریقی">تزریقی</option>
                        <option value="موضعی">موضعی</option>
                        <option value="استنشاقی">استنشاقی</option>
                        <option value="زیرزبانی">زیرزبانی</option>
                        <option value="مقعدی">مقعدی</option>
                        <option value="واژینال">واژینال</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* تعداد تکرار نسخه */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">تعداد تکرار نسخه</label>
                      <input
                        type="number"
                        name="refills"
                        value={formData.refills}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">آخرین تکرار</label>
                      <input
                        type="date"
                        name="lastRefillDate"
                        value={formData.lastRefillDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
                
                {/* ستون دوم */}
                <div className="space-y-5">
                  {/* تاریخ‌ها */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-800 font-medium mb-2 flex items-center gap-2">
                        <span className="text-red-500">*</span>
                        تاریخ شروع
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 ${formErrors.startDate ? 'border-red-300' : 'border-gray-300'} rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
                      />
                      {formErrors.startDate && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                          <FiAlertCircle className="w-4 h-4" />
                          {formErrors.startDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">تاریخ پایان</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 ${formErrors.endDate ? 'border-red-300' : 'border-gray-300'} rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
                      />
                      {formErrors.endDate && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                          <FiAlertCircle className="w-4 h-4" />
                          {formErrors.endDate}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* مدت زمان درمان */}
                  <div>
                    <label className="block text-gray-800 font-medium mb-2">مدت زمان درمان</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      placeholder="مثال: 2 هفته، 1 ماه، 6 ماه"
                    />
                  </div>
                  
                  {/* وضعیت */}
                  <div>
                    <label className="block text-gray-800 font-medium mb-2">وضعیت مصرف</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    >
                      <option value="در حال مصرف">در حال مصرف</option>
                      <option value="قطع شده">قطع شده</option>
                      <option value="تک‌دوز">تک‌دوز</option>
                      <option value="دوره‌ای">دوره‌ای</option>
                      <option value="PRN">در صورت نیاز (PRN)</option>
                    </select>
                  </div>
                  
                  {/* هدف درمان */}
                  <div>
                    <label className="block text-gray-800 font-medium mb-2">هدف درمان / اندیکاسیون</label>
                    <input
                      type="text"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      placeholder="مثال: کنترل فشار خون، کاهش کلسترول"
                    />
                  </div>
                  
                  {/* پزشک تجویزکننده */}
                  <div>
                    <label className="block text-gray-800 font-medium mb-2">پزشک تجویزکننده</label>
                    <input
                      type="text"
                      name="prescribingDoctor"
                      value={formData.prescribingDoctor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    />
                  </div>
                </div>
                
                {/* بخش مقدار مصرف (تمام عرض) */}
                <div className="md:col-span-2">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FiClock className="text-blue-600" />
                      برنامه مصرف دارو
                    </h4>
                    
                    {/* انتخاب نوع دوزبندی */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setDosageType('daily')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          dosageType === 'daily' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        روزانه
                      </button>
                      <button
                        type="button"
                        onClick={() => setDosageType('weekly')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          dosageType === 'weekly' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        هفتگی
                      </button>
                      <button
                        type="button"
                        onClick={() => setDosageType('monthly')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          dosageType === 'monthly' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        ماهانه
                      </button>
                      <button
                        type="button"
                        onClick={() => setDosageType('prn')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          dosageType === 'prn' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        در صورت نیاز (PRN)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDosageType('custom')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          dosageType === 'custom' 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        دستور خاص
                      </button>
                    </div>
                    
                    {/* فرم بر اساس نوع دوزبندی */}
                    <div className="bg-white p-4 rounded-lg">
                      {dosageType === 'daily' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              تعداد دفعات در روز
                            </label>
                            <select
                              name="frequency.daily.times"
                              value={formData.frequency.daily.times}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value={1}>روزی یکبار</option>
                              <option value={2}>روزی دوبار</option>
                              <option value={3}>روزی سه بار</option>
                              <option value={4}>روزی چهار بار</option>
                              <option value={5}>روزی پنج بار</option>
                              <option value={6}>روزی شش بار</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              نحوه مصرف نسبت به غذا
                            </label>
                            <select
                              name="frequency.daily.withMeal"
                              value={formData.frequency.daily.withMeal}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="none">مهم نیست</option>
                              <option value="before">ناشتا (قبل از غذا)</option>
                              <option value="after">بعد از غذا</option>
                              <option value="with">همراه با غذا</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              ساعات مصرف (اختیاری - با کاما جدا کنید)
                            </label>
                            <input
                              type="text"
                              name="frequency.daily.schedule"
                              value={formData.frequency.daily.schedule.join('، ')}
                              onChange={(e) => {
                                const schedules = e.target.value.split('،').map(s => s.trim()).filter(s => s);
                                setFormData(prev => ({
                                  ...prev,
                                  frequency: {
                                    ...prev.frequency,
                                    daily: {
                                      ...prev.frequency.daily,
                                      schedule: schedules
                                    }
                                  }
                                }));
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="مثال: ۸ صبح، ۲ بعدازظهر، ۸ شب"
                            />
                          </div>
                        </div>
                      )}
                      
                      {dosageType === 'weekly' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              روزهای هفته
                            </label>
                            <div className="grid grid-cols-7 gap-1">
                              {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((day, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleWeeklyDayToggle(index)}
                                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                                    formData.frequency.weekly.days.includes(index)
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  {day}
                                </button>
                              ))}
                            </div>
                            {formErrors.weeklyDays && (
                              <p className="text-red-600 text-sm mt-2">{formErrors.weeklyDays}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              تعداد دفعات در روز
                            </label>
                            <select
                              name="frequency.weekly.times"
                              value={formData.frequency.weekly.times}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value={1}>یکبار در روز</option>
                              <option value={2}>دوبار در روز</option>
                              <option value={3}>سه بار در روز</option>
                            </select>
                          </div>
                        </div>
                      )}
                      
                      {dosageType === 'monthly' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              روزهای ماه (مثال: 1,15,30)
                            </label>
                            <input
                              type="text"
                              value={formData.frequency.monthly.days.join(',')}
                              onChange={(e) => {
                                const days = e.target.value.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d) && d >= 1 && d <= 31);
                                setFormData(prev => ({
                                  ...prev,
                                  frequency: {
                                    ...prev.frequency,
                                    monthly: {
                                      ...prev.frequency.monthly,
                                      days: days
                                    }
                                  }
                                }));
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="1, 15, 30"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              تعداد دفعات در روز
                            </label>
                            <select
                              name="frequency.monthly.times"
                              value={formData.frequency.monthly.times}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value={1}>یکبار در روز</option>
                              <option value={2}>دوبار در روز</option>
                              <option value={3}>سه بار در روز</option>
                            </select>
                          </div>
                        </div>
                      )}
                      
                      {dosageType === 'prn' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              موارد مصرف
                            </label>
                            <input
                              type="text"
                              name="frequency.prn.reason"
                              value={formData.frequency.prn.reason}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="مثال: در صورت درد، در صورت تهوع"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">
                                حداکثر در روز
                              </label>
                              <input
                                type="number"
                                name="frequency.prn.maxDaily"
                                value={formData.frequency.prn.maxDaily}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="مثال: 4"
                                min="1"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">
                                حداقل فاصله (ساعت)
                              </label>
                              <input
                                type="number"
                                name="frequency.prn.minInterval"
                                value={formData.frequency.prn.minInterval}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="مثال: 6"
                                min="1"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {dosageType === 'custom' && (
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            دستور مصرف خاص
                          </label>
                          <textarea
                            name="frequency.custom.instruction"
                            value={formData.frequency.custom.instruction}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="مثال: روزهای فرد هفته، یک روز در میان، هر 12 ساعت و ..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* هشدارها و یادداشت‌ها (تمام عرض) */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-gray-800 font-medium mb-2 flex items-center gap-2">
                      <FiAlertCircle className="text-amber-500" />
                      هشدارها و نکات مهم
                    </label>
                    <input
                      type="text"
                      name="warnings"
                      value={formData.warnings}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl text-right focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                      placeholder="مثال: همراه غذا مصرف شود، از مصرف الکل خودداری شود"
                    />
                  </div>
                  
                  <div>
                    <label className="text-gray-800 font-medium mb-2 flex items-center gap-2">
                      <FiInfo className="text-blue-500" />
                      توضیحات و یادداشت‌ها
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
                      placeholder="هرگونه توضیح اضافی درباره دارو، عوارض جانبی، پاسخ بیمار و ..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* فوتر مودال */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiAlertCircle className="w-4 h-4" />
                <span>فیلدهای ستاره‌دار (*) الزامی هستند</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-all font-medium shadow-sm hover:shadow"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <FiCheck className="w-5 h-5" />
                  {editingId ? 'ذخیره تغییرات' : 'ثبت دارو'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال تایید حذف */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FiTrash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">تایید حذف دارو</h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-5 md:p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiAlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-gray-800 font-bold text-lg mb-2">
                  آیا از حذف این دارو اطمینان دارید؟
                </h4>
                <p className="text-gray-600 text-sm">
                  این عمل قابل بازگشت نیست و اطلاعات دارو به طور کامل حذف خواهد شد.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-all font-medium"
                >
                  انصراف
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2"
                >
                  <FiTrash2 className="w-5 h-5" />
                  حذف دارو
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationHistorySection;