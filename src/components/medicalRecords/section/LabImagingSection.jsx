import React, { useState, useRef, useEffect } from 'react';
import { 
  FiCamera, 
  FiUpload, 
  FiTrash2, 
  FiEye, 
  FiEdit, 
  FiX, 
  FiCheck,
  FiEyeOff,
  FiFileText,
  FiDownload,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
  FiPlus
} from 'react-icons/fi';
import { FaFileMedical, FaXRay, FaVial } from 'react-icons/fa';

// کامپوننت EditableLabImagingItem برای ویرایش inline
const EditableLabImagingItem = ({ 
  item, 
  onEdit, 
  onRemove,
  onDownload,
  onViewImage 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [editedData, setEditedData] = useState({
    type: item.type || 'آزمایش خون',
    name: item.name || '',
    date: item.date || new Date().toISOString().split('T')[0],
    result: item.result || '',
    notes: item.notes || '',
  });
  
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const getTypeInfo = (type) => {
    if (type.includes('آزمایش')) {
      return { 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-100', 
        border: 'border-blue-200',
        icon: <FaVial className="w-4 h-4" />
      };
    } else if (type.includes('تصویر') || type.includes('سیتی') || type.includes('ام‌آرآی') || type.includes('سونو') || type.includes('رادیو')) {
      return { 
        color: 'text-purple-600', 
        bgColor: 'bg-purple-100', 
        border: 'border-purple-200',
        icon: <FaXRay className="w-4 h-4" />
      };
    } else if (type.includes('نوار')) {
      return { 
        color: 'text-green-600', 
        bgColor: 'bg-green-100', 
        border: 'border-green-200',
        icon: <FaFileMedical className="w-4 h-4" />
      };
    } else {
      return { 
        color: 'text-gray-600', 
        bgColor: 'bg-gray-100', 
        border: 'border-gray-200',
        icon: <FiFileText className="w-4 h-4" />
      };
    }
  };

  const typeInfo = getTypeInfo(item.type);

  const handleSaveEdit = () => {
    if (!editedData.name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    onEdit(item.id, editedData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedData({
      type: item.type || 'آزمایش خون',
      name: item.name || '',
      date: item.date || new Date().toISOString().split('T')[0],
      result: item.result || '',
      notes: item.notes || '',
    });
    setNameError(false);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleNameChange = (e) => {
    setEditedData({...editedData, name: e.target.value});
    if (nameError && e.target.value.trim()) {
      setNameError(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fa-IR');
    } catch {
      return dateString;
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div className="group p-4 hover:bg-gray-50 rounded-xl border border-gray-200 mb-3 transition-all duration-200 hover:shadow-sm">
      {isEditing ? (
        <div className="space-y-4">
          {/* ردیف اول: نوع و نام */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">نوع تست</label>
              <select
                value={editedData.type}
                onChange={(e) => setEditedData({...editedData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
              >
                <option value="آزمایش خون">آزمایش خون</option>
                <option value="آزمایش ادرار">آزمایش ادرار</option>
                <option value="آزمایش مدفوع">آزمایش مدفوع</option>
                <option value="سیتی اسکن">سیتی اسکن</option>
                <option value="ام‌آرآی">ام‌آرآی</option>
                <option value="سونوگرافی">سونوگرافی</option>
                <option value="رادیوگرافی">رادیوگرافی</option>
                <option value="نوار قلب">نوار قلب</option>
                <option value="سایر">سایر</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                نام تست
                <span className="text-red-500 mr-1">*</span>
              </label>
              <input
                ref={editInputRef}
                type="text"
                value={editedData.name}
                onChange={handleNameChange}
                onKeyDown={handleKeyPress}
                className={`w-full px-3 py-2 border rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm ${
                  nameError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="مثال: CBC, Chest X-Ray"
              />
              {nameError && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FiInfo className="w-3 h-3" />
                  وارد کردن نام تست الزامی است
                </p>
              )}
            </div>
          </div>

          {/* ردیف دوم: تاریخ و نتیجه */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">تاریخ</label>
              <input
                type="date"
                value={editedData.date}
                onChange={(e) => setEditedData({...editedData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">نتیجه</label>
              <input
                type="text"
                value={editedData.result}
                onChange={(e) => setEditedData({...editedData, result: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                placeholder="مثلاً: طبیعی، غیرطبیعی"
              />
            </div>
          </div>

          {/* یادداشت‌ها */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">یادداشت‌ها (اختیاری)</label>
            <textarea
              value={editedData.notes}
              onChange={(e) => setEditedData({...editedData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
              placeholder="توضیحات اضافی درباره این تست..."
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
                <div className={`px-3 py-1 rounded-lg text-xs font-medium border ${typeInfo.bgColor} ${typeInfo.color} ${typeInfo.border} flex items-center gap-1`}>
                  {typeInfo.icon}
                  {item.type}
                </div>
                <div className="flex-1 text-right">
                  <p className="text-gray-800 font-medium text-base">{item.name}</p>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <div className="flex items-center gap-2">
                      <FiFileText className="text-gray-400 w-3 h-3" />
                      <p className="text-xs text-gray-500">تاریخ: {formatDate(item.date)}</p>
                    </div>
                    {item.result && (
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        item.result.includes('طبیعی') || item.result.includes('نرمال') || item.result.includes('normal') 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        نتیجه: {item.result}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* تصویر - کوچک شده */}
              {item.image && (
                <div className="mt-2">
                  <div className="flex items-start gap-3">
                    {/* تصویر بندانگشتی کوچک */}
                    <div className="relative group flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-90 transition border border-gray-200 shadow-sm"
                        onClick={() => onViewImage(item)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <FiEye className="text-white text-lg" />
                      </div>
                    </div>
                    
                    {/* دکمه‌های کنار تصویر */}
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => onViewImage(item)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 py-1 px-2 rounded-lg transition"
                      >
                        <FiEye className="w-3 h-3" />
                        مشاهده
                      </button>
                      <button
                        onClick={() => onDownload(item)}
                        className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 hover:bg-green-50 py-1 px-2 rounded-lg transition"
                      >
                        <FiDownload className="w-3 h-3" />
                        دانلود
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* یادداشت‌ها */}
              {item.notes && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-xs font-medium mb-1"
                  >
                    {showDetails ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
                    مشاهده یادداشت‌ها
                  </button>
                  {showDetails && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 text-right">{item.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* اطلاعات پزشک */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  ثبت شده توسط: {item.doctorName || 'دکتر'}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(item.createdAt)}
                </p>
              </div>
            </div>

            {/* دکمه‌های ویرایش و حذف */}
            <div className="flex items-center gap-1 md:gap-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                title="ویرایش تست"
              >
                <FiEdit className="w-4 h-4" />
              </button>
              <button
                onClick={handleRemove}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                title="حذف تست"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// تابع مرتب‌سازی تست‌ها بر اساس تاریخ
const sortLabImagingByDate = (items) => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt);
    const dateB = new Date(b.date || b.createdAt);
    return dateB - dateA; // نزولی
  });
};

// کامپوننت اصلی LabImagingSection
const LabImagingSection = ({ 
  labImaging = [], 
  onAdd, 
  onEdit, 
  onRemove, 
  showAddButton = true 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLabImagingList, setShowLabImagingList] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [formData, setFormData] = useState({
    type: 'آزمایش خون',
    name: '',
    date: new Date().toISOString().split('T')[0],
    result: '',
    notes: '',
    image: null,
    imagePreview: null
  });
  const [editingId, setEditingId] = useState(null);
  const [imageViewer, setImageViewer] = useState(null);
  const [showExamples, setShowExamples] = useState(false);
  const fileInputRef = useRef(null);

  const safeLabImaging = Array.isArray(labImaging) ? labImaging : [];
  const sortedLabImaging = sortLabImagingByDate(safeLabImaging);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'name' && nameError && value.trim()) {
      setNameError(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم فایل نباید بیشتر از 5 مگابایت باشد');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setNameError(true);
      // اسکرول به بالای مودال برای دیدن خطا
      const modalContent = document.querySelector('.bg-white.rounded-2xl.shadow-2xl');
      if (modalContent) {
        modalContent.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    setNameError(false);

    // اگر در حال ویرایش هستیم، تصویر قبلی را نگه داریم
    let finalImage = formData.imagePreview;
    if (editingId) {
      const originalItem = safeLabImaging.find(item => item.id === editingId);
      if (!finalImage && originalItem?.image) {
        finalImage = originalItem.image;
      }
    }

    const newItem = {
      id: editingId || Date.now(),
      type: formData.type,
      name: formData.name.trim(),
      date: formData.date,
      result: formData.result.trim(),
      notes: formData.notes.trim(),
      image: finalImage,
      createdAt: editingId ? safeLabImaging.find(item => item.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      doctorName: localStorage.getItem("doctorName") || "دکتر"
    };

    if (editingId) {
      onEdit(editingId, newItem);
      setEditingId(null);
    } else {
      onAdd(newItem);
    }

    handleCloseModal();
    setShowLabImagingList(true);
  };

  const handleEditItem = (id, editedData) => {
    const originalItem = safeLabImaging.find(item => item.id === id);
    
    const updatedItem = {
      ...originalItem,
      ...editedData,
      id: id,
      createdAt: originalItem?.createdAt || new Date().toISOString(),
      doctorName: originalItem?.doctorName || localStorage.getItem("doctorName") || "دکتر",
      image: editedData.image || originalItem?.image || null
    };
    
    onEdit(id, updatedItem);
  };

  const handleRemoveItem = (id) => {
    onRemove(id);
  };

  const handleEdit = (item) => {
    setFormData({
      type: item.type,
      name: item.name,
      date: item.date,
      result: item.result || '',
      notes: item.notes || '',
      image: null,
      imagePreview: item.image || null
    });
    setEditingId(item.id);
    setShowAddModal(true);
    setNameError(false);
  };

  const handleCloseModal = () => {
    setFormData({
      type: 'آزمایش خون',
      name: '',
      date: new Date().toISOString().split('T')[0],
      result: '',
      notes: '',
      image: null,
      imagePreview: null
    });
    setEditingId(null);
    setShowAddModal(false);
    setNameError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCaptureImage = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('دوربین در این دستگاه پشتیبانی نمی‌شود');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      setFormData(prev => ({
        ...prev,
        image: imageData,
        imagePreview: imageData
      }));
      
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      alert('خطا در دسترسی به دوربین: لطفاً مجوز دوربین را بررسی کنید');
    }
  };

  const handleDownloadImage = (item) => {
    if (!item.image) {
      alert('تصویری برای دانلود وجود ندارد');
      return;
    }

    const link = document.createElement('a');
    link.href = item.image;
    link.download = `${item.name}_${item.date || new Date().toISOString().split('T')[0]}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewImage = (item) => {
    setImageViewer(item);
  };

  const handleQuickAdd = (template) => {
    setFormData(prev => ({
      ...prev,
      type: template.type,
      name: template.name
    }));
    if (nameError && template.name.trim()) {
      setNameError(false);
    }
    setShowExamples(false);
  };

  // آمار و اطلاعات
  const calculateStats = () => {
    const total = safeLabImaging.length;
    const labTests = safeLabImaging.filter(item => item.type.includes('آزمایش')).length;
    const imagingTests = safeLabImaging.filter(item => 
      item.type.includes('تصویر') || item.type.includes('سیتی') || 
      item.type.includes('ام‌آرآی') || item.type.includes('سونو') || 
      item.type.includes('رادیو')
    ).length;
    const otherTests = total - labTests - imagingTests;
    const withImages = safeLabImaging.filter(item => item.image).length;

    return { total, labTests, imagingTests, otherTests, withImages };
  };

  const stats = calculateStats();

  // مثال‌های رایج تست‌ها
  const commonTests = [
    { name: "CBC", type: "آزمایش خون", icon: "🩸" },
    { name: "BS", type: "آزمایش خون", icon: "🩸" },
    { name: "U/A", type: "آزمایش ادرار", icon: "🧪" },
    { name: "Chest X-Ray", type: "رادیوگرافی", icon: "📷" },
    { name: "ECG", type: "نوار قلب", icon: "📈" },
    { name: "MRI Brain", type: "ام‌آرآی", icon: "🧠" }
  ];

  // راهنمای انواع تست‌ها
  const testTypeGuide = [
    { type: 'آزمایش خون', desc: 'بررسی وضعیت خون و سلول‌های خونی' },
    { type: 'آزمایش ادرار', desc: 'بررسی سلامت کلیه و سیستم ادراری' },
    { type: 'آزمایش مدفوع', desc: 'بررسی سلامت گوارش و عفونت‌ها' },
    { type: 'رادیوگرافی', desc: 'عکسبرداری با اشعه X برای استخوان و ریه' },
    { type: 'سونوگرافی', desc: 'تصویربرداری با امواج صوتی' },
    { type: 'سیتی اسکن', desc: 'تصویربرداری سه‌بعدی با اشعه X' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-xl">
      {/* هدر */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 shadow-sm">
            <FaVial className="w-6 h-6 md:w-7 md:h-7 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">تست‌های آزمایشگاهی و تصویربرداری</h3>
            <p className="text-gray-600 text-sm mt-1">
              {sortedLabImaging.length} مورد ثبت شده
              <span className="mr-2">•</span>
              {stats.labTests} آزمایش خون
              <span className="mr-2">•</span>
              {stats.imagingTests} تصویربرداری
              {stats.withImages > 0 && (
                <>
                  <span className="mr-2">•</span>
                  {stats.withImages} مورد دارای تصویر
                </>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* دکمه نمایش/پنهان لیست */}
          {sortedLabImaging.length > 0 && (
            <button
              onClick={() => setShowLabImagingList(!showLabImagingList)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 text-sm font-medium"
            >
              {showLabImagingList ? (
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
          
          {/* دکمه افزودن تست جدید */}
          {showAddButton && !showAddModal && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm md:text-base font-medium"
            >
              <FiUpload className="w-5 h-5" />
              <span>افزودن تست جدید</span>
            </button>
          )}
        </div>
      </div>

      {/* لیست تست‌ها */}
      {showLabImagingList && sortedLabImaging.length > 0 && (
        <div className="mb-6">
          <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {sortedLabImaging.map((item) => (
              <EditableLabImagingItem
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onRemove={handleRemoveItem}
                onDownload={handleDownloadImage}
                onViewImage={handleViewImage}
              />
            ))}
          </div>
        </div>
      )}

      {/* پیام وقتی لیست خالی است */}
      {!showAddModal && sortedLabImaging.length === 0 && (
        <div className="text-center py-10 md:py-12 border-3 border-dashed border-gray-300 rounded-2xl bg-gradient-to-b from-gray-50 to-white">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaVial className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
          </div>
          <h4 className="text-gray-600 font-medium text-lg mb-2">تستی ثبت نشده است</h4>
          <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
            ثبت تست‌های آزمایشگاهی و تصویربرداری به بررسی دقیق‌تر وضعیت بیمار کمک می‌کند
          </p>
          {showAddButton && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition"
            >
              <FiPlus className="w-5 h-5" />
              افزودن اولین تست
            </button>
          )}
        </div>
      )}

      {/* مودال افزودن/ویرایش */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex items-center justify-between">
              <h3 className="text-lg md:text-2xl font-bold text-gray-800">
                {editingId ? 'ویرایش تست' : 'افزودن تست جدید'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="p-4 md:p-6">
              {/* هشدار در بالای مودال */}
              {nameError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <FiInfo className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">لطفاً نام تست را وارد کنید</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع تست
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-right text-base"
                  >
                    <option value="آزمایش خون">آزمایش خون</option>
                    <option value="آزمایش ادرار">آزمایش ادرار</option>
                    <option value="آزمایش مدفوع">آزمایش مدفوع</option>
                    <option value="سیتی اسکن">سیتی اسکن</option>
                    <option value="ام‌آرآی">ام‌آرآی</option>
                    <option value="سونوگرافی">سونوگرافی</option>
                    <option value="رادیوگرافی">رادیوگرافی</option>
                    <option value="نوار قلب">نوار قلب</option>
                    <option value="سایر">سایر</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام تست
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-right text-base placeholder:text-gray-400 ${
                      nameError ? 'border-red-500 bg-red-50' : 'border-purple-300'
                    }`}
                    placeholder="مثال: CBC, Chest X-Ray"
                  />
                  {nameError && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiInfo className="w-3 h-3" />
                      وارد کردن نام تست الزامی است
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاریخ
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-right text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نتیجه
                    <span className="text-gray-500 text-xs font-normal mr-2">(اختیاری)</span>
                  </label>
                  <input
                    type="text"
                    name="result"
                    value={formData.result}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-right text-base placeholder:text-gray-400"
                    placeholder="مثلاً: طبیعی، غیرطبیعی، عددی"
                  />
                </div>
              </div>
              
              {/* تصویر / فایل */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تصویر / فایل
                  <span className="text-gray-500 text-xs font-normal mr-2">(اختیاری)</span>
                </label>
                <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center hover:border-purple-400 transition">
                  {formData.imagePreview ? (
                    <div className="relative">
                      <img 
                        src={formData.imagePreview} 
                        alt="پیش‌نمایش" 
                        className="max-h-48 mx-auto rounded-lg mb-4"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 left-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <FiUpload className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-sm">تصویر را اینجا رها کنید یا کلیک کنید</p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition flex items-center gap-2 text-sm"
                    >
                      <FiUpload className="w-4 h-4" />
                      آپلود از کامپیوتر
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleCaptureImage}
                      className="px-4 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition flex items-center gap-2 text-sm"
                    >
                      <FiCamera className="w-4 h-4" />
                      عکس بگیرید
                    </button>
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                  
                  <p className="text-gray-500 text-xs mt-4">فرم‌های مجاز: JPG, PNG, PDF (حداکثر 5MB)</p>
                </div>
              </div>
              
              {/* یادداشت‌ها */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  یادداشت‌ها
                  <span className="text-gray-500 text-xs font-normal mr-2">(اختیاری)</span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-right text-base resize-none placeholder:text-gray-400"
                  placeholder="توضیحات اضافی درباره این تست..."
                />
              </div>

              {/* راهنمای سریع */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-medium text-gray-700">راهنمای سریع افزودن</h5>
                  <button
                    onClick={() => setShowExamples(!showExamples)}
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm"
                  >
                    {showExamples ? 'بستن' : 'نمایش مثال‌ها'}
                    {showExamples ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                  </button>
                </div>
                
                {showExamples && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* مثال‌های رایج */}
                    <div className="bg-white rounded-xl p-4 border border-purple-200">
                      <h6 className="text-sm font-medium text-gray-800 mb-3">تست‌های رایج</h6>
                      <div className="flex flex-wrap gap-2">
                        {commonTests.map((test, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickAdd(test)}
                            className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs transition flex items-center gap-1"
                          >
                            <span>{test.icon}</span>
                            {test.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* راهنمای انواع */}
                    <div className="bg-white rounded-xl p-4 border border-purple-200">
                      <h6 className="text-sm font-medium text-gray-800 mb-3">راهنمای انواع تست</h6>
                      <div className="space-y-2">
                        {testTypeGuide.slice(0, 3).map((guide, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-3 h-3 rounded-full mt-1 bg-purple-500"></div>
                            <div>
                              <span className="text-xs font-medium text-gray-700">{guide.type}:</span>
                              <p className="text-xs text-gray-600 mt-0.5">{guide.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* دکمه‌های پایین */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 md:p-6 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition font-medium text-sm"
              >
                لغو
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition font-medium shadow-lg text-sm flex items-center gap-2"
              >
                <FiCheck className="w-4 h-4" />
                {editingId ? 'ذخیره تغییرات' : 'افزودن تست'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال نمایش تصویر */}
      {imageViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <button
              onClick={() => setImageViewer(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full z-10 transition"
            >
              <FiX className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            
            <img 
              src={imageViewer.image} 
              alt={imageViewer.name}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 text-white p-4 rounded-lg">
              <h4 className="font-bold text-lg md:text-xl mb-2">{imageViewer.name}</h4>
              <p className="text-sm md:text-base opacity-90">
                {imageViewer.type} - تاریخ: {imageViewer.date}
              </p>
              {imageViewer.result && (
                <p className="text-sm md:text-base mt-2">نتیجه: {imageViewer.result}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabImagingSection;