import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 

  FiUser, 
  FiEdit, 

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
  height: basicData.height || '',
  weight: basicData.weight || '',
  bmi: basicData.bmi || '',
  smoking: basicData.smoking || 'غیرسیگاری',
  pregnancy: basicData.pregnancy || false,
  breastfeeding: basicData.breastfeeding || false,
  
  // سوابق - مطمئن می‌شویم همگی آرایه باشند
  vaccinations: basicData.vaccinations || [],
  medicalHistory: basicData.medicalHistory || [],
  surgeryHistory: basicData.surgeryHistory || [],
  familyHistory: basicData.familyHistory || [],
  
  // اطلاعات دیگر
  lastVisit: basicData.lastVisit || new Date().toLocaleDateString('fa-IR'),
  lastUpdate: basicData.lastUpdate || new Date().toLocaleDateString('fa-IR')
});

// کامپوننت EditableItem
const EditableItem = React.memo(({ item, onEdit, onRemove, isEditing }) => {
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editedText, setEditedText] = useState(item.text);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditingItem && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditingItem]);

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="flex items-center justify-between group p-3 hover:bg-gray-50 rounded-lg border border-gray-100 mb-2">
      <div className="flex-1">
        {isEditingItem ? (
          <div className="flex gap-2">
            <input
              ref={editInputRef}
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="متن جدید را وارد کنید"
            />
            <button
              onClick={handleSaveEdit}
              className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-1 transition"
            >
              <FiCheck className="w-4 h-4" />
              ذخیره
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm flex items-center gap-1 transition"
            >
              <FiX className="w-4 h-4" />
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
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditingItem(true)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
            title="ویرایش"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
            title="حذف"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
});

