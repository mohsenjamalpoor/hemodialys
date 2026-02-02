import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  FiUser, FiEdit, FiCalendar, FiHash, 
  FiFolder, FiPhone, FiActivity, FiHeart, FiThermometer, 
  FiSmile, FiInfo, FiTrash2,
  FiClock, FiAlertCircle, FiX, FiCheck, FiEdit2,
   FiSave, FiArrowLeft, FiRefreshCw,
   FiAlertTriangle, FiPrinter
} from 'react-icons/fi';

// کامپوننت‌های جداگانه
import MedicalHistorySection from './section/MedicalHistorySection';
import SurgeryHistorySection from './section/SurgeryHistorySection';
import FamilyHistorySection from './section/FamilyHistorySection';
import VaccinationSection from './section/VaccinationSection';
import LabTestsSection from './section/LabTestsSection';
import NotesSection from './section/NotesSection';
import MedicationHistorySection from './section/MedicationHistorySection';
import LabImagingSection from './section/LabImagingSection';

const PATIENTS_STORAGE_KEY = 'hemo_patients_data';

// ساختار اولیه برای فیلدهای اضافی
const getDefaultPatientData = (basicData) => ({
  ...basicData,
  height: basicData.height || '',
  weight: basicData.weight || '',
  bmi: basicData.bmi || '',
  smoking: basicData.smoking || 'غیرسیگاری',
  pregnancy: basicData.pregnancy || false,
  breastfeeding: basicData.breastfeeding || false,
  bloodType: basicData.bloodType || '',
  vaccinations: basicData.vaccinations || [],
  medicalHistory: basicData.medicalHistory || [],
  surgeryHistory: basicData.surgeryHistory || [],
  familyHistory: basicData.familyHistory || [],
  foodAllergies: basicData.foodAllergies || [],
  drugAllergies: basicData.drugAllergies || [],
  notes: basicData.notes || [], // تغییر از رشته به آرایه
  labTests: basicData.labTests || [],
  medicationHistory: basicData.medicationHistory || [],
  labImaging: basicData.labImaging || [],
  lastVisit: basicData.lastVisit || new Date().toLocaleDateString('fa-IR'),
  lastUpdate: basicData.lastUpdate || new Date().toLocaleDateString('fa-IR')
});

