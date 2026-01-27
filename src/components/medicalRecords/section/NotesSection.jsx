import React, { useState, useEffect, useRef } from 'react';
import { 
  FiFileText, FiPlus, FiX, FiEdit2, FiTrash2, FiCheck, 
  FiCalendar, FiClock, FiSave, FiTag, FiSearch, FiFilter,
  FiStar, FiPrinter, FiCopy, FiLock, FiUnlock, FiEye, FiEyeOff,
  FiBookOpen, FiMessageSquare, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import { MdLocalHospital } from 'react-icons/md';
import { FaStethoscope, FaNotesMedical } from 'react-icons/fa';

// تابع کمکی برای تعیین اطلاعات دسته‌بندی
const getCategoryInfo = (category) => {
  switch(category) {
    case 'بالینی':
      return { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '🩺', iconComponent: <FaStethoscope /> };
    case 'دارویی':
      return { color: 'text-green-600', bgColor: 'bg-green-100', icon: '💊', iconComponent: <MdLocalHospital /> };
    case 'آزمایشات':
      return { color: 'text-purple-600', bgColor: 'bg-purple-100', icon: '🧪', iconComponent: <FaNotesMedical /> };
    case 'مشاوره':
      return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '💬', iconComponent: <FiMessageSquare /> };
    case 'پیگیری':
      return { color: 'text-orange-600', bgColor: 'bg-orange-100', icon: '📅', iconComponent: <FiCalendar /> };
    case 'ضروری':
      return { color: 'text-red-600', bgColor: 'bg-red-100', icon: '⚠️', iconComponent: <FiStar /> };
    case 'عمومی':
    default:
      return { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: '📝', iconComponent: <FiFileText /> };
  }
};