// کامپوننت EditableSection
const EditableSection = React.memo(({ 
  title, 
  icon: Icon, 
  items = [],
  onAdd,
  onEdit,
  onRemove,
  placeholder,
  isEditing,
  sectionType 
}) => {
  const [localValue, setLocalValue] = useState('');
  const inputRef = useRef(null);

  const safeItems = Array.isArray(items) ? items : [];

  const handleLocalAdd = () => {
    if (localValue.trim()) {
      onAdd(localValue);
      setLocalValue('');
      // فوکوس روی input باقی می‌ماند
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLocalAdd();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    if (pastedText.trim()) {
      setLocalValue(pastedText);
    }
  };

  useEffect(() => {
    // وقتی حالت ویرایش فعال شد، فوکوس روی input مربوطه
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${
            sectionType === 'medical' ? 'bg-red-100' :
            sectionType === 'surgery' ? 'bg-orange-100' :
            sectionType === 'family' ? 'bg-purple-100' :
            'bg-green-100'
          }`}>
            <Icon className={`w-6 h-6 ${
              sectionType === 'medical' ? 'text-red-600' :
              sectionType === 'surgery' ? 'text-orange-600' :
              sectionType === 'family' ? 'text-purple-600' :
              'text-green-600'
            }`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">
              {safeItems.length} مورد ثبت شده
            </p>
          </div>
        </div>
        {isEditing && (
          <span className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full flex items-center gap-2">
            <FiEdit2 className="w-4 h-4" />
            در حال ویرایش
          </span>
        )}
      </div>
      
      {/* لیست موارد */}
      <div className="mb-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
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
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <div className="text-gray-400 mb-3 text-3xl">
              {sectionType === 'medical' ? '' :
               sectionType === 'surgery' ? ' ' :
               sectionType === 'family' ? '' : ''}
            </div>
            <p className="text-gray-500">اطلاعاتی ثبت نشده است</p>
            {isEditing && (
              <p className="text-sm text-gray-400 mt-1">اولین مورد را اضافه کنید</p>
            )}
          </div>
        )}
      </div>
      
      {/* فرم افزودن جدید */}
      {isEditing && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleKeyPress}
              onPaste={handlePaste}
              placeholder={placeholder}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right text-lg placeholder:text-gray-400"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              onClick={handleLocalAdd}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg"
              disabled={!localValue.trim()}
              title="افزودن مورد جدید"
            >
              <FiPlus className="w-5 h-5" />
              <span className="font-medium">افزودن</span>
            </button>
          </div>
          <div className="flex justify-between mt-3">
            <p className="text-xs text-gray-500">
              Enter ↵ برای افزودن سریع
            </p>
            <p className="text-xs text-gray-500">
              {localValue.length}/200 کاراکتر
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

// کامپوننت اصلی
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
      
      if (location.state?.patient) {
        loadedPatient = location.state.patient;
      } else {
        loadedPatient = parsedPatients.find(p => 
          p.id.toString() === patientId && p.doctorId === savedDoctorId
        );
      }
      
      if (loadedPatient) {
        const completePatient = getDefaultPatientData(loadedPatient);
        setPatient(completePatient);
        setEditablePatient({ ...completePatient });
      } else {
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
    const colorIndex = editablePatient.id ? (editablePatient.id % colors.length) : 0;
    const color = colors[colorIndex];
    const firstLetter = editablePatient.fullName?.charAt(0) || '?';
    
    return (
      <div className={`${color} w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg`}>
        {firstLetter}
      </div>
    );
  };

  // ذخیره تغییرات
  const handleSaveChanges = () => {
    const savedPatients = localStorage.getItem(PATIENTS_STORAGE_KEY);
    if (savedPatients && editablePatient) {
      const parsedPatients = JSON.parse(savedPatients);
      
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
  const handleInputChange = (field, value) => {
    setEditablePatient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // تابع ویژه برای inputهای متنی
  const handleTextInputChange = (e) => {
    const { name, value } = e.target;
    setEditablePatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // اضافه کردن سابقه پزشکی
  const handleAddMedicalHistory = (text) => {
    const currentHistory = Array.isArray(editablePatient?.medicalHistory) 
      ? editablePatient.medicalHistory 
      : [];
    
    const updatedHistory = [...currentHistory, {
      id: Date.now() + Math.random(),
      text: text,
      date: new Date().toLocaleDateString('fa-IR'),
      details: ''
    }];
    
    handleInputChange('medicalHistory', updatedHistory);
    showNotificationMessage('سابقه بیماری اضافه شد', 'success');
  };

  // ویرایش سابقه پزشکی
  const handleEditMedicalHistory = (id, newText) => {
    if (!newText.trim()) {
      showNotificationMessage('متن نمی‌تواند خالی باشد', 'error');
      return;
    }

    const currentHistory = Array.isArray(editablePatient?.medicalHistory) 
      ? editablePatient.medicalHistory 
      : [];
    
    const updatedHistory = currentHistory.map(item => 
      item.id === id ? { ...item, text: newText } : item
    );
    handleInputChange('medicalHistory', updatedHistory);
    showNotificationMessage('سابقه بیماری ویرایش شد', 'success');
  };

  // حذف سابقه پزشکی
  const handleRemoveMedicalHistory = (id) => {
    const currentHistory = Array.isArray(editablePatient?.medicalHistory) 
      ? editablePatient.medicalHistory 
      : [];
    
    const updatedHistory = currentHistory.filter(item => item.id !== id);
    handleInputChange('medicalHistory', updatedHistory);
    showNotificationMessage('سابقه بیماری حذف شد', 'success');
  };

  // اضافه کردن سابقه جراحی
  const handleAddSurgeryHistory = (text) => {
    const currentHistory = Array.isArray(editablePatient?.surgeryHistory) 
      ? editablePatient.surgeryHistory 
      : [];
    
    const updatedHistory = [...currentHistory, {
      id: Date.now() + Math.random(),
      text: text,
      date: new Date().toLocaleDateString('fa-IR'),
      details: ''
    }];
    
    handleInputChange('surgeryHistory', updatedHistory);
    showNotificationMessage('سابقه جراحی اضافه شد', 'success');
  };

  // ویرایش سابقه جراحی
  const handleEditSurgeryHistory = (id, newText) => {
    if (!newText.trim()) {
      showNotificationMessage('متن نمی‌تواند خالی باشد', 'error');
      return;
    }

    const currentHistory = Array.isArray(editablePatient?.surgeryHistory) 
      ? editablePatient.surgeryHistory 
      : [];
    
    const updatedHistory = currentHistory.map(item => 
      item.id === id ? { ...item, text: newText } : item
    );
    handleInputChange('surgeryHistory', updatedHistory);
    showNotificationMessage('سابقه جراحی ویرایش شد', 'success');
  };

  // حذف سابقه جراحی
  const handleRemoveSurgeryHistory = (id) => {
    const currentHistory = Array.isArray(editablePatient?.surgeryHistory) 
      ? editablePatient.surgeryHistory 
      : [];
    
    const updatedHistory = currentHistory.filter(item => item.id !== id);
    handleInputChange('surgeryHistory', updatedHistory);
    showNotificationMessage('سابقه جراحی حذف شد', 'success');
  };

  // اضافه کردن سابقه خانوادگی
  const handleAddFamilyHistory = (text) => {
    const currentHistory = Array.isArray(editablePatient?.familyHistory) 
      ? editablePatient.familyHistory 
      : [];
    
    const updatedHistory = [...currentHistory, {
      id: Date.now() + Math.random(),
      text: text,
      relation: 'والدین',
      date: new Date().toLocaleDateString('fa-IR'),
      details: ''
    }];
    
    handleInputChange('familyHistory', updatedHistory);
    showNotificationMessage('سابقه خانوادگی اضافه شد', 'success');
  };

  // ویرایش سابقه خانوادگی
  const handleEditFamilyHistory = (id, newText) => {
    if (!newText.trim()) {
      showNotificationMessage('متن نمی‌تواند خالی باشد', 'error');
      return;
    }

    const currentHistory = Array.isArray(editablePatient?.familyHistory) 
      ? editablePatient.familyHistory 
      : [];
    
    const updatedHistory = currentHistory.map(item => 
      item.id === id ? { ...item, text: newText } : item
    );
    handleInputChange('familyHistory', updatedHistory);
    showNotificationMessage('سابقه خانوادگی ویرایش شد', 'success');
  };

  // حذف سابقه خانوادگی
  const handleRemoveFamilyHistory = (id) => {
    const currentHistory = Array.isArray(editablePatient?.familyHistory) 
      ? editablePatient.familyHistory 
      : [];
    
    const updatedHistory = currentHistory.filter(item => item.id !== id);
    handleInputChange('familyHistory', updatedHistory);
    showNotificationMessage('سابقه خانوادگی حذف شد', 'success');
  };

  // اضافه کردن واکسیناسیون
  const handleAddVaccination = (text) => {
    const currentVaccinations = Array.isArray(editablePatient?.vaccinations) 
      ? editablePatient.vaccinations 
      : [];
    
    const updatedVaccinations = [...currentVaccinations, {
      id: Date.now() + Math.random(),
      text: text,
      date: new Date().toLocaleDateString('fa-IR'),
      status: 'تکمیل شده'
    }];
    
    handleInputChange('vaccinations', updatedVaccinations);
    showNotificationMessage('واکسن اضافه شد', 'success');
  };

  // ویرایش واکسیناسیون
  const handleEditVaccination = (id, newText) => {
    if (!newText.trim()) {
      showNotificationMessage('متن نمی‌تواند خالی باشد', 'error');
      return;
    }

    const currentVaccinations = Array.isArray(editablePatient?.vaccinations) 
      ? editablePatient.vaccinations 
      : [];
    
    const updatedVaccinations = currentVaccinations.map(item => 
      item.id === id ? { ...item, text: newText } : item
    );
    handleInputChange('vaccinations', updatedVaccinations);
    showNotificationMessage('واکسن ویرایش شد', 'success');
  };

  // حذف واکسیناسیون
  const handleRemoveVaccination = (id) => {
    const currentVaccinations = Array.isArray(editablePatient?.vaccinations) 
      ? editablePatient.vaccinations 
      : [];
    
    const updatedVaccinations = currentVaccinations.filter(item => item.id !== id);
    handleInputChange('vaccinations', updatedVaccinations);
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

  // استایل CSS برای اسکرول بار سفارشی
  const customScrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #a1a1a1;
    }
  `;

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
      <style>{customScrollbarStyles}</style>
      
      {/* هدر */}
      <div className="sticky top-0 z-40 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-3 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
            >
              <FiArrowLeft className="rotate-180 w-5 h-5" />
              <span className="font-medium">بازگشت به لیست بیماران</span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">{doctorInfo.specialty}</p>
                <p className="font-bold text-blue-700 text-lg">{doctorInfo.name}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiUser className="text-blue-600 w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div className="max-w-7xl mx-auto p-4">
        {/* هدر بیمار */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-8 text-white mb-8 transform transition-all hover:shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              {renderAvatar()}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">{editablePatient.fullName}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="bg-white bg-opacity-20 px-4 py-1.5 rounded-full text-sm font-medium">
                    {editablePatient.age} سال
                  </span>
                  <span className="bg-white bg-opacity-20 px-4 py-1.5 rounded-full text-sm font-medium">
                    {editablePatient.gender}
                  </span>
                  <span className="bg-white bg-opacity-20 px-4 py-1.5 rounded-full text-sm font-medium">
                    پرونده: {editablePatient.medicalRecordNumber}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-3 px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition transform hover:scale-105"
                  >
                    <FiX className="w-5 h-5" />
                    <span className="font-medium">لغو ویرایش</span>
                  </button>
                  
                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center gap-3 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition transform hover:scale-105 shadow-lg"
                  >
                    <FiSave className="w-5 h-5" />
                    <span className="font-medium">ذخیره تغییرات</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-3 px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition transform hover:scale-105"
                  >
                    <FiTrash2 className="w-5 h-5" />
                    <span className="font-medium">حذف پرونده</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setEditMode(true);
                      showNotificationMessage('حالت ویرایش فعال شد. تغییرات خود را انجام دهید.', 'info');
                    }}
                    className="flex items-center gap-3 px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-xl transition transform hover:scale-105 shadow-lg"
                  >
                    <FiEdit className="w-5 h-5" />
                    <span className="font-medium">ویرایش اطلاعات</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* اطلاعات بیمار */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ستون سمت چپ - اطلاعات سلامت */}
          <div className="lg:col-span-2 space-y-8">
            {/* اطلاعات سلامت پایه */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-800">اطلاعات سلامت</h3>
                {editMode && (
                  <button
                    onClick={() => {
                      const newBMI = calculateBMI();
                      handleInputChange('bmi', newBMI);
                      showNotificationMessage('BMI محاسبه شد', 'success');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 px-4 py-2 hover:bg-blue-50 rounded-lg transition"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                    محاسبه BMI
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* قد */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <FiActivity className="text-blue-600 w-6 h-6" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">قد</span>
                  </div>
                  <div className="text-center">
                    {editMode ? (
                      <div className="relative">
                        <input
                          type="number"
                          value={editablePatient.height || ''}
                          onChange={(e) => handleInputChange('height', e.target.value)}
                          className="w-full text-center text-3xl font-bold border-2 border-blue-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="175"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">cm</span>
                      </div>
                    ) : (
                      <p className="text-4xl font-bold text-gray-800">{editablePatient.height || '---'}</p>
                    )}
                    <p className="text-gray-600 mt-3">سانتی‌متر</p>
                  </div>
                </div>

                {/* وزن */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <FiThermometer className="text-green-600 w-6 h-6" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">وزن</span>
                  </div>
                  <div className="text-center">
                    {editMode ? (
                      <div className="relative">
                        <input
                          type="number"
                          value={editablePatient.weight || ''}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          className="w-full text-center text-3xl font-bold border-2 border-green-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          placeholder="70"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">kg</span>
                      </div>
                    ) : (
                      <p className="text-4xl font-bold text-gray-800">{editablePatient.weight || '---'}</p>
                    )}
                    <p className="text-gray-600 mt-3">کیلوگرم</p>
                  </div>
                </div>

                {/* BMI */}
                <div className={`bg-gradient-to-br rounded-2xl p-6 border shadow-sm ${
                  bmiColor === 'green' ? 'from-emerald-50 to-green-50 border-emerald-200' :
                  bmiColor === 'yellow' ? 'from-yellow-50 to-amber-50 border-yellow-200' :
                  bmiColor === 'orange' ? 'from-orange-50 to-amber-50 border-orange-200' :
                  'from-red-50 to-pink-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${
                      bmiColor === 'green' ? 'bg-emerald-100' :
                      bmiColor === 'yellow' ? 'bg-amber-100' :
                      bmiColor === 'orange' ? 'bg-orange-100' :
                      'bg-red-100'
                    }`}>
                      <FiHeart className={`w-6 h-6 ${
                        bmiColor === 'green' ? 'text-emerald-600' :
                        bmiColor === 'yellow' ? 'text-amber-600' :
                        bmiColor === 'orange' ? 'text-orange-600' :
                        'text-red-600'
                      }`} />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">شاخص توده بدنی</span>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-gray-800">{bmi || '---'}</p>
                    {bmiCategory && (
                      <p className={`mt-3 px-5 py-2 rounded-full text-sm font-medium inline-block ${
                        bmiColor === 'green' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        bmiColor === 'yellow' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        bmiColor === 'orange' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                        'bg-red-100 text-red-800 border border-red-200'
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
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gray-200 p-3 rounded-xl">
                      <FiSmile className="text-gray-700 w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg">مصرف دخانیات</h4>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    {editMode ? (
                      <select
                        value={editablePatient.smoking || 'غیرسیگاری'}
                        onChange={(e) => handleInputChange('smoking', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value="غیرسیگاری">غیرسیگاری</option>
                        <option value="سیگاری (کمتر از 10 نخ)">سیگاری (کمتر از 10 نخ)</option>
                        <option value="سیگاری (10-20 نخ)">سیگاری (10-20 نخ)</option>
                        <option value="سیگاری (بیش از 20 نخ)">سیگاری (بیش از 20 نخ)</option>
                        <option value="ترک کرده">ترک کرده</option>
                      </select>
                    ) : (
                      <p className="text-gray-700 text-lg">{editablePatient.smoking || 'غیرسیگاری'}</p>
                    )}
                  </div>
                </div>

                {/* آخرین ویزیت */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <FiCalendar className="text-blue-700 w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg">آخرین ویزیت</h4>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    {editMode ? (
                      <input
                        type="text"
                        name="lastVisit"
                        value={editablePatient.lastVisit || ''}
                        onChange={handleTextInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="1402/11/15"
                      />
                    ) : (
                      <>
                        <p className="text-gray-700 text-lg">{editablePatient.lastVisit || '---'}</p>
                        <p className="text-sm text-gray-600 mt-2">توسط: {editablePatient.doctorName}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* بارداری و شیردهی */}
                {editablePatient.gender === 'زن' && (
                  <div className="bg-pink-50 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-pink-100 p-3 rounded-xl">
                        <FiInfo className="text-pink-700 w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-gray-800 text-lg">وضعیت بارداری و شیردهی</h4>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 text-lg">بارداری:</span>
                          {editMode ? (
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editablePatient.pregnancy || false}
                                onChange={(e) => handleInputChange('pregnancy', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="relative w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                              <span className="mr-3 text-lg font-medium text-gray-900">
                                {editablePatient.pregnancy ? 'بله' : 'خیر'}
                              </span>
                            </label>
                          ) : (
                            <span className={`font-bold text-lg ${editablePatient.pregnancy ? 'text-green-600' : 'text-gray-600'}`}>
                              {editablePatient.pregnancy ? '✓ بله' : '✗ خیر'}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 text-lg">شیردهی:</span>
                          {editMode ? (
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editablePatient.breastfeeding || false}
                                onChange={(e) => handleInputChange('breastfeeding', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="relative w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                              <span className="mr-3 text-lg font-medium text-gray-900">
                                {editablePatient.breastfeeding ? 'بله' : 'خیر'}
                              </span>
                            </label>
                          ) : (
                            <span className={`font-bold text-lg ${editablePatient.breastfeeding ? 'text-green-600' : 'text-gray-600'}`}>
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
              onAdd={handleAddMedicalHistory}
              onEdit={handleEditMedicalHistory}
              onRemove={handleRemoveMedicalHistory}
              placeholder="مثلاً: فشار خون بالا از سال 1400"
              isEditing={editMode}
              sectionType="medical"
            />

            {/* سوابق جراحی */}
            <EditableSection
              title="سوابق جراحی"
              icon={FiActivity}
              items={editablePatient.surgeryHistory}
              onAdd={handleAddSurgeryHistory}
              onEdit={handleEditSurgeryHistory}
              onRemove={handleRemoveSurgeryHistory}
              placeholder="مثلاً: عمل آپاندیس در سال 1399"
              isEditing={editMode}
              sectionType="surgery"
            />

            {/* سوابق خانوادگی */}
            <EditableSection
              title="سوابق خانوادگی"
              icon={FiUsers}
              items={editablePatient.familyHistory}
              onAdd={handleAddFamilyHistory}
              onEdit={handleEditFamilyHistory}
              onRemove={handleRemoveFamilyHistory}
              placeholder="مثلاً: دیابت در پدر"
              isEditing={editMode}
              sectionType="family"
            />
          </div>

          {/* ستون سمت راست - سایدبار */}
          <div className="lg:col-span-1 space-y-8">
            {/* اطلاعات تماس */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">اطلاعات تماس</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <FiPhone className="text-blue-600 w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">شماره تماس</p>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editablePatient.phone || ''}
                        onChange={handleTextInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="09123456789"
                      />
                    ) : (
                      <p className="font-bold text-gray-800 text-lg font-mono">{editablePatient.phone}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <FiHash className="text-green-600 w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">کد ملی</p>
                    {editMode ? (
                      <input
                        type="text"
                        name="nationalId"
                        value={editablePatient.nationalId || ''}
                        onChange={handleTextInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="0012345678"
                      />
                    ) : (
                      <p className="font-bold text-gray-800 text-lg font-mono">{editablePatient.nationalId}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <FiFolder className="text-purple-600 w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">شماره پرونده</p>
                    {editMode ? (
                      <input
                        type="text"
                        name="medicalRecordNumber"
                        value={editablePatient.medicalRecordNumber || ''}
                        onChange={handleTextInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="MR-2024-001"
                      />
                    ) : (
                      <p className="font-bold text-gray-800 text-lg font-mono">{editablePatient.medicalRecordNumber}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <span className="text-red-600 font-bold">🩸</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">گروه خونی</p>
                    {editMode ? (
                      <select
                        value={editablePatient.bloodType || ''}
                        onChange={(e) => handleInputChange('bloodType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      >
                        <option value="">انتخاب کنید</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    ) : (
                      <p className={`font-bold text-lg ${editablePatient.bloodType?.includes('+') ? 'text-red-600' : 'text-blue-600'}`}>
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
              onAdd={handleAddVaccination}
              onEdit={handleEditVaccination}
              onRemove={handleRemoveVaccination}
              placeholder="مثلاً: واکسن آنفلوآنزا 1402"
              isEditing={editMode}
              sectionType="vaccination"
            />

            {/* آخرین بروزرسانی */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <FiClock className="text-purple-600 w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-800 text-xl">آخرین بروزرسانی</h3>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <p className="text-gray-800 font-bold text-2xl mb-2">{editablePatient.lastUpdate || new Date().toLocaleDateString('fa-IR')}</p>
                <p className="text-gray-600">توسط: {editablePatient.doctorName}</p>
                <p className="text-sm text-gray-500 mt-3">با کلیک روی ویرایش اطلاعات، تاریخ به‌روز می‌شود</p>
              </div>
            </div>

            {/* هشدارها */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <FiAlertCircle className="text-yellow-600 w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-800 text-xl">هشدارها و یادداشت‌ها</h3>
              </div>
              <div className="space-y-4">
                {editablePatient.pregnancy && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-600 text-xl">⚠️</span>
                      <div>
                        <p className="text-gray-700 font-medium text-lg mb-1">بیمار باردار</p>
                        <p className="text-gray-600 text-sm">ملاحظات ویژه در تجویز داروها</p>
                      </div>
                    </div>
                  </div>
                )}
                {editablePatient.smoking && editablePatient.smoking !== 'غیرسیگاری' && editablePatient.smoking !== 'ترک کرده' && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-3">
                      <span className="text-orange-600 text-xl">🚬</span>
                      <div>
                        <p className="text-gray-700 font-medium text-lg mb-1">بیمار سیگاری</p>
                        <p className="text-gray-600 text-sm">نیاز به مشاوره ترک دخانیات</p>
                      </div>
                    </div>
                  </div>
                )}
                {(!editablePatient.vaccinations || editablePatient.vaccinations.length === 0) && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 text-xl">💉</span>
                      <div>
                        <p className="text-gray-700 font-medium text-lg mb-1">واکسیناسیون</p>
                        <p className="text-gray-600 text-sm">نیاز به تکمیل واکسیناسیون</p>
                      </div>
                    </div>
                  </div>
                )}
                {editablePatient.medicalHistory && editablePatient.medicalHistory.length > 3 && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 text-xl">🏥</span>
                      <div>
                        <p className="text-gray-700 font-medium text-lg mb-1">سوابق پزشکی متعدد</p>
                        <p className="text-gray-600 text-sm">نیاز به پیگیری منظم</p>
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiTrash2 className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">حذف پرونده بیمار</h3>
              <p className="text-gray-600 mb-2">
                آیا از حذف پرونده <span className="font-bold text-red-600">{editablePatient.fullName}</span> اطمینان دارید؟
              </p>
              <p className="text-sm text-gray-500">این عمل قابل بازگشت نیست.</p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition font-medium"
              >
                لغو
              </button>
              <button
                onClick={handleDeletePatient}
                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition font-medium shadow-lg"
              >
                حذف پرونده
              </button>
            </div>
          </div>
        </div>
      )}

      {/* اطلاع‌رسانی */}
      {showNotification && (
        <div className={`fixed bottom-6 left-6 right-6 md:right-auto md:w-96 rounded-xl shadow-xl p-6 transform transition-all duration-300 z-50 ${
          notification.type === 'success' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              notification.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {notification.type === 'success' ? <FiCheck className="w-6 h-6" /> : <FiX className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {notification.message}
              </p>
              <div className="h-1 w-full bg-gray-200 mt-2 rounded-full overflow-hidden">
                <div className={`h-full ${
                  notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } animate-progress`}></div>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes progress {
              from { width: 100%; }
              to { width: 0%; }
            }
            .animate-progress {
              animation: progress 3s linear forwards;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}