// کامپوننت HealthInfoCard
const HealthInfoCard = React.memo(({ 
  title, 
  icon: Icon, 
  value, 
  unit, 
  color = 'blue',
  isEditing,
  onChange,
  type = 'text',
  options = []
}) => {
  const colors = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' }
  };

  const selectedColor = colors[color] || colors.blue;

  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6 border ${selectedColor.border} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className={`${selectedColor.bg} p-2 md:p-3 rounded-lg md:rounded-xl`}>
          <Icon className={`${selectedColor.text} w-5 h-5 md:w-6 md:h-6`} />
        </div>
        <span className="text-xs md:text-sm text-gray-600 font-medium">{title}</span>
      </div>
      <div className="text-center">
        {isEditing ? (
          <div className="relative">
            {type === 'select' ? (
              <select
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full text-center text-lg md:text-2xl lg:text-3xl font-bold border-2 border-gray-300 rounded-xl px-3 py-2 md:px-4 md:py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">انتخاب کنید</option>
                {options.map((option, index) => (
                  <option key={index} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : type === 'checkbox' ? (
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value || false}
                  onChange={(e) => onChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-12 md:w-16 h-6 md:h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 md:after:h-7 after:w-5 md:after:w-7 after:transition-all peer-checked:bg-green-500"></div>
                <span className="mr-2 md:mr-3 text-sm md:text-lg font-medium text-gray-900">
                  {value ? 'بله' : 'خیر'}
                </span>
              </label>
            ) : (
              <>
                <input
                  type={type}
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full text-center text-lg md:text-2xl lg:text-3xl font-bold border-2 border-gray-300 rounded-xl px-3 py-2 md:px-4 md:py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder={unit ? `عدد ${unit}` : 'مقدار'}
                />
                {unit && (
                  <span className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm md:text-lg">{unit}</span>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">{value || '---'}</p>
            {unit && <p className="text-gray-600 mt-2 md:mt-3 text-sm md:text-base">{unit}</p>}
          </>
        )}
      </div>
    </div>
  );
});

// کامپوننت ContactInfoCard
const ContactInfoCard = React.memo(({ 
  title, 
  icon: Icon, 
  value, 
  placeholder,
  isEditing,
  onChange,
  type = 'text',
  color = 'blue'
}) => {
  const colors = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-50', icon: 'bg-green-100', text: 'text-green-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100', text: 'text-purple-600' },
    red: { bg: 'bg-red-50', icon: 'bg-red-100', text: 'text-red-600' }
  };

  const selectedColor = colors[color] || colors.blue;

  return (
    <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 ${selectedColor.bg} rounded-xl hover:bg-opacity-80 transition`}>
      <div className={`${selectedColor.icon} p-2 md:p-3 rounded-lg md:rounded-xl`}>
        <Icon className={`${selectedColor.text} w-4 h-4 md:w-5 md:h-5`} />
      </div>
      <div className="flex-1">
        <p className="text-xs md:text-sm text-gray-600 mb-1">{title}</p>
        {isEditing ? (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1.5 md:px-3 md:py-2 border border-gray-300 rounded-lg text-right text-sm md:text-base font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder={placeholder}
          />
        ) : (
          <p className="font-bold text-gray-800 text-sm md:text-lg font-mono">{value || '---'}</p>
        )}
      </div>
    </div>
  );
});

// کامپوننت AlertCard
const AlertCard = React.memo(({ 
  title, 
  description, 
  icon,
  color = 'yellow'
}) => {
  const colors = {
    yellow: { bg: 'bg-gradient-to-r from-yellow-50 to-orange-50', border: 'border-yellow-200', text: 'text-yellow-600' },
    orange: { bg: 'bg-gradient-to-r from-orange-50 to-red-50', border: 'border-orange-200', text: 'text-orange-600' },
    blue: { bg: 'bg-gradient-to-r from-blue-50 to-cyan-50', border: 'border-blue-200', text: 'text-blue-600' },
    red: { bg: 'bg-gradient-to-r from-red-50 to-pink-50', border: 'border-red-200', text: 'text-red-600' },
    amber: { bg: 'bg-gradient-to-r from-amber-50 to-yellow-50', border: 'border-amber-200', text: 'text-amber-600' }
  };

  const selectedColor = colors[color] || colors.yellow;

  return (
    <div className={`${selectedColor.bg} border ${selectedColor.border} rounded-xl p-3 md:p-4 hover:shadow-md transition`}>
      <div className="flex items-start gap-2 md:gap-3">
        <span className={`text-lg md:text-xl ${selectedColor.text}`}>{icon}</span>
        <div>
          <p className="text-gray-700 font-medium text-sm md:text-lg mb-1">{title}</p>
          <p className="text-gray-600 text-xs md:text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
});

// کامپوننت اصلی PatientDetailPage
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
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printContent, setPrintContent] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  
  // حالت ویرایش برای فیلدهای پایه
  const [editingBasicInfo, setEditingBasicInfo] = useState(false);

  // بارگذاری اطلاعات بیمار و پزشک
  useEffect(() => {
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
    if (!patient || !patient.height || !patient.weight) return null;
    const heightInMeters = patient.height / 100;
    const bmi = patient.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(0);
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
    if (!patient) return null;
    
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];
    const colorIndex = patient.id ? (patient.id % colors.length) : 0;
    const color = colors[colorIndex];
    const firstLetter = patient.fullName?.charAt(0) || '?';
    
    return (
      <div className={`${color} w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl md:text-3xl shadow-lg`}>
        {firstLetter}
      </div>
    );
  };

  // ذخیره تغییرات فیلدهای پایه
  const handleSaveBasicInfo = () => {
    const savedPatients = localStorage.getItem(PATIENTS_STORAGE_KEY);
    if (savedPatients && patient) {
      const parsedPatients = JSON.parse(savedPatients);
      
      const bmi = calculateBMI();
      const updatedPatient = {
        ...patient,
        bmi,
        lastUpdate: new Date().toLocaleDateString('fa-IR')
      };
      
      const updatedPatients = parsedPatients.map(p => 
        p.id === updatedPatient.id ? updatedPatient : p
      );
      
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(updatedPatients));
      setPatient(updatedPatient);
      setEditingBasicInfo(false);
      showNotificationMessage('تغییرات با موفقیت ذخیره شد', 'success');
    }
  };

  // لغو ویرایش فیلدهای پایه
  const handleCancelEditBasicInfo = () => {
    setEditingBasicInfo(false);
    showNotificationMessage('ویرایش لغو شد', 'info');
  };

  // مدیریت تغییرات فیلدها
  const handleInputChange = (field, value) => {
    setPatient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // تابع ویژه برای inputهای متنی
  const handleTextInputChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(name, value);
  };

  // تابع ذخیره بیمار در localStorage
  const savePatientToStorage = (updates = {}) => {
    if (!patient) return;
    
    const savedPatients = localStorage.getItem(PATIENTS_STORAGE_KEY);
    if (savedPatients) {
      const parsedPatients = JSON.parse(savedPatients);
      const updatedPatient = {
        ...patient,
        ...updates,
        lastUpdate: new Date().toLocaleDateString('fa-IR')
      };
      
      const updatedPatients = parsedPatients.map(p => 
        p.id === patient.id ? updatedPatient : p
      );
      
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(updatedPatients));
    }
  };

  // سوابق پزشکی
  const handleAddMedicalHistory = (item) => {
    const currentHistory = Array.isArray(patient?.medicalHistory) 
      ? patient.medicalHistory 
      : [];
    
    const updatedHistory = [...currentHistory, item];
    
    handleInputChange('medicalHistory', updatedHistory);
    savePatientToStorage({ medicalHistory: updatedHistory });
    showNotificationMessage('سابقه بیماری اضافه شد', 'success');
  };

  const handleEditMedicalHistory = (id, newText) => {
    if (!newText.trim()) {
      showNotificationMessage('متن نمی‌تواند خالی باشد', 'error');
      return;
    }

    const currentHistory = Array.isArray(patient?.medicalHistory) 
      ? patient.medicalHistory 
      : [];
    
    const updatedHistory = currentHistory.map(item => 
      item.id === id ? { ...item, text: newText } : item
    );
    handleInputChange('medicalHistory', updatedHistory);
    savePatientToStorage({ medicalHistory: updatedHistory });
    showNotificationMessage('سابقه بیماری ویرایش شد', 'success');
  };

  const handleRemoveMedicalHistory = (id) => {
    const currentHistory = Array.isArray(patient?.medicalHistory) 
      ? patient.medicalHistory 
      : [];
    
    const updatedHistory = currentHistory.filter(item => item.id !== id);
    handleInputChange('medicalHistory', updatedHistory);
    savePatientToStorage({ medicalHistory: updatedHistory });
    showNotificationMessage('سابقه بیماری حذف شد', 'success');
  };

  // سوابق جراحی
  const handleAddSurgeryHistory = (item) => {
    const currentHistory = Array.isArray(patient?.surgeryHistory) 
      ? patient.surgeryHistory 
      : [];
    
    const updatedHistory = [...currentHistory, item];
    
    handleInputChange('surgeryHistory', updatedHistory);
    savePatientToStorage({ surgeryHistory: updatedHistory });
    showNotificationMessage('سابقه جراحی اضافه شد', 'success');
  };

  const handleEditSurgeryHistory = (id, newText, newDate) => {
    const currentHistory = Array.isArray(patient?.surgeryHistory) 
      ? patient.surgeryHistory 
      : [];
    
    const updatedHistory = currentHistory.map(item => 
      item.id === id ? { ...item, text: newText, date: newDate || item.date } : item
    );
    handleInputChange('surgeryHistory', updatedHistory);
    savePatientToStorage({ surgeryHistory: updatedHistory });
    showNotificationMessage('سابقه جراحی ویرایش شد', 'success');
  };

  const handleRemoveSurgeryHistory = (id) => {
    const currentHistory = Array.isArray(patient?.surgeryHistory) 
      ? patient.surgeryHistory 
      : [];
    
    const updatedHistory = currentHistory.filter(item => item.id !== id);
    handleInputChange('surgeryHistory', updatedHistory);
    savePatientToStorage({ surgeryHistory: updatedHistory });
    showNotificationMessage('سابقه جراحی حذف شد', 'success');
  };

  // سوابق خانوادگی
  const handleAddFamilyHistory = (item) => {
    const currentHistory = Array.isArray(patient?.familyHistory) 
      ? patient.familyHistory 
      : [];
    
    const updatedHistory = [...currentHistory, item];
    
    handleInputChange('familyHistory', updatedHistory);
    savePatientToStorage({ familyHistory: updatedHistory });
    showNotificationMessage('سابقه خانوادگی اضافه شد', 'success');
  };

  const handleEditFamilyHistory = (id, newText) => {
    const currentHistory = Array.isArray(patient?.familyHistory) 
      ? patient.familyHistory 
      : [];
    
    const updatedHistory = currentHistory.map(item => 
      item.id === id ? { ...item, text: newText } : item
    );
    handleInputChange('familyHistory', updatedHistory);
    savePatientToStorage({ familyHistory: updatedHistory });
    showNotificationMessage('سابقه خانوادگی ویرایش شد', 'success');
  };

  const handleRemoveFamilyHistory = (id) => {
    const currentHistory = Array.isArray(patient?.familyHistory) 
      ? patient.familyHistory 
      : [];
    
    const updatedHistory = currentHistory.filter(item => item.id !== id);
    handleInputChange('familyHistory', updatedHistory);
    savePatientToStorage({ familyHistory: updatedHistory });
    showNotificationMessage('سابقه خانوادگی حذف شد', 'success');
  };

  // واکسیناسیون
  const handleAddVaccination = (item) => {
    const currentVaccinations = Array.isArray(patient?.vaccinations) 
      ? patient.vaccinations 
      : [];
    
    const updatedVaccinations = [...currentVaccinations, item];
    
    handleInputChange('vaccinations', updatedVaccinations);
    savePatientToStorage({ vaccinations: updatedVaccinations });
    showNotificationMessage('واکسن اضافه شد', 'success');
  };

  const handleEditVaccination = (id, newText) => {
    const currentVaccinations = Array.isArray(patient?.vaccinations) 
      ? patient.vaccinations 
      : [];
    
    const updatedVaccinations = currentVaccinations.map(item => 
      item.id === id ? { ...item, text: newText } : item
    );
    handleInputChange('vaccinations', updatedVaccinations);
    savePatientToStorage({ vaccinations: updatedVaccinations });
    showNotificationMessage('واکسن ویرایش شد', 'success');
  };

  const handleRemoveVaccination = (id) => {
    const currentVaccinations = Array.isArray(patient?.vaccinations) 
      ? patient.vaccinations 
      : [];
    
    const updatedVaccinations = currentVaccinations.filter(item => item.id !== id);
    handleInputChange('vaccinations', updatedVaccinations);
    savePatientToStorage({ vaccinations: updatedVaccinations });
    showNotificationMessage('واکسن حذف شد', 'success');
  };

  // آزمایشات
  const handleAddLabTest = (test) => {
    const currentTests = Array.isArray(patient?.labTests) 
      ? patient.labTests 
      : [];
    
    const updatedTests = [...currentTests, test];
    
    handleInputChange('labTests', updatedTests);
    savePatientToStorage({ labTests: updatedTests });
    showNotificationMessage('آزمایش جدید اضافه شد', 'success');
  };

  const handleEditLabTest = (id, updatedData) => {
    const currentTests = Array.isArray(patient?.labTests) 
      ? patient.labTests 
      : [];
    
    const updatedTests = currentTests.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    );
    
    handleInputChange('labTests', updatedTests);
    savePatientToStorage({ labTests: updatedTests });
    showNotificationMessage('آزمایش ویرایش شد', 'success');
  };

  const handleRemoveLabTest = (id) => {
    const currentTests = Array.isArray(patient?.labTests) 
      ? patient.labTests 
      : [];
    
    const updatedTests = currentTests.filter(item => item.id !== id);
    handleInputChange('labTests', updatedTests);
    savePatientToStorage({ labTests: updatedTests });
    showNotificationMessage('آزمایش حذف شد', 'success');
  };

  // توابع مدیریت یادداشت‌ها
  const handleAddNote = (newNote) => {
    const currentNotes = Array.isArray(patient?.notes) 
      ? patient.notes 
      : [];
    
    const updatedNotes = [...currentNotes, newNote];
    
    handleInputChange('notes', updatedNotes);
    savePatientToStorage({ notes: updatedNotes });
    showNotificationMessage('یادداشت جدید اضافه شد', 'success');
  };

  const handleEditNote = (id, content, title, category, tags) => {
    const currentNotes = Array.isArray(patient?.notes) 
      ? patient.notes 
      : [];
    
    const updatedNotes = currentNotes.map(note => 
      note.id === id ? { 
        ...note, 
        content, 
        title, 
        category, 
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : note.tags || [],
        lastEdited: new Date().toLocaleDateString('fa-IR')
      } : note
    );
    
    handleInputChange('notes', updatedNotes);
    savePatientToStorage({ notes: updatedNotes });
    showNotificationMessage('یادداشت ویرایش شد', 'success');
  };

  const handleRemoveNote = (id) => {
    const currentNotes = Array.isArray(patient?.notes) 
      ? patient.notes 
      : [];
    
    const updatedNotes = currentNotes.filter(note => note.id !== id);
    handleInputChange('notes', updatedNotes);
    savePatientToStorage({ notes: updatedNotes });
    showNotificationMessage('یادداشت حذف شد', 'success');
  };

  const handleToggleNoteImportant = (id) => {
    const currentNotes = Array.isArray(patient?.notes) 
      ? patient.notes 
      : [];
    
    const updatedNotes = currentNotes.map(note => 
      note.id === id ? { ...note, isImportant: !note.isImportant } : note
    );
    
    handleInputChange('notes', updatedNotes);
    savePatientToStorage({ notes: updatedNotes });
    showNotificationMessage('وضعیت اهمیت یادداشت تغییر کرد', 'success');
  };

  const handleToggleNotePrivacy = (id) => {
    const currentNotes = Array.isArray(patient?.notes) 
      ? patient.notes 
      : [];
    
    const updatedNotes = currentNotes.map(note => 
      note.id === id ? { ...note, isPrivate: !note.isPrivate } : note
    );
    
    handleInputChange('notes', updatedNotes);
    savePatientToStorage({ notes: updatedNotes });
    showNotificationMessage('وضعیت خصوصی بودن یادداشت تغییر کرد', 'success');
  };

  // سوابق دارویی
  const handleAddMedication = (medication) => {
    const currentMedications = Array.isArray(patient?.medicationHistory) 
      ? patient.medicationHistory 
      : [];
    
    const updatedMedications = [...currentMedications, medication];
    handleInputChange('medicationHistory', updatedMedications);
    savePatientToStorage({ medicationHistory: updatedMedications });
    showNotificationMessage('دارو اضافه شد', 'success');
  };

  const handleEditMedication = (id, updatedMedication) => {
    const currentMedications = Array.isArray(patient?.medicationHistory) 
      ? patient.medicationHistory 
      : [];
    
    const updatedMedications = currentMedications.map(item => 
      item.id === id ? { ...item, ...updatedMedication } : item
    );
    handleInputChange('medicationHistory', updatedMedications);
    savePatientToStorage({ medicationHistory: updatedMedications });
    showNotificationMessage('دارو ویرایش شد', 'success');
  };

  const handleRemoveMedication = (id) => {
    const currentMedications = Array.isArray(patient?.medicationHistory) 
      ? patient.medicationHistory 
      : [];
    
    const updatedMedications = currentMedications.filter(item => item.id !== id);
    handleInputChange('medicationHistory', updatedMedications);
    savePatientToStorage({ medicationHistory: updatedMedications });
    showNotificationMessage('دارو حذف شد', 'success');
  };

  // آزمایشات و تصویربرداری
  const handleAddLabImaging = (item) => {
    const currentLabImaging = Array.isArray(patient?.labImaging) 
      ? patient.labImaging 
      : [];
    
    const updatedLabImaging = [...currentLabImaging, item];
    handleInputChange('labImaging', updatedLabImaging);
    savePatientToStorage({ labImaging: updatedLabImaging });
    showNotificationMessage('آزمایش/تصویربرداری اضافه شد', 'success');
  };

  const handleEditLabImaging = (id, updatedItem) => {
    const currentLabImaging = Array.isArray(patient?.labImaging) 
      ? patient.labImaging 
      : [];
    
    const updatedLabImaging = currentLabImaging.map(item => 
      item.id === id ? { ...item, ...updatedItem } : item
    );
    handleInputChange('labImaging', updatedLabImaging);
    savePatientToStorage({ labImaging: updatedLabImaging });
    showNotificationMessage('آزمایش/تصویربرداری ویرایش شد', 'success');
  };

  const handleRemoveLabImaging = (id) => {
    const currentLabImaging = Array.isArray(patient?.labImaging) 
      ? patient.labImaging 
      : [];
    
    const updatedLabImaging = currentLabImaging.filter(item => item.id !== id);
    handleInputChange('labImaging', updatedLabImaging);
    savePatientToStorage({ labImaging: updatedLabImaging });
    showNotificationMessage('آزمایش/تصویربرداری حذف شد', 'success');
  };

  // آلرژی‌ها
  const handleAddAllergy = (type, text) => {
    const field = type === 'food' ? 'foodAllergies' : 'drugAllergies';
    const currentAllergies = Array.isArray(patient?.[field]) 
      ? patient[field] 
      : [];
    
    const newItem = {
      id: Date.now() + Math.random(),
      text: text,
      date: new Date().toLocaleDateString('fa-IR'),
      type: type
    };
    
    const updatedAllergies = [...currentAllergies, newItem];
    handleInputChange(field, updatedAllergies);
    savePatientToStorage({ [field]: updatedAllergies });
    showNotificationMessage(`آلرژی ${type === 'food' ? 'غذایی' : 'دارویی'} اضافه شد`, 'success');
  };

  const handleRemoveAllergy = (type, id) => {
    const field = type === 'food' ? 'foodAllergies' : 'drugAllergies';
    const currentAllergies = Array.isArray(patient?.[field]) 
      ? patient[field] 
      : [];
    
    const updatedAllergies = currentAllergies.filter(item => item.id !== id);
    handleInputChange(field, updatedAllergies);
    savePatientToStorage({ [field]: updatedAllergies });
    showNotificationMessage(`آلرژی ${type === 'food' ? 'غذایی' : 'دارویی'} حذف شد`, 'success');
  };

  // پرینت
  const handlePrint = (test = null, type = 'single') => {
    if (type === 'all') {
      const printData = {
        patient: patient,
        doctor: doctorInfo,
        tests: patient.labTests,
        printDate: new Date().toLocaleDateString('fa-IR'),
        printTime: new Date().toLocaleTimeString('fa-IR')
      };
      setPrintContent(printData);
    } else if (test) {
      const printData = {
        patient: patient,
        doctor: doctorInfo,
        test: test,
        printDate: new Date().toLocaleDateString('fa-IR'),
        printTime: new Date().toLocaleTimeString('fa-IR')
      };
      setPrintContent(printData);
    }
    setShowPrintModal(true);
  };

  const handlePrintConfirm = () => {
    const printWindow = window.open('', '_blank');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>پرینت آزمایشات پزشکی</title>
        <style>
          body {
            font-family: 'B Nazanin', 'Iranian Sans', Tahoma, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 20px;
            max-width: 1000px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .patient-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            background: #f5f5f5;
            padding: 20px;
            border-radius: 10px;
          }
          .test-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .test-table th, .test-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
          }
          .test-table th {
            background-color: #4f46e5;
            color: white;
          }
          .normal { color: green; }
          .abnormal { color: red; }
          .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>گزارش آزمایشات پزشکی</h1>
          <p>مرکز پزشکی همودیالیز</p>
        </div>
        
        <div class="patient-info">
          <div>
            <h3>اطلاعات بیمار</h3>
            <p>نام: ${printContent.patient.fullName}</p>
            <p>سن: ${printContent.patient.age} سال</p>
            <p>شماره پرونده: ${printContent.patient.medicalRecordNumber}</p>
            <p>کد ملی: ${printContent.patient.nationalId}</p>
          </div>
          <div>
            <h3>اطلاعات پزشک</h3>
            <p>نام پزشک: ${printContent.doctor.name}</p>
            <p>تخصص: ${printContent.doctor.specialty}</p>
            <p>کد پزشک: ${printContent.doctor.code}</p>
          </div>
        </div>
        
        ${
          printContent.tests ? `
          <h2>لیست تمام آزمایشات</h2>
          <table class="test-table">
            <thead>
              <tr>
                <th>ردیف</th>
                <th>نام آزمایش</th>
                <th>تاریخ</th>
                <th>نتیجه</th>
                <th>محدوده نرمال</th>
                <th>وضعیت</th>
                <th>یادداشت</th>
              </tr>
            </thead>
            <tbody>
              ${printContent.tests.map((test, index) => {
                const isNormal = test.normalRange && test.result ? 
                  (() => {
                    const numResult = parseFloat(test.result);
                    const rangeParts = test.normalRange.split('-').map(p => parseFloat(p.trim()));
                    if (rangeParts.length === 2) {
                      return numResult >= rangeParts[0] && numResult <= rangeParts[1];
                    }
                    return false;
                  })() : false;
                
                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${test.testName}</td>
                    <td>${test.date || '---'}</td>
                    <td>${test.result || '---'}</td>
                    <td>${test.normalRange || '---'}</td>
                    <td class="${isNormal ? 'normal' : 'abnormal'}">
                      ${test.result ? (isNormal ? 'نرمال' : 'غیرنرمال') : 'در انتظار'}
                    </td>
                    <td>${test.notes || '---'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          ` : `
          <h2>گزارش آزمایش</h2>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3>${printContent.test.testName}</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
              <div><strong>تاریخ آزمایش:</strong> ${printContent.test.date || '---'}</div>
              <div><strong>نتیجه:</strong> ${printContent.test.result || '---'}</div>
              <div><strong>محدوده نرمال:</strong> ${printContent.test.normalRange || '---'}</div>
            </div>
            ${printContent.test.notes ? `<div style="margin-top: 15px;"><strong>یادداشت:</strong><br>${printContent.test.notes}</div>` : ''}
          </div>
          `
        }
        
        <div class="footer">
          <p>تاریخ پرینت: ${printContent.printDate} - ساعت: ${printContent.printTime}</p>
          <p>این سند به صورت خودکار تولید شده است</p>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 5px; cursor: pointer;">
            پرینت گزارش
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
            بستن
          </button>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 1000);
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setShowPrintModal(false);
    showNotificationMessage('صفحه پرینت آماده شد', 'success');
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

  // محاسبه BMI با ذخیره خودکار
  const calculateAndSaveBMI = () => {
    const bmi = calculateBMI();
    handleInputChange('bmi', bmi);
    showNotificationMessage('BMI محاسبه و ذخیره شد', 'success');
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
    @media (max-width: 768px) {
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
    }
  `;

  // بررسی اینکه آیا بیمار بارگذاری شده است
  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm md:text-base">در حال بارگذاری اطلاعات بیمار...</p>
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
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-1 md:gap-3 px-2 md:px-4 py-1.5 md:py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition text-sm md:text-base"
            >
              <FiArrowLeft className="rotate-180 w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium hidden md:inline">بازگشت به لیست بیماران</span>
              <span className="font-medium md:hidden">بازگشت</span>
            </button>
            
            <div className="flex items-center gap-2 md:gap-4">
              <div className="text-right hidden md:block">
                <p className="text-xs md:text-sm text-gray-600">{doctorInfo.specialty}</p>
                <p className="font-bold text-blue-700 text-sm md:text-lg">{doctorInfo.name}</p>
              </div>
              <div className="bg-blue-100 p-2 md:p-3 rounded-full">
                <FiUser className="text-blue-600 w-4 h-4 md:w-6 md:h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div className="max-w-7xl mx-auto p-3 md:p-4">
        {/* هدر بیمار */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl md:rounded-2xl shadow-xl p-4 md:p-8 text-white mb-6 md:mb-8 transform transition-all hover:shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 md:gap-8">
            <div className="flex items-center gap-3 md:gap-6">
              {renderAvatar()}
              <div>
                <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2">{patient.fullName}</h1>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 md:mt-3">
                  <span className="bg-white bg-opacity-20 px-2 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium">
                    {patient.age} سال
                  </span>
                  <span className="bg-white bg-opacity-20 px-2 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium">
                    {patient.gender}
                  </span>
                  <span className="bg-white bg-opacity-20 px-2 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium">
                    پرونده: {patient.medicalRecordNumber}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4 md:mt-0">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1 md:gap-3 px-3 md:px-6 py-1.5 md:py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition transform hover:scale-105 text-sm md:text-base"
              >
                <FiTrash2 className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium hidden md:inline">حذف پرونده</span>
                <span className="font-medium md:hidden">حذف</span>
              </button>
              
              {editingBasicInfo ? (
                <>
                  <button
                    onClick={handleCancelEditBasicInfo}
                    className="flex items-center gap-1 md:gap-3 px-3 md:px-6 py-1.5 md:py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition transform hover:scale-105 text-sm md:text-base"
                  >
                    <FiX className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-medium hidden md:inline">لغو ویرایش</span>
                    <span className="font-medium md:hidden">لغو</span>
                  </button>
                  
                  <button
                    onClick={handleSaveBasicInfo}
                    className="flex items-center gap-1 md:gap-3 px-4 md:px-8 py-1.5 md:py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition transform hover:scale-105 shadow-lg text-sm md:text-base"
                  >
                    <FiSave className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-medium hidden md:inline">ذخیره تغییرات</span>
                    <span className="font-medium md:hidden">ذخیره</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditingBasicInfo(true)}
                  className="flex items-center gap-1 md:gap-3 px-4 md:px-8 py-1.5 md:py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-xl transition transform hover:scale-105 shadow-lg text-sm md:text-base"
                >
                  <FiEdit className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-medium hidden md:inline">ویرایش اطلاعات پایه</span>
                  <span className="font-medium md:hidden">ویرایش</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* اطلاعات بیمار */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* ستون سمت چپ - اطلاعات سلامت */}
          <div className="lg:col-span-2 space-y-4 md:space-y-8">
            {/* اطلاعات سلامت پایه */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8">
              <div className="flex items-center justify-between mb-4 md:mb-8">
                <h3 className="text-lg md:text-2xl font-bold text-gray-800">اطلاعات سلامت</h3>
                {editingBasicInfo && (
                  <button
                    onClick={calculateAndSaveBMI}
                    className="text-xs md:text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 hover:bg-blue-50 rounded-lg transition"
                  >
                    <FiRefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                    محاسبه BMI
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
                {/* قد */}
                <HealthInfoCard
                  title="قد"
                  icon={FiActivity}
                  value={patient.height}
                  unit="سانتی‌متر"
                  color="blue"
                  isEditing={editingBasicInfo}
                  onChange={(value) => handleInputChange('height', value)}
                  type="number"
                />

                {/* وزن */}
                <HealthInfoCard
                  title="وزن"
                  icon={FiThermometer}
                  value={patient.weight}
                  unit="کیلوگرم"
                  color="green"
                  isEditing={editingBasicInfo}
                  onChange={(value) => handleInputChange('weight', value)}
                  type="number"
                />

                {/* BMI */}
                <div className={`bg-gradient-to-br rounded-xl md:rounded-2xl p-4 md:p-6 border shadow-sm ${
                  bmiColor === 'green' ? 'from-emerald-50 to-green-50 border-emerald-200' :
                  bmiColor === 'yellow' ? 'from-yellow-50 to-amber-50 border-yellow-200' :
                  bmiColor === 'orange' ? 'from-orange-50 to-amber-50 border-orange-200' :
                  'from-red-50 to-pink-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${
                      bmiColor === 'green' ? 'bg-emerald-100' :
                      bmiColor === 'yellow' ? 'bg-amber-100' :
                      bmiColor === 'orange' ? 'bg-orange-100' :
                      'bg-red-100'
                    }`}>
                      <FiHeart className={`w-5 h-5 md:w-6 md:h-6 ${
                        bmiColor === 'green' ? 'text-emerald-600' :
                        bmiColor === 'yellow' ? 'text-amber-600' :
                        bmiColor === 'orange' ? 'text-orange-600' :
                        'text-red-600'
                      }`} />
                    </div>
                    <span className="text-xs md:text-sm text-gray-600 font-medium">شاخص توده بدنی</span>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">{bmi || '---'}</p>
                    {bmiCategory && (
                      <p className={`mt-2 md:mt-3 px-3 md:px-5 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium inline-block ${
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                {/* مصرف دخانیات */}
                <HealthInfoCard
                  title="مصرف دخانیات"
                  icon={FiSmile}
                  value={patient.smoking}
                  unit=""
                  color="gray"
                  isEditing={editingBasicInfo}
                  onChange={(value) => handleInputChange('smoking', value)}
                  type="select"
                  options={[
                    { value: 'غیرسیگاری', label: 'غیرسیگاری' },
                    { value: 'سیگاری (کمتر از 10 نخ)', label: 'سیگاری (کمتر از 10 نخ)' },
                    { value: 'سیگاری (10-20 نخ)', label: 'سیگاری (10-20 نخ)' },
                    { value: 'سیگاری (بیش از 20 نخ)', label: 'سیگاری (بیش از 20 نخ)' },
                    { value: 'ترک کرده', label: 'ترک کرده' }
                  ]}
                />

                {/* آخرین ویزیت */}
                <div className="bg-blue-50 rounded-xl p-3 md:p-6">
                  <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
                    <div className="bg-blue-100 p-2 md:p-3 rounded-lg md:rounded-xl">
                      <FiCalendar className="text-blue-700 w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm md:text-lg">آخرین ویزیت</h4>
                  </div>
                  <div className="bg-white rounded-xl p-2 md:p-4">
                    {editingBasicInfo ? (
                      <input
                        type="text"
                        name="lastVisit"
                        value={patient.lastVisit || ''}
                        onChange={handleTextInputChange}
                        className="w-full px-2 md:px-4 py-1.5 md:py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
                        placeholder="1402/11/15"
                      />
                    ) : (
                      <>
                        <p className="text-gray-700 text-sm md:text-lg">{patient.lastVisit || '---'}</p>
                        <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">توسط: {patient.doctorName || doctorInfo.name}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* بارداری و شیردهی */}
                {patient.gender === 'زن' && (
                  <div className="bg-pink-50 rounded-xl p-3 md:p-6 md:col-span-2">
                    <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
                      <div className="bg-pink-100 p-2 md:p-3 rounded-lg md:rounded-xl">
                        <FiInfo className="text-pink-700 w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm md:text-lg">وضعیت بارداری و شیردهی</h4>
                    </div>
                    <div className="bg-white rounded-xl p-2 md:p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 text-sm md:text-lg">بارداری:</span>
                          {editingBasicInfo ? (
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={patient.pregnancy || false}
                                onChange={(e) => handleInputChange('pregnancy', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="relative w-10 md:w-12 h-5 md:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 md:after:h-5 after:w-4 md:after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                              <span className="mr-2 md:mr-3 text-sm md:text-lg font-medium text-gray-900">
                                {patient.pregnancy ? 'بله' : 'خیر'}
                              </span>
                            </label>
                          ) : (
                            <span className={`font-bold text-sm md:text-lg ${patient.pregnancy ? 'text-green-600' : 'text-gray-600'}`}>
                              {patient.pregnancy ? '✓ بله' : '✗ خیر'}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 text-sm md:text-lg">شیردهی:</span>
                          {editingBasicInfo ? (
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={patient.breastfeeding || false}
                                onChange={(e) => handleInputChange('breastfeeding', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="relative w-10 md:w-12 h-5 md:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 md:after:h-5 after:w-4 md:after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                              <span className="mr-2 md:mr-3 text-sm md:text-lg font-medium text-gray-900">
                                {patient.breastfeeding ? 'بله' : 'خیر'}
                              </span>
                            </label>
                          ) : (
                            <span className={`font-bold text-sm md:text-lg ${patient.breastfeeding ? 'text-green-600' : 'text-gray-600'}`}>
                              {patient.breastfeeding ? '✓ بله' : '✗ خیر'}
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
            <MedicalHistorySection
              medicalHistory={patient.medicalHistory}
              onAdd={handleAddMedicalHistory}
              onEdit={handleEditMedicalHistory}
              onRemove={handleRemoveMedicalHistory}
              showAddButton={true}
            />

            {/* سوابق جراحی */}
            <SurgeryHistorySection
              surgeryHistory={patient.surgeryHistory}
              onAdd={handleAddSurgeryHistory}
              onEdit={handleEditSurgeryHistory}
              onRemove={handleRemoveSurgeryHistory}
              showAddButton={true}
            />

            {/* سوابق خانوادگی */}
            <FamilyHistorySection
              familyHistory={patient.familyHistory}
              onAdd={handleAddFamilyHistory}
              onEdit={handleEditFamilyHistory}
              onRemove={handleRemoveFamilyHistory}
              showAddButton={true}
            />

            {/* سوابق دارویی */}
            <MedicationHistorySection
              medicationHistory={patient.medicationHistory}
              onAdd={handleAddMedication}
              onEdit={handleEditMedication}
              onRemove={handleRemoveMedication}
              showAddButton={true}
            />

            {/* آزمایشات و تصویربرداری */}
            <LabImagingSection
              labImaging={patient.labImaging}
              onAdd={handleAddLabImaging}
              onEdit={handleEditLabImaging}
              onRemove={handleRemoveLabImaging}
              showAddButton={true}
            />

            {/* آزمایشات */}
            <LabTestsSection
              labTests={patient.labTests}
              onAdd={handleAddLabTest}
              onEdit={handleEditLabTest}
              onRemove={handleRemoveLabTest}
              onPrint={handlePrint}
              showAddButton={true}
              showEditButtons={true}
            />

            {/* یادداشت‌ها */}
            <NotesSection
              notes={patient.notes}
              onAdd={handleAddNote}
              onEdit={handleEditNote}
              onRemove={handleRemoveNote}
              onToggleImportant={handleToggleNoteImportant}
              onTogglePrivacy={handleToggleNotePrivacy}
              onCopyNote={(text) => {
                navigator.clipboard.writeText(text);
                showNotificationMessage('متن کپی شد', 'success');
              }}
              showAddButton={true}
              doctorName={doctorInfo.name}
              patientName={patient.fullName}
              showEditButtons={true}
            />

            {/* واکسیناسیون */}
            <VaccinationSection
              vaccinations={patient.vaccinations}
              onAdd={handleAddVaccination}
              onEdit={handleEditVaccination}
              onRemove={handleRemoveVaccination}
              showAddButton={true}
            />

          </div>

          {/* ستون سمت راست - سایدبار */}
          <div className="lg:col-span-1 space-y-4 md:space-y-8">
            {/* اطلاعات تماس */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              <div className="flex items-center justify-between mb-4 md:mb-8">
                <h3 className="text-lg md:text-2xl font-bold text-gray-800">اطلاعات تماس</h3>
                {editingBasicInfo && (
                  <span className="text-xs md:text-sm text-green-600 bg-green-50 px-2 md:px-4 py-1 md:py-2 rounded-full flex items-center gap-1 md:gap-2">
                    <FiEdit2 className="w-3 h-3 md:w-4 md:h-4" />
                    در حال ویرایش
                  </span>
                )}
              </div>
              
              <div className="space-y-3 md:space-y-6">
                <ContactInfoCard
                  title="شماره تماس"
                  icon={FiPhone}
                  value={patient.phone}
                  placeholder="09123456789"
                  isEditing={editingBasicInfo}
                  onChange={(value) => handleInputChange('phone', value)}
                  type="tel"
                  color="blue"
                />
                
                <ContactInfoCard
                  title="کد ملی"
                  icon={FiHash}
                  value={patient.nationalId}
                  placeholder="0012345678"
                  isEditing={editingBasicInfo}
                  onChange={(value) => handleInputChange('nationalId', value)}
                  color="green"
                />
                
                <ContactInfoCard
                  title="شماره پرونده"
                  icon={FiFolder}
                  value={patient.medicalRecordNumber}
                  placeholder="MR-2024-001"
                  isEditing={editingBasicInfo}
                  onChange={(value) => handleInputChange('medicalRecordNumber', value)}
                  color="purple"
                />
                
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-red-50 rounded-xl hover:bg-red-100 transition">
                  <div className="bg-red-100 p-2 md:p-3 rounded-lg md:rounded-xl">
                    <span className="text-red-600 font-bold text-sm md:text-base">🩸</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs md:text-sm text-gray-600 mb-1">گروه خونی</p>
                    {editingBasicInfo ? (
                      <select
                        value={patient.bloodType || ''}
                        onChange={(e) => handleInputChange('bloodType', e.target.value)}
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm md:text-base"
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
                      <p className={`font-bold text-sm md:text-lg ${patient.bloodType?.includes('+') ? 'text-red-600' : 'text-blue-600'}`}>
                        {patient.bloodType || '---'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* آلرژی‌ها */}
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-2 md:p-3 rounded-lg bg-yellow-100">
                    <FiAlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">آلرژی‌ها</h3>
                    <p className="text-xs md:text-sm text-gray-500">
                      {(patient.foodAllergies?.length || 0) + (patient.drugAllergies?.length || 0)} مورد ثبت شده
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                {/* آلرژی غذایی */}
                <div className="bg-amber-50 rounded-xl p-3 md:p-4">
                  <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2 md:mb-3">آلرژی غذایی</h4>
                  {patient.foodAllergies && patient.foodAllergies.length > 0 ? (
                    <div className="space-y-2">
                      {patient.foodAllergies.map((allergy, index) => (
                        <div key={allergy.id} className="flex items-center justify-between bg-white p-2 md:p-3 rounded-lg">
                          <span className="text-gray-700 text-xs md:text-sm">{allergy.text}</span>
                          <button
                            onClick={() => handleRemoveAllergy('food', allergy.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            حذف
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-xs md:text-sm text-center py-2">هیچ آلرژی غذایی ثبت نشده</p>
                  )}
                  {editingBasicInfo && (
                    <div className="mt-2 md:mt-3">
                      <input
                        type="text"
                        placeholder="مثلاً: بادام زمینی، لبنیات"
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-right text-xs md:text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            handleAddAllergy('food', e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter ↵ برای افزودن سریع</p>
                    </div>
                  )}
                </div>

                {/* آلرژی دارویی */}
                <div className="bg-red-50 rounded-xl p-3 md:p-4">
                  <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2 md:mb-3">آلرژی دارویی</h4>
                  {patient.drugAllergies && patient.drugAllergies.length > 0 ? (
                    <div className="space-y-2">
                      {patient.drugAllergies.map((allergy, index) => (
                        <div key={allergy.id} className="flex items-center justify-between bg-white p-2 md:p-3 rounded-lg">
                          <span className="text-gray-700 text-xs md:text-sm">{allergy.text}</span>
                          <button
                            onClick={() => handleRemoveAllergy('drug', allergy.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            حذف
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-xs md:text-sm text-center py-2">هیچ آلرژی دارویی ثبت نشده</p>
                  )}
                  {editingBasicInfo && (
                    <div className="mt-2 md:mt-3">
                      <input
                        type="text"
                        placeholder="مثلاً: پنی‌سیلین، ایبوپروفن"
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-right text-xs md:text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            handleAddAllergy('drug', e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter ↵ برای افزودن سریع</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* آخرین بروزرسانی */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-6">
                <div className="bg-purple-100 p-2 md:p-3 rounded-lg md:rounded-xl">
                  <FiClock className="text-purple-600 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg md:text-xl">آخرین بروزرسانی</h3>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 md:p-6 border border-purple-200">
                <p className="text-gray-800 font-bold text-lg md:text-2xl mb-1 md:mb-2">{patient.lastUpdate || new Date().toLocaleDateString('fa-IR')}</p>
                <p className="text-gray-600 text-sm md:text-base">توسط: {patient.doctorName || doctorInfo.name}</p>
                <p className="text-xs md:text-sm text-gray-500 mt-2 md:mt-3">تغییرات به صورت خودکار ذخیره می‌شوند</p>
              </div>
            </div>

            {/* هشدارها */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-6">
                <div className="bg-yellow-100 p-2 md:p-3 rounded-lg md:rounded-xl">
                  <FiAlertCircle className="text-yellow-600 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg md:text-xl">هشدارها و یادداشت‌ها</h3>
              </div>
              <div className="space-y-3 md:space-y-4">
                {patient.pregnancy && (
                  <AlertCard
                    title="بیمار باردار"
                    description="ملاحظات ویژه در تجویز داروها"
                    icon="⚠️"
                    color="yellow"
                  />
                )}
                {patient.smoking && patient.smoking !== 'غیرسیگاری' && patient.smoking !== 'ترک کرده' && (
                  <AlertCard
                    title="بیمار سیگاری"
                    description="نیاز به مشاوره ترک دخانیات"
                    icon="🚬"
                    color="orange"
                  />
                )}
                {(!patient.vaccinations || patient.vaccinations.length === 0) && (
                  <AlertCard
                    title="واکسیناسیون"
                    description="نیاز به تکمیل واکسیناسیون"
                    icon="💉"
                    color="blue"
                  />
                )}
                {(patient.foodAllergies && patient.foodAllergies.length > 0) && (
                  <AlertCard
                    title="آلرژی غذایی"
                    description={`${patient.foodAllergies.length} مورد آلرژی غذایی ثبت شده`}
                    icon="🍽️"
                    color="amber"
                  />
                )}
                {bmi && parseFloat(bmi) >= 30 && (
                  <AlertCard
                    title="اضافه وزن"
                    description="نیاز به مشاوره تغذیه و کاهش وزن"
                    icon="⚖️"
                    color="red"
                  />
                )}
                {(patient.drugAllergies && patient.drugAllergies.length > 0) && (
                  <AlertCard
                    title="آلرژی دارویی"
                    description="توجه ویژه در تجویز داروها"
                    icon="💊"
                    color="red"
                  />
                )}
                {patient.medicationHistory && patient.medicationHistory.some(med => med.status === 'در حال مصرف') && (
                  <AlertCard
                    title="داروهای فعال"
                    description={`${patient.medicationHistory.filter(med => med.status === 'در حال مصرف').length} داروی فعال`}
                    icon="💊"
                    color="green"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* مودال تایید حذف */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-8">
            <div className="text-center mb-4 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6">
                <FiTrash2 className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">حذف پرونده بیمار</h3>
              <p className="text-gray-600 text-sm md:text-base mb-1 md:mb-2">
                آیا از حذف پرونده <span className="font-bold text-red-600">{patient.fullName}</span> اطمینان دارید؟
              </p>
              <p className="text-xs md:text-sm text-gray-500">این عمل قابل بازگشت نیست.</p>
            </div>
            
            <div className="flex gap-2 md:gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 md:py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition font-medium text-sm md:text-base"
              >
                لغو
              </button>
              <button
                onClick={handleDeletePatient}
                className="flex-1 py-2 md:py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition font-medium shadow-lg text-sm md:text-base"
              >
                حذف پرونده
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال پرینت */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-8">
            <div className="text-center mb-4 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6">
                <FiPrinter className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">آماده‌سازی پرینت</h3>
              <p className="text-gray-600 text-sm md:text-base mb-1 md:mb-2">
                {printContent?.tests ? 
                  'آیا مایلید گزارش کامل آزمایشات چاپ شود؟' : 
                  'آیا مایلید این آزمایش چاپ شود؟'
                }
              </p>
              <p className="text-xs md:text-sm text-gray-500">گزارش در پنجره جدید باز خواهد شد</p>
            </div>
            
            <div className="flex gap-2 md:gap-4">
              <button
                onClick={() => setShowPrintModal(false)}
                className="flex-1 py-2 md:py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition font-medium text-sm md:text-base"
              >
                لغو
              </button>
              <button
                onClick={handlePrintConfirm}
                className="flex-1 py-2 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium shadow-lg text-sm md:text-base"
              >
                تایید و چاپ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* اطلاع‌رسانی */}
      {showNotification && (
        <div className={`fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:w-96 rounded-xl shadow-xl p-4 md:p-6 transform transition-all duration-300 z-50 ${
          notification.type === 'success' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
        }`}>
          <div className="flex items-center gap-3 md:gap-4">
            <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
              notification.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {notification.type === 'success' ? <FiCheck className="w-4 h-4 md:w-6 md:h-6" /> : <FiX className="w-4 h-4 md:w-6 md:h-6" />}
            </div>
            <div className="flex-1">
              <p className={`font-medium text-sm md:text-base ${
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