import React, { useState, useEffect, useRef } from 'react';
import { FiPackage, FiPlus, FiX, FiEdit2, FiTrash2, FiCheck, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// کامپوننت EditableVaccinationItem (همان قبلی)
const EditableVaccinationItem = React.memo(({ item, onEdit, onRemove }) => {
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editedText, setEditedText] = useState(item.text);
  const [editedDate, setEditedDate] = useState(item.date || '');
  const [editedDose, setEditedDose] = useState(item.dose || '');
  const [editedType, setEditedType] = useState(item.vaccineType || '');
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditingItem && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditingItem]);

  const handleSaveEdit = () => {
    if (editedText.trim() && onEdit) {
      onEdit(item.id, editedText, editedDate, editedDose, editedType);
      setIsEditingItem(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedText(item.text);
    setEditedDate(item.date || '');
    setEditedDose(item.dose || '');
    setEditedType(item.vaccineType || '');
    setIsEditingItem(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const getVaccineInfo = (type) => {
    switch(type) {
      case 'آنفلوآنزا':
        return { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '❄️' };
      case 'کووید':
        return { color: 'text-red-600', bgColor: 'bg-red-100', icon: '🦠' };
      case 'کزاز':
        return { color: 'text-green-600', bgColor: 'bg-green-100', icon: '🛡️' };
      case 'هپاتیت':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '🩺' };
      default:
        return { color: 'text-purple-600', bgColor: 'bg-purple-100', icon: '💉' };
    }
  };

  const vaccineInfo = getVaccineInfo(editedType);

  return (
    <div className="flex items-center justify-between group p-3 hover:bg-gray-50 rounded-lg border border-gray-100 mb-2 transition-all duration-200">
      <div className="flex-1">
        {isEditingItem ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row gap-2">
              <input
                ref={editInputRef}
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="نام واکسن"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 md:flex-none px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center justify-center gap-1 transition"
                >
                  <FiCheck className="w-4 h-4" />
                  <span className="md:hidden">ذخیره</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 md:flex-none px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm flex items-center justify-center gap-1 transition"
                >
                  <FiX className="w-4 h-4" />
                  <span className="md:hidden">لغو</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={editedDate}
                  onChange={(e) => setEditedDate(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-right text-sm"
                  placeholder="تاریخ (1402/05/15)"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">دوز:</span>
                <select
                  value={editedDose}
                  onChange={(e) => setEditedDose(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-right text-sm"
                >
                  <option value="">انتخاب دوز</option>
                  <option value="دوز اول">دوز اول</option>
                  <option value="دوز دوم">دوز دوم</option>
                  <option value="دوز سوم">دوز سوم</option>
                  <option value="یادآور">یادآور</option>
                  <option value="تک دوز">تک دوز</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">نوع:</span>
                <select
                  value={editedType}
                  onChange={(e) => setEditedType(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-right text-sm"
                >
                  <option value="">انتخاب نوع</option>
                  <option value="آنفلوآنزا">آنفلوآنزا</option>
                  <option value="کووید">کووید</option>
                  <option value="کزاز">کزاز</option>
                  <option value="هپاتیت">هپاتیت</option>
                  <option value="سرخک">سرخک</option>
                  <option value="پنوموکوک">پنوموکوک</option>
                  <option value="مننژیت">مننژیت</option>
                  <option value="سایر">سایر</option>
                </select>
              </div>
            </div>
            
            {item.notes && (
              <div className="mt-2">
                <textarea
                  value={item.notes}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-right text-sm"
                  placeholder="یادداشت اضافی"
                  rows="2"
                  readOnly
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-start gap-2">
              <div className={`${vaccineInfo.bgColor} p-2 rounded-lg`}>
                <span className="text-lg">{vaccineInfo.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-700 text-right text-sm md:text-base font-medium">{item.text}</p>
                    {item.vaccineType && (
                      <span className={`text-xs px-2 py-1 rounded-full mr-2 ${vaccineInfo.bgColor} ${vaccineInfo.color}`}>
                        {item.vaccineType}
                      </span>
                    )}
                  </div>
                  {item.dose && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      {item.dose}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mt-2">
                  {item.date && (
                    <div className="flex items-center gap-1">
                      <FiCalendar className="text-gray-400 w-3 h-3" />
                      <p className="text-xs text-gray-500">تاریخ: {item.date}</p>
                    </div>
                  )}
                  
                  {item.status === 'دریافت نشده' && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      ⚠️ نیاز به تزریق
                    </span>
                  )}
                  
                  {item.dueDate && new Date(item.dueDate) > new Date() && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      ⏰ موعد: {item.dueDate}
                    </span>
                  )}
                </div>
                
                {item.notes && (
                  <p className="text-xs text-gray-600 mt-2 text-right">{item.notes}</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {!isEditingItem && (
        <div className="flex items-center gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setIsEditingItem(true)}
            className="p-1 md:p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
            title="ویرایش"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="p-1 md:p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
            title="حذف"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
});

// کامپوننت اصلی VaccinationSection با قابلیت expand/collapse
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
  const [newItemText, setNewItemText] = useState('');
  const [newItemDate, setNewItemDate] = useState('');
  const [newItemDose, setNewItemDose] = useState('');
  const [newItemType, setNewItemType] = useState('');
  const [showSuggested, setShowSuggested] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // حالت expand/collapse
  const inputRef = useRef(null);

  const safeItems = Array.isArray(vaccinations) ? vaccinations : [];

  // تابع toggle برای باز و بسته شدن
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddItem = (text = null, type = null, dose = null) => {
    const vaccineText = text || newItemText;
    if (vaccineText.trim()) {
      const newItem = {
        id: Date.now() + Math.random(),
        text: vaccineText,
        date: newItemDate || new Date().toLocaleDateString('fa-IR'),
        dose: dose || newItemDose,
        vaccineType: type || newItemType,
        status: 'دریافت شده',
        notes: '',
        addedDate: new Date().toLocaleDateString('fa-IR')
      };
      onAdd(newItem);
      setNewItemText('');
      setNewItemDate('');
      setNewItemDose('');
      setNewItemType('');
      setIsAdding(false);
      setShowForm(false);
      setShowSuggested(false);
      
      // اگر بسته بود، بعد از اضافه کردن باز شود
      if (!isExpanded) {
        setIsExpanded(true);
      }
    }
  };

  const handleQuickAdd = (vaccine) => {
    handleAddItem(vaccine.name, vaccine.type, vaccine.dose);
  };

  const handleCancelAdd = () => {
    setNewItemText('');
    setNewItemDate('');
    setNewItemDose('');
    setNewItemType('');
    setIsAdding(false);
    setShowForm(false);
    setShowSuggested(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleEditItem = (id, newText, newDate, newDose, newType) => {
    if (onEdit) {
      onEdit(id, newText, newDate, newDose, newType);
    }
  };

  const handleRemoveItem = (id) => {
    if (onRemove) {
      onRemove(id);
    }
  };

  // آمار و اطلاعات
  const calculateStats = () => {
    const total = safeItems.length;
    const thisYear = safeItems.filter(item => {
      const currentYear = new Date().getFullYear();
      return item.date && item.date.includes(currentYear.toString());
    }).length;
    
    const pending = safeItems.filter(item => 
      item.status === 'دریافت نشده' || item.status === 'نیاز به تزریق'
    ).length;
    
    const completed = safeItems.filter(item => 
      item.status === 'دریافت شده'
    ).length;

    return { total, thisYear, pending, completed };
  };

  const stats = calculateStats();

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      {/* هدر با قابلیت کلیک */}
      <div 
        className="flex items-center justify-between mb-4 md:mb-6 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 md:p-3 rounded-lg bg-green-100">
            <FiPackage className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800">واکسیناسیون</h3>
            <div className="flex items-center gap-2 md:gap-3">
              <p className="text-xs md:text-sm text-gray-500">
                {safeItems.length} واکسن ثبت شده
                {stats.completed > 0 && ` • ${stats.completed} دریافت شده`}
                {stats.pending > 0 && ` • ${stats.pending} در انتظار`}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* آیکون expand/collapse */}
          <button
            className="text-gray-500 hover:text-gray-700 transition"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
          >
            {isExpanded ? (
              <FiChevronUp className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <FiChevronDown className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </button>
          
          {/* دکمه افزودن فقط وقتی باز است */}
          {showAddButton && isExpanded && !isAdding && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowForm(true);
              }}
              className="flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition text-sm md:text-base"
            >
              <FiPlus className="w-4 h-4" />
              <span className="hidden md:inline">افزودن واکسن</span>
              <span className="md:hidden">افزودن</span>
            </button>
          )}
        </div>
      </div>
      
      {/* محتوای expandable */}
      {isExpanded && (
        <div className="mt-4">
          {/* لیست واکسن‌ها */}
          <div className="mb-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {safeItems.length > 0 ? (
              safeItems.map((item) => (
                <EditableVaccinationItem
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                  onRemove={handleRemoveItem}
                />
              ))
            ) : (
              <div className="text-center py-6 md:py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <div className="text-gray-400 mb-3 text-2xl md:text-3xl">💉</div>
                <p className="text-gray-500 text-sm md:text-base">واکسنی ثبت نشده است</p>
                {showAddButton && (
                  <p className="text-xs md:text-sm text-gray-400 mt-1">برای افزودن واکسن، روی افزودن کلیک کنید</p>
                )}
              </div>
            )}
          </div>
          
          {/* فرم افزودن جدید */}
          {showForm && (
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="نام واکسن (مثلاً: واکسن آنفلوآنزا)"
                    className="flex-1 px-3 md:px-4 py-2 md:py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-right text-sm md:text-base placeholder:text-gray-400"
                    autoComplete="off"
                    spellCheck="false"
                    maxLength={200}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FiCalendar className="text-green-600 w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={newItemDate}
                      onChange={(e) => setNewItemDate(e.target.value)}
                      placeholder="تاریخ تزریق (اختیاری)"
                      className="flex-1 px-2 md:px-3 py-1.5 md:py-2 border border-green-200 rounded-lg text-right text-sm md:text-base"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">دوز:</span>
                    <select
                      value={newItemDose}
                      onChange={(e) => setNewItemDose(e.target.value)}
                      className="flex-1 px-2 md:px-3 py-1.5 md:py-2 border border-green-200 rounded-lg text-right text-sm md:text-base"
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
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">نوع:</span>
                    <select
                      value={newItemType}
                      onChange={(e) => setNewItemType(e.target.value)}
                      className="flex-1 px-2 md:px-3 py-1.5 md:py-2 border border-green-200 rounded-lg text-right text-sm md:text-base"
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
                
                <div className="flex gap-2 md:gap-3">
                  <button
                    onClick={() => handleAddItem()}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-5 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    disabled={!newItemText.trim()}
                  >
                    <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">افزودن واکسن</span>
                  </button>
                  <button
                    onClick={handleCancelAdd}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl transition text-sm md:text-base"
                  >
                    <FiX className="w-4 h-4" />
                    <span className="text-sm md:text-base">لغو</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <p>Enter ↵ برای افزودن سریع</p>
                <p>{newItemText.length}/200 کاراکتر</p>
              </div>
            </div>
          )}
          
          {/* خلاصه وضعیت واکسیناسیون */}
          {safeItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                <div className="bg-green-50 rounded-xl p-2 md:p-3 text-center">
                  <p className="text-xs md:text-sm text-gray-600">کل واکسن‌ها</p>
                  <p className="text-lg md:text-2xl font-bold text-green-700">{stats.total}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-2 md:p-3 text-center">
                  <p className="text-xs md:text-sm text-gray-600">امسال</p>
                  <p className="text-lg md:text-2xl font-bold text-blue-700">{stats.thisYear}</p>
                </div>
                <div className="bg-green-100 rounded-xl p-2 md:p-3 text-center">
                  <p className="text-xs md:text-sm text-gray-600">دریافت شده</p>
                  <p className="text-lg md:text-2xl font-bold text-green-800">{stats.completed}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-2 md:p-3 text-center">
                  <p className="text-xs md:text-sm text-gray-600">در انتظار</p>
                  <p className="text-lg md:text-2xl font-bold text-yellow-700">{stats.pending}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default VaccinationSection;