import React, { useState, useRef, useEffect } from 'react';
import { 
  FiAlertTriangle, 
  FiPlus, 
  FiX, 
  FiTrash2, 
  FiEdit2, 
  FiCheck, 
  FiCoffee,
  FiCalendar,
  FiInfo,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';

// کامپوننت EditableFoodAllergyItem برای ویرایش inline
const EditableFoodAllergyItem = React.memo(({ item, onEdit, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.text || '');
  const [editedSeverity, setEditedSeverity] = useState(item.severity || 'متوسط');
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
      onEdit(item.id, editedText, editedSeverity, editedDetails);
      setIsEditing(false);
      setShowDetails(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedText(item.text || '');
    setEditedSeverity(item.severity || 'متوسط');
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'خفیف': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'متوسط': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'شدید': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' };
      case 'بسیار شدید': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const severityColors = getSeverityColor(item.severity);

  return (
    <div className="group p-3 md:p-4 hover:bg-gray-50 rounded-xl border border-gray-200 mb-3 transition-all duration-200 hover:shadow-sm">
      {isEditing ? (
        <div className="space-y-4">
          {/* ردیف اول: نام آلرژی و شدت */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">نام ماده غذایی</label>
              <input
                ref={editInputRef}
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                placeholder="مثال: بادام زمینی"
                autoComplete="off"
              />
            </div>
            <div className="w-full md:w-40">
              <label className="block text-xs text-gray-600 mb-1">شدت آلرژی</label>
              <select
                value={editedSeverity}
                onChange={(e) => setEditedSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
              >
                <option value="خفیف">خفیف</option>
                <option value="متوسط">متوسط</option>
                <option value="شدید">شدید</option>
                <option value="بسیار شدید">بسیار شدید</option>
              </select>
            </div>
          </div>

          {/* جزئیات */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">جزئیات و علائم (اختیاری)</label>
            <textarea
              value={editedDetails}
              onChange={(e) => setEditedDetails(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
              placeholder="مثال: کهیر، تورم صورت، مشکل تنفسی"
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
                <div className={`px-3 py-1 rounded-lg text-xs font-medium border ${severityColors.bg} ${severityColors.text} ${severityColors.border}`}>
                  {item.severity || 'متوسط'}
                </div>
                <div className="flex-1 text-right">
                  <p className="text-gray-800 font-medium text-base">{item.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <FiCalendar className="text-gray-400 w-3 h-3" />
                    <p className="text-xs text-gray-500">ثبت در: {item.date || '---'}</p>
                  </div>
                </div>
              </div>

              {/* جزئیات */}
              {item.details && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-1 text-amber-600 hover:text-amber-700 text-xs font-medium mb-1"
                  >
                    {showDetails ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
                    جزئیات علائم
                  </button>
                  {showDetails && (
                    <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
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
                title="ویرایش آلرژی"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemove(item.id)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                title="حذف آلرژی"
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

// کامپوننت اصلی FoodAllergiesSection
const FoodAllergiesSection = React.memo(({
  foodAllergies = [],
  onAdd,
  onEdit,
  onRemove,
  showAddButton = true
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAllergyText, setNewAllergyText] = useState('');
  const [newAllergySeverity, setNewAllergySeverity] = useState('متوسط');
  const [newAllergyDetails, setNewAllergyDetails] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const inputRef = useRef(null);

  const safeAllergies = Array.isArray(foodAllergies) ? foodAllergies : [];

  // محاسبه آمار
  const calculateStats = () => {
    const total = safeAllergies.length;
    const severe = safeAllergies.filter(item => 
      item.severity === 'شدید' || item.severity === 'بسیار شدید'
    ).length;
    
    const withDetails = safeAllergies.filter(item => item.details).length;
    
    return { total, severe, withDetails };
  };

  const stats = calculateStats();

  const handleAddAllergy = () => {
    if (newAllergyText.trim()) {
      const newItem = {
        id: Date.now() + Math.random(),
        text: newAllergyText.trim(),
        severity: newAllergySeverity,
        details: newAllergyDetails.trim(),
        date: new Date().toLocaleDateString('fa-IR'),
        createdAt: new Date().toISOString(),
        type: 'food'
      };
      onAdd(newItem);
      setNewAllergyText('');
      setNewAllergySeverity('متوسط');
      setNewAllergyDetails('');
      setIsAdding(false);
    }
  };

  const handleCancelAdd = () => {
    setNewAllergyText('');
    setNewAllergySeverity('متوسط');
    setNewAllergyDetails('');
    setIsAdding(false);
  };

  const handleQuickAdd = (text) => {
    setNewAllergyText(text);
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

  const handleEditAllergy = (id, newText, newSeverity, newDetails) => {
    if (onEdit) {
      onEdit(id, newText, newSeverity, newDetails);
    }
  };

  const handleRemoveAllergy = (id) => {
    if (onRemove) {
      onRemove(id);
    }
  };

  // مثال‌های رایج آلرژی غذایی با دسته‌بندی
  const commonFoodExamples = [
    { category: 'آجیل و مغزها', items: ['بادام زمینی', 'بادام', 'گردو', 'پسته', 'فندق'] },
    { category: 'لبنیات', items: ['شیر گاو', 'پنیر', 'ماست', 'کره'] },
    { category: 'غلات', items: ['گندم (گلوتن)', 'جو', 'چاودار'] },
    { category: 'غذاهای دریایی', items: ['ماهی قزل آلا', 'میگو', 'صدف'] },
    { category: 'تخم مرغ و مرغ', items: ['تخم مرغ', 'گوشت مرغ'] },
    { category: 'دیگر', items: ['سویا', 'کنجد', 'کاکائو'] }
  ];

  // دستورالعمل‌های شدت آلرژی
  const severityGuide = [
    { level: 'خفیف', desc: 'علائم جزئی مانند خارش دهان یا کهیر موضعی' },
    { level: 'متوسط', desc: 'کهیر گسترده، تورم لب‌ها یا صورت' },
    { level: 'شدید', desc: 'مشکل تنفسی، سرگیجه، حالت تهوع' },
    { level: 'بسیار شدید', desc: 'شوک آنافیلاکسی، خطر جانی' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-xl">
      {/* هدر */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 shadow-sm">
            <FiCoffee className="w-6 h-6 md:w-7 md:h-7 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">آلرژی غذایی</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg">
                {stats.total} مورد ثبت شده
              </span>
              {stats.severe > 0 && (
                <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-lg">
                  {stats.severe} مورد شدید
                </span>
              )}
              {stats.withDetails > 0 && (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                  {stats.withDetails} مورد دارای جزئیات
                </span>
              )}
            </div>
          </div>
        </div>
        
        {showAddButton && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm md:text-base font-medium"
          >
            <FiPlus className="w-5 h-5" />
            <span>افزودن آلرژی غذایی جدید</span>
          </button>
        )}
      </div>

      {/* لیست آلرژی‌های غذایی */}
      <div className="mb-6">
        {safeAllergies.length > 0 ? (
          <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {safeAllergies.map((allergy) => (
              <EditableFoodAllergyItem
                key={allergy.id}
                item={allergy}
                onEdit={handleEditAllergy}
                onRemove={handleRemoveAllergy}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 md:py-12 border-3 border-dashed border-gray-300 rounded-2xl bg-gradient-to-b from-gray-50 to-white">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
            </div>
            <h4 className="text-gray-600 font-medium text-lg mb-2">آلرژی غذایی ثبت نشده است</h4>
            <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
              ثبت آلرژی‌های غذایی به مدیریت بهتر رژیم غذایی بیمار کمک می‌کند
            </p>
            {showAddButton && (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition"
              >
                <FiPlus className="w-5 h-5" />
                افزودن اولین آلرژی غذایی
              </button>
            )}
          </div>
        )}
      </div>

      {/* فرم افزودن جدید */}
      {isAdding && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 md:p-6 mb-6 border border-amber-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiPlus className="text-amber-600" />
              افزودن آلرژی غذایی جدید
            </h4>
            
            <div className="space-y-4">
              {/* ردیف اول: نام آلرژی و شدت */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام ماده غذایی
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={newAllergyText}
                    onChange={(e) => setNewAllergyText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="مثال: بادام زمینی"
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-right text-base placeholder:text-gray-400"
                    autoComplete="off"
                    spellCheck="false"
                    maxLength={100}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شدت آلرژی
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <select
                    value={newAllergySeverity}
                    onChange={(e) => setNewAllergySeverity(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-right text-base"
                  >
                    <option value="خفیف">خفیف</option>
                    <option value="متوسط">متوسط</option>
                    <option value="شدید">شدید</option>
                    <option value="بسیار شدید">بسیار شدید</option>
                  </select>
                </div>
              </div>

              {/* جزئیات */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  جزئیات و علائم مشاهده شده
                  <span className="text-gray-500 text-xs font-normal mr-2">(اختیاری)</span>
                </label>
                <textarea
                  value={newAllergyDetails}
                  onChange={(e) => setNewAllergyDetails(e.target.value)}
                  placeholder="علائم و واکنش‌های مشاهده شده، مدت زمان بروز علائم، اقدامات درمانی انجام شده"
                  className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-right text-base placeholder:text-gray-400 resize-none"
                  rows="3"
                  maxLength={500}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">مثال: کهیر صورت و دست‌ها، 30 دقیقه بعد از مصرف</p>
                  <p className="text-xs text-gray-500">{newAllergyDetails.length}/500 کاراکتر</p>
                </div>
              </div>

              {/* دکمه‌های افزودن و لغو */}
              <div className="flex flex-col md:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddAllergy}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] text-base font-medium"
                  disabled={!newAllergyText.trim()}
                >
                  <FiCheck className="w-5 h-5" />
                  افزودن آلرژی غذایی
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
                  className="flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm"
                >
                  {showExamples ? 'بستن' : 'نمایش مثال‌ها'}
                  {showExamples ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              {showExamples && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* مثال‌های رایج */}
                  <div className="bg-white rounded-xl p-4 border border-amber-200">
                    <h6 className="text-sm font-medium text-gray-800 mb-3">مواد غذایی شایع</h6>
                    <div className="flex flex-wrap gap-2">
                      {commonFoodExamples.slice(0, 3).flatMap(category => 
                        category.items.map((item, idx) => (
                          <button
                            key={`${category.category}-${idx}`}
                            onClick={() => handleQuickAdd(item)}
                            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs transition"
                          >
                            {item}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* راهنمای شدت آلرژی */}
                  <div className="bg-white rounded-xl p-4 border border-amber-200">
                    <h6 className="text-sm font-medium text-gray-800 mb-3">راهنمای شدت آلرژی</h6>
                    <div className="space-y-2">
                      {severityGuide.map((guide, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className={`w-3 h-3 rounded-full mt-1 ${
                            guide.level === 'خفیف' ? 'bg-green-500' :
                            guide.level === 'متوسط' ? 'bg-yellow-500' :
                            guide.level === 'شدید' ? 'bg-orange-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <span className="text-xs font-medium text-gray-700">{guide.level}:</span>
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
                  <p className="text-sm font-medium text-blue-800 mb-1">نکات مهم ثبت آلرژی غذایی</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• حتماً شدت آلرژی را بر اساس واکنش بیمار مشخص کنید</li>
                    <li>• برای آلرژی‌های شدید، اقدامات اورژانسی را در جزئیات ثبت کنید</li>
                    <li>• در صورت عدم اطمینان، از مقادیر "متوسط" استفاده کنید</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* اطلاعات آماری */}
      {safeAllergies.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-600 mt-1">تعداد کل</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {safeAllergies.filter(a => a.severity === 'خفیف').length}
              </p>
              <p className="text-xs text-gray-600 mt-1">خفیف</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                {safeAllergies.filter(a => a.severity === 'متوسط').length}
              </p>
              <p className="text-xs text-gray-600 mt-1">متوسط</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {safeAllergies.filter(a => a.severity === 'شدید' || a.severity === 'بسیار شدید').length}
              </p>
              <p className="text-xs text-gray-600 mt-1">شدید و خطرناک</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default FoodAllergiesSection;