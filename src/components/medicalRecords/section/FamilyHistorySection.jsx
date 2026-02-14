import React, { useState, useEffect, useRef } from 'react';
import { 
  FiUsers, FiPlus, FiX, FiEdit2, FiTrash2, FiCheck, 
  FiCalendar, FiHeart, FiFilter, FiSearch, 
  FiUserPlus, FiUserMinus, FiEyeOff,
  FiEye
} from 'react-icons/fi';

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
  const [editedStatus, setEditedStatus] = useState(item.isActive !== false ? 'active' : 'deceased');
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditingItem && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditingItem]);

  useEffect(() => {
    // وقتی item تغییر می‌کند، وضعیت ویرایش را هم به‌روزرسانی کن
    setEditedStatus(item.isActive !== false ? 'active' : 'deceased');
  }, [item.isActive]);

  const handleSaveEdit = () => {
    if (editedText.trim() && onEdit) {
      const isActive = editedStatus === 'active';
      onEdit(item.id, editedText, editedRelation, editedAge, editedAgeAtDiagnosis, isActive);
      setIsEditingItem(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedText(item.text || '');
    setEditedRelation(item.relation || '');
    setEditedAge(item.age || '');
    setEditedAgeAtDiagnosis(item.ageAtDiagnosis || '');
    setEditedStatus(item.isActive !== false ? 'active' : 'deceased');
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
    <div className={`flex items-center justify-between group p-3 md:p-4 hover:bg-gray-50 rounded-lg border border-gray-100 mb-2 transition-all duration-200 ${
      item.isActive === false ? 'opacity-60' : ''
    }`}>
      <div className="flex-1">
        {isEditingItem ? (
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <input
                ref={editInputRef}
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm md:text-base"
                placeholder="نام بیماری یا شرایط پزشکی"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 md:flex-none px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm md:text-base flex items-center justify-center gap-1 md:gap-2 transition"
                >
                  <FiCheck className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden md:inline">ذخیره</span>
                  <span className="md:hidden">ذخیره</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 md:flex-none px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm md:text-base flex items-center justify-center gap-1 md:gap-2 transition"
                >
                  <FiX className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden md:inline">لغو</span>
                  <span className="md:hidden">لغو</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
                <span className="text-gray-500 text-xs md:text-sm whitespace-nowrap">نسبت:</span>
                <select
                  value={editedRelation}
                  onChange={(e) => setEditedRelation(e.target.value)}
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-right text-sm md:text-base"
                >
                  {FAMILY_RELATIONS.map(rel => (
                    <option key={rel.value} value={rel.value}>
                      {rel.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
                <span className="text-gray-500 text-xs md:text-sm whitespace-nowrap">سن:</span>
                <input
                  type="text"
                  value={editedAge}
                  onChange={(e) => setEditedAge(e.target.value)}
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-right text-sm md:text-base"
                  placeholder="سن فعلی"
                />
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
                <span className="text-gray-500 text-xs md:text-sm whitespace-nowrap">سن تشخیص:</span>
                <input
                  type="text"
                  value={editedAgeAtDiagnosis}
                  onChange={(e) => setEditedAgeAtDiagnosis(e.target.value)}
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-right text-sm md:text-base"
                  placeholder="سن تشخیص"
                />
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
                <span className="text-gray-500 text-xs md:text-sm whitespace-nowrap">وضعیت:</span>
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-right text-sm md:text-base"
                >
                  <option value="active">زنده</option>
                  <option value="deceased">فوت شده</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-2 md:gap-3">
              <div className={`${relationInfo.bgColor} p-2 md:p-3 rounded-lg flex-shrink-0`}>
                <span className="text-lg md:text-xl">{relationInfo.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row justify-between items-start gap-2 md:gap-0">
                  <div className="flex flex-wrap items-center gap-1 md:gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs ${severityInfo.color}`}>
                      {severityInfo.level}
                    </div>
                    {item.age && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full whitespace-nowrap">
                        سن: {item.age}
                      </span>
                    )}
                    {item.ageAtDiagnosis && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">
                        تشخیص در {item.ageAtDiagnosis} سالگی
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    {item.relation && (
                      <span className={`text-xs px-2 py-1 rounded-full ${relationInfo.bgColor} ${relationInfo.color} whitespace-nowrap`}>
                        {item.relation}
                      </span>
                    )}
                    {item.isActive === false && (
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full whitespace-nowrap">
                        فوت شده
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 text-right text-sm md:text-base font-medium mt-2 break-words">
                  {item.text}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">
                  {item.date && (
                    <div className="flex items-center gap-1">
                      <FiCalendar className="text-gray-400 w-3 h-3 md:w-4 md:h-4" />
                      <p className="text-xs text-gray-500 whitespace-nowrap">تاریخ ثبت: {item.date}</p>
                    </div>
                  )}
                  
                  {item.onsetAge && (
                    <div className="flex items-center gap-1">
                      <FiHeart className="text-red-400 w-3 h-3 md:w-4 md:h-4" />
                      <p className="text-xs text-gray-500 whitespace-nowrap">شروع در سن {item.onsetAge}</p>
                    </div>
                  )}
                </div>
                
                {item.notes && (
                  <p className="text-xs text-gray-600 mt-2 text-right break-words">{item.notes}</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {!isEditingItem && (
        <div className="flex items-center gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
          <button
            onClick={() => {
              console.log('Toggling status for item:', item.id, 'current status:', item.isActive);
              if (onToggleStatus) {
                onToggleStatus(item.id);
              }
            }}
            className="p-1 md:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            title={item.isActive === false ? "بازگرداندن" : "علامت‌گذاری فوت"}
          >
            {item.isActive === false ? (
              <FiUserPlus className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <FiUserMinus className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>
          <button
            onClick={() => setIsEditingItem(true)}
            className="p-1 md:p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
            title="ویرایش"
          >
            <FiEdit2 className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="p-1 md:p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
            title="حذف"
          >
            <FiTrash2 className="w-4 h-4 md:w-5 md:h-5" />
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
  const [newItemStatus, setNewItemStatus] = useState('active');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showList, setShowList] = useState(false);
  const inputRef = useRef(null);

  const safeItems = Array.isArray(familyHistory) ? familyHistory : [];

  // فیلتر و جستجوی موارد
  const filteredItems = safeItems.filter(item => {
    if (searchQuery && 
        !item.text?.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.relation?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filter === 'active' && item.isActive === false) return false;
    if (filter === 'deceased' && item.isActive !== false) return false;
    
    return true;
  });

  const handleAddItem = (text = null, relation = null, age = null, ageAtDiagnosis = null, status = null) => {
    const itemText = text || newItemText;
    if (itemText.trim()) {
      const selectedStatus = status || newItemStatus;
      const isActive = selectedStatus === 'deceased' ? false : true;
      
      const newItem = {
        id: Date.now() + Math.random(),
        text: itemText,
        relation: relation || newItemRelation,
        age: age || newItemAge,
        ageAtDiagnosis: ageAtDiagnosis || newItemAgeAtDiagnosis,
        date: new Date().toLocaleDateString('fa-IR'),
        isActive: isActive,
        notes: '',
        addedDate: new Date().toLocaleDateString('fa-IR')
      };
      
      if (onAdd) {
        onAdd(newItem);
      }
      
      resetForm();
      setShowList(true);
    }
  };

  const handleCancelAdd = () => {
    resetForm();
  };

  const resetForm = () => {
    setNewItemText('');
    setNewItemRelation('');
    setNewItemAge('');
    setNewItemAgeAtDiagnosis('');
    setNewItemStatus('active');
    setIsAdding(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddItem();
    } else if (e.key === 'Escape') {
      handleCancelAdd();
    }
  };

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleEditItem = (id, newText, newRelation, newAge, newAgeAtDiagnosis, isActive) => {
    if (onEdit) {
      onEdit(id, newText, newRelation, newAge, newAgeAtDiagnosis, isActive);
    }
  };

  const handleRemoveItem = (id) => {
    if (onRemove) {
      onRemove(id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      {/* هدر */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-4 md:mb-6">
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
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowList(!showList)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 text-sm font-medium"
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
          
          {showAddButton && !isAdding && (
            <button
              onClick={() => {
                setIsAdding(true);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-3 py-2.5 md:px-4 md:py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition text-sm md:text-base font-medium"
            >
              <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
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
                  className="w-full px-3 md:px-4 py-2 md:py-3 pr-10 border border-gray-300 rounded-lg text-right text-sm md:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1 md:flex-none px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg text-right text-sm md:text-base min-w-[120px]"
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
                className="px-3 md:px-4 py-2 md:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm md:text-base flex items-center justify-center"
              >
                <FiFilter className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
          
          <div className="mb-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <EditableFamilyItem
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                  onRemove={handleRemoveItem}
                  onToggleStatus={onToggleStatus} // 🔴 اینجا مستقیماً prop را پاس می‌دهیم
                />
              ))
            ) : (
              <div className="text-center py-8 md:py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <div className="text-5xl md:text-6xl mb-3 md:mb-4">👨‍👩‍👧‍👦</div>
                <p className="text-gray-500 text-sm md:text-base mb-1 md:mb-2">سابقه خانوادگی ثبت نشده است</p>
                <p className="text-xs md:text-sm text-gray-400">برای افزودن سابقه خانوادگی، روی دکمه "افزودن سابقه" کلیک کنید</p>
              </div>
            )}
          </div>
        </>
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
              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
                <span className="text-gray-500 text-xs md:text-sm whitespace-nowrap">نسبت:</span>
                <select
                  value={newItemRelation}
                  onChange={(e) => setNewItemRelation(e.target.value)}
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-purple-200 rounded-lg text-right text-sm md:text-base"
                >
                  {FAMILY_RELATIONS.map(rel => (
                    <option key={rel.value} value={rel.value}>
                      {rel.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
                <span className="text-gray-500 text-xs md:text-sm whitespace-nowrap">سن فعلی:</span>
                <input
                  type="text"
                  value={newItemAge}
                  onChange={(e) => setNewItemAge(e.target.value)}
                  placeholder="سن (اختیاری)"
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-purple-200 rounded-lg text-right text-sm md:text-base"
                />
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
                <span className="text-gray-500 text-xs md:text-sm whitespace-nowrap">سن تشخیص:</span>
                <input
                  type="text"
                  value={newItemAgeAtDiagnosis}
                  onChange={(e) => setNewItemAgeAtDiagnosis(e.target.value)}
                  placeholder="سن تشخیص (اختیاری)"
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-purple-200 rounded-lg text-right text-sm md:text-base"
                />
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
                <span className="text-gray-500 text-xs md:text-sm whitespace-nowrap">وضعیت:</span>
                <select
                  value={newItemStatus}
                  onChange={(e) => setNewItemStatus(e.target.value)}
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-purple-200 rounded-lg text-right text-sm md:text-base"
                >
                  <option value="active">زنده</option>
                  <option value="deceased">فوت شده</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <button
                onClick={() => handleAddItem()}
                className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 py-2.5 md:px-5 md:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm md:text-base font-medium"
                disabled={!newItemText.trim()}
              >
                <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
                <span>افزودن سابقه</span>
              </button>
              <button
                onClick={handleCancelAdd}
                className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 py-2.5 md:px-5 md:py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl transition text-sm md:text-base font-medium"
              >
                <FiX className="w-4 h-4 md:w-5 md:h-5" />
                <span>لغو</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between mt-2 text-xs text-gray-500 gap-1">
            <p>Enter ↵ برای افزودن سریع | Escape ⎋ برای لغو</p>
            <p>{newItemText.length}/200 کاراکتر</p>
          </div>
          <div className="mt-2 text-xs md:text-sm text-purple-500">
            <p> بیماری‌های پرخطر خانوادگی: سرطان‌ها، بیماری‌های قلبی زودهنگام، دیابت نوع ۱</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default FamilyHistorySection;