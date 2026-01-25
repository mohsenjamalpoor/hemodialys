import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiUser, 
  FiEdit, 
  FiFileText, 
  FiCalendar, 
  FiHash, 
  FiFolder, 
  FiPhone, 
  FiActivity, 
  FiHeart, 
  FiThermometer, 
  FiSmile, 
  FiInfo, 
  FiPackage,
  FiPlus,
  FiTrash2,
  FiClock,
  FiAlertCircle,
  FiX,
  FiCheck,
  FiEdit2,
  FiBook,
  FiClipboard,
  FiUsers,
  FiSave,
  FiArrowLeft,
  FiRefreshCw
} from 'react-icons/fi';

const PATIENTS_STORAGE_KEY = 'hemo_patients_data';

// ساختار اولیه برای فیلدهای اضافی
const getDefaultPatientData = (basicData) => ({
  ...basicData,
  // اطلاعات سلامت
  height: '',
  weight: '',
  bmi: '',
  smoking: 'غیرسیگاری',
  pregnancy: false,
  breastfeeding: false,
  
  // سوابق - مطمئن می‌شویم همگی آرایه باشند
  vaccinations: [],
  medicalHistory: [],
  surgeryHistory: [],
  familyHistory: [],
  
  // اطلاعات دیگر
  lastVisit: basicData.lastVisit || new Date().toLocaleDateString('fa-IR'),
  lastUpdate: new Date().toLocaleDateString('fa-IR')
});

