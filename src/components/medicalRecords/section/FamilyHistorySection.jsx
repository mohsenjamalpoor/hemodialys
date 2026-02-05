import React, { useState, useEffect, useRef } from 'react';
import { 
  FiUsers, FiPlus, FiX, FiEdit2, FiTrash2, FiCheck, 
  FiCalendar, FiHeart, FiFilter, FiSearch, 
  FiUserPlus, FiUserMinus, FiList, FiChevronUp,
  FiEyeOff,
  FiEye
} from 'react-icons/fi';
import { GiFamilyHouse, GiFamilyTree } from 'react-icons/gi';

// تابع کمکی برای تعیین اطلاعات رابطه خانوادگی
const getRelationInfo = (relation) => {
  switch(relation) {
    case 'پدر':
      return { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '👨', emoji: '♂️' };
    case 'مادر':
      return { color: 'text-pink-600', bgColor: 'bg-pink-100', icon: '👩', emoji: '♀️' };
    case 'برادر':
      return { color: 'text-blue-500', bgColor: 'bg-blue-50', icon: '👨‍👦', emoji: '👦' };
    case 'خواهر':
      return { color: 'text-pink-500', bgColor: 'bg-pink-50', icon: '👩‍👧', emoji: '👧' };
    case 'پدربزرگ':
      return { color: 'text-blue-700', bgColor: 'bg-blue-200', icon: '👴', emoji: '👴' };
    case 'مادربزرگ':
      return { color: 'text-pink-700', bgColor: 'bg-pink-200', icon: '👵', emoji: '👵' };
    case 'فرزند':
      return { color: 'text-green-600', bgColor: 'bg-green-100', icon: '👶', emoji: '👶' };
    default:
      return { color: 'text-purple-600', bgColor: 'bg-purple-100', icon: '👥', emoji: '👤' };
  }
};

// تابع کمکی برای تعیین شدت بیماری
const getDiseaseSeverity = (text) => {
  if (!text) return { level: 'خفیف', color: 'bg-green-100 text-green-800' };
  
  const lowerText = text.toLowerCase();
  if (lowerText.includes('شدید') || lowerText.includes('حاد') || lowerText.includes('مرگ')) {
    return { level: 'شدید', color: 'bg-red-100 text-red-800' };
  }
  if (lowerText.includes('متوسط') || lowerText.includes('خفیف')) {
    return { level: 'متوسط', color: 'bg-yellow-100 text-yellow-800' };
  }
  return { level: 'خفیف', color: 'bg-green-100 text-green-800' };
};

// لیست بیماری‌های شایع خانوادگی
const COMMON_FAMILY_DISEASES = [
  { name: "بیماری قلبی عروقی", relation: "پدر", icon: "❤️", risk: "بالا" },
  { name: "دیابت نوع ۲", relation: "مادر", icon: "🩸", risk: "متوسط" },
  { name: "فشار خون بالا", relation: "پدر", icon: "💓", risk: "متوسط" },
  { name: "سرطان پستان", relation: "خواهر", icon: "🎗️", risk: "بالا" },
  { name: "آلزایمر", relation: "مادربزرگ", icon: "🧠", risk: "متوسط" },
  { name: "آسم", relation: "برادر", icon: "🌬️", risk: "پایین" },
  { name: "میگرن", relation: "مادر", icon: "🤕", risk: "پایین" },
  { name: "پوکی استخوان", relation: "مادر", icon: "🦴", risk: "متوسط" },
];

// دسته‌بندی‌های پیش‌فرض
const FAMILY_RELATIONS = [
  { value: '', label: 'انتخاب نسبت' },
  { value: 'پدر', label: 'پدر' },
  { value: 'مادر', label: 'مادر' },
  { value: 'برادر', label: 'برادر' },
  { value: 'خواهر', label: 'خواهر' },
  { value: 'پدربزرگ', label: 'پدربزرگ' },
  { value: 'مادربزرگ', label: 'مادربزرگ' },
  { value: 'فرزند', label: 'فرزند' },
  { value: 'عمو', label: 'عمو' },
  { value: 'عمه', label: 'عمه' },
  { value: 'دایی', label: 'دایی' },
  { value: 'خاله', label: 'خاله' },
  { value: 'خویشاوند دور', label: 'خویشاوند دور' }
];

