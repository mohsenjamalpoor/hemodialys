import React, { useState, useEffect, useRef } from 'react';
import { 
  FiFileText, 
  FiPlus, 
  FiX, 
  FiEdit2, 
  FiTrash2, 
  FiCheck, 
  FiCalendar, 
  FiClock, 
  FiSave, 
  FiTag, 
  FiSearch, 
  FiFilter,
  FiStar, 
  FiPrinter, 
  FiCopy, 
  FiLock, 
  FiUnlock, 
  FiEye, 
  FiEyeOff,
  FiBookOpen, 
  FiMessageSquare, 
  FiChevronDown, 
  FiChevronUp,
  FiInfo
} from 'react-icons/fi';
import { MdLocalHospital } from 'react-icons/md';
import { FaStethoscope, FaNotesMedical } from 'react-icons/fa';

// تابع کمکی برای تعیین اطلاعات دسته‌بندی
const getCategoryInfo = (category) => {
  switch(category) {
    case 'بالینی':
      return { 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-100', 
        border: 'border-blue-200',
        icon: '🩺', 
        iconComponent: <FaStethoscope /> 
      };
    case 'دارویی':
      return { 
        color: 'text-green-600', 
        bgColor: 'bg-green-100', 
        border: 'border-green-200',
        icon: '💊', 
        iconComponent: <MdLocalHospital /> 
      };
    case 'آزمایشات':
      return { 
        color: 'text-purple-600', 
        bgColor: 'bg-purple-100', 
        border: 'border-purple-200',
        icon: '🧪', 
        iconComponent: <FaNotesMedical /> 
      };
    case 'مشاوره':
      return { 
        color: 'text-yellow-600', 
        bgColor: 'bg-yellow-100', 
        border: 'border-yellow-200',
        icon: '💬', 
        iconComponent: <FiMessageSquare /> 
      };
    case 'پیگیری':
      return { 
        color: 'text-orange-600', 
        bgColor: 'bg-orange-100', 
        border: 'border-orange-200',
        icon: '📅', 
        iconComponent: <FiCalendar /> 
      };
    case 'ضروری':
      return { 
        color: 'text-red-600', 
        bgColor: 'bg-red-100', 
        border: 'border-red-200',
        icon: '⚠️', 
        iconComponent: <FiStar /> 
      };
    case 'عمومی':
    default:
      return { 
        color: 'text-gray-600', 
        bgColor: 'bg-gray-100', 
        border: 'border-gray-200',
        icon: '📝', 
        iconComponent: <FiFileText /> 
      };
  }
};