export default function PatientDetailPage() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const location = useLocation();
  
  const [patient, setPatient] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState({
    name: '',
    specialty: '',
    code: '',
    doctorId: ''
  });
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  
  // حالت‌های ویرایش
  const [editMode, setEditMode] = useState(false);
  const [editablePatient, setEditablePatient] = useState(null);
  
  // فیلدهای جدید برای افزودن
  const [newMedicalHistory, setNewMedicalHistory] = useState('');
  const [newSurgeryHistory, setNewSurgeryHistory] = useState('');
  const [newFamilyHistory, setNewFamilyHistory] = useState('');
  const [newVaccination, setNewVaccination] = useState('');

  // بارگذاری اطلاعات بیمار و پزشک
  useEffect(() => {
    // اطلاعات پزشک
    const savedName = localStorage.getItem("doctorName") || "دکتر احمدی";
    const savedSpecialty = localStorage.getItem("doctorSpecialty") || "متخصص نفرولوژی";
    const savedCode = localStorage.getItem("doctorCode") || "DR001";
    const savedDoctorId = localStorage.getItem("doctorId") || "DR001";

    setDoctorInfo({
      name: savedName,
      specialty: savedSpecialty,
      code: savedCode,
      doctorId: savedDoctorId
    });

    // اطلاعات بیمار
    const savedPatients = localStorage.getItem(PATIENTS_STORAGE_KEY);
    if (savedPatients) {
      const parsedPatients = JSON.parse(savedPatients);
      
      let loadedPatient;
      
      // ابتدا بررسی می‌کنیم آیا patient در location.state وجود دارد
      if (location.state?.patient) {
        loadedPatient = location.state.patient;
      } else {
        // اگر نبود، از localStorage پیدا می‌کنیم
        loadedPatient = parsedPatients.find(p => 
          p.id.toString() === patientId && p.doctorId === savedDoctorId
        );
      }
      
      if (loadedPatient) {
        // مطمئن می‌شویم فیلدهای آرایه‌ای وجود داشته باشند
        const completePatient = getDefaultPatientData(loadedPatient);
        setPatient(completePatient);
        setEditablePatient({ ...completePatient });
      } else {
        // اگر بیمار پیدا نشد، به صفحه لیست برمی‌گردیم
        navigate('/hemo/medicalRecords');
      }
    } else {
      navigate('/hemo/medicalRecords');
    }
  }, [patientId, navigate, location.state]);

  // نمایش اطلاع‌رسانی
  const showNotificationMessage = (message, type = 'success') => {
    setNotification({ message, type });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // محاسبه BMI
  const calculateBMI = () => {
    if (!editablePatient || !editablePatient.height || !editablePatient.weight) return null;
    const heightInMeters = editablePatient.height / 100;
    const bmi = editablePatient.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // تفسیر BMI
  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'کمبود وزن';
    if (bmiValue < 24.9) return 'وزن طبیعی';
    if (bmiValue < 29.9) return 'اضافه وزن';
    return 'چاقی';
  };

  // رنگ BMI
  const getBMIColor = (bmi) => {
    if (!bmi) return 'gray';
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'yellow';
    if (bmiValue < 24.9) return 'green';
    if (bmiValue < 29.9) return 'orange';
    return 'red';
  };

  // آواتار
  const renderAvatar = () => {
    if (!editablePatient) return null;
    
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const firstLetter = editablePatient.fullName.charAt(0);
    
    return (
      <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl`}>
        {firstLetter}
      </div>
    );
  };

  // ذخیره تغییرات
  const handleSaveChanges = () => {
    const savedPatients = localStorage.getItem(PATIENTS_STORAGE_KEY);
    if (savedPatients && editablePatient) {
      const parsedPatients = JSON.parse(savedPatients);
      
      // محاسبه BMI و بروزرسانی تاریخ
      const updatedPatient = {
        ...editablePatient,
        bmi: calculateBMI(),
        lastUpdate: new Date().toLocaleDateString('fa-IR')
      };
      
      const updatedPatients = parsedPatients.map(p => 
        p.id === updatedPatient.id ? updatedPatient : p
      );
      
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(updatedPatients));
      setPatient(updatedPatient);
      setEditMode(false);
      showNotificationMessage('تغییرات با موفقیت ذخیره شد', 'success');
    }
  };

  // لغو ویرایش
  const handleCancelEdit = () => {
    setEditablePatient({ ...patient });
    setEditMode(false);
    showNotificationMessage('ویرایش لغو شد', 'info');
  };

  // مدیریت تغییرات فیلدها
  const handleFieldChange = (field, value) => {
    setEditablePatient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // اضافه کردن سابقه پزشکی
  const handleAddMedicalHistory = () => {
    if (newMedicalHistory.trim()) {
      const currentHistory = Array.isArray(editablePatient.medicalHistory) 
        ? editablePatient.medicalHistory 
        : [];
      
      const updatedHistory = [...currentHistory, {
        id: Date.now() + Math.random(),
        text: newMedicalHistory,
        date: new Date().toLocaleDateString('fa-IR'),
        details: ''
      }];
      
      handleFieldChange('medicalHistory', updatedHistory);
      setNewMedicalHistory('');
      showNotificationMessage('سابقه بیماری اضافه شد', 'success');
    } else {
      showNotificationMessage('لطفا متن سابقه بیماری را وارد کنید', 'error');
    }
  };

  // ویرایش سابقه پزشکی
  const handleEditMedicalHistory = (id, newText) => {
    if (!newText.trim()) {
      showNotificationMessage('متن نمی‌تواند خالی باشد', 'error');
      return;
    }

    const currentHistory = Array.isArray(editablePatient.medicalHistory) 
      ? editablePatient.medicalHistory 
      : [];
    
    const updatedHistory = currentHistory.map(item => 
      item.id === id ? { ...item, text: newText } : item
    );
    handleFieldChange('medicalHistory', updatedHistory);
    showNotificationMessage('سابقه بیماری ویرایش شد', 'success');
  };

  // حذف سابقه پزشکی
  const handleRemoveMedicalHistory = (id) => {
    const currentHistory = Array.isArray(editablePatient.medicalHistory) 
      ? editablePatient.medicalHistory 
      : [];
    
    const updatedHistory = currentHistory.filter(item => item.id !== id);
    handleFieldChange('medicalHistory', updatedHistory);
    showNotificationMessage('سابقه بیماری حذف شد', 'success');
  };

  // اضافه کردن سابقه جراحی
  const handleAddSurgeryHistory = () => {
    if (newSurgeryHistory.trim()) {
      const currentHistory = Array.isArray(editablePatient.surgeryHistory) 
        ? editablePatient.surgeryHistory 
        : [];
      
      const updatedHistory = [...currentHistory, {
        id: Date.now() + Math.random(),
        text: newSurgeryHistory,
        date: new Date().toLocaleDateString('fa-IR'),
        details: ''
      }];
      
      handleFieldChange('surgeryHistory', updatedHistory);
      setNewSurgeryHistory('');
      showNotificationMessage('سابقه جراحی اضافه شد', 'success');
    } else {
      showNotificationMessage('لطفا متن سابقه جراحی را وارد کنید', 'error');
    }
  };

  // ویرایش سابقه جراحی
  const handleEditSurgeryHistory = (id, newText) => {
    if (!newText.trim()) {
      showNotificationMessage('متن نمی‌تواند خالی باشد', 'error');
      return;
    }

    const currentHistory = Array.isArray(editablePatient.surgeryHistory) 
      ? editablePatient.surgeryHistory 
      : [];
    
    const updatedHistory = currentHistory.map(item => 
      item.id === id ? { ...item, text: newText } : item
    );
    handleFieldChange('surgeryHistory', updatedHistory);
    showNotificationMessage('سابقه جراحی ویرایش شد', 'success');
  };

  // حذف سابقه جراحی
  const handleRemoveSurgeryHistory = (id) => {
    const currentHistory = Array.isArray(editablePatient.surgeryHistory) 
      ? editablePatient.surgeryHistory 
      : [];
    
    const updatedHistory = currentHistory.filter(item => item.id !== id);
    handleFieldChange('surgeryHistory', updatedHistory);
    showNotificationMessage('سابقه جراحی حذف شد', 'success');
  };

  // اضافه کردن سابقه خانوادگی
  const handleAddFamilyHistory = () => {
    if (newFamilyHistory.trim()) {
      const currentHistory = Array.isArray(editablePatient.familyHistory) 
        ? editablePatient.familyHistory 
        : [];
      
      const updatedHistory = [...currentHistory, {
        id: Date.now() + Math.random(),
        text: newFamilyHistory,
        relation: 'والدین',
        date: new Date().toLocaleDateString('fa-IR'),
        details: ''
      }];
      
      handleFieldChange('familyHistory', updatedHistory);
      setNewFamilyHistory('');
      showNotificationMessage('سابقه خانوادگی اضافه شد', 'success');
    } else {
      showNotificationMessage('لطفا متن سابقه خانوادگی را وارد کنید', 'error');
    }
  };

  // ویرایش سابقه خانوادگی
  const handleEditFamilyHistory = (id, newText) => {
    if (!newText.trim()) {
      showNotificationMessage('متن نمی‌تواند خالی باشد', 'error');
      return;
    }

    const currentHistory = Array.isArray(editablePatient.familyHistory) 
      ? editablePatient.familyHistory 
      : [];
    
    const updatedHistory = currentHistory.map(item => 
      item.id === id ? { ...item, text: newText } : item
    );
    handleFieldChange('familyHistory', updatedHistory);
    showNotificationMessage('سابقه خانوادگی ویرایش شد', 'success');
  };

  // حذف سابقه خانوادگی
  const handleRemoveFamilyHistory = (id) => {
    const currentHistory = Array.isArray(editablePatient.familyHistory) 
      ? editablePatient.familyHistory 
      : [];
    
    const updatedHistory = currentHistory.filter(item => item.id !== id);
    handleFieldChange('familyHistory', updatedHistory);
    showNotificationMessage('سابقه خانوادگی حذف شد', 'success');
  };

  // اضافه کردن واکسیناسیون
  const handleAddVaccination = () => {
    if (newVaccination.trim()) {
      const currentVaccinations = Array.isArray(editablePatient.vaccinations) 
        ? editablePatient.vaccinations 
        : [];
      
      const updatedVaccinations = [...currentVaccinations, {
        id: Date.now() + Math.random(),
        text: newVaccination,
        date: new Date().toLocaleDateString('fa-IR'),
        status: 'تکمیل شده'
      }];
      
      handleFieldChange('vaccinations', updatedVaccinations);
      setNewVaccination('');
      showNotificationMessage('واکسن اضافه شد', 'success');
    } else {
      showNotificationMessage('لطفا نام واکسن را وارد کنید', 'error');
    }
  };

  // ویرایش واکسیناسیون
  const handleEditVaccination = (id, newText) => {
    if (!newText.trim()) {
      showNotificationMessage('متن نمی‌تواند خالی باشد', 'error');
      return;
    }

    const currentVaccinations = Array.isArray(editablePatient.vaccinations) 
      ? editablePatient.vaccinations 
      : [];
    
    const updatedVaccinations = currentVaccinations.map(item => 
      item.id === id ? { ...item, text: newText } : item
    );
    handleFieldChange('vaccinations', updatedVaccinations);
    showNotificationMessage('واکسن ویرایش شد', 'success');
  };

  // حذف واکسیناسیون
  const handleRemoveVaccination = (id) => {
    const currentVaccinations = Array.isArray(editablePatient.vaccinations) 
      ? editablePatient.vaccinations 
      : [];
    
    const updatedVaccinations = currentVaccinations.filter(item => item.id !== id);
    handleFieldChange('vaccinations', updatedVaccinations);
    showNotificationMessage('واکسن حذف شد', 'success');
  };

  // حذف بیمار
  const handleDeletePatient = () => {
    const savedPatients = localStorage.getItem(PATIENTS_STORAGE_KEY);
    if (savedPatients && patient) {
      const parsedPatients = JSON.parse(savedPatients);
      const updatedPatients = parsedPatients.filter(p => p.id !== patient.id);
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(updatedPatients));
      
      showNotificationMessage('پرونده بیمار با موفقیت حذف شد', 'success');
      setTimeout(() => {
        navigate('/hemo/medicalRecords');
      }, 1000);
    }
  };

  // برگشت به لیست
  const handleBackToList = () => {
    navigate('/hemo/medicalRecords');
  };

  // کامپوننت برای نمایش آیتم‌های قابل ویرایش/حذف
  const EditableItem = ({ item, onEdit, onRemove, isEditing }) => {
    const [isEditingItem, setIsEditingItem] = useState(false);
    const [editedText, setEditedText] = useState(item.text);

    const handleSaveEdit = () => {
      if (editedText.trim() && onEdit) {
        onEdit(item.id, editedText);
        setIsEditingItem(false);
      }
    };

    const handleCancelEdit = () => {
      setEditedText(item.text);
      setIsEditingItem(false);
    };

    return (
      <div className="flex items-center justify-between group p-3 hover:bg-gray-50 rounded-lg border border-gray-100 mb-2">
        <div className="flex-1">
          {isEditingItem ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-right"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
              />
              <button
                onClick={handleSaveEdit}
                className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm flex items-center gap-1"
              >
                <FiCheck className="w-3 h-3" />
                ذخیره
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm flex items-center gap-1"
              >
                <FiX className="w-3 h-3" />
                لغو
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-gray-700 text-right">{item.text}</p>
                  {item.date && (
                    <p className="text-xs text-gray-500 mt-1 text-left">📅 {item.date}</p>
                  )}
                  {item.details && item.details.trim() && (
                    <p className="text-xs text-gray-600 mt-1 text-right">{item.details}</p>
                  )}
                  {item.relation && (
                    <p className="text-xs text-blue-600 mt-1 text-left">👨‍👩‍👧‍👦 {item.relation}</p>
                  )}
                  {item.status && (
                    <p className="text-xs text-green-600 mt-1 text-left">✅ {item.status}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        {isEditing && !isEditingItem && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditingItem(true)}
              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              title="ویرایش"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
              title="حذف"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  // کامپوننت برای بخش‌های قابل ویرایش - اینجا مشکل حل شده
  const EditableSection = ({ 
    title, 
    icon: Icon, 
    items = [], // مقدار پیش‌فرض آرایه خالی
    newValue, 
    setNewValue, 
    onAdd, 
    onEdit,
    onRemove,
    placeholder,
    isEditing 
  }) => {
    // مطمئن می‌شویم items همیشه یک آرایه باشد
    const safeItems = Array.isArray(items) ? items : [];
    
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              title.includes('بیماری') ? 'bg-red-100' :
              title.includes('جراحی') ? 'bg-orange-100' :
              title.includes('خانوادگی') ? 'bg-purple-100' :
              'bg-green-100'
            }`}>
              <Icon className={
                title.includes('بیماری') ? 'text-red-600' :
                title.includes('جراحی') ? 'text-orange-600' :
                title.includes('خانوادگی') ? 'text-purple-600' :
                'text-green-600'
              } />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-500">
                {safeItems.length} مورد ثبت شده
              </p>
            </div>
          </div>
          {isEditing && (
            <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
              <FiEdit2 className="w-3 h-3" />
              در حال ویرایش
            </span>
          )}
        </div>
        
        {/* لیست موارد */}
        <div className="mb-4 max-h-60 overflow-y-auto pr-2">
          {safeItems.length > 0 ? (
            safeItems.map((item) => (
              <EditableItem
                key={item.id}
                item={item}
                onEdit={onEdit}
                onRemove={onRemove}
                isEditing={isEditing}
              />
            ))
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-gray-400 mb-2">
                {title.includes('بیماری') ? '🏥' :
                 title.includes('جراحی') ? '🔪' :
                 title.includes('خانوادگی') ? '👨‍👩‍👧‍👦' : '💉'}
              </div>
              <p className="text-gray-500">موردی ثبت نشده است</p>
              {isEditing && (
                <p className="text-sm text-gray-400 mt-1">اولین مورد را اضافه کنید</p>
              )}
            </div>
          )}
        </div>
        
        {/* فرم افزودن جدید */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-right"
                onKeyPress={(e) => e.key === 'Enter' && onAdd()}
              />
              <button
                onClick={onAdd}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newValue.trim()}
              >
                <FiPlus className="w-5 h-5" />
                افزودن
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">
              Enter ↵ برای افزودن سریع
            </p>
          </div>
        )}
      </div>
    );
  };

  // مدیریت تغییرات فیلدهای اصلی در حالت ویرایش
  const handleInputChange = (field, value) => {
    setEditablePatient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // بررسی اینکه آیا بیمار بارگذاری شده است
  if (!patient || !editablePatient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری اطلاعات بیمار...</p>
        </div>
      </div>
    );
  }

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);
  const bmiColor = getBMIColor(bmi);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* هدر */}
      <div className="sticky top-0 z-40 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
            >
              <FiArrowLeft className="rotate-180" />
              <span>بازگشت به لیست بیماران</span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">{doctorInfo.specialty}</p>
                <p className="font-bold text-blue-700">{doctorInfo.name}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <FiUser className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div className="max-w-7xl mx-auto p-4">
        {/* هدر بیمار */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {renderAvatar()}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{editablePatient.fullName}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-blue-100">{editablePatient.age} سال</p>
                  <span className="text-blue-200">•</span>
                  <p className="text-blue-100">{editablePatient.gender}</p>
                  <span className="text-blue-200">•</span>
                  <p className="text-blue-100">پرونده: {editablePatient.medicalRecordNumber}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
                  >
                    <FiX />
                    لغو ویرایش
                  </button>
                  
                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                  >
                    <FiSave />
                    ذخیره تغییرات
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
                  >
                    <FiTrash2 />
                    حذف پرونده
                  </button>
                  
                  <button
                    onClick={() => {
                      setEditMode(true);
                      showNotificationMessage('حالت ویرایش فعال شد. تغییرات خود را انجام دهید.', 'info');
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <FiEdit />
                    ویرایش اطلاعات
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* اطلاعات بیمار */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ستون سمت چپ - اطلاعات سلامت */}
          <div className="lg:col-span-2 space-y-6">
            {/* اطلاعات سلامت پایه */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">اطلاعات سلامت</h3>
                {editMode && (
                  <button
                    onClick={() => {
                      // محاسبه مجدد BMI
                      const newBMI = calculateBMI();
                      handleFieldChange('bmi', newBMI);
                      showNotificationMessage('BMI محاسبه شد', 'success');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                    محاسبه BMI
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* قد */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FiActivity className="text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">قد</span>
                  </div>
                  <div className="text-center">
                    {editMode ? (
                      <div className="relative">
                        <input
                          type="number"
                          value={editablePatient.height || ''}
                          onChange={(e) => handleInputChange('height', e.target.value)}
                          className="w-full text-center text-2xl font-bold border-2 border-blue-200 rounded-lg px-3 py-2 bg-white"
                          placeholder="175"
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">cm</span>
                      </div>
                    ) : (
                      <p className="text-3xl font-bold text-gray-800">{editablePatient.height || '---'}</p>
                    )}
                    <p className="text-gray-600 mt-2">سانتی‌متر</p>
                  </div>
                </div>

                {/* وزن */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FiThermometer className="text-green-600" />
                    </div>
                    <span className="text-sm text-gray-600">وزن</span>
                  </div>
                  <div className="text-center">
                    {editMode ? (
                      <div className="relative">
                        <input
                          type="number"
                          value={editablePatient.weight || ''}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          className="w-full text-center text-2xl font-bold border-2 border-green-200 rounded-lg px-3 py-2 bg-white"
                          placeholder="70"
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">kg</span>
                      </div>
                    ) : (
                      <p className="text-3xl font-bold text-gray-800">{editablePatient.weight || '---'}</p>
                    )}
                    <p className="text-gray-600 mt-2">کیلوگرم</p>
                  </div>
                </div>

                {/* BMI */}
                <div className={`bg-gradient-to-r rounded-xl p-6 border ${
                  bmiColor === 'green' ? 'from-emerald-50 to-green-50 border-emerald-100' :
                  bmiColor === 'yellow' ? 'from-yellow-50 to-amber-50 border-yellow-100' :
                  bmiColor === 'orange' ? 'from-orange-50 to-amber-50 border-orange-100' :
                  'from-red-50 to-pink-50 border-red-100'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${
                      bmiColor === 'green' ? 'bg-emerald-100' :
                      bmiColor === 'yellow' ? 'bg-amber-100' :
                      bmiColor === 'orange' ? 'bg-orange-100' :
                      'bg-red-100'
                    }`}>
                      <FiHeart className={
                        bmiColor === 'green' ? 'text-emerald-600' :
                        bmiColor === 'yellow' ? 'text-amber-600' :
                        bmiColor === 'orange' ? 'text-orange-600' :
                        'text-red-600'
                      } />
                    </div>
                    <span className="text-sm text-gray-600">شاخص توده بدنی</span>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-800">{bmi || '---'}</p>
                    {bmiCategory && (
                      <p className={`mt-2 px-4 py-1 rounded-full text-sm font-medium inline-block ${
                        bmiColor === 'green' ? 'bg-emerald-100 text-emerald-800' :
                        bmiColor === 'yellow' ? 'bg-amber-100 text-amber-800' :
                        bmiColor === 'orange' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {bmiCategory}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* اطلاعات سلامت تکمیلی */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* مصرف دخانیات */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gray-200 p-2 rounded-lg">
                      <FiSmile className="text-gray-700" />
                    </div>
                    <h4 className="font-bold text-gray-800">مصرف دخانیات</h4>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    {editMode ? (
                      <select
                        value={editablePatient.smoking || 'غیرسیگاری'}
                        onChange={(e) => handleInputChange('smoking', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-right"
                      >
                        <option value="غیرسیگاری">غیرسیگاری</option>
                        <option value="سیگاری (کمتر از 10 نخ)">سیگاری (کمتر از 10 نخ)</option>
                        <option value="سیگاری (10-20 نخ)">سیگاری (10-20 نخ)</option>
                        <option value="سیگاری (بیش از 20 نخ)">سیگاری (بیش از 20 نخ)</option>
                        <option value="ترک کرده">ترک کرده</option>
                      </select>
                    ) : (
                      <p className="text-gray-700">{editablePatient.smoking || 'غیرسیگاری'}</p>
                    )}
                  </div>
                </div>

                {/* آخرین ویزیت */}
                <div className="bg-blue-50 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FiCalendar className="text-blue-700" />
                    </div>
                    <h4 className="font-bold text-gray-800">آخرین ویزیت</h4>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    {editMode ? (
                      <input
                        type="text"
                        value={editablePatient.lastVisit || ''}
                        onChange={(e) => handleInputChange('lastVisit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-right"
                        placeholder="1402/11/15"
                      />
                    ) : (
                      <>
                        <p className="text-gray-700">{editablePatient.lastVisit || '---'}</p>
                        <p className="text-sm text-gray-600 mt-2">توسط: {editablePatient.doctorName}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* بارداری و شیردهی */}
                {editablePatient.gender === 'زن' && (
                  <div className="bg-pink-50 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-pink-100 p-2 rounded-lg">
                        <FiInfo className="text-pink-700" />
                      </div>
                      <h4 className="font-bold text-gray-800">وضعیت بارداری و شیردهی</h4>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">بارداری:</span>
                          {editMode ? (
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editablePatient.pregnancy || false}
                                onChange={(e) => handleInputChange('pregnancy', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                              <span className="mr-3 text-sm font-medium text-gray-900">
                                {editablePatient.pregnancy ? 'بله' : 'خیر'}
                              </span>
                            </label>
                          ) : (
                            <span className={`font-bold ${editablePatient.pregnancy ? 'text-green-600' : 'text-gray-600'}`}>
                              {editablePatient.pregnancy ? '✓ بله' : '✗ خیر'}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">شیردهی:</span>
                          {editMode ? (
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editablePatient.breastfeeding || false}
                                onChange={(e) => handleInputChange('breastfeeding', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                              <span className="mr-3 text-sm font-medium text-gray-900">
                                {editablePatient.breastfeeding ? 'بله' : 'خیر'}
                              </span>
                            </label>
                          ) : (
                            <span className={`font-bold ${editablePatient.breastfeeding ? 'text-green-600' : 'text-gray-600'}`}>
                              {editablePatient.breastfeeding ? '✓ بله' : '✗ خیر'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* سوابق پزشکی */}
            <EditableSection
              title="سوابق بیماری"
              icon={FiClipboard}
              items={editablePatient.medicalHistory}
              newValue={newMedicalHistory}
              setNewValue={setNewMedicalHistory}
              onAdd={handleAddMedicalHistory}
              onEdit={handleEditMedicalHistory}
              onRemove={handleRemoveMedicalHistory}
              placeholder="مثلاً: فشار خون بالا از سال 1400"
              isEditing={editMode}
            />

            {/* سوابق جراحی */}
            <EditableSection
              title="سوابق جراحی"
              icon={FiActivity}
              items={editablePatient.surgeryHistory}
              newValue={newSurgeryHistory}
              setNewValue={setNewSurgeryHistory}
              onAdd={handleAddSurgeryHistory}
              onEdit={handleEditSurgeryHistory}
              onRemove={handleRemoveSurgeryHistory}
              placeholder="مثلاً: عمل آپاندیس در سال 1399"
              isEditing={editMode}
            />

            {/* سوابق خانوادگی */}
            <EditableSection
              title="سوابق خانوادگی"
              icon={FiUsers}
              items={editablePatient.familyHistory}
              newValue={newFamilyHistory}
              setNewValue={setNewFamilyHistory}
              onAdd={handleAddFamilyHistory}
              onEdit={handleEditFamilyHistory}
              onRemove={handleRemoveFamilyHistory}
              placeholder="مثلاً: دیابت در پدر"
              isEditing={editMode}
            />
          </div>

          {/* ستون سمت راست - سایدبار */}
          <div className="lg:col-span-1 space-y-6">
            {/* اطلاعات تماس */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">اطلاعات تماس</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FiPhone className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">شماره تماس</p>
                    {editMode ? (
                      <input
                        type="tel"
                        value={editablePatient.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-right font-mono"
                        placeholder="09123456789"
                      />
                    ) : (
                      <p className="font-bold text-gray-800 font-mono">{editablePatient.phone}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FiHash className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">کد ملی</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={editablePatient.nationalId || ''}
                        onChange={(e) => handleInputChange('nationalId', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-right font-mono"
                        placeholder="0012345678"
                      />
                    ) : (
                      <p className="font-bold text-gray-800 font-mono">{editablePatient.nationalId}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FiFolder className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">شماره پرونده</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={editablePatient.medicalRecordNumber || ''}
                        onChange={(e) => handleInputChange('medicalRecordNumber', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-right font-mono"
                        placeholder="MR-2024-001"
                      />
                    ) : (
                      <p className="font-bold text-gray-800 font-mono">{editablePatient.medicalRecordNumber}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <span className="text-sm">🩸</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">گروه خونی</p>
                    {editMode ? (
                      <select
                        value={editablePatient.bloodType || ''}
                        onChange={(e) => handleInputChange('bloodType', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-right"
                      >
                        <option value="">انتخاب کنید</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB">AB</option>
                      </select>
                    ) : (
                      <p className={`font-bold ${editablePatient.bloodType?.includes('+') ? 'text-red-600' : 'text-blue-600'}`}>
                        {editablePatient.bloodType || '---'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* واکسیناسیون */}
            <EditableSection
              title="واکسیناسیون"
              icon={FiPackage}
              items={editablePatient.vaccinations}
              newValue={newVaccination}
              setNewValue={setNewVaccination}
              onAdd={handleAddVaccination}
              onEdit={handleEditVaccination}
              onRemove={handleRemoveVaccination}
              placeholder="مثلاً: واکسن آنفلوآنزا 1402"
              isEditing={editMode}
            />

            {/* آخرین بروزرسانی */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FiClock className="text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-800">آخرین بروزرسانی</h3>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-gray-800 font-bold">{editablePatient.lastUpdate || new Date().toLocaleDateString('fa-IR')}</p>
                <p className="text-sm text-gray-600 mt-1">توسط: {editablePatient.doctorName}</p>
                <p className="text-xs text-gray-500 mt-2">با کلیک روی ویرایش اطلاعات، تاریخ به‌روز می‌شود</p>
              </div>
            </div>

            {/* هشدارها */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <FiAlertCircle className="text-yellow-600" />
                </div>
                <h3 className="font-bold text-gray-800">هشدارها و یادداشت‌ها</h3>
              </div>
              <div className="space-y-3">
                {editablePatient.pregnancy && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600">⚠️</span>
                      <div>
                        <p className="text-sm text-gray-700 font-medium">بیمار باردار</p>
                        <p className="text-xs text-gray-600 mt-1">ملاحظات ویژه در تجویز داروها</p>
                      </div>
                    </div>
                  </div>
                )}
                {editablePatient.smoking && editablePatient.smoking !== 'غیرسیگاری' && editablePatient.smoking !== 'ترک کرده' && (
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600">🚬</span>
                      <div>
                        <p className="text-sm text-gray-700 font-medium">بیمار سیگاری</p>
                        <p className="text-xs text-gray-600 mt-1">نیاز به مشاوره ترک دخانیات</p>
                      </div>
                    </div>
                  </div>
                )}
                {(!editablePatient.vaccinations || editablePatient.vaccinations.length === 0) && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600">💉</span>
                      <div>
                        <p className="text-sm text-gray-700 font-medium">واکسیناسیون</p>
                        <p className="text-xs text-gray-600 mt-1">نیاز به تکمیل واکسیناسیون</p>
                      </div>
                    </div>
                  </div>
                )}
                {editablePatient.medicalHistory && editablePatient.medicalHistory.length > 3 && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600">🏥</span>
                      <div>
                        <p className="text-sm text-gray-700 font-medium">سوابق پزشکی متعدد</p>
                        <p className="text-xs text-gray-600 mt-1">نیاز به پیگیری منظم</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* مودال تایید حذف */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">حذف پرونده بیمار</h3>
              <p className="text-gray-600">
                آیا از حذف پرونده <span className="font-bold">{editablePatient.fullName}</span> اطمینان دارید؟
              </p>
              <p className="text-sm text-gray-500 mt-2">این عمل قابل بازگشت نیست.</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition"
              >
                لغو
              </button>
              <button
                onClick={handleDeletePatient}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                حذف پرونده
              </button>
            </div>
          </div>
        </div>
      )}

      {/* اطلاع‌رسانی */}
      {showNotification && (
        <div className={`fixed bottom-4 left-4 right-4 md:right-auto md:w-96 rounded-lg shadow-lg p-4 transform transition-transform duration-300 z-50 ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              notification.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {notification.type === 'success' ? '✓' : '✗'}
            </div>
            <p className={`flex-1 ${
              notification.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}