// کامپوننت EditableFamilyItem
const EditableFamilyItem = React.memo(({ item, onEdit, onRemove, onToggleStatus }) => {
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editedText, setEditedText] = useState(item.text || '');
  const [editedRelation, setEditedRelation] = useState(item.relation || '');
  const [editedAge, setEditedAge] = useState(item.age || '');
  const [editedAgeAtDiagnosis, setEditedAgeAtDiagnosis] = useState(item.ageAtDiagnosis || '');
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditingItem && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditingItem]);

  const handleSaveEdit = () => {
    if (editedText.trim() && onEdit) {
      onEdit(item.id, editedText, editedRelation, editedAge, editedAgeAtDiagnosis);
      setIsEditingItem(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedText(item.text || '');
    setEditedRelation(item.relation || '');
    setEditedAge(item.age || '');
    setEditedAgeAtDiagnosis(item.ageAtDiagnosis || '');
    setIsEditingItem(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const relationInfo = getRelationInfo(editedRelation);
  const severityInfo = getDiseaseSeverity(editedText);

  return (
    <div className={`flex items-center justify-between group p-3 hover:bg-gray-50 rounded-lg border border-gray-100 mb-2 transition-all duration-200 ${
      item.isActive === false ? 'opacity-60' : ''
    }`}>
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="نام بیماری یا شرایط پزشکی"
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
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">نسبت:</span>
                <select
                  value={editedRelation}
                  onChange={(e) => setEditedRelation(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-right text-sm"
                >
                  {FAMILY_RELATIONS.map(rel => (
                    <option key={rel.value} value={rel.value}>
                      {rel.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">سن:</span>
                <input
                  type="text"
                  value={editedAge}
                  onChange={(e) => setEditedAge(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-right text-sm"
                  placeholder="سن فعلی"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">سن تشخیص:</span>
                <input
                  type="text"
                  value={editedAgeAtDiagnosis}
                  onChange={(e) => setEditedAgeAtDiagnosis(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-right text-sm"
                  placeholder="سن تشخیص"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">شدت:</span>
                <select
                  value={severityInfo.level}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-right text-sm"
                  onChange={(e) => {
                    const baseText = editedText.replace(/\s*\(شدید\)|\s*\(متوسط\)|\s*\(خفیف\)/g, '').trim();
                    const newText = e.target.value === 'خفیف' ? baseText : `${baseText} (${e.target.value})`;
                    setEditedText(newText);
                  }}
                >
                  <option value="خفیف">خفیف</option>
                  <option value="متوسط">متوسط</option>
                  <option value="شدید">شدید</option>
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
              <div className={`${relationInfo.bgColor} p-2 rounded-lg`}>
                <span className="text-lg">{relationInfo.emoji}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs ${severityInfo.color}`}>
                      {severityInfo.level}
                    </div>
                    {item.age && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        سن: {item.age}
                      </span>
                    )}
                    {item.ageAtDiagnosis && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        تشخیص در {item.ageAtDiagnosis} سالگی
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {item.relation && (
                      <span className={`text-xs px-2 py-1 rounded-full ${relationInfo.bgColor} ${relationInfo.color}`}>
                        {item.relation}
                      </span>
                    )}
                    {item.isActive === false && (
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                        فوت شده
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 text-right text-sm md:text-base font-medium mt-2">{item.text}</p>
                
                <div className="flex items-center gap-3 mt-2">
                  {item.date && (
                    <div className="flex items-center gap-1">
                      <FiCalendar className="text-gray-400 w-3 h-3" />
                      <p className="text-xs text-gray-500">تاریخ ثبت: {item.date}</p>
                    </div>
                  )}
                  
                  {item.onsetAge && (
                    <div className="flex items-center gap-1">
                      <FiHeart className="text-red-400 w-3 h-3" />
                      <p className="text-xs text-gray-500">شروع در سن {item.onsetAge}</p>
                    </div>
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
            onClick={() => onToggleStatus && onToggleStatus(item.id)}
            className="p-1 md:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            title={item.isActive === false ? "بازگرداندن" : "علامت‌گذاری فوت"}
          >
            {item.isActive === false ? (
              <FiUserPlus className="w-4 h-4" />
            ) : (
              <FiUserMinus className="w-4 h-4" />
            )}
          </button>
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

// کامپوننت اصلی FamilyHistorySection
const FamilyHistorySection = React.memo(({
  familyHistory = [],
  onAdd,
  onEdit,
  onRemove,
  onToggleStatus,
  showAddButton = true,
  patientAge = null,
  patientGender = null
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [newItemRelation, setNewItemRelation] = useState('');
  const [newItemAge, setNewItemAge] = useState('');
  const [newItemAgeAtDiagnosis, setNewItemAgeAtDiagnosis] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, deceased
  const [searchQuery, setSearchQuery] = useState('');
  const [showList, setShowList] = useState(false);
  const inputRef = useRef(null);

  const safeItems = Array.isArray(familyHistory) ? familyHistory : [];

  // فیلتر و جستجوی موارد
  const filteredItems = safeItems.filter(item => {
    // جستجوی متنی
    if (searchQuery && 
        !item.text?.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.relation?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // فیلتر وضعیت
    if (filter === 'active' && item.isActive === false) return false;
    if (filter === 'deceased' && item.isActive !== false) return false;
    
    return true;
  });

  // پیشنهاد بیماری‌های شایع بر اساس جنسیت بیمار
  const getSuggestedDiseases = () => {
    let suggestions = [...COMMON_FAMILY_DISEASES];
    
    // فیلتر بر اساس جنسیت بیمار برای سرطان پستان
    if (patientGender === 'مرد') {
      suggestions = suggestions.filter(d => !d.name.includes('پستان'));
    }
    
    // فیلتر مواردی که قبلاً اضافه شده‌اند
    return suggestions.filter(suggestion => 
      !safeItems.some(item => 
        item.text?.includes(suggestion.name.split(' ')[0]) && 
        item.relation === suggestion.relation
      )
    );
  };

  const handleAddItem = (text = null, relation = null, age = null, ageAtDiagnosis = null) => {
    const itemText = text || newItemText;
    if (itemText.trim()) {
      const newItem = {
        id: Date.now() + Math.random(),
        text: itemText,
        relation: relation || newItemRelation,
        age: age || newItemAge,
        ageAtDiagnosis: ageAtDiagnosis || newItemAgeAtDiagnosis,
        date: new Date().toLocaleDateString('fa-IR'),
        isActive: true,
        notes: '',
        addedDate: new Date().toLocaleDateString('fa-IR')
      };
      
      if (onAdd) {
        onAdd(newItem);
      }
      
      resetForm();
    }
  };

  const handleQuickAdd = (disease) => {
    handleAddItem(disease.name, disease.relation, '', '');
  };

  const handleCancelAdd = () => {
    resetForm();
  };

  const resetForm = () => {
    setNewItemText('');
    setNewItemRelation('');
    setNewItemAge('');
    setNewItemAgeAtDiagnosis('');
    setIsAdding(false);
    setShowQuickAdd(false);
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

  const handleEditItem = (id, newText, newRelation, newAge, newAgeAtDiagnosis) => {
    if (onEdit) {
      onEdit(id, newText, newRelation, newAge, newAgeAtDiagnosis);
    }
  };

  const handleRemoveItem = (id) => {
    if (onRemove) {
      onRemove(id);
    }
  };

  const handleStatusToggle = (id) => {
    if (onToggleStatus) {
      onToggleStatus(id);
    }
  };

  const suggestedDiseases = getSuggestedDiseases();

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      {/* هدر */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 md:p-3 rounded-lg bg-purple-100">
            <FiUsers className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800">سوابق خانوادگی</h3>
            <p className="text-xs md:text-sm text-gray-500">
              {safeItems.length} مورد ثبت شده
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isAdding && (
            <button
              onClick={() => setShowList(!showList)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 text-sm font-medium"
            >
              {showList ? (
                <>
                 <FiEyeOff className="w-4 h-4" />
                  <span className="hidden md:inline">بستن لیست</span>
                  <span className="md:hidden">بستن</span>
                </>
              ) : (
                <>
                  <FiEye className="w-4 h-4" />
                  <span className="hidden md:inline">مشاهده لیست</span>
                  <span className="md:hidden">لیست</span>
                </>
              )}
            </button>
          )}
          
          {showAddButton && !isAdding && (
            <button
              onClick={() => {
                setIsAdding(true);
                setShowQuickAdd(false);
              }}
              className="flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition text-sm md:text-base"
            >
              <FiPlus className="w-4 h-4" />
              <span className="hidden md:inline">افزودن سابقه</span>
              <span className="md:hidden">افزودن</span>
            </button>
          )}
        </div>
      </div>
      
      {/* لیست سوابق خانوادگی */}
      {showList && (
        <>
          {/* فیلتر و جستجو */}
          <div className="mb-4 flex flex-col md:flex-row gap-2 md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو در سوابق خانوادگی..."
                  className="w-full px-3 md:px-4 py-2 pr-10 border border-gray-300 rounded-lg text-right text-sm md:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-right text-sm md:text-base"
              >
                <option value="all">همه موارد</option>
                <option value="active">افراد زنده</option>
                <option value="deceased">فوت شده‌ها</option>
              </select>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
              >
                <FiFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="mb-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <EditableFamilyItem
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                  onRemove={handleRemoveItem}
                  onToggleStatus={handleStatusToggle}
                />
              ))
            ) : (
              <div className="text-center py-6 md:py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <p className="text-gray-500 text-sm md:text-base">سابقه خانوادگی ثبت نشده است</p>
                {showAddButton && (
                  <p className="text-xs md:text-sm text-gray-400 mt-1">برای افزودن سابقه، روی افزودن کلیک کنید</p>
                )}
              </div>
            )}
          </div>
        </>
      )}
      
      {/* بیماری‌های شایع سریع */}
      {showQuickAdd && !isAdding && (
        <div className="mb-4 p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-gray-800 text-sm md:text-base">بیماری‌های شایع خانوادگی</h4>
            <button
              onClick={() => setShowQuickAdd(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestedDiseases.map((disease, index) => {
              const relationInfo = getRelationInfo(disease.relation);
              
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAdd(disease)}
                  className="flex items-center gap-2 p-2 md:p-3 rounded-lg transition bg-white hover:bg-blue-100 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-300"
                >
                  <div className={`${relationInfo.bgColor} p-2 rounded-lg`}>
                    <span className="text-lg">{disease.icon}</span>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-xs md:text-sm font-medium">{disease.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${relationInfo.bgColor} ${relationInfo.color}`}>
                        {disease.relation}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        disease.risk === 'بالا' ? 'bg-red-100 text-red-800' :
                        disease.risk === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        ریسک {disease.risk}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <button
              onClick={() => {
                setShowQuickAdd(false);
                setIsAdding(true);
              }}
              className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1"
            >
              <FiPlus className="w-3 h-3" />
              افزودن بیماری سفارشی
            </button>
          </div>
        </div>
      )}
      
      {/* فرم افزودن جدید */}
      {isAdding && (
        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
          <div className="space-y-3 md:space-y-4">
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <input
                ref={inputRef}
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="نام بیماری یا شرایط پزشکی"
                className="flex-1 px-3 md:px-4 py-2 md:py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-right text-sm md:text-base placeholder:text-gray-400"
                autoComplete="off"
                spellCheck="false"
                maxLength={200}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">نسبت:</span>
                <select
                  value={newItemRelation}
                  onChange={(e) => setNewItemRelation(e.target.value)}
                  className="flex-1 px-2 md:px-3 py-1.5 md:py-2 border border-purple-200 rounded-lg text-right text-sm md:text-base"
                >
                  {FAMILY_RELATIONS.map(rel => (
                    <option key={rel.value} value={rel.value}>
                      {rel.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">سن فعلی:</span>
                <input
                  type="text"
                  value={newItemAge}
                  onChange={(e) => setNewItemAge(e.target.value)}
                  placeholder="سن (اختیاری)"
                  className="flex-1 px-2 md:px-3 py-1.5 md:py-2 border border-purple-200 rounded-lg text-right text-sm md:text-base"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">سن تشخیص:</span>
                <input
                  type="text"
                  value={newItemAgeAtDiagnosis}
                  onChange={(e) => setNewItemAgeAtDiagnosis(e.target.value)}
                  placeholder="سن تشخیص (اختیاری)"
                  className="flex-1 px-2 md:px-3 py-1.5 md:py-2 border border-purple-200 rounded-lg text-right text-sm md:text-base"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">وضعیت:</span>
                <select
                  defaultValue="active"
                  className="flex-1 px-2 md:px-3 py-1.5 md:py-2 border border-purple-200 rounded-lg text-right text-sm md:text-base"
                >
                  <option value="active">زنده</option>
                  <option value="deceased">فوت شده</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={() => handleAddItem()}
                className="flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-5 md:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                disabled={!newItemText.trim()}
              >
                <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">افزودن سابقه</span>
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
          <div className="mt-2 text-xs text-purple-500">
            <p>💡 بیماری‌های پرخطر خانوادگی: سرطان‌ها، بیماری‌های قلبی زودهنگام، دیابت نوع ۱</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default FamilyHistorySection;