// کامپوننت EditableNoteItem برای ویرایش inline
const EditableNoteItem = React.memo(({ 
  note, 
  onEdit, 
  onRemove, 
  onToggleStatus,
  onTogglePrivacy,
  onCopyNote
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content || '');
  const [editedTitle, setEditedTitle] = useState(note.title || '');
  const [editedTags, setEditedTags] = useState(note.tags?.join(', ') || '');
  const [editedCategory, setEditedCategory] = useState(note.category || 'عمومی');
  const [showDetails, setShowDetails] = useState(false);
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
      setShowDetails(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(note.content || '');
    setEditedTitle(note.title || '');
    setEditedTags(note.tags?.join(', ') || '');
    setEditedCategory(note.category || 'عمومی');
    setIsEditing(false);
    setShowDetails(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const categoryInfo = getCategoryInfo(editedCategory);

  // ساده‌سازی محتوا برای نمایش مختصر
  const getPreviewContent = (content) => {
    if (!content) return '';
    if (content.length <= 120) return content;
    return content.substring(0, 120) + '...';
  };

  return (
    <div className={`group p-4 md:p-5 hover:bg-gray-50 rounded-xl border transition-all duration-200 mb-3 hover:shadow-sm ${
      note.isImportant 
        ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-white' 
        : note.isPrivate 
          ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-white'
          : 'border-gray-200 bg-white'
    }`}>
      {isEditing ? (
        <div className="space-y-4">
          {/* عنوان */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">عنوان یادداشت</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              placeholder="عنوان اختیاری"
              maxLength={100}
            />
          </div>

          {/* دسته‌بندی و تگ‌ها */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">دسته‌بندی</label>
              <select
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
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
              <label className="block text-xs text-gray-600 mb-1">برچسب‌ها (با ویرگول جدا کنید)</label>
              <input
                type="text"
                value={editedTags}
                onChange={(e) => setEditedTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                placeholder="مثلاً: فشار خون, دارو, رژیم"
              />
            </div>
          </div>

          {/* محتوا */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              متن یادداشت
              <span className="text-red-500 mr-1">*</span>
            </label>
            <textarea
              ref={editTextareaRef}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
              placeholder="متن کامل یادداشت را وارد کنید..."
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Ctrl+Enter برای ذخیره • Esc برای لغو</span>
              <span>{editedContent.length}/2000 کاراکتر</span>
            </div>
          </div>

          {/* دکمه‌های عمل */}
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
                <div className={`px-3 py-1 rounded-lg text-xs font-medium border ${categoryInfo.bgColor} ${categoryInfo.color} ${categoryInfo.border}`}>
                  {note.category || 'عمومی'}
                </div>
                <div className="flex-1 text-right">
                  <p className="text-gray-800 font-medium text-base">{note.title || 'یادداشت پزشکی'}</p>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-gray-400 w-3 h-3" />
                      <p className="text-xs text-gray-500">{note.date || '---'}</p>
                    </div>
                    {note.doctorName && (
                      <span className="text-xs text-blue-600">
                        توسط: {note.doctorName}
                      </span>
                    )}
                    {note.isImportant && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        مهم
                      </span>
                    )}
                    {note.isPrivate && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        خصوصی
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* محتوای یادداشت */}
              <div className="mt-3">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium mb-1"
                >
                  {showDetails ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
                  مشاهده متن یادداشت
                </button>
                {showDetails && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 text-right leading-relaxed">
                      {note.content}
                    </pre>
                  </div>
                )}
              </div>

              {/* تگ‌ها */}
              {note.tags && note.tags.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs whitespace-nowrap"
                      >
                        <FiTag className="inline w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* دکمه‌های عمل */}
            <div className="flex items-center gap-1 md:gap-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {onCopyNote && (
                <button
                  onClick={() => onCopyNote(note.content)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="کپی متن"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
              )}
              {onTogglePrivacy && (
                <button
                  onClick={() => onTogglePrivacy(note.id)}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                  title={note.isPrivate ? "عمومی کردن" : "خصوصی کردن"}
                >
                  {note.isPrivate ? <FiUnlock className="w-4 h-4" /> : <FiLock className="w-4 h-4" />}
                </button>
              )}
              {onToggleStatus && (
                <button
                  onClick={() => onToggleStatus(note.id)}
                  className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                  title={note.isImportant ? "حذف از مهم‌ها" : "علامت‌گذاری مهم"}
                >
                  <FiStar className={`w-4 h-4 ${note.isImportant ? 'fill-current text-yellow-500' : ''}`} />
                </button>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                title="ویرایش یادداشت"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemove(note.id)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                title="حذف یادداشت"
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
  { id: 'all', name: 'همه یادداشت‌ها', icon: '📝', color: 'bg-gray-100 text-gray-700' },
  { id: 'clinical', name: 'بالینی', icon: '🩺', color: 'bg-blue-100 text-blue-700' },
  { id: 'medication', name: 'دارویی', icon: '💊', color: 'bg-green-100 text-green-700' },
  { id: 'lab', name: 'آزمایشات', icon: '🧪', color: 'bg-purple-100 text-purple-700' },
  { id: 'consultation', name: 'مشاوره', icon: '💬', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'followup', name: 'پیگیری', icon: '📅', color: 'bg-orange-100 text-orange-700' },
  { id: 'important', name: 'مهم‌ها', icon: '⚠️', color: 'bg-red-100 text-red-700' },
  { id: 'private', name: 'خصوصی', icon: '🔒', color: 'bg-purple-50 text-purple-700' }
];

// کامپوننت اصلی NotesSection
const NotesSection = React.memo(({
  notes = [],
  onAdd,
  onEdit,
  onRemove,
  onToggleImportant,
  onTogglePrivacy,
  onCopyNote,
  showAddButton = true,
  doctorName = "",
  patientName = ""
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showNotesList, setShowNotesList] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('عمومی');
  const [newNoteTags, setNewNoteTags] = useState('');
  const [newNoteIsPrivate, setNewNoteIsPrivate] = useState(false);
  const [newNoteIsImportant, setNewNoteIsImportant] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showExamples, setShowExamples] = useState(false);
  const textareaRef = useRef(null);

  const safeNotes = Array.isArray(notes) ? notes : [];

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      const newItem = {
        id: Date.now() + Math.random(),
        content: newNoteContent.trim(),
        title: newNoteTitle.trim() || undefined,
        category: newNoteCategory,
        tags: newNoteTags ? newNoteTags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        date: new Date().toLocaleDateString('fa-IR'),
        time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        doctorName: doctorName || 'دکتر',
        isPrivate: newNoteIsPrivate,
        isImportant: newNoteIsImportant,
        lastEdited: new Date().toLocaleDateString('fa-IR'),
        createdAt: new Date().toISOString(),
        type: 'note'
      };
      onAdd(newItem);
      setNewNoteContent('');
      setNewNoteTitle('');
      setNewNoteCategory('عمومی');
      setNewNoteTags('');
      setNewNoteIsPrivate(false);
      setNewNoteIsImportant(false);
      setIsAdding(false);
      setShowNotesList(true);
    }
  };

  const handleCancelAdd = () => {
    setNewNoteContent('');
    setNewNoteTitle('');
    setNewNoteCategory('عمومی');
    setNewNoteTags('');
    setNewNoteIsPrivate(false);
    setNewNoteIsImportant(false);
    setIsAdding(false);
    setShowExamples(false);
  };

  const handleQuickAdd = (template) => {
    setNewNoteContent(template.content);
    setNewNoteTitle(template.title);
    setNewNoteCategory(template.category);
    setNewNoteTags(template.tags.join(', '));
    setNewNoteIsPrivate(false);
    setNewNoteIsImportant(false);
    setIsAdding(true);
    setShowExamples(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleAddNote();
    } else if (e.key === 'Escape') {
      handleCancelAdd();
    }
  };

  useEffect(() => {
    if (isAdding && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAdding]);

  const handleEditNote = (id, newContent, newTitle, newCategory, newTags) => {
    if (onEdit) {
      onEdit(id, newContent, newTitle, newCategory, newTags);
    }
  };

  const handleRemoveNote = (id) => {
    if (onRemove) {
      onRemove(id);
    }
  };

  const handleToggleImportant = (id) => {
    if (onToggleImportant) {
      onToggleImportant(id);
    }
  };

  const handleTogglePrivacy = (id) => {
    if (onTogglePrivacy) {
      onTogglePrivacy(id);
    }
  };

  const handleCopyNoteText = (content) => {
    if (onCopyNote) {
      onCopyNote(content);
    } else {
      navigator.clipboard.writeText(content);
    }
  };

  // فیلتر و مرتب‌سازی یادداشت‌ها
  const filteredNotes = safeNotes.filter(note => {
    // جستجوی متنی
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const inContent = note.content?.toLowerCase().includes(query);
      const inTitle = note.title?.toLowerCase().includes(query);
      const inTags = note.tags?.some(tag => tag.toLowerCase().includes(query));
      if (!inContent && !inTitle && !inTags) return false;
    }
    
    // فیلتر دسته‌بندی
    if (selectedCategory !== 'all') {
      switch(selectedCategory) {
        case 'clinical': return note.category === 'بالینی';
        case 'medication': return note.category === 'دارویی';
        case 'lab': return note.category === 'آزمایشات';
        case 'consultation': return note.category === 'مشاوره';
        case 'followup': return note.category === 'پیگیری';
        case 'important': return note.isImportant === true;
        case 'private': return note.isPrivate === true;
        default: return true;
      }
    }
    
    return true;
  }).sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

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

    return { total, today, important, privateNotes, clinical };
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

  // راهنمای دسته‌بندی‌ها
  const categoryGuide = [
    { category: 'بالینی', desc: 'یادداشت‌های معاینه و وضعیت بیمار' },
    { category: 'دارویی', desc: 'نسخه‌ها و دستورات دارویی' },
    { category: 'آزمایشات', desc: 'نتایج آزمایشات و تفسیر آن‌ها' },
    { category: 'مشاوره', desc: 'مشاوره‌ها و توصیه‌های تخصصی' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-xl">
      {/* هدر */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 shadow-sm">
            <FiFileText className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">یادداشت‌های پزشکی</h3>
            <p className="text-gray-600 text-sm mt-1">
              {safeNotes.length} مورد ثبت شده
              <span className="mr-2">•</span>
              {stats.today} مورد امروز
              {stats.important > 0 && (
                <>
                  <span className="mr-2">•</span>
                  <span className="text-yellow-600">{stats.important} مورد مهم</span>
                </>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* دکمه نمایش/پنهان لیست */}
          {safeNotes.length > 0 && (
            <button
              onClick={() => setShowNotesList(!showNotesList)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 text-sm font-medium"
            >
              {showNotesList ? (
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
          
          {/* دکمه افزودن یادداشت جدید */}
          {showAddButton && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm md:text-base font-medium"
            >
              <FiPlus className="w-5 h-5" />
              <span>افزودن یادداشت جدید</span>
            </button>
          )}
        </div>
      </div>

      {/* لیست یادداشت‌ها */}
      {showNotesList && safeNotes.length > 0 && (
        <div className="mb-6">
          {/* فیلتر و جستجو */}
          <div className="mb-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">جستجو در یادداشت‌ها</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجو بر اساس متن، عنوان یا برچسب..."
                    className="w-full px-4 py-3 pr-10 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right placeholder:text-gray-400"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right"
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
            <div className="flex flex-wrap gap-2">
              {categoriesWithCount.slice(1).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                    selectedCategory === cat.id 
                      ? `${cat.color} border border-current` 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="ml-1">{cat.icon}</span>
                  {cat.name}
                  <span className="mr-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* لیست یادداشت‌ها */}
          <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <EditableNoteItem
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onRemove={handleRemoveNote}
                  onToggleStatus={onToggleImportant ? () => handleToggleImportant(note.id) : undefined}
                  onTogglePrivacy={onTogglePrivacy ? () => handleTogglePrivacy(note.id) : undefined}
                  onCopyNote={onCopyNote ? () => handleCopyNoteText(note.content) : undefined}
                />
              ))
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-b from-gray-50 to-white">
                <div className="text-gray-400 text-3xl mb-3">🔍</div>
                <h4 className="text-gray-600 font-medium text-lg mb-2">یادداشتی یافت نشد</h4>
                <p className="text-gray-500 text-sm mb-4">هیچ یادداشتی با فیلترهای انتخاب شده مطابقت ندارد</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition text-sm"
                >
                  حذف فیلترها
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* پیام وقتی لیست خالی است */}
      {!isAdding && safeNotes.length === 0 && (
        <div className="text-center py-10 md:py-12 border-3 border-dashed border-gray-300 rounded-2xl bg-gradient-to-b from-gray-50 to-white">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFileText className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
          </div>
          <h4 className="text-gray-600 font-medium text-lg mb-2">یادداشتی ثبت نشده است</h4>
          <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
            ثبت یادداشت‌های پزشکی به پیگیری بهتر روند درمان بیمار کمک می‌کند
          </p>
          {showAddButton && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition"
            >
              <FiPlus className="w-5 h-5" />
              افزودن اولین یادداشت
            </button>
          )}
        </div>
      )}

      {/* فرم افزودن جدید */}
      {isAdding && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 md:p-6 mb-6 border border-blue-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiPlus className="text-blue-600" />
              افزودن یادداشت جدید
            </h4>
            
            <div className="space-y-4">
              {/* عنوان */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان یادداشت
                  <span className="text-gray-500 text-xs font-normal mr-2">(اختیاری)</span>
                </label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right text-base placeholder:text-gray-400"
                  placeholder="مثال: ویزیت دکتر احمدی"
                  maxLength={100}
                />
              </div>

              {/* دسته‌بندی و تگ‌ها */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دسته‌بندی
                  </label>
                  <select
                    value={newNoteCategory}
                    onChange={(e) => setNewNoteCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right text-base"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    برچسب‌ها
                    <span className="text-gray-500 text-xs font-normal mr-2">(اختیاری)</span>
                  </label>
                  <input
                    type="text"
                    value={newNoteTags}
                    onChange={(e) => setNewNoteTags(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right text-base placeholder:text-gray-400"
                    placeholder="با ویرگول جدا کنید: فشار خون, دیابت, دارو"
                  />
                </div>
              </div>

              {/* محتوا */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  متن یادداشت
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <textarea
                  ref={textareaRef}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full h-48 px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right text-base placeholder:text-gray-400 resize-none"
                  placeholder="متن کامل یادداشت را وارد کنید..."
                  maxLength={2000}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">Ctrl+Enter برای ذخیره سریع</p>
                  <p className="text-xs text-gray-500">{newNoteContent.length}/2000 کاراکتر</p>
                </div>
              </div>

              {/* تنظیمات اضافی */}
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newNoteIsImportant}
                      onChange={(e) => setNewNoteIsImportant(e.target.checked)}
                      className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">
                      <FiStar className="inline w-4 h-4 mr-1" />
                      علامت‌گذاری به عنوان مهم
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newNoteIsPrivate}
                      onChange={(e) => setNewNoteIsPrivate(e.target.checked)}
                      className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">
                      <FiLock className="inline w-4 h-4 mr-1" />
                      یادداشت خصوصی
                    </span>
                  </label>
                </div>
              </div>

              {/* دکمه‌های افزودن و لغو */}
              <div className="flex flex-col md:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddNote}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] text-base font-medium"
                  disabled={!newNoteContent.trim()}
                >
                  <FiCheck className="w-5 h-5" />
                  افزودن یادداشت
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
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  {showExamples ? 'بستن' : 'نمایش الگوها'}
                  {showExamples ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              {showExamples && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* الگوهای آماده */}
                  <div className="bg-white rounded-xl p-4 border border-blue-200">
                    <h6 className="text-sm font-medium text-gray-800 mb-3">الگوهای آماده</h6>
                    <div className="space-y-2">
                      {NOTE_TEMPLATES.map((template, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickAdd(template)}
                          className="w-full flex items-center justify-between p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition group"
                        >
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FiFileText className="text-blue-600 w-4 h-4" />
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-700">{template.title}</p>
                              <p className="text-xs text-gray-500">{template.category}</p>
                            </div>
                          </div>
                          <span className="text-xs text-blue-600 px-2 py-1 bg-white rounded-full group-hover:bg-blue-200">
                            استفاده
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* راهنمای دسته‌بندی */}
                  <div className="bg-white rounded-xl p-4 border border-blue-200">
                    <h6 className="text-sm font-medium text-gray-800 mb-3">راهنمای دسته‌بندی</h6>
                    <div className="space-y-2">
                      {categoryGuide.map((guide, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-3 h-3 rounded-full mt-1 bg-blue-500"></div>
                          <div>
                            <span className="text-xs font-medium text-gray-700">{guide.category}:</span>
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
                  <p className="text-sm font-medium text-blue-800 mb-1">نکات مهم ثبت یادداشت</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• یادداشت‌های مهم با رنگ زرد مشخص می‌شوند</li>
                    <li>• یادداشت‌های خصوصی فقط برای پزشک قابل مشاهده هستند</li>
                    <li>• برچسب‌ها به جستجوی سریع‌تر کمک می‌کنند</li>
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

export default NotesSection;