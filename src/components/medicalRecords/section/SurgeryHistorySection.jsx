import React, { useState, useEffect, useRef } from 'react';
import { FiActivity, FiPlus, FiX, FiEdit2, FiTrash2, FiCheck, FiCalendar, FiEye, FiEyeOff } from 'react-icons/fi';

// کامپوننت EditableSurgeryItem
const EditableSurgeryItem = React.memo(({ item, onEdit, onRemove }) => {
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editedText, setEditedText] = useState(item.text);
  const [editedDate, setEditedDate] = useState(item.date || '');
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditingItem && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditingItem]);

  const handleSaveEdit = () => {
    if (editedText.trim() && onEdit) {
      onEdit(item.id, editedText, editedDate);
      setIsEditingItem(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedText(item.text);
    setEditedDate(item.date || '');
    setIsEditingItem(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="نام عمل جراحی"
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
            <div className="flex items-center gap-2">
              <FiCalendar className="text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={editedDate}
                onChange={(e) => setEditedDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right text-sm"
                placeholder="تاریخ جراحی (مثلاً: 1402/05/15)"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-gray-700 text-right text-sm md:text-base">{item.text}</p>
                {item.date && (
                  <div className="flex items-center gap-1 mt-1">
                    <FiCalendar className="text-gray-400 w-3 h-3" />
                    <p className="text-xs text-gray-500">تاریخ: {item.date}</p>
                  </div>
                )}
                {item.details && (
                  <p className="text-xs text-gray-600 mt-1 text-right">{item.details}</p>
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

// کامپوننت اصلی SurgeryHistorySection
const SurgeryHistorySection = React.memo(({
  surgeryHistory = [],
  onAdd,
  onEdit,
  onRemove,
  showAddButton = true
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showSurgeryList, setShowSurgeryList] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [newItemDate, setNewItemDate] = useState('');
  const inputRef = useRef(null);

  const safeItems = Array.isArray(surgeryHistory) ? surgeryHistory : [];

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem = {
        id: Date.now() + Math.random(),
        text: newItemText,
        date: newItemDate || new Date().toLocaleDateString('fa-IR'),
        details: '',
        type: 'surgery'
      };
      onAdd(newItem);
      setNewItemText('');
      setNewItemDate('');
      setIsAdding(false);
      setShowSurgeryList(true);
    }
  };

  const handleCancelAdd = () => {
    setNewItemText('');
    setNewItemDate('');
    setIsAdding(false);
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

  const handleEditItem = (id, newText, newDate) => {
    if (onEdit) {
      onEdit(id, newText, newDate);
    }
  };

  const handleRemoveItem = (id) => {
    if (onRemove) {
      onRemove(id);
    }
  };

  // محاسبه آمار
  const calculateStats = () => {
    const total = safeItems.length;
    const last5Years = safeItems.filter(item => {
      if (!item.date) return false;
      const currentYear = new Date().getFullYear();
      const itemYear = parseInt(item.date.split('/')[0]);
      return itemYear >= currentYear - 5;
    }).length;
    
    const majorSurgeries = safeItems.filter(item => 
      item.text.toLowerCase().includes('باز') || 
      item.text.toLowerCase().includes('اساسی') ||
      item.text.toLowerCase().includes('عمده')
    ).length;

    return { total, last5Years, majorSurgeries };
  };

  const stats = calculateStats();

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      {/* هدر */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 md:p-3 rounded-lg bg-orange-100">
            <FiActivity className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800">سوابق جراحی</h3>
            <p className="text-xs md:text-sm text-gray-500">
              {safeItems.length} مورد ثبت شده
              {stats.last5Years > 0 && ` • ${stats.last5Years} مورد ۵ سال اخیر`}
              {stats.majorSurgeries > 0 && ` • ${stats.majorSurgeries} مورد عمده`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* دکمه نمایش/پنهان لیست */}
          {safeItems.length > 0 && (
            <button
              onClick={() => setShowSurgeryList(!showSurgeryList)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm"
            >
              {showSurgeryList ? (
                <>
                  <FiEyeOff className="w-4 h-4" />
                  <span className="hidden md:inline">بستن لیست</span>
                </>
              ) : (
                <>
                  <FiEye className="w-4 h-4" />
                  <span className="hidden md:inline">مشاهده لیست</span>
                </>
              )}
            </button>
          )}
          
          {/* دکمه افزودن سابقه جدید */}
          {showAddButton && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition text-sm md:text-base"
            >
              <FiPlus className="w-4 h-4" />
              <span className="hidden md:inline">افزودن سابقه جراحی</span>
              <span className="md:hidden">افزودن</span>
            </button>
          )}
        </div>
      </div>
      
      {/* لیست سوابق جراحی */}
      {showSurgeryList && safeItems.length > 0 && (
        <div className="mb-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {safeItems.map((item) => (
            <EditableSurgeryItem
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>
      )}

      {/* پیام وقتی لیست خالی است */}
      {!isAdding && showSurgeryList && safeItems.length === 0 && (
        <div className="text-center py-6 md:py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <p className="text-gray-500 text-sm md:text-base">سابقه جراحی ثبت نشده است</p>
          {showAddButton && (
            <p className="text-xs md:text-sm text-gray-400 mt-1">برای افزودن سابقه، روی افزودن کلیک کنید</p>
          )}
        </div>
      )}
      
      {/* فرم افزودن جدید */}
      {isAdding && (
        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <input
                ref={inputRef}
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="مثلاً: آپاندکتومی"
                className="flex-1 px-3 md:px-4 py-2 md:py-3 border-2 border-orange-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-right text-sm md:text-base placeholder:text-gray-400"
                autoComplete="off"
                spellCheck="false"
                maxLength={200}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <FiCalendar className="text-orange-600 w-4 h-4" />
              </div>
              <input
                type="text"
                value={newItemDate}
                onChange={(e) => setNewItemDate(e.target.value)}
                placeholder="تاریخ جراحی (اختیاری - مثال: 1402/05/15)"
                className="flex-1 px-3 md:px-4 py-2 border border-orange-200 rounded-lg text-right text-sm md:text-base"
              />
            </div>
            
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={handleAddItem}
                className="flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-5 md:py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                disabled={!newItemText.trim()}
              >
                <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">افزودن</span>
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
          <div className="mt-2 text-xs text-orange-500">
            <p> مثال‌ها: آپاندکتومی، فتق، لاپاراسکوپی، سزارین، تعویض مفصل، آنژیوپلاستی</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default SurgeryHistorySection;