// کامپوننت EditableNoteItem
const EditableNoteItem = React.memo(({ 
  note, 
  onEdit, 
  onRemove, 
  onToggleStatus,
  onTogglePrivacy,
  onCopyNote,
  isEditingGlobal = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content || '');
  const [editedTitle, setEditedTitle] = useState(note.title || '');
  const [editedTags, setEditedTags] = useState(note.tags?.join(', ') || '');
  const [editedCategory, setEditedCategory] = useState(note.category || 'عمومی');
  const [isExpanded, setIsExpanded] = useState(false);
  const editTextareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.focus();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    if (editedContent.trim() && onEdit) {
      onEdit(note.id, editedContent, editedTitle, editedCategory, editedTags);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(note.content || '');
    setEditedTitle(note.title || '');
    setEditedTags(note.tags?.join(', ') || '');
    setEditedCategory(note.category || 'عمومی');
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const categoryInfo = getCategoryInfo(editedCategory);

  // ساده‌سازی محتوا برای نمایش مختصر
  const getPreviewContent = (content) => {
    if (!content) return '';
    if (content.length <= 150) return content;
    return content.substring(0, 150) + '...';
  };

  return (
    <div className={`group p-3 md:p-4 rounded-xl border transition-all duration-200 mb-3 ${
      note.isImportant ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-white' :
      note.isPrivate ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-white' :
      'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
    }`}>
      {isEditing ? (
        <div className="space-y-3 md:space-y-4">
          {/* عنوان */}
          <div>
            <label className="block text-xs md:text-sm text-gray-600 mb-1">عنوان یادداشت</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="عنوان اختیاری"
              maxLength={100}
            />
          </div>

          {/* دسته‌بندی و تگ‌ها */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs md:text-sm text-gray-600 mb-1">دسته‌بندی</label>
              <select
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="عمومی">عمومی</option>
                <option value="بالینی">بالینی</option>
                <option value="دارویی">دارویی</option>
                <option value="آزمایشات">آزمایشات</option>
                <option value="مشاوره">مشاوره</option>
                <option value="پیگیری">پیگیری</option>
                <option value="ضروری">ضروری</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs md:text-sm text-gray-600 mb-1">برچسب‌ها (با ویرگول جدا کنید)</label>
              <input
                type="text"
                value={editedTags}
                onChange={(e) => setEditedTags(e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="مثلاً: فشار خون, دارو, رژیم"
              />
            </div>
          </div>

          {/* محتوا */}
          <div>
            <label className="block text-xs md:text-sm text-gray-600 mb-1">متن یادداشت</label>
            <textarea
              ref={editTextareaRef}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full h-40 md:h-48 px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="متن کامل یادداشت را وارد کنید..."
            />
            <div className="flex flex-col md:flex-row justify-between mt-1 text-xs text-gray-500">
              <span className="mb-1 md:mb-0">Ctrl+Enter برای ذخیره سریع</span>
              <span>{editedContent.length}/2000 کاراکتر</span>
            </div>
          </div>

          {/* دکمه‌های عمل */}
          <div className="flex flex-col md:flex-row gap-2 pt-2">
            <button
              onClick={handleSaveEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition text-sm md:text-base"
            >
              <FiSave className="w-4 h-4" />
              ذخیره تغییرات
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition text-sm md:text-base"
            >
              <FiX className="w-4 h-4" />
              لغو
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* هدر یادداشت */}
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-3">
            <div className="flex items-start gap-2 md:gap-3">
              <div className={`p-2 rounded-lg ${categoryInfo.bgColor} flex-shrink-0`}>
                <span className={categoryInfo.color}>
                  {categoryInfo.iconComponent || <span className="text-lg">{categoryInfo.icon}</span>}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-2">
                  <h4 className="font-bold text-gray-800 text-sm md:text-base truncate">
                    {note.title || 'یادداشت پزشکی'}
                  </h4>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${categoryInfo.bgColor} ${categoryInfo.color} whitespace-nowrap`}>
                      {note.category || 'عمومی'}
                    </span>
                    {note.isImportant && (
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 whitespace-nowrap">
                        <FiStar className="inline w-3 h-3 mr-1" />
                        مهم
                      </span>
                    )}
                    {note.isPrivate && (
                      <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 whitespace-nowrap">
                        <FiLock className="inline w-3 h-3 mr-1" />
                        خصوصی
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    <FiCalendar className="inline w-3 h-3 mr-1" />
                    {note.date || ''}
                  </span>
                  {note.doctorName && (
                    <span className="text-xs text-blue-600 truncate">
                      توسط: {note.doctorName}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end md:justify-start gap-1 md:gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2 md:mt-0">
              {onCopyNote && (
                <button
                  onClick={() => onCopyNote(note.content)}
                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="کپی متن"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
              )}
              {onTogglePrivacy && (
                <button
                  onClick={() => onTogglePrivacy(note.id)}
                  className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                  title={note.isPrivate ? "عمومی کردن" : "خصوصی کردن"}
                >
                  {note.isPrivate ? <FiUnlock className="w-4 h-4" /> : <FiLock className="w-4 h-4" />}
                </button>
              )}
              {onToggleStatus && (
                <button
                  onClick={() => onToggleStatus(note.id)}
                  className="p-1.5 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                  title={note.isImportant ? "حذف از مهم‌ها" : "علامت‌گذاری مهم"}
                >
                  <FiStar className={`w-4 h-4 ${note.isImportant ? 'fill-current text-yellow-500' : ''}`} />
                </button>
              )}
              {isEditingGlobal ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                  title="ویرایش"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
              ) : null}
              <button
                onClick={() => onRemove(note.id)}
                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                title="حذف"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* محتوای یادداشت */}
          <div className="mb-3">
            <div className={`text-gray-700 text-right leading-relaxed ${
              isExpanded ? '' : 'max-h-32 overflow-hidden'
            }`}>
              <pre className="whitespace-pre-wrap font-sans text-sm md:text-base break-words">
                {isExpanded ? note.content : getPreviewContent(note.content)}
              </pre>
            </div>
            
            {note.content && note.content.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:text-blue-800 text-sm mt-2 flex items-center gap-1"
              >
                {isExpanded ? (
                  <>
                    <FiEyeOff className="w-3 h-3" />
                    نمایش کمتر
                  </>
                ) : (
                  <>
                    <FiEye className="w-3 h-3" />
                    نمایش کامل
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* تگ‌ها و اطلاعات پایین */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pt-3 border-t border-gray-100 gap-2">
            <div className="flex flex-wrap gap-1">
              {note.tags && note.tags.length > 0 ? (
                note.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs whitespace-nowrap"
                  >
                    <FiTag className="inline w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">بدون برچسب</span>
              )}
            </div>
            
            {note.lastEdited && (
              <span className="text-xs text-gray-500 whitespace-nowrap">
                <FiClock className="inline w-3 h-3 mr-1" />
                آخرین ویرایش: {note.lastEdited}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
});

// الگوهای یادداشت آماده
const NOTE_TEMPLATES = [
  {
    title: "یادداشت ویزیت",
    content: `وضعیت فعلی بیمار: 
معاینه فیزیکی:
بررسی سیستم‌های حیاتی:
درمان پیشنهادی:
دستورات:
تاریخ ویزیت بعدی:`,
    category: "بالینی",
    tags: ["ویزیت", "معاینه", "بررسی"]
  },
  {
    title: "نسخه دارویی",
    content: `لیست داروها:
1. 
2. 
3. 

دستورات مصرف:
نکات مهم:
تاریخ مراجعه بعدی برای دریافت دارو:`,
    category: "دارویی",
    tags: ["دارو", "نسخه", "درمان"]
  },
  {
    title: "نتایج آزمایش",
    content: `آزمایش درخواست شده:
تاریخ نمونه‌گیری:
تاریخ اعلام نتیجه:
نتایج:
نظرات پزشک:`,
    category: "آزمایشات",
    tags: ["آزمایش", "نتایج", "پزشکی"]
  },
  {
    title: "مشاوره تخصصی",
    content: `موضوع مشاوره:
توضیحات بیمار:
نظرات و پیشنهادات:
توصیه‌ها:
پیگیری‌های لازم:`,
    category: "مشاوره",
    tags: ["مشاوره", "توصیه", "پیگیری"]
  }
];

// دسته‌بندی‌های پیش‌فرض
const NOTE_CATEGORIES = [
  { id: 'all', name: 'همه یادداشت‌ها', count: 0 },
  { id: 'clinical', name: 'بالینی', icon: '🩺' },
  { id: 'medication', name: 'دارویی', icon: '💊' },
  { id: 'lab', name: 'آزمایشات', icon: '🧪' },
  { id: 'consultation', name: 'مشاوره', icon: '💬' },
  { id: 'followup', name: 'پیگیری', icon: '📅' },
  { id: 'important', name: 'مهم‌ها', icon: '⚠️' },
  { id: 'private', name: 'خصوصی', icon: '🔒' }
];

// کامپوننت اصلی NotesSection با قابلیت expand/collapse
const NotesSection = React.memo(({
  notes = [],
  onAdd,
  onEdit,
  onRemove,
  onToggleImportant,
  onTogglePrivacy,
  onCopyNote,
  showAddButton = true,
  doctorName = "دکتر",
  patientName = "بیمار",
  showEditButtons = true
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('عمومی');
  const [newNoteTags, setNewNoteTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showFilters, setShowFilters] = useState(true); // فیلترها همیشه نمایش داده می‌شوند
  const [sortBy, setSortBy] = useState('date-desc');
  const [isExpanded, setIsExpanded] = useState(false); // حالت expand/collapse
  
  // حالت‌های جداگانه برای فرم اضافه کردن
  const [addNoteIsPrivate, setAddNoteIsPrivate] = useState(false);
  const [addNoteIsImportant, setAddNoteIsImportant] = useState(false);
  
  const textareaRef = useRef(null);

  const safeNotes = Array.isArray(notes) ? notes : [];

  // تابع toggle برای باز و بسته شدن
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // فیلتر و مرتب‌سازی یادداشت‌ها
  const filteredNotes = safeNotes.filter(note => {
    // جستجوی متنی
    if (searchQuery && 
        !note.content?.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !(note.title && note.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !(note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))) {
      return false;
    }
    
    // فیلتر دسته‌بندی
    if (selectedCategory !== 'all') {
      switch(selectedCategory) {
        case 'clinical': if (note.category !== 'بالینی') return false; break;
        case 'medication': if (note.category !== 'دارویی') return false; break;
        case 'lab': if (note.category !== 'آزمایشات') return false; break;
        case 'consultation': if (note.category !== 'مشاوره') return false; break;
        case 'followup': if (note.category !== 'پیگیری') return false; break;
        case 'important': if (!note.isImportant) return false; break;
        case 'private': if (!note.isPrivate) return false; break;
      }
    }
    
    return true;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'date-asc':
        return new Date(a.date || 0) - new Date(b.date || 0);
      case 'important':
        return (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0);
      case 'date-desc':
      default:
        return new Date(b.date || 0) - new Date(a.date || 0);
    }
  });

  // تابع اصلی برای افزودن یادداشت
  const handleSaveNote = () => {
    if (newNoteContent.trim()) {
      const newNote = {
        id: Date.now() + Math.random(),
        content: newNoteContent,
        title: newNoteTitle || undefined,
        category: newNoteCategory,
        tags: newNoteTags ? newNoteTags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        date: new Date().toLocaleDateString('fa-IR'),
        time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        doctorName: doctorName,
        isPrivate: addNoteIsPrivate,
        isImportant: addNoteIsImportant,
        lastEdited: new Date().toLocaleDateString('fa-IR')
      };
      
      if (onAdd && typeof onAdd === 'function') {
        onAdd(newNote);
      } else {
        console.error('onAdd function is not provided or is not a function');
      }
      
      resetForm();
      
      // اگر بسته بود، بعد از اضافه کردن باز شود
      if (!isExpanded) {
        setIsExpanded(true);
      }
    } else {
      alert('لطفا متن یادداشت را وارد کنید!');
    }
  };

  const handleUseTemplate = (template) => {
    setNewNoteContent(template.content);
    setNewNoteTitle(template.title);
    setNewNoteCategory(template.category);
    setNewNoteTags(template.tags.join(', '));
    setAddNoteIsPrivate(false);
    setAddNoteIsImportant(false);
    setIsAdding(true);
    setShowTemplates(false);
    
    // اگر بسته بود، باز شود
    if (!isExpanded) {
      setIsExpanded(true);
    }
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  const handleEditNote = (id, content, title, category, tags) => {
    if (onEdit && typeof onEdit === 'function') {
      onEdit(id, content, title, category, tags);
    }
  };

  const handleRemoveNote = (id) => {
    if (onRemove && typeof onRemove === 'function') {
      onRemove(id);
    }
  };

  const handleToggleImportant = (id) => {
    if (onToggleImportant && typeof onToggleImportant === 'function') {
      onToggleImportant(id);
    }
  };

  const handleTogglePrivacy = (id) => {
    if (onTogglePrivacy && typeof onTogglePrivacy === 'function') {
      onTogglePrivacy(id);
    }
  };

  const handleCopyNoteText = (content) => {
    if (onCopyNote && typeof onCopyNote === 'function') {
      onCopyNote(content);
    } else {
      navigator.clipboard.writeText(content).then(() => {
        alert('متن یادداشت کپی شد!');
      });
    }
  };

  const handleCancelAdd = () => {
    resetForm();
  };

  const resetForm = () => {
    setNewNoteContent('');
    setNewNoteTitle('');
    setNewNoteCategory('عمومی');
    setNewNoteTags('');
    setAddNoteIsPrivate(false);
    setAddNoteIsImportant(false);
    setIsAdding(false);
    setShowTemplates(false);
  };

  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSaveNote();
    } else if (e.key === 'Escape') {
      handleCancelAdd();
    }
  };

  useEffect(() => {
    if (isAdding && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAdding]);

  // آمار و اطلاعات
  const calculateStats = () => {
    const total = safeNotes.length;
    const today = safeNotes.filter(note => {
      const todayDate = new Date().toLocaleDateString('fa-IR');
      return note.date === todayDate;
    }).length;
    
    const important = safeNotes.filter(note => note.isImportant).length;
    const privateNotes = safeNotes.filter(note => note.isPrivate).length;
    const clinical = safeNotes.filter(note => note.category === 'بالینی').length;
    const medication = safeNotes.filter(note => note.category === 'دارویی').length;

    return { total, today, important, privateNotes, clinical, medication };
  };

  const stats = calculateStats();

  // دسته‌بندی‌ها با تعداد
  const categoriesWithCount = NOTE_CATEGORIES.map(cat => {
    let count = 0;
    switch(cat.id) {
      case 'all': count = safeNotes.length; break;
      case 'clinical': count = safeNotes.filter(n => n.category === 'بالینی').length; break;
      case 'medication': count = safeNotes.filter(n => n.category === 'دارویی').length; break;
      case 'lab': count = safeNotes.filter(n => n.category === 'آزمایشات').length; break;
      case 'consultation': count = safeNotes.filter(n => n.category === 'مشاوره').length; break;
      case 'followup': count = safeNotes.filter(n => n.category === 'پیگیری').length; break;
      case 'important': count = safeNotes.filter(n => n.isImportant).length; break;
      case 'private': count = safeNotes.filter(n => n.isPrivate).length; break;
    }
    return { ...cat, count };
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      {/* هدر با قابلیت کلیک */}
      <div 
        className="flex items-center justify-between mb-4 md:mb-6 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 md:p-3 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0">
            <FiFileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 truncate">یادداشت‌های پزشک</h3>
            <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1">
              <p className="text-xs md:text-sm text-gray-500 truncate">
                {safeNotes.length} یادداشت ثبت شده
                {stats.today > 0 && ` • ${stats.today} مورد امروز`}
                {stats.important > 0 && ` • ${stats.important} مورد مهم`}
              </p>
              {patientName && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">
                  برای: {patientName}
                </span>
              )}
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
          
          {/* دکمه‌های عمل فقط وقتی باز است */}
          {isExpanded && showAddButton && !isAdding && (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTemplates(true);
                }}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition text-xs md:text-sm"
              >
                <FiBookOpen className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline">الگوها</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetForm();
                  setIsAdding(true);
                }}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition text-xs md:text-sm md:text-base shadow-md hover:shadow-lg"
              >
                <FiPlus className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline">یادداشت جدید</span>
                <span className="md:hidden">جدید</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* محتوای expandable */}
      {isExpanded && (
        <div className="mt-4">
          {/* آمار سریع */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4 md:mb-6">
            <div className="bg-blue-50 rounded-xl p-2 md:p-3 text-center">
              <p className="text-xs text-gray-600">کل یادداشت‌ها</p>
              <p className="text-base md:text-xl lg:text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-2 md:p-3 text-center">
              <p className="text-xs text-gray-600">یادداشت‌های امروز</p>
              <p className="text-base md:text-xl lg:text-2xl font-bold text-green-700">{stats.today}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-2 md:p-3 text-center">
              <p className="text-xs text-gray-600">مهم‌ها</p>
              <p className="text-base md:text-xl lg:text-2xl font-bold text-yellow-700">{stats.important}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-2 md:p-3 text-center">
              <p className="text-xs text-gray-600">خصوصی</p>
              <p className="text-base md:text-xl lg:text-2xl font-bold text-purple-700">{stats.privateNotes}</p>
            </div>
            <div className="bg-blue-100 rounded-xl p-2 md:p-3 text-center">
              <p className="text-xs text-gray-600">بالینی</p>
              <p className="text-base md:text-xl lg:text-2xl font-bold text-blue-800">{stats.clinical}</p>
            </div>
            <div className="bg-green-100 rounded-xl p-2 md:p-3 text-center">
              <p className="text-xs text-gray-600">دارویی</p>
              <p className="text-base md:text-xl lg:text-2xl font-bold text-green-800">{stats.medication}</p>
            </div>
          </div>

          {/* فیلترها و جستجو - همیشه نمایش داده می‌شوند */}
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              {/* جستجو */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجو در یادداشت‌ها..."
                    className="w-full px-3 py-2 text-sm md:text-base pr-10 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              
              {/* مرتب‌سازی و دسته‌بندی */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 md:flex-none px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="date-desc">جدیدترین اول</option>
                  <option value="date-asc">قدیمی‌ترین اول</option>
                  <option value="important">مهم‌ها اول</option>
                </select>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 md:flex-none px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {categoriesWithCount.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* دسته‌بندی‌های سریع */}
            <div className="flex flex-wrap gap-1 md:gap-2 mt-3">
              {categoriesWithCount.slice(1).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm transition whitespace-nowrap ${
                    selectedCategory === cat.id 
                      ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="ml-1">{cat.icon}</span>
                  {cat.name} <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* الگوهای آماده */}
          {showTemplates && !isAdding && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-800 text-sm md:text-base">الگوهای یادداشت سریع</h4>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                {NOTE_TEMPLATES.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => handleUseTemplate(template)}
                    className="flex flex-col items-start gap-2 p-3 bg-white hover:bg-green-50 text-right rounded-xl border border-gray-200 hover:border-green-300 transition"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                        <FiFileText className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-800 text-sm truncate">{template.title}</h5>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full whitespace-nowrap">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-left w-full truncate">
                      {template.content.split('\n')[0]}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* فرم افزودن یادداشت جدید */}
          {isAdding && (
            <div className="mb-6 p-3 md:p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h4 className="font-bold text-gray-800 text-base md:text-lg">یادداشت جدید</h4>
                <button
                  onClick={handleCancelAdd}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                {/* عنوان */}
                <div>
                  <label className="block text-xs md:text-sm text-gray-600 mb-1">عنوان یادداشت (اختیاری)</label>
                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="مثلاً: ویزیت ۱۴۰۲/۱۱/۱۵"
                    maxLength={100}
                  />
                </div>

                {/* تنظیمات سریع */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                  <div>
                    <label className="block text-xs md:text-sm text-gray-600 mb-1">دسته‌بندی</label>
                    <select
                      value={newNoteCategory}
                      onChange={(e) => setNewNoteCategory(e.target.value)}
                      className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="عمومی">عمومی</option>
                      <option value="بالینی">بالینی</option>
                      <option value="دارویی">دارویی</option>
                      <option value="آزمایشات">آزمایشات</option>
                      <option value="مشاوره">مشاوره</option>
                      <option value="پیگیری">پیگیری</option>
                      <option value="ضروری">ضروری</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs md:text-sm text-gray-600 mb-1">برچسب‌ها</label>
                    <input
                      type="text"
                      value={newNoteTags}
                      onChange={(e) => setNewNoteTags(e.target.value)}
                      className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="با ویرگول جدا کنید"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 md:gap-4 pt-4 md:pt-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addNoteIsImportant}
                        onChange={(e) => setAddNoteIsImportant(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="relative w-8 md:w-10 h-4 md:h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] md:after:top-[2px] after:left-[1px] md:after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 md:after:h-4 after:w-3 md:after:w-4 after:transition-all peer-checked:bg-yellow-500"></div>
                      <span className="mr-1 text-xs md:text-sm text-gray-700">
                        <FiStar className="inline w-3 h-3 md:w-4 md:h-4 mr-1" />
                        مهم
                      </span>
                    </label>
                    
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addNoteIsPrivate}
                        onChange={(e) => setAddNoteIsPrivate(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="relative w-8 md:w-10 h-4 md:h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] md:after:top-[2px] after:left-[1px] md:after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 md:after:h-4 after:w-3 md:after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                      <span className="mr-1 text-xs md:text-sm text-gray-700">
                        <FiLock className="inline w-3 h-3 md:w-4 md:h-4 mr-1" />
                        خصوصی
                      </span>
                    </label>
                  </div>
                </div>

                {/* محتوا */}
                <div>
                  <label className="block text-xs md:text-sm text-gray-600 mb-1">متن یادداشت</label>
                  <textarea
                    ref={textareaRef}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full h-40 md:h-48 lg:h-56 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right resize-none"
                    placeholder="متن کامل یادداشت را وارد کنید..."
                  />
                  <div className="flex flex-col md:flex-row justify-between mt-2 text-xs text-gray-500">
                    <span className="mb-1 md:mb-0">Ctrl+Enter برای ذخیره سریع • Escape برای لغو</span>
                    <span>{newNoteContent.length}/2000 کاراکتر</span>
                  </div>
                </div>

                {/* دکمه‌های عمل */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-3 pt-2">
                  <button
                    onClick={handleSaveNote}
                    className="flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition font-medium text-sm md:text-base shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newNoteContent.trim()}
                  >
                    <FiSave className="w-4 h-4 md:w-5 md:h-5" />
                    ذخیره یادداشت
                  </button>
                  <button
                    onClick={handleCancelAdd}
                    className="flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl transition font-medium text-sm md:text-base"
                  >
                    <FiX className="w-4 h-4 md:w-5 md:h-5" />
                    لغو
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* لیست یادداشت‌ها */}
          <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <EditableNoteItem
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onRemove={handleRemoveNote}
                  onToggleStatus={onToggleImportant && (() => handleToggleImportant(note.id))}
                  onTogglePrivacy={onTogglePrivacy && (() => handleTogglePrivacy(note.id))}
                  onCopyNote={onCopyNote && (() => handleCopyNoteText(note.content))}
                  isEditingGlobal={showEditButtons}
                />
              ))
            ) : (
              <div className="text-center py-6 md:py-8 lg:py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="text-gray-400 mb-2 md:mb-3 text-2xl md:text-3xl lg:text-4xl">
                  {searchQuery || selectedCategory !== 'all' ? '🔍' : '📝'}
                </div>
                <p className="text-gray-500 text-sm md:text-base mb-2">
                  {searchQuery 
                    ? `یادداشتی با "${searchQuery}" یافت نشد` 
                    : selectedCategory !== 'all'
                    ? 'یادداشتی در این دسته‌بندی یافت نشد'
                    : 'هیچ یادداشتی ثبت نشده است'}
                </p>
                {showAddButton && !isAdding && (
                  <button
                    onClick={() => {
                      resetForm();
                      setIsAdding(true);
                    }}
                    className="mt-3 md:mt-4 inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition text-xs md:text-sm"
                  >
                    <FiPlus className="w-3 h-3 md:w-4 md:h-4" />
                    افزودن اولین یادداشت
                  </button>
                )}
              </div>
            )}
          </div>

          {/* خلاصه */}
          {filteredNotes.length > 0 && (
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">
                    نمایش {filteredNotes.length} از {safeNotes.length} یادداشت
                    {searchQuery && ` • جستجو: "${searchQuery}"`}
                  </p>
                </div>
                
                <div className="flex gap-1 md:gap-2">
                  <button
                    onClick={() => {
                      const allNotesText = filteredNotes.map(note => 
                        `---\nعنوان: ${note.title || 'بدون عنوان'}\nدسته: ${note.category}\nتاریخ: ${note.date}\n\n${note.content}\n\n`
                      ).join('\n');
                      handleCopyNoteText(allNotesText);
                    }}
                    className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-xs md:text-sm"
                  >
                    <FiCopy className="w-3 h-3 md:w-4 md:h-4" />
                    کپی همه
                  </button>
                  
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition text-xs md:text-sm"
                  >
                    <FiPrinter className="w-3 h-3 md:w-4 md:h-4" />
                    پرینت
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default NotesSection;