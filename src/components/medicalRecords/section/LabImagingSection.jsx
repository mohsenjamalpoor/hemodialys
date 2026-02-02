import React, { useState, useRef } from 'react';
import { FiCamera, FiUpload, FiTrash2, FiEye, FiEdit, FiX, FiCheck, FiDownload } from 'react-icons/fi';

const LabImagingSection = ({ 
  labImaging, 
  onAdd, 
  onEdit, 
  onRemove, 
  showAddButton = true 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'آزمایش خون',
    name: '',
    date: new Date().toISOString().split('T')[0],
    result: '',
    notes: '',
    image: null,
    imagePreview: null
  });
  const [imageViewer, setImageViewer] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
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
      alert('نام تست الزامی است');
      return;
    }

    const newItem = {
      id: editingId || Date.now(),
      type: formData.type,
      name: formData.name,
      date: formData.date,
      result: formData.result,
      notes: formData.notes,
      image: formData.imagePreview,
      createdAt: new Date().toISOString(),
      doctorName: localStorage.getItem("doctorName") || "دکتر"
    };

    if (editingId) {
      onEdit(editingId, newItem);
      setEditingId(null);
    } else {
      onAdd(newItem);
    }

    handleCloseModal();
  };

  const handleEdit = (item) => {
    setFormData({
      type: item.type,
      name: item.name,
      date: item.date,
      result: item.result,
      notes: item.notes || '',
      image: null,
      imagePreview: item.image || null
    });
    setEditingId(item.id);
    setShowAddModal(true);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCaptureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      
      setFormData(prev => ({
        ...prev,
        image: imageData,
        imagePreview: imageData
      }));
      
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      alert('خطا در دسترسی به دوربین: ' + error.message);
    }
  };

  const handleDownloadImage = (imageData, fileName) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `${fileName}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 mb-6 md:mb-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4">
         
          <div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-800">تست‌های آزمایشگاهی و تصویربرداری</h3>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              {labImaging?.length || 0} مورد ثبت شده
            </p>
          </div>
        </div>
        
        {showAddButton && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition transform hover:scale-105 shadow-lg text-sm md:text-base"
          >
            <FiUpload className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-medium hidden md:inline">افزودن تست جدید</span>
            <span className="font-medium md:hidden">افزودن</span>
          </button>
        )}
      </div>

      {labImaging && labImaging.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {labImaging.map((item) => (
            <div key={item.id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 md:p-6 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${
                  item.type.includes('آزمایش') ? 'bg-blue-100 text-blue-800' : 
                  item.type.includes('تصویر') ? 'bg-green-100 text-green-800' : 
                  'bg-purple-100 text-purple-800'
                }`}>
                  {item.type}
                </span>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 md:p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                    title="ویرایش"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-1.5 md:p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                    title="حذف"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h4 className="font-bold text-gray-800 text-base md:text-lg mb-2 md:mb-3">{item.name}</h4>
              
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs md:text-sm">تاریخ:</span>
                  <span className="font-medium text-gray-800 text-xs md:text-sm">{item.date}</span>
                </div>
                
                {item.result && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-xs md:text-sm">نتیجه:</span>
                    <span className="font-medium text-gray-800 text-xs md:text-sm">{item.result}</span>
                  </div>
                )}
              </div>
              
              {item.image && (
                <div className="mb-4 md:mb-6">
                  <div className="relative group">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-32 md:h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                      onClick={() => setImageViewer(item)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <FiEye className="text-white text-2xl" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setImageViewer(item)}
                      className="flex-1 text-xs md:text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 py-1 rounded-lg transition"
                    >
                      مشاهده
                    </button>
                    <button
                      onClick={() => handleDownloadImage(item.image, item.name)}
                      className="flex-1 text-xs md:text-sm text-green-600 hover:text-green-800 hover:bg-green-50 py-1 rounded-lg transition"
                    >
                      دانلود
                    </button>
                  </div>
                </div>
              )}
              
              {item.notes && (
                <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                  <p className="text-gray-700 text-xs md:text-sm">{item.notes}</p>
                </div>
              )}
              
              <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200">
                <p className="text-gray-500 text-xs">ثبت شده توسط: {item.doctorName}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
         
          <h4 className="text-gray-600 font-medium text-lg md:text-xl mb-2 md:mb-3">هیچ تستی ثبت نشده است</h4>
          <p className="text-gray-500 text-sm md:text-base mb-6 md:mb-8">با افزودن تست‌های جدید، اطلاعات بیمار تکمیل می‌شود</p>
          {showAddButton && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-8 py-2.5 md:py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition transform hover:scale-105 shadow-lg text-sm md:text-base"
            >
              <FiUpload className="w-4 h-4 md:w-5 md:h-5" />
              افزودن اولین تست
            </button>
          )}
        </div>
      )}

      {/* مودال افزودن/ویرایش */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <div>
                  <label className="block text-gray-700 text-sm md:text-base mb-2">نوع تست</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm md:text-base"
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
                  <label className="block text-gray-700 text-sm md:text-base mb-2">نام تست *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm md:text-base"
                    placeholder="مثلاً: CBC, U/A, Chest X-Ray"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm md:text-base mb-2">تاریخ</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm md:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm md:text-base mb-2">نتیجه</label>
                  <input
                    type="text"
                    name="result"
                    value={formData.result}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm md:text-base"
                    placeholder="مثلاً: طبیعی، غیرطبیعی، عددی"
                  />
                </div>
              </div>
              
              <div className="mb-6 md:mb-8">
                <label className="block text-gray-700 text-sm md:text-base mb-2">تصویر / فایل</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 text-center hover:border-purple-400 transition">
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
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <FiUpload className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-sm md:text-base">تصویر را اینجا رها کنید یا کلیک کنید</p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 md:px-6 py-2 md:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition flex items-center gap-2"
                    >
                      <FiUpload className="w-4 h-4" />
                      آپلود از کامپیوتر
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleCaptureImage}
                      className="px-4 md:px-6 py-2 md:py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition flex items-center gap-2"
                    >
                      <FiCamera className="w-4 h-4" />
                      عکس بگیرید
                    </button>
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <p className="text-gray-500 text-xs md:text-sm mt-4">فرم‌های مجاز: JPG, PNG, PDF (حداکثر 5MB)</p>
                </div>
              </div>
              
              <div className="mb-6 md:mb-8">
                <label className="block text-gray-700 text-sm md:text-base mb-2">یادداشت‌ها (اختیاری)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm md:text-base resize-none"
                  placeholder="توضیحات اضافی درباره این تست..."
                />
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 md:p-6 flex justify-end gap-3 md:gap-4">
              <button
                onClick={handleCloseModal}
                className="px-6 md:px-8 py-2.5 md:py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition font-medium text-sm md:text-base"
              >
                لغو
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 md:px-8 py-2.5 md:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition font-medium shadow-lg text-sm md:text-base flex items-center gap-2"
              >
                <FiCheck className="w-4 h-4 md:w-5 md:h-5" />
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