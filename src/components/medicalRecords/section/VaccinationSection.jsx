import React, { useState, useRef, useEffect } from 'react';
import { 
  FiPackage, 
  FiPlus, 
  FiX, 
  FiEdit2, 
  FiTrash2, 
  FiCheck, 
  FiCalendar, 
  FiChevronDown, 
  FiChevronUp,
  FiEye,
  FiEyeOff,
  FiInfo
} from 'react-icons/fi';

// کامپوننت EditableVaccinationItem برای ویرایش inline
const EditableVaccinationItem = React.memo(({ item, onEdit, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.text || '');
  const [editedDate, setEditedDate] = useState(item.date || '');
  const [editedDose, setEditedDose] = useState(item.dose || '');
  const [editedType, setEditedType] = useState(item.vaccineType || '');
  const [editedDetails, setEditedDetails] = useState(item.details || '');
  const [showDetails, setShowDetails] = useState(false);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    if (editedText.trim() && onEdit) {
      onEdit(item.id, editedText, editedDate, editedDose, editedType, editedDetails);
      setIsEditing(false);
      setShowDetails(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedText(item.text || '');
    setEditedDate(item.date || '');
    setEditedDose(item.dose || '');
    setEditedType(item.vaccineType || '');
    setEditedDetails(item.details || '');
    setIsEditing(false);
    setShowDetails(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const getVaccineInfo = (type) => {
    switch(type) {
      case 'آنفلوآنزا':
        return { 
          color: 'text-blue-600', 
          bgColor: 'bg-blue-100', 
          border: 'border-blue-200',
          icon: '❄️'
        };
      case 'کووید':
        return { 
          color: 'text-red-600', 
          bgColor: 'bg-red-100', 
          border: 'border-red-200',
          icon: '🦠'
        };
      case 'کزاز':
        return { 
          color: 'text-green-600', 
          bgColor: 'bg-green-100', 
          border: 'border-green-200',
          icon: '🛡️'
        };
      case 'هپاتیت':
        return { 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-100', 
          border: 'border-yellow-200',
          icon: '🩺'
        };
      case 'پنوموکوک':
        return { 
          color: 'text-purple-600', 
          bgColor: 'bg-purple-100', 
          border: 'border-purple-200',
          icon: '🫁'
        };
      case 'مننژیت':
        return { 
          color: 'text-indigo-600', 
          bgColor: 'bg-indigo-100', 
          border: 'border-indigo-200',
          icon: '🧠'
        };
      default:
        return { 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100', 
          border: 'border-gray-200',
          icon: '💉'
        };
    }
  };

  const vaccineInfo = getVaccineInfo(item.vaccineType || editedType);

  return (
    <div className="group p-3 md:p-4 hover:bg-gray-50 rounded-xl border border-gray-200 mb-3 transition-all duration-200 hover:shadow-sm">
      {isEditing ? (
        <div className="space-y-4">
          {/* ردیف اول: نام واکسن و نوع */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">نام واکسن</label>
              <input
                ref={editInputRef}
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                placeholder="مثال: واکسن آنفلوآنزا"
                autoComplete="off"
              />
            </div>
            <div className="w-full md:w-40">
              <label className="block text-xs text-gray-600 mb-1">نوع واکسن</label>
              <select
                value={editedType}
                onChange={(e) => setEditedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
              >
                <option value="">انتخاب نوع</option>
                <option value="آنفلوآنزا">آنفلوآنزا</option>
                <option value="کووید">کووید</option>
                <option value="کزاز">کزاز</option>
                <option value="هپاتیت">هپاتیت</option>
                <option value="سرخک">سرخک</option>
                <option value="پنوموکوک">پنوموکوک</option>
                <option value="مننژیت">مننژیت</option>
                <option value="آبله مرغان">آبله مرغان</option>
                <option value="زونا">زونا</option>
                <option value="سایر">سایر</option>
              </select>
            </div>
          </div>

          {/* ردیف دوم: تاریخ و دوز */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">تاریخ تزریق</label>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={editedDate}
                  onChange={(e) => setEditedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                  placeholder="1402/05/15"
                />
              </div>
            </div>
            <div className="w-full md:w-40">
              <label className="block text-xs text-gray-600 mb-1">دوز</label>
              <select
                value={editedDose}
                onChange={(e) => setEditedDose(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
              >
                <option value="">انتخاب دوز</option>
                <option value="دوز اول">دوز اول</option>
                <option value="دوز دوم">دوز دوم</option>
                <option value="دوز سوم">دوز سوم</option>
                <option value="یادآور">یادآور</option>
                <option value="تک دوز">تک دوز</option>
                <option value="سالانه">سالانه</option>
              </select>
            </div>
          </div>

          {/* جزئیات */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">جزئیات (اختیاری)</label>
            <textarea
              value={editedDetails}
              onChange={(e) => setEditedDetails(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
              placeholder="توضیحات اضافی، عوارض جانبی یا نکات مهم"
              rows="2"
            />
          </div>

          {/* دکمه‌های ویرایش */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSaveEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition text-sm font-medium"
            >
              <FiCheck className="w-4 h-4" />
              ذخیره تغییرات
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition text-sm font-medium"
            >
              <FiX className="w-4 h-4" />
              لغو
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* نمایش حالت عادی */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                <div className={`px-3 py-1 rounded-lg text-xs font-medium border ${vaccineInfo.bgColor} ${vaccineInfo.color} ${vaccineInfo.border}`}>
                  {item.vaccineType || 'سایر'}
                </div>
                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 justify-start">
                    <span className="text-lg">{vaccineInfo.icon}</span>
                    <p className="text-gray-800 font-medium text-base">{item.text}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    {item.dose && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        {item.dose}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-gray-400 w-3 h-3" />
                      <p className="text-xs text-gray-500">تاریخ: {item.date || '---'}</p>
                    </div>
                    {item.status === 'دریافت نشده' && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        نیاز به تزریق
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* جزئیات */}
              {item.details && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 text-xs font-medium mb-1"
                  >
                    {showDetails ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
                    جزئیات
                  </button>
                  {showDetails && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-700 text-right">{item.details}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* دکمه‌های ویرایش و حذف */}
            <div className="flex items-center gap-1 md:gap-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                title="ویرایش واکسن"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemove(item.id)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                title="حذف واکسن"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

// تابع مرتب‌سازی واکسن‌ها بر اساس نوع
const sortVaccinationsByType = (vaccinations) => {
  const typeOrder = {
    'کووید': 1,
    'آنفلوآنزا': 2,
    'کزاز': 3,
    'هپاتیت': 4,
    'پنوموکوک': 5,
    'مننژیت': 6,
    'سرخک': 7,
    'آبله مرغان': 8,
    'زونا': 9,
    'سایر': 10
  };
  
  return [...vaccinations].sort((a, b) => {
    const orderA = typeOrder[a.vaccineType] || 99;
    const orderB = typeOrder[b.vaccineType] || 99;
    return orderA - orderB;
  });
};

// لیست واکسن‌های پیشنهادی
const SUGGESTED_VACCINES = [
  { name: "واکسن آنفلوآنزا", type: "آنفلوآنزا", dose: "سالانه", icon: "❄️", desc: "برای همه بزرگسالان توصیه می‌شود" },
  { name: "واکسن کووید-۱۹", type: "کووید", dose: "یادآور", icon: "🦠", desc: "دوزهای یادآور بر اساس پروتکل کشوری" },
  { name: "واکسن کزاز", type: "کزاز", dose: "هر ۱۰ سال", icon: "🛡️", desc: "بعد از هر آسیب‌دیدگی احتمالی" },
  { name: "واکسن هپاتیت B", type: "هپاتیت", dose: "۳ دوز", icon: "🩺", desc: "برای پرسنل درمانی و افراد پرخطر" },
  { name: "واکسن پنوموکوک", type: "پنوموکوک", dose: "تک دوز", icon: "🫁", desc: "برای افراد بالای ۶۵ سال و بیماران مزمن" },
  { name: "واکسن مننژیت", type: "مننژیت", dose: "تک دوز", icon: "🧠", desc: "برای مسافران و دانشجویان خوابگاهی" },
  { name: "واکسن سرخک", type: "سرخک", dose: "۲ دوز", icon: "🌡️", desc: "در کودکی دریافت می‌شود" },
  { name: "واکسن واریسلا", type: "آبله مرغان", dose: "۲ دوز", icon: "🔴", desc: "برای افراد بدون سابقه بیماری" },
];

// کامپوننت اصلی VaccinationSection
const VaccinationSection = React.memo(({
  vaccinations = [],
  onAdd,
  onEdit,
  onRemove,
  showAddButton = true,
  patientAge = null,
  patientConditions = []
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showVaccinationsList, setShowVaccinationsList] = useState(false);
  const [newVaccineText, setNewVaccineText] = useState('');
  const [newVaccineDate, setNewVaccineDate] = useState('');
  const [newVaccineDose, setNewVaccineDose] = useState('');
  const [newVaccineType, setNewVaccineType] = useState('');
  const [newVaccineDetails, setNewVaccineDetails] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const inputRef = useRef(null);

  const safeVaccinations = Array.isArray(vaccinations) ? vaccinations : [];
  const sortedVaccinations = sortVaccinationsByType(safeVaccinations);

  const handleAddVaccine = () => {
    if (newVaccineText.trim()) {
      const newItem = {
        id: Date.now() + Math.random(),
        text: newVaccineText.trim(),
        date: newVaccineDate || new Date().toLocaleDateString('fa-IR'),
        dose: newVaccineDose,
        vaccineType: newVaccineType || 'سایر',
        details: newVaccineDetails.trim(),
        status: 'دریافت شده',
        createdAt: new Date().toISOString(),
        type: 'vaccination'
      };
      onAdd(newItem);
      setNewVaccineText('');
      setNewVaccineDate('');
      setNewVaccineDose('');
      setNewVaccineType('');
      setNewVaccineDetails('');
      setIsAdding(false);
      setShowVaccinationsList(true);
    }
  };

  const handleCancelAdd = () => {
    setNewVaccineText('');
    setNewVaccineDate('');
    setNewVaccineDose('');
    setNewVaccineType('');
    setNewVaccineDetails('');
    setIsAdding(false);
  };

  const handleQuickAdd = (vaccine) => {
    setNewVaccineText(vaccine.name);
    setNewVaccineType(vaccine.type);
    setNewVaccineDose(vaccine.dose);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddVaccine();
    }
  };

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleEditVaccine = (id, newText, newDate, newDose, newType, newDetails) => {
    if (onEdit) {
      onEdit(id, newText, newDate, newDose, newType, newDetails);
    }
  };

  const handleRemoveVaccine = (id) => {
    if (onRemove) {
      onRemove(id);
    }
  };

  // واکسن‌های ضروری بر اساس سن و شرایط
  const getEssentialVaccines = () => {
    const essentials = [];
    
    // واکسن‌های عمومی
    essentials.push({ name: "واکسن آنفلوآنزا", reason: "همه بزرگسالان", priority: "بالا" });
    
    // بر اساس سن
    if (patientAge >= 65) {
      essentials.push({ name: "واکسن پنوموکوک", reason: "سن بالای ۶۵ سال", priority: "بالا" });
      essentials.push({ name: "واکسن زونا", reason: "سن بالای ۵۰ سال", priority: "متوسط" });
    }
    
    // بر اساس شرایط پزشکی
    if (patientConditions && patientConditions.includes('دیابت')) {
      essentials.push({ name: "واکسن هپاتیت B", reason: "بیماران دیابتی", priority: "بالا" });
    }
    
    if (patientConditions && patientConditions.includes('بیماری قلبی')) {
      essentials.push({ name: "واکسن آنفلوآنزا", reason: "بیماران قلبی", priority: "بالا" });
    }
    
    if (patientConditions && patientConditions.includes('سرطان')) {
      essentials.push({ name: "واکسن پنوموکوک", reason: "بیماران سرطانی", priority: "بالا" });
    }
    
    return essentials;
  };

  const essentialVaccines = getEssentialVaccines();

  // آمار و اطلاعات
  const calculateStats = () => {
    const total = safeVaccinations.length;
    const thisYear = safeVaccinations.filter(item => {
      const currentYear = new Date().getFullYear();
      return item.date && item.date.includes(currentYear.toString());
    }).length;
    
    const pending = safeVaccinations.filter(item => 
      item.status === 'دریافت نشده' || item.status === 'نیاز به تزریق'
    ).length;
    
    const completed = safeVaccinations.filter(item => 
      item.status === 'دریافت شده'
    ).length;

    // واکسن‌های ضروری دریافت نشده
    const missingEssentials = essentialVaccines.filter(essential => 
      !safeVaccinations.some(vaccine => vaccine.text.includes(essential.name.split(' ')[1]))
    );

    return { total, thisYear, pending, completed, missingEssentials };
  };

  const stats = calculateStats();

  // راهنمای دوز واکسن
  const doseGuide = [
    { dose: 'دوز اول', desc: 'شروع واکسیناسیون' },
    { dose: 'دوز دوم', desc: 'تکمیل اولیه ایمنی' },
    { dose: 'یادآور', desc: 'تقویت ایمنی' },
    { dose: 'سالانه', desc: 'واکسن‌های فصلی' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-xl">
      {/* هدر */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 shadow-sm">
            <FiPackage className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">واکسیناسیون</h3>
            <p className="text-gray-600 text-sm mt-1">
              {sortedVaccinations.length} مورد ثبت شده
              <span className="mr-2">•</span>
              {stats.completed} دریافت شده
              {stats.missingEssentials.length > 0 && (
                <>
                  <span className="mr-2">•</span>
                  <span className="text-red-500">{stats.missingEssentials.length} مورد ضروری باقی‌مانده</span>
                </>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* دکمه نمایش/پنهان لیست */}
          {sortedVaccinations.length > 0 && (
            <button
              onClick={() => setShowVaccinationsList(!showVaccinationsList)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 text-sm font-medium"
            >
              {showVaccinationsList ? (
                <>
                  <FiEyeOff className="w-4 h-4" />
                  بستن لیست
                </>
              ) : (
                <>
                  <FiEye className="w-4 h-4" />
                  مشاهده لیست
                </>
              )}
            </button>
          )}
          
          {/* دکمه افزودن واکسن جدید */}
          {showAddButton && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm md:text-base font-medium"
            >
              <FiPlus className="w-5 h-5" />
              <span>افزودن واکسن جدید</span>
            </button>
          )}
        </div>
      </div>

      {/* لیست واکسن‌ها */}
      {showVaccinationsList && sortedVaccinations.length > 0 && (
        <div className="mb-6">
          <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {sortedVaccinations.map((vaccine) => (
              <EditableVaccinationItem
                key={vaccine.id}
                item={vaccine}
                onEdit={handleEditVaccine}
                onRemove={handleRemoveVaccine}
              />
            ))}
          </div>
        </div>
      )}

      {/* پیام وقتی لیست خالی است */}
      {!isAdding && sortedVaccinations.length === 0 && (
        <div className="text-center py-10 md:py-12 border-3 border-dashed border-gray-300 rounded-2xl bg-gradient-to-b from-gray-50 to-white">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPackage className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
          </div>
          <h4 className="text-gray-600 font-medium text-lg mb-2">واکسنی ثبت نشده است</h4>
          <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
            ثبت سابقه واکسیناسیون به ارزیابی دقیق‌تر سلامت بیمار کمک می‌کند
          </p>
          {showAddButton && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition"
            >
              <FiPlus className="w-5 h-5" />
              افزودن اولین واکسن
            </button>
          )}
        </div>
      )}

      {/* فرم افزودن جدید */}
      {isAdding && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 md:p-6 mb-6 border border-green-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiPlus className="text-green-600" />
              افزودن واکسن جدید
            </h4>
            
            <div className="space-y-4">
              {/* ردیف اول: نام واکسن و نوع */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام واکسن
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={newVaccineText}
                    onChange={(e) => setNewVaccineText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="مثال: واکسن آنفلوآنزا"
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-right text-base placeholder:text-gray-400"
                    autoComplete="off"
                    spellCheck="false"
                    maxLength={100}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع واکسن
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <select
                    value={newVaccineType}
                    onChange={(e) => setNewVaccineType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-right text-base"
                  >
                    <option value="">انتخاب نوع</option>
                    <option value="آنفلوآنزا">آنفلوآنزا</option>
                    <option value="کووید">کووید</option>
                    <option value="کزاز">کزاز</option>
                    <option value="هپاتیت">هپاتیت</option>
                    <option value="سرخک">سرخک</option>
                    <option value="پنوموکوک">پنوموکوک</option>
                    <option value="مننژیت">مننژیت</option>
                    <option value="آبله مرغان">آبله مرغان</option>
                    <option value="زونا">زونا</option>
                    <option value="سایر">سایر</option>
                  </select>
                </div>
              </div>

              {/* ردیف دوم: تاریخ و دوز */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاریخ تزریق
                    <span className="text-gray-500 text-xs font-normal mr-2">(اختیاری)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FiCalendar className="text-green-600 w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={newVaccineDate}
                      onChange={(e) => setNewVaccineDate(e.target.value)}
                      placeholder="1402/05/15"
                      className="flex-1 px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-right text-base"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دوز
                    <span className="text-gray-500 text-xs font-normal mr-2">(اختیاری)</span>
                  </label>
                  <select
                    value={newVaccineDose}
                    onChange={(e) => setNewVaccineDose(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-right text-base"
                  >
                    <option value="">انتخاب دوز</option>
                    <option value="دوز اول">دوز اول</option>
                    <option value="دوز دوم">دوز دوم</option>
                    <option value="دوز سوم">دوز سوم</option>
                    <option value="یادآور">یادآور</option>
                    <option value="تک دوز">تک دوز</option>
                    <option value="سالانه">سالانه</option>
                  </select>
                </div>
              </div>

              {/* جزئیات */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  جزئیات (اختیاری)
                </label>
                <textarea
                  value={newVaccineDetails}
                  onChange={(e) => setNewVaccineDetails(e.target.value)}
                  placeholder="توضیحات اضافی، عوارض جانبی، نام برند واکسن، محل تزریق"
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-right text-base placeholder:text-gray-400 resize-none"
                  rows="3"
                  maxLength={500}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">مثال: عارضه تب خفیف، در مرکز بهداشت تزریق شد</p>
                  <p className="text-xs text-gray-500">{newVaccineDetails.length}/500 کاراکتر</p>
                </div>
              </div>

              {/* دکمه‌های افزودن و لغو */}
              <div className="flex flex-col md:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddVaccine}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] text-base font-medium"
                  disabled={!newVaccineText.trim()}
                >
                  <FiCheck className="w-5 h-5" />
                  افزودن واکسن
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-700 rounded-xl transition-all duration-200 text-base font-medium"
                >
                  <FiX className="w-5 h-5" />
                  لغو
                </button>
              </div>
            </div>

            {/* راهنمای سریع */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-medium text-gray-700">راهنمای سریع افزودن</h5>
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm"
                >
                  {showExamples ? 'بستن' : 'نمایش مثال‌ها'}
                  {showExamples ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              {showExamples && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* واکسن‌های پیشنهادی */}
                  <div className="bg-white rounded-xl p-4 border border-green-200">
                    <h6 className="text-sm font-medium text-gray-800 mb-3">واکسن‌های رایج</h6>
                    <div className="space-y-2">
                      {SUGGESTED_VACCINES.slice(0, 4).map((vaccine, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickAdd(vaccine)}
                          className="w-full flex items-center justify-between p-2 bg-green-50 hover:bg-green-100 rounded-lg transition group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{vaccine.icon}</span>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-700">{vaccine.name}</p>
                              <p className="text-xs text-gray-500">{vaccine.desc}</p>
                            </div>
                          </div>
                          <span className="text-xs text-green-600 px-2 py-1 bg-white rounded-full group-hover:bg-green-200">
                            افزودن
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* راهنمای دوز */}
                  <div className="bg-white rounded-xl p-4 border border-green-200">
                    <h6 className="text-sm font-medium text-gray-800 mb-3">راهنمای دوز</h6>
                    <div className="space-y-2">
                      {doseGuide.map((guide, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-3 h-3 rounded-full mt-1 bg-green-500"></div>
                          <div>
                            <span className="text-xs font-medium text-gray-700">{guide.dose}:</span>
                            <p className="text-xs text-gray-600 mt-0.5">{guide.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* نکات مهم */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <FiInfo className="text-blue-600 w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">نکات مهم ثبت واکسیناسیون</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• تاریخ دقیق تزریق را در صورت امکان ثبت کنید</li>
                    <li>• برای واکسن‌های چنددوز، شماره دوز را مشخص کنید</li>
                    <li>• عوارض جانبی مهم را در بخش جزئیات ثبت کنید</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default VaccinationSection;