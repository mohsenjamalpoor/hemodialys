import React, { useState } from 'react';
import { FiPackage, FiCalendar, FiEdit, FiTrash2, FiPlus, FiCheck, FiX, FiClock } from 'react-icons/fi';

const MedicationHistorySection = ({ 
  medicationHistory, 
  onAdd, 
  onEdit, 
  onRemove, 
  showAddButton = true 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    drugName: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    purpose: '',
    prescribingDoctor: localStorage.getItem("doctorName") || "دکتر",
    status: 'در حال مصرف',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.drugName.trim() || !formData.dosage.trim()) {
      alert('نام دارو و دوز الزامی است');
      return;
    }

    const newItem = {
      id: editingId || Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
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
      drugName: item.drugName,
      dosage: item.dosage,
      frequency: item.frequency,
      startDate: item.startDate,
      endDate: item.endDate || '',
      purpose: item.purpose || '',
      prescribingDoctor: item.prescribingDoctor,
      status: item.status,
      notes: item.notes || ''
    });
    setEditingId(item.id);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setFormData({
      drugName: '',
      dosage: '',
      frequency: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      purpose: '',
      prescribingDoctor: localStorage.getItem("doctorName") || "دکتر",
      status: 'در حال مصرف',
      notes: ''
    });
    setEditingId(null);
    setShowAddModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'در حال مصرف': return 'bg-green-100 text-green-800';
      case 'قطع شده': return 'bg-red-100 text-red-800';
      case 'تک‌دوز': return 'bg-blue-100 text-blue-800';
      case 'دوره‌ای': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 mb-6 md:mb-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-green-100 p-2 md:p-3 rounded-lg md:rounded-xl">
  <FiPackage className="text-green-600 w-5 h-5 md:w-6 md:h-6" />
</div>
          <div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-800">سوابق دارویی</h3>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              {medicationHistory?.length || 0} مورد ثبت شده
            </p>
          </div>
        </div>
        
        {showAddButton && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition transform hover:scale-105 shadow-lg text-sm md:text-base"
          >
            <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-medium hidden md:inline">افزودن داروی جدید</span>
            <span className="font-medium md:hidden">افزودن</span>
          </button>
        )}
      </div>

      {medicationHistory && medicationHistory.length > 0 ? (
        <div className="space-y-4 md:space-y-6">
          {medicationHistory.map((item) => (
            <div key={item.id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 md:p-6 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-0">
                 <div className="bg-green-50 p-2 md:p-3 rounded-lg">
  <FiPackage className="text-green-600 w-5 h-5 md:w-6 md:h-6" />
</div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-base md:text-xl">{item.drugName}</h4>
                    <p className="text-gray-600 text-sm md:text-base">{item.dosage}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4">
                  <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-6">
                <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-100">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <FiCalendar className="text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-gray-600 text-xs md:text-sm">دوره مصرف</span>
                  </div>
                  <p className="font-medium text-gray-800 text-sm md:text-base">
                    {item.startDate} {item.endDate ? `- ${item.endDate}` : '(تاکنون)'}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-100">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <FiClock className="text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-gray-600 text-xs md:text-sm">فرکانس مصرف</span>
                  </div>
                  <p className="font-medium text-gray-800 text-sm md:text-base">{item.frequency || '---'}</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-100">
                  <div className="mb-2">
                    <span className="text-gray-600 text-xs md:text-sm">هدف درمان</span>
                  </div>
                  <p className="font-medium text-gray-800 text-sm md:text-base">{item.purpose || '---'}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4 md:pt-6">
                <div>
                  <p className="text-gray-600 text-xs md:text-sm">تجویز کننده:</p>
                  <p className="font-medium text-gray-800 text-sm md:text-base">{item.prescribingDoctor}</p>
                </div>
                
                {item.notes && (
                  <div className="text-left">
                    <p className="text-gray-600 text-xs md:text-sm">یادداشت:</p>
                    <p className="font-medium text-gray-800 text-xs md:text-sm max-w-xs truncate" title={item.notes}>
                      {item.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
  <FiPackage className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
</div>
          <h4 className="text-gray-600 font-medium text-lg md:text-xl mb-2 md:mb-3">هیچ دارویی ثبت نشده است</h4>
          <p className="text-gray-500 text-sm md:text-base mb-6 md:mb-8">با افزودن داروهای مصرفی بیمار، سوابق دارویی تکمیل می‌شود</p>
          {showAddButton && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-8 py-2.5 md:py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition transform hover:scale-105 shadow-lg text-sm md:text-base"
            >
              <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
              افزودن اولین دارو
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
                {editingId ? 'ویرایش دارو' : 'افزودن داروی جدید'}
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
                  <label className="block text-gray-700 text-sm md:text-base mb-2">نام دارو *</label>
                  <input
                    type="text"
                    name="drugName"
                    value={formData.drugName}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm md:text-base"
                    placeholder="مثلاً: آتورواستاتین"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm md:text-base mb-2">دوز *</label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm md:text-base"
                    placeholder="مثلاً: 20 میلی‌گرم"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm md:text-base mb-2">فرکانس مصرف</label>
                  <input
                    type="text"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm md:text-base"
                    placeholder="مثلاً: روزی یک بار"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm md:text-base mb-2">وضعیت</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm md:text-base"
                  >
                    <option value="در حال مصرف">در حال مصرف</option>
                    <option value="قطع شده">قطع شده</option>
                    <option value="تک‌دوز">تک‌دوز</option>
                    <option value="دوره‌ای">دوره‌ای</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm md:text-base mb-2">تاریخ شروع</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm md:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm md:text-base mb-2">تاریخ پایان (اختیاری)</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm md:text-base"
                  />
                </div>
              </div>
              
              <div className="mb-6 md:mb-8">
                <label className="block text-gray-700 text-sm md:text-base mb-2">هدف درمان</label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm md:text-base"
                  placeholder="مثلاً: کنترل فشار خون"
                />
              </div>
              
              <div className="mb-6 md:mb-8">
                <label className="block text-gray-700 text-sm md:text-base mb-2">یادداشت‌ها (اختیاری)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm md:text-base resize-none"
                  placeholder="توضیحات اضافی درباره دارو..."
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
                className="px-6 md:px-8 py-2.5 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition font-medium shadow-lg text-sm md:text-base flex items-center gap-2"
              >
                <FiCheck className="w-4 h-4 md:w-5 md:h-5" />
                {editingId ? 'ذخیره تغییرات' : 'افزودن دارو'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationHistorySection;