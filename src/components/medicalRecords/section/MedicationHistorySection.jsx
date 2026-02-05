import React, { useState, useEffect } from 'react';
import { 
  FiPackage, 
  FiCalendar, 
  FiEdit, 
  FiTrash2, 
  FiPlus, 
  FiCheck, 
  FiX, 
  FiClock, 
  FiEye, 
  FiEyeOff,
  FiUser,
  FiInfo,
  FiAlertCircle,
  FiFilter,
  FiSearch,
  FiStar
} from 'react-icons/fi';

const MedicationHistorySection = ({ 
  medicationHistory = [], 
  onAdd, 
  onEdit, 
  onRemove, 
  showAddButton = true 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMedicationList, setShowMedicationList] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    drugName: '',
    dosage: '',
    dosageUnit: 'mg',
    frequency: '',
    frequencyUnit: 'روز',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    purpose: '',
    prescribingDoctor: localStorage.getItem("doctorName") || "دکتر",
    status: 'در حال مصرف',
    notes: '',
    drugCode: '',
    route: 'خوراکی',
    warnings: ''
  });

  const safeItems = Array.isArray(medicationHistory) ? medicationHistory : [];
  
  // فیلتر کردن داروها بر اساس وضعیت و جستجو
  const filteredItems = safeItems.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.status === activeFilter;
    const matchesSearch = searchTerm === '' || 
      item.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.purpose?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // آمار داروها
  const stats = {
    total: safeItems.length,
    active: safeItems.filter(item => item.status === 'در حال مصرف').length,
    stopped: safeItems.filter(item => item.status === 'قطع شده').length,
    oneTime: safeItems.filter(item => item.status === 'تک‌دوز').length,
    periodic: safeItems.filter(item => item.status === 'دوره‌ای').length
  };

  useEffect(() => {
    // وقتی دارویی اضافه شد، لیست را باز کن
    if (safeItems.length > 0 && !showMedicationList) {
      setShowMedicationList(true);
    }
  }, [safeItems.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.drugName.trim()) {
      errors.push('نام دارو الزامی است');
    }
    
    if (!formData.dosage.trim()) {
      errors.push('دوز دارو الزامی است');
    } else if (isNaN(parseFloat(formData.dosage))) {
      errors.push('دوز باید عددی باشد');
    }
    
    if (!formData.startDate) {
      errors.push('تاریخ شروع الزامی است');
    }
    
    if (formData.endDate && formData.endDate < formData.startDate) {
      errors.push('تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد');
    }
    
    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    const newItem = {
      id: editingId || Date.now(),
      ...formData,
      dosage: `${formData.dosage} ${formData.dosageUnit}`,
      frequency: formData.frequency ? `${formData.frequency} ${formData.frequencyUnit}` : '',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      source: 'دستی'
    };

    if (editingId) {
      onEdit(editingId, newItem);
      setEditingId(null);
    } else {
      onAdd(newItem);
    }

    handleCloseModal();
    setShowMedicationList(true);
  };

  const handleEdit = (item) => {
    // استخراج دوز و واحد از رشته
    const dosageParts = item.dosage?.split(' ') || ['', ''];
    
    setFormData({
      drugName: item.drugName || '',
      dosage: dosageParts[0] || '',
      dosageUnit: dosageParts[1] || 'mg',
      frequency: item.frequency?.split(' ')[0] || '',
      frequencyUnit: item.frequency?.split(' ')[1] || 'روز',
      startDate: item.startDate || new Date().toISOString().split('T')[0],
      endDate: item.endDate || '',
      purpose: item.purpose || '',
      prescribingDoctor: item.prescribingDoctor || localStorage.getItem("doctorName") || "دکتر",
      status: item.status || 'در حال مصرف',
      notes: item.notes || '',
      drugCode: item.drugCode || '',
      route: item.route || 'خوراکی',
      warnings: item.warnings || ''
    });
    setEditingId(item.id);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setFormData({
      drugName: '',
      dosage: '',
      dosageUnit: 'mg',
      frequency: '',
      frequencyUnit: 'روز',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      purpose: '',
      prescribingDoctor: localStorage.getItem("doctorName") || "دکتر",
      status: 'در حال مصرف',
      notes: '',
      drugCode: '',
      route: 'خوراکی',
      warnings: ''
    });
    setEditingId(null);
    setShowAddModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'در حال مصرف': return 'bg-green-100 text-green-800 border border-green-200';
      case 'قطع شده': return 'bg-red-100 text-red-800 border border-red-200';
      case 'تک‌دوز': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'دوره‌ای': return 'bg-purple-100 text-purple-800 border border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'در حال مصرف': return '🟢';
      case 'قطع شده': return '🔴';
      case 'تک‌دوز': return '🔵';
      case 'دوره‌ای': return '🟣';
      default: return '⚪';
    }
  };

  const getRouteColor = (route) => {
    switch (route) {
      case 'خوراکی': return 'text-blue-600 bg-blue-50';
      case 'تزریقی': return 'text-red-600 bg-red-50';
      case 'موضعی': return 'text-green-600 bg-green-50';
      case 'استنشاقی': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-xl">
      {/* هدر اصلی */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="relative">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 md:p-4 rounded-xl shadow-lg">
              <FiPackage className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
           
          </div>
          
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>سوابق دارویی</span>
             
            </h2>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">
              <div className="flex items-center gap-1 text-xs md:text-sm">
                <span className="text-green-600 font-bold">{stats.active}</span>
                <span className="text-gray-600">داروی فعال</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1 text-xs md:text-sm">
                <span className="text-red-600 font-bold">{stats.stopped}</span>
                <span className="text-gray-600">قطع شده</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1 text-xs md:text-sm">
                <span className="text-blue-600 font-bold">{stats.oneTime + stats.periodic}</span>
                <span className="text-gray-600">دوره‌ای</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* دکمه‌های فیلتر */}
          {safeItems.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all flex items-center gap-1 ${activeFilter === 'all' 
                  ? 'bg-green-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <FiFilter className="w-3 h-3" />
                همه
              </button>
              <button
                onClick={() => setActiveFilter('در حال مصرف')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${activeFilter === 'در حال مصرف' 
                  ? 'bg-green-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                فعال
              </button>
              <button
                onClick={() => setActiveFilter('قطع شده')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${activeFilter === 'قطع شده' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                قطع شده
              </button>
            </div>
          )}

          {/* دکمه نمایش/پنهان لیست */}
          {safeItems.length > 0 && (
            <button
              onClick={() => setShowMedicationList(!showMedicationList)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 text-sm font-medium"
            >
              {showMedicationList ? (
                <>
                  <FiEyeOff className="w-4 h-4" />
                  <span>بستن لیست</span>
                </>
              ) : (
                <>
                  <FiEye className="w-4 h-4" />
                  <span>مشاهده لیست</span>
                </>
              )}
            </button>
          )}
          
          {/* دکمه افزودن */}
          {showAddButton && !showAddModal && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium min-w-[140px]"
            >
              <FiPlus className="w-4 h-4" />
              <span>افزودن دارو</span>
            </button>
          )}
        </div>
      </div>

      {/* نوار جستجو */}
      {safeItems.length > 0 && showMedicationList && (
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی دارو یا هدف درمان..."
              className="w-full px-4 py-3 pr-12 bg-white border-2 border-gray-200 rounded-xl text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm shadow-sm"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <FiSearch className="text-gray-400 w-4 h-4" />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              {filteredItems.length} مورد از {safeItems.length} دارو یافت شد
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <FiX className="w-3 h-3" />
              پاکسازی فیلترها
            </button>
          </div>
        </div>
      )}

      {/* لیست داروها */}
      {showMedicationList && filteredItems.length > 0 ? (
        <div className="space-y-4 animate-fadeIn">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="p-4 md:p-5">
                {/* هدر آیتم */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                      <span className="text-lg">{getStatusIcon(item.status)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-lg md:text-xl">{item.drugName}</h3>
                        {item.drugCode && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            کد: {item.drugCode}
                          </span>
                        )}
                        {item.route === 'تزریقی' && (
                          <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full flex items-center gap-1">
                            ⚡ تزریقی
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <FiPackage className="text-gray-400 w-4 h-4" />
                          <span className="text-gray-700 font-medium">{item.dosage}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRouteColor(item.route)}`}>
                          {item.route}
                        </span>
                        {item.status === 'در حال مصرف' && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            فعال
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="ویرایش دارو"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('آیا از حذف این دارو اطمینان دارید؟')) {
                            onRemove(item.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="حذف دارو"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* اطلاعات اصلی */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCalendar className="text-gray-500 w-4 h-4" />
                      <span className="text-gray-700 text-sm font-medium">دوره درمان</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">شروع</div>
                        <div className="font-bold text-gray-900">{item.startDate}</div>
                      </div>
                      <div className="w-6 h-px bg-gray-300 mx-2"></div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">پایان</div>
                        <div className="font-bold text-gray-900">
                          {item.endDate ? item.endDate : 'تاکنون'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FiClock className="text-gray-500 w-4 h-4" />
                      <span className="text-gray-700 text-sm font-medium">مدت زمان </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-lg">
                        {item.frequency || '---'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="mb-2">
                      <span className="text-gray-700 text-sm font-medium">هدف درمان</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {item.purpose || '---'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* اطلاعات اضافی */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-gray-400 w-4 h-4" />
                        <span className="text-gray-600 text-sm">تجویز کننده:</span>
                        <span className="font-medium text-gray-900">{item.prescribingDoctor}</span>
                      </div>
                    </div>
                    
                    {item.notes && (
                      <div className="flex items-start gap-2">
                        <FiInfo className="text-blue-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div className="text-right">
                          <div className="text-gray-600 text-sm mb-1">یادداشت:</div>
                          <div className="text-gray-800 text-sm line-clamp-1">{item.notes}</div>
                        </div>
                      </div>
                    )}
                    
                    {item.warnings && (
                      <div className="flex items-start gap-2">
                        <FiAlertCircle className="text-amber-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div className="text-right">
                          <div className="text-gray-600 text-sm mb-1">هشدارها:</div>
                          <div className="text-amber-700 text-sm line-clamp-1">{item.warnings}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* نوار وضعیت پایین */}
              <div className={`h-1 ${
                item.status === 'در حال مصرف' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                item.status === 'قطع شده' ? 'bg-gradient-to-r from-red-400 to-rose-500' :
                item.status === 'تک‌دوز' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                'bg-gradient-to-r from-purple-400 to-violet-500'
              }`}></div>
            </div>
          ))}
        </div>
      ) : showMedicationList && safeItems.length === 0 ? (
        <div className="text-center py-12 md:py-16 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner">
            <FiPackage className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
          </div>
          <h4 className="text-gray-700 font-bold text-lg md:text-xl mb-2 md:mb-3">هنوز دارویی ثبت نشده است</h4>
          <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto mb-6 md:mb-8">
            ثبت دقیق سوابق دارویی بیمار، نقش کلیدی در درمان و پیشگیری از تداخلات دارویی دارد
          </p>
          {showAddButton && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
            >
              <FiPlus className="w-5 h-5" />
              افزودن اولین داروی بیمار
            </button>
          )}
        </div>
      ) : null}

      {/* مودال افزودن/ویرایش */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200">
            {/* هدر مودال */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-green-700 text-white p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FiPackage className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold">
                      {editingId ? 'ویرایش اطلاعات دارو' : 'ثبت داروی جدید'}
                    </h3>
                    <p className="text-emerald-100 text-sm mt-1">
                      طبق پروتکل‌های وزارت بهداشت و سازمان جهانی بهداشت
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* بدنه مودال */}
            <div className="p-5 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {/* ستون اول */}
                <div className="space-y-5">
                  {/* نام دارو */}
                  <div>
                    <label className="block text-gray-800 font-medium mb-2 flex items-center gap-2">
                      <span className="text-red-500">*</span>
                      نام دارو
                    </label>
                    <input
                      type="text"
                      name="drugName"
                      value={formData.drugName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-lg placeholder:text-gray-400"
                      placeholder="مثال: آتورواستاتین"
                      dir="rtl"
                    />
                  </div>
                  
                  {/* دوز و واحد */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-800 font-medium mb-2 flex items-center gap-2">
                        <span className="text-red-500">*</span>
                        دوز
                      </label>
                      <input
                        type="number"
                        name="dosage"
                        value={formData.dosage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        placeholder="20"
                        step="0.1"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">واحد</label>
                      <select
                        name="dosageUnit"
                        value={formData.dosageUnit}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      >
                        <option value="mg">میلی‌گرم (mg)</option>
                        <option value="mcg">میکروگرم (mcg)</option>
                        <option value="g">گرم (g)</option>
                        <option value="ml">میلی‌لیتر (ml)</option>
                        <option value="IU">واحد بین‌المللی (IU)</option>
                        <option value="unit">واحد</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* فرکانس */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">تعداد</label>
                      <input
                        type="number"
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        placeholder="1"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">دوره زمانی</label>
                      <select
                        name="frequencyUnit"
                        value={formData.frequencyUnit}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      >
                        <option value="روز">روز</option>
                        <option value="هفته">هفته</option>
                        <option value="ماه">ماه</option>
                        <option value="ساعت">ساعت</option>
                        <option value="روز در هفته">روز در هفته</option>
                        <option value="هر بار">هر بار</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* کد دارو و راه مصرف */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">کد دارو</label>
                      <input
                        type="text"
                        name="drugCode"
                        value={formData.drugCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        placeholder="ATC Code"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">راه مصرف</label>
                      <select
                        name="route"
                        value={formData.route}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      >
                        <option value="خوراکی">خوراکی</option>
                        <option value="تزریقی">تزریقی</option>
                        <option value="موضعی">موضعی</option>
                        <option value="استنشاقی">استنشاقی</option>
                        <option value="زیرزبانی">زیرزبانی</option>
                        <option value="مقعدی">مقعدی</option>
                        <option value="واژینال">واژینال</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* ستون دوم */}
                <div className="space-y-5">
                  {/* تاریخ‌ها */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-800 font-medium mb-2 flex items-center gap-2">
                        <span className="text-red-500">*</span>
                        تاریخ شروع
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-800 font-medium mb-2">تاریخ پایان</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  {/* وضعیت */}
                  <div>
                    <label className="block text-gray-800 font-medium mb-2">وضعیت مصرف</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    >
                      <option value="در حال مصرف">در حال مصرف</option>
                      <option value="قطع شده">قطع شده</option>
                      <option value="تک‌دوز">تک‌دوز</option>
                      <option value="دوره‌ای">دوره‌ای</option>
                      <option value="PRN">در صورت نیاز (PRN)</option>
                    </select>
                  </div>
                  
                  {/* هدف درمان */}
                  <div>
                    <label className="block text-gray-800 font-medium mb-2">هدف درمان / اندیکاسیون</label>
                    <input
                      type="text"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      placeholder="مثال: کنترل فشار خون، کاهش کلسترول"
                    />
                  </div>
                  
                  {/* پزشک تجویزکننده */}
                  <div>
                    <label className="block text-gray-800 font-medium mb-2">پزشک تجویزکننده</label>
                    <input
                      type="text"
                      name="prescribingDoctor"
                      value={formData.prescribingDoctor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    />
                  </div>
                  
                  {/* هشدارها */}
                  <div>
                    <label className="block text-gray-800 font-medium mb-2 flex items-center gap-2">
                      <FiAlertCircle className="text-amber-500" />
                      هشدارها و نکات مهم
                    </label>
                    <input
                      type="text"
                      name="warnings"
                      value={formData.warnings}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl text-right focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                      placeholder="مثال: همراه غذا مصرف شود، از مصرف الکل خودداری شود"
                    />
                  </div>
                </div>
                
                {/* یادداشت‌ها (تمام عرض) */}
                <div className="md:col-span-2">
                  <label className="block text-gray-800 font-medium mb-2 flex items-center gap-2">
                    <FiInfo className="text-blue-500" />
                    توضیحات و یادداشت‌ها
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
                    placeholder="هرگونه توضیح اضافی درباره دارو، عوارض جانبی، پاسخ بیمار و ..."
                  />
                </div>
              </div>
            </div>
            
            {/* فوتر مودال */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiAlertCircle className="w-4 h-4" />
                <span>فیلدهای ستاره‌دار (*) الزامی هستند</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-all font-medium shadow-sm hover:shadow"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <FiCheck className="w-5 h-5" />
                  {editingId ? 'ذخیره تغییرات' : 'ثبت دارو'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationHistorySection;