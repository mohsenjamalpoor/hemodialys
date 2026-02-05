import React, { useState, useRef, useEffect } from 'react';
import { 
  FiAlertTriangle, 
  FiPlus, 
  FiX, 
  FiTrash2, 
  FiEdit2, 
  FiCheck, 
  FiActivity,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiAlertCircle,
  FiPackage,
  FiClipboard,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

// کامپوننت EditableDrugAllergyItem برای ویرایش inline
const EditableDrugAllergyItem = React.memo(({ item, onEdit, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.text || '');
  const [editedSeverity, setEditedSeverity] = useState(item.severity || 'متوسط');
  const [editedReaction, setEditedReaction] = useState(item.reaction || '');
  const [editedAlternative, setEditedAlternative] = useState(item.alternative || '');
  const [editedNotes, setEditedNotes] = useState(item.notes || '');
  const [showDetails, setShowDetails] = useState(false);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    if (editedText.trim() && onEdit) {
      onEdit(item.id, editedText, editedSeverity, editedReaction, editedAlternative, editedNotes);
      setIsEditing(false);
      setShowDetails(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedText(item.text || '');
    setEditedSeverity(item.severity || 'متوسط');
    setEditedReaction(item.reaction || '');
    setEditedAlternative(item.alternative || '');
    setEditedNotes(item.notes || '');
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'خفیف': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: '🟢' };
      case 'متوسط': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: '🟡' };
      case 'شدید': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', icon: '🟠' };
      case 'بسیار شدید': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: '🔴' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: '⚪' };
    }
  };

  const severityColors = getSeverityColor(item.severity);

  return (
    <div className="group p-4 md:p-5 hover:bg-gray-50 rounded-xl border border-gray-200 mb-3 transition-all duration-200 hover:shadow-sm">
      {isEditing ? (
        <div className="space-y-4">
          {/* ردیف اول: نام دارو و شدت */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                نام دارو یا گروه دارویی
                <span className="text-red-500 mr-1">*</span>
              </label>
              <input
                ref={editInputRef}
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                placeholder="مثال: پنی‌سیلین"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                شدت واکنش آلرژیک
                <span className="text-red-500 mr-1">*</span>
              </label>
              <select
                value={editedSeverity}
                onChange={(e) => setEditedSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
              >
                <option value="خفیف">خفیف</option>
                <option value="متوسط">متوسط</option>
                <option value="شدید">شدید</option>
                <option value="بسیار شدید">بسیار شدید</option>
              </select>
            </div>
          </div>

          {/* ردیف دوم: واکنش و جایگزین */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">علائم و واکنش‌های مشاهده شده</label>
              <input
                type="text"
                value={editedReaction}
                onChange={(e) => setEditedReaction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                placeholder="مثال: کهیر، شوک آنافیلاکسی"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">داروهای جایگزین پیشنهادی</label>
              <input
                type="text"
                value={editedAlternative}
                onChange={(e) => setEditedAlternative(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                placeholder="مثال: آموکسی‌سیلین"
              />
            </div>
          </div>

          {/* جزئیات تکمیلی */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">یادداشت‌های تکمیلی</label>
            <textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
              placeholder="مثال: تاریخ بروز آلرژی، دوز مصرفی، اقدامات درمانی انجام شده"
              rows="2"
            />
          </div>

          {/* دکمه‌های ویرایش */}
          <div className="flex flex-col md:flex-row gap-2 pt-2">
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
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${severityColors.bg} ${severityColors.text} ${severityColors.border} flex items-center gap-1`}>
                  <span className="text-lg">{severityColors.icon}</span>
                  {item.severity || 'متوسط'}
                </div>
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-start gap-2">
                    {item.severity === 'شدید' || item.severity === 'بسیار شدید' ? (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-md">⚠️ خطرناک</span>
                    ) : null}
                    <p className="text-gray-800 font-bold text-lg">{item.text}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="text-gray-400 w-3 h-3" />
                      <p className="text-xs text-gray-500">ثبت در: {item.date || '---'}</p>
                    </div>
                    {item.confirmed && (
                      <div className="flex items-center gap-1">
                        <FiCheck className="text-green-500 w-3 h-3" />
                        <p className="text-xs text-green-600">تأیید شده</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* جزئیات */}
              {(item.reaction || item.alternative || item.notes) && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium mb-2"
                  >
                    {showDetails ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                    جزئیات کامل
                  </button>
                  {showDetails && (
                    <div className="space-y-3 mt-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                      {item.reaction && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <FiAlertCircle className="text-red-600 w-4 h-4" />
                            <p className="text-sm font-medium text-red-800">واکنش‌های مشاهده شده</p>
                          </div>
                          <p className="text-sm text-gray-700 text-right pr-6">{item.reaction}</p>
                        </div>
                      )}
                      
                      {item.alternative && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <FiPackage className="text-blue-600 w-4 h-4" />
                            <p className="text-sm font-medium text-blue-800">داروهای جایگزین پیشنهادی</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.alternative.split(',').map((alt, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                                {alt.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {item.notes && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <FiClipboard className="text-gray-600 w-4 h-4" />
                            <p className="text-sm font-medium text-gray-800">یادداشت‌های تکمیلی</p>
                          </div>
                          <p className="text-sm text-gray-700 text-right pr-6">{item.notes}</p>
                        </div>
                      )}
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
                title="ویرایش آلرژی دارویی"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemove(item.id)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                title="حذف آلرژی دارویی"
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

// تابع مرتب‌سازی آلرژی‌ها از بسیار شدید به خفیف
const sortAllergiesBySeverity = (allergies) => {
  const severityOrder = {
    'بسیار شدید': 4,
    'شدید': 3,
    'متوسط': 2,
    'خفیف': 1
  };
  
  return [...allergies].sort((a, b) => {
    const orderA = severityOrder[a.severity] || 0;
    const orderB = severityOrder[b.severity] || 0;
    return orderB - orderA; // نزولی
  });
};

// کامپوننت اصلی DrugAllergiesSection
const DrugAllergiesSection = React.memo(({
  drugAllergies = [],
  onAdd,
  onEdit,
  onRemove,
  showAddButton = true
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showAllergiesList, setShowAllergiesList] = useState(false);
  const [newAllergyText, setNewAllergyText] = useState('');
  const [newAllergySeverity, setNewAllergySeverity] = useState('متوسط');
  const [newAllergyReaction, setNewAllergyReaction] = useState('');
  const [newAllergyAlternative, setNewAllergyAlternative] = useState('');
  const [newAllergyNotes, setNewAllergyNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const inputRef = useRef(null);

  const safeAllergies = Array.isArray(drugAllergies) ? drugAllergies : [];
  const sortedAllergies = sortAllergiesBySeverity(safeAllergies);

  const handleAddAllergy = () => {
    if (newAllergyText.trim()) {
      const newItem = {
        id: Date.now() + Math.random(),
        text: newAllergyText.trim(),
        severity: newAllergySeverity,
        reaction: newAllergyReaction.trim(),
        alternative: newAllergyAlternative.trim(),
        notes: newAllergyNotes.trim(),
        confirmed: confirmed,
        date: new Date().toLocaleDateString('fa-IR'),
        createdAt: new Date().toISOString(),
        type: 'drug',
        doctorVerified: true
      };
      onAdd(newItem);
      resetForm();
      setIsAdding(false);
      setShowAllergiesList(true);
    }
  };

  const resetForm = () => {
    setNewAllergyText('');
    setNewAllergySeverity('متوسط');
    setNewAllergyReaction('');
    setNewAllergyAlternative('');
    setNewAllergyNotes('');
    setConfirmed(false);
    setShowAdvanced(false);
  };

  const handleCancelAdd = () => {
    resetForm();
    setIsAdding(false);
  };

  const handleQuickAdd = (text, severity = 'متوسط') => {
    setNewAllergyText(text);
    setNewAllergySeverity(severity);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddAllergy();
    }
  };

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleEditAllergy = (id, newText, newSeverity, newReaction, newAlternative, newNotes) => {
    if (onEdit) {
      onEdit(id, newText, newSeverity, newReaction, newAlternative, newNotes);
    }
  };

  const handleRemoveAllergy = (id) => {
    if (onRemove) {
      onRemove(id);
    }
  };

  // دسته‌بندی داروهای رایج
  const drugCategories = [
    {
      category: 'آنتی‌بیوتیک‌ها',
      items: [
        { name: 'پنی‌سیلین', severity: 'شدید' },
        { name: 'سفالوسپورین', severity: 'شدید' },
        { name: 'آموکسی‌سیلین', severity: 'متوسط' },
        { name: 'آزیترومایسین', severity: 'متوسط' },
        { name: 'داکسی‌سایکلین', severity: 'متوسط' }
      ]
    },
    {
      category: 'مسکن‌ها و NSAIDs',
      items: [
        { name: 'آسپرین', severity: 'متوسط' },
        { name: 'ایبوپروفن', severity: 'متوسط' },
        { name: 'ناپروکسن', severity: 'متوسط' },
        { name: 'دیکلوفناک', severity: 'خفیف' },
        { name: 'سلکوکسیب', severity: 'خفیف' }
      ]
    },
    {
      category: 'داروهای خاص',
      items: [
        { name: 'سولفا', severity: 'شدید' },
        { name: 'انسولین', severity: 'متوسط' },
        { name: 'کنتراست یددار', severity: 'شدید' },
        { name: 'کدئین', severity: 'متوسط' },
        { name: 'مورفین', severity: 'متوسط' }
      ]
    }
  ];

  // راهنمای شدت واکنش
  const reactionGuide = [
    { 
      level: 'خفیف', 
      desc: 'علائم محدود به پوست، بدون خطر سیستمیک',
      examples: 'خارش موضعی، کهیر کوچک',
      actions: 'قطع دارو، آنتی‌هیستامین'
    },
    { 
      level: 'متوسط', 
      desc: 'علائم عمومی اما بدون خطر فوری',
      examples: 'کهیر گسترده، تورم لب‌ها، سرفه',
      actions: 'قطع دارو، کورتیکواستروئید، مراقبت'
    },
    { 
      level: 'شدید', 
      desc: 'علائم تهدیدکننده اما نه فوری',
      examples: 'تورم صورت و گلو، تنگی نفس متوسط',
      actions: 'اورژانس، اپی‌نفرین، بستری'
    },
    { 
      level: 'بسیار شدید', 
      desc: 'شوک آنافیلاکسی، خطر فوری جانی',
      examples: 'شوک، قطع تنفس، افت فشار',
      actions: 'احیاء، اپی‌نفرین، ICU'
    }
  ];

  // داروهای جایگزین رایج
  const alternativeDrugs = [
    'آموکسی‌سیلین',
    'داکسی‌سایکلین',
    'آزیترومایسین',
    'استامینوفن',
    'ترامادول',
    'متوکاربامول',
    'لوراتادین',
    'فکسوفنادین',
    'پردنیزولون'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-xl">
      {/* هدر */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-red-100 to-pink-100 shadow-sm">
            <FiActivity className="w-6 h-6 md:w-7 md:h-7 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">آلرژی دارویی</h3>
            <p className="text-gray-600 text-sm mt-1">
              {sortedAllergies.length} مورد ثبت شده
              <span className="mr-2">•</span>
              به ترتیب از شدید به خفیف
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* دکمه نمایش/پنهان لیست */}
          {sortedAllergies.length > 0 && (
            <button
              onClick={() => setShowAllergiesList(!showAllergiesList)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 text-sm font-medium"
            >
              {showAllergiesList ? (
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
          
          {/* دکمه افزودن آلرژی جدید */}
          {showAddButton && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm md:text-base font-medium"
            >
              <FiPlus className="w-5 h-5" />
              <span>افزودن آلرژی دارویی جدید</span>
            </button>
          )}
        </div>
      </div>

      {/* لیست آلرژی‌های دارویی */}
      {showAllergiesList && sortedAllergies.length > 0 && (
        <div className="mb-6">
          <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {sortedAllergies.map((allergy) => (
              <EditableDrugAllergyItem
                key={allergy.id}
                item={allergy}
                onEdit={handleEditAllergy}
                onRemove={handleRemoveAllergy}
              />
            ))}
          </div>
        </div>
      )}

      {/* پیام وقتی لیست خالی است */}
      {!isAdding && sortedAllergies.length === 0 && (
        <div className="text-center py-10 md:py-12 border-3 border-dashed border-gray-300 rounded-2xl bg-gradient-to-b from-gray-50 to-white">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-red-400" />
          </div>
          <h4 className="text-gray-600 font-medium text-lg mb-2">هیچ آلرژی دارویی ثبت نشده است</h4>
          <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
            ثبت دقیق آلرژی‌های دارویی می‌تواند از بروز عوارض جدی جلوگیری کند
          </p>
          {showAddButton && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
            >
              <FiPlus className="w-5 h-5" />
              افزودن اولین آلرژی دارویی
            </button>
          )}
        </div>
      )}

      {/* فرم افزودن جدید */}
      {isAdding && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4 md:p-6 mb-6 border border-red-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiPlus className="text-red-600" />
              ثبت آلرژی دارویی جدید
            </h4>
            
            <div className="space-y-5">
              {/* ردیف اول: نام دارو و شدت */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام دارو یا گروه دارویی
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={newAllergyText}
                    onChange={(e) => setNewAllergyText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="نام ژنریک یا تجاری دارو"
                    className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-right text-base placeholder:text-gray-400"
                    autoComplete="off"
                    spellCheck="false"
                    maxLength={100}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شدت واکنش آلرژیک
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <select
                    value={newAllergySeverity}
                    onChange={(e) => setNewAllergySeverity(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-right text-base"
                  >
                    {reactionGuide.map((guide, index) => (
                      <option key={index} value={guide.level}>
                        {guide.level} - {guide.desc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ردیف دوم: واکنش و جایگزین */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    علائم و واکنش‌های مشاهده شده
                  </label>
                  <input
                    type="text"
                    value={newAllergyReaction}
                    onChange={(e) => setNewAllergyReaction(e.target.value)}
                    placeholder="مثال: کهیر، شوک آنافیلاکسی، تنگی نفس"
                    className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-right text-base placeholder:text-gray-400"
                    maxLength={200}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    داروهای جایگزین پیشنهادی
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newAllergyAlternative}
                      onChange={(e) => setNewAllergyAlternative(e.target.value)}
                      placeholder="مثال: آموکسی‌سیلین، استامینوفن"
                      className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-right text-base placeholder:text-gray-400"
                      maxLength={200}
                      list="alternative-drugs"
                    />
                    <datalist id="alternative-drugs">
                      {alternativeDrugs.map((drug, index) => (
                        <option key={index} value={drug} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* جزئیات تکمیلی و تأیید */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    یادداشت‌های تکمیلی
                  </label>
                  <textarea
                    value={newAllergyNotes}
                    onChange={(e) => setNewAllergyNotes(e.target.value)}
                    placeholder="تاریخ بروز، دوز مصرفی، اقدامات درمانی، نتایج آزمایشات پوستی"
                    className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-right text-base placeholder:text-gray-400 resize-none"
                    rows="3"
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">مشخص کردن دوز و فرم دارو مهم است</p>
                    <p className="text-xs text-gray-500">{newAllergyNotes.length}/500 کاراکتر</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="confirmed"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <label htmlFor="confirmed" className="text-sm font-medium text-gray-700">
                      این آلرژی توسط تست پوستی یا آزمایش تأیید شده است
                    </label>
                  </div>
                  {confirmed && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      ✅ تأیید شده
                    </span>
                  )}
                </div>
              </div>

              {/* دکمه‌های افزودن و لغو */}
              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <button
                  onClick={handleAddAllergy}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] text-base font-medium"
                  disabled={!newAllergyText.trim()}
                >
                  <FiCheck className="w-5 h-5" />
                  ثبت آلرژی دارویی
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
                <h5 className="text-sm font-medium text-gray-700">راهنمای سریع ثبت</h5>
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                >
                  {showExamples ? 'بستن' : 'نمایش راهنما'}
                  {showExamples ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              {showExamples && (
                <div className="space-y-4">
                  {/* داروهای رایج */}
                  <div className="bg-white rounded-xl p-4 border border-red-200">
                    <h6 className="text-sm font-medium text-gray-800 mb-3">داروهای شایع آلرژی‌زا</h6>
                    <div className="space-y-3">
                      {drugCategories.map((category, catIndex) => (
                        <div key={catIndex}>
                          <p className="text-xs font-medium text-gray-600 mb-2">{category.category}:</p>
                          <div className="flex flex-wrap gap-2">
                            {category.items.map((drug, drugIndex) => (
                              <button
                                key={drugIndex}
                                onClick={() => handleQuickAdd(drug.name, drug.severity)}
                                className={`px-3 py-1.5 rounded-lg text-xs transition ${
                                  drug.severity === 'شدید' 
                                    ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                                    : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                                }`}
                              >
                                {drug.name}
                                {drug.severity === 'شدید' && ' ⚠️'}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* راهنمای شدت واکنش */}
                  <div className="bg-white rounded-xl p-4 border border-red-200">
                    <h6 className="text-sm font-medium text-gray-800 mb-3">راهنمای شدت واکنش</h6>
                    <div className="space-y-3">
                      {reactionGuide.map((guide, index) => (
                        <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50">
                          <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                            guide.level === 'خفیف' ? 'bg-green-500' :
                            guide.level === 'متوسط' ? 'bg-yellow-500' :
                            guide.level === 'شدید' ? 'bg-orange-500' : 'bg-red-500'
                          }`}></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-bold text-gray-700">{guide.level}</span>
                              <button
                                onClick={() => setNewAllergySeverity(guide.level)}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                انتخاب
                              </button>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{guide.desc}</p>
                            <p className="text-xs text-gray-500 mt-1"><strong>مثال:</strong> {guide.examples}</p>
                            <p className="text-xs text-gray-500 mt-1"><strong>اقدام:</strong> {guide.actions}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* گزینه‌های پیشرفته */}
                  <div className="bg-white rounded-xl p-4 border border-red-200">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="text-sm font-medium text-gray-800">گزینه‌های پیشرفته</h6>
                      <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        {showAdvanced ? 'ساده' : 'پیشرفته'}
                      </button>
                    </div>
                    
                    {showAdvanced && (
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs font-medium text-blue-800 mb-1">💡 نکات مهم:</p>
                          <ul className="text-xs text-blue-700 space-y-1">
                            <li>• برای آلرژی‌های شدید حتماً تست پوستی انجام شود</li>
                            <li>• تاریخ دقیق بروز آلرژی را ثبت کنید</li>
                            <li>• دوز و فرم داروی مصرفی مهم است</li>
                            <li>• واکنش متقاطع با داروهای مشابه را بررسی کنید</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-xs font-medium text-green-800 mb-1">✅ اقدامات پیشگیرانه:</p>
                          <ul className="text-xs text-green-700 space-y-1">
                            <li>• برچسب آلرژی روی پرونده بیمار نصب شود</li>
                            <li>• بیمار کارت هشدار آلرژی همراه داشته باشد</li>
                            <li>• در سیستم داروخانه و آزمایشگاه ثبت شود</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* هشدار مهم */}
            <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiAlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-800 mb-2">⚠️ هشدار مهم برای آلرژی‌های دارویی</p>
                  <ul className="text-xs text-red-700 space-y-1">
                    <li>• آلرژی‌های دارویی می‌توانند تهدیدکننده زندگی باشند</li>
                    <li>• حتماً شدت واقعی واکنش را ثبت کنید</li>
                    <li>• برای آلرژی‌های شدید، بیمار باید کارت هشدار همراه داشته باشد</li>
                    <li>• آلرژی به آنتی‌بیوتیک‌های بتا-لاکتام (پنی‌سیلین، سفالوسپورین) باید با دقت ثبت شود</li>
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

export default DrugAllergiesSection;