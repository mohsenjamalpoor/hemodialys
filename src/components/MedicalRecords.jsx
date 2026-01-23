import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FiSearch, 
  FiUserPlus, 
  FiFileText, 
  FiCalendar, 
  FiHash, 
  FiFolder, 
  FiMoreVertical, 
  FiUser, 
  FiPhone, 
  FiEdit, 
  FiTrash2,
  FiEye,
  FiX,
  FiCheck,
  FiArrowRight,
  FiLogOut
} from 'react-icons/fi';

// داده‌های نمونه برای بیماران با پزشک اختصاصی
const allPatients = [
  {
    id: 1,
    fullName: 'علی محمدی',
    nationalId: '0012345678',
    medicalRecordNumber: 'MR-2024-001',
    lastVisit: '1402/11/15',
    age: 35,
    gender: 'مرد',
    phone: '09123456789',
    bloodType: 'O+',
    doctorId: 'DR001', // کد پزشک
    doctorName: 'دکتر احمدی'
  },
  {
    id: 2,
    fullName: 'فاطمه کریمی',
    nationalId: '0023456789',
    medicalRecordNumber: 'MR-2024-002',
    lastVisit: '1402/11/10',
    age: 28,
    gender: 'زن',
    phone: '09129876543',
    bloodType: 'A+',
    doctorId: 'DR001',
    doctorName: 'دکتر احمدی'
  },
  {
    id: 3,
    fullName: 'رضا احمدی',
    nationalId: '0034567890',
    medicalRecordNumber: 'MR-2024-003',
    lastVisit: '1402/10/25',
    age: 45,
    gender: 'مرد',
    phone: '09351234567',
    bloodType: 'B+',
    doctorId: 'DR002',
    doctorName: 'دکتر کریمی'
  },
  {
    id: 4,
    fullName: 'سارا نوری',
    nationalId: '0045678901',
    medicalRecordNumber: 'MR-2024-004',
    lastVisit: '1402/10/20',
    age: 32,
    gender: 'زن',
    phone: '09107654321',
    bloodType: 'AB+',
    doctorId: 'DR001',
    doctorName: 'دکتر احمدی'
  },
  {
    id: 5,
    fullName: 'محمد حسینی',
    nationalId: '0056789012',
    medicalRecordNumber: 'MR-2024-005',
    lastVisit: '1402/11/05',
    age: 50,
    gender: 'مرد',
    phone: '09191234567',
    bloodType: 'A-',
    doctorId: 'DR002',
    doctorName: 'دکتر کریمی'
  },
  {
    id: 6,
    fullName: 'نازنین رضایی',
    nationalId: '0067890123',
    medicalRecordNumber: 'MR-2024-006',
    lastVisit: '1402/10/30',
    age: 29,
    gender: 'زن',
    phone: '09187654321',
    bloodType: 'O-',
    doctorId: 'DR001',
    doctorName: 'دکتر احمدی'
  }
];

export default function MedicalRecords() {
  const location = useLocation();
  const [doctorInfo, setDoctorInfo] = useState({
    name: '',
    specialty: '',
    code: '',
    doctorId: ''
  });
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit', 'view', 'delete'
  const [newPatient, setNewPatient] = useState({
    fullName: '',
    nationalId: '',
    medicalRecordNumber: '',
    age: '',
    gender: '',
    phone: '',
    bloodType: '',
    lastVisit: new Date().toLocaleDateString('fa-IR'),
    doctorId: '',
    doctorName: ''
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // خواندن اطلاعات پزشک از localStorage
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

    // فیلتر کردن بیماران بر اساس پزشک وارد شده
    const doctorPatients = allPatients.filter(patient => 
      patient.doctorId === savedDoctorId
    );
    
    setPatients(doctorPatients);
    setFilteredPatients(doctorPatients);
  }, []);

  // فیلتر بیماران بر اساس جستجو
  useEffect(() => {
    const filtered = patients.filter(patient => 
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.nationalId.includes(searchTerm) ||
      patient.medicalRecordNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  // مدیریت منو
  const toggleDropdown = (patientId) => {
    setDropdownOpen(dropdownOpen === patientId ? null : patientId);
  };

  // باز کردن مودال
  const openModal = (type, patient = null) => {
    setModalType(type);
    setSelectedPatient(patient);
    
    if (type === 'edit' && patient) {
      setNewPatient(patient);
    } else if (type === 'add') {
      const nextRecordNumber = patients.length + 1;
      setNewPatient({
        fullName: '',
        nationalId: '',
        medicalRecordNumber: `MR-${new Date().getFullYear()}-${String(nextRecordNumber).padStart(3, '0')}`,
        age: '',
        gender: '',
        phone: '',
        bloodType: '',
        lastVisit: new Date().toLocaleDateString('fa-IR'),
        doctorId: doctorInfo.doctorId,
        doctorName: doctorInfo.name
      });
    } else if (type === 'view' && patient) {
      setNewPatient(patient);
    }
    setShowModal(true);
    setDropdownOpen(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewPatient({
      fullName: '',
      nationalId: '',
      medicalRecordNumber: '',
      age: '',
      gender: '',
      phone: '',
      bloodType: '',
      lastVisit: new Date().toLocaleDateString('fa-IR'),
      doctorId: doctorInfo.doctorId,
      doctorName: doctorInfo.name
    });
  };

  // مدیریت تغییرات فرم
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // نمایش اطلاع‌رسانی
  const showNotificationMessage = (message, type = 'success') => {
    setNotification({ message, type });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // اضافه کردن بیمار جدید
  const handleAddPatient = () => {
    const newPatientObj = {
      ...newPatient,
      id: allPatients.length + 1,
      doctorId: doctorInfo.doctorId,
      doctorName: doctorInfo.name
    };
    
    // در واقعیت اینجا باید به API ارسال شود
    setPatients(prev => [...prev, newPatientObj]);
    showNotificationMessage('بیمار جدید با موفقیت اضافه شد', 'success');
    closeModal();
  };

  // ویرایش بیمار
  const handleEditPatient = () => {
    const updatedPatients = patients.map(patient => 
      patient.id === selectedPatient.id ? { ...newPatient, id: patient.id } : patient
    );
    
    setPatients(updatedPatients);
    showNotificationMessage('اطلاعات بیمار با موفقیت ویرایش شد', 'success');
    closeModal();
  };

  // حذف بیمار
  const handleDeletePatient = () => {
    const filtered = patients.filter(patient => patient.id !== selectedPatient.id);
    setPatients(filtered);
    showNotificationMessage('بیمار با موفقیت حذف شد', 'success');
    closeModal();
  };

  // بازگشت به صفحه اصلی
  const handleBackToHome = () => {
    window.location.href = '/hemo';
  };

  // خروج از سیستم
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("doctorName");
    localStorage.removeItem("doctorSpecialty");
    localStorage.removeItem("doctorCode");
    localStorage.removeItem("doctorId");
    window.location.href = "/login";
  };

  // رندر آواتار با حرف اول نام
  const renderAvatar = (name) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    return (
      <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
        {name.charAt(0)}
      </div>
    );
  };

  // رندر گزینه‌های گروه خونی
  const bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // تاریخ شمسی
  const getPersianDate = () => {
    const date = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      calendar: "persian"
    };
    return date.toLocaleDateString("fa-IR", options);
  };

  // زمان فعلی
  const [currentTime, setCurrentTime] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* هدر ثابت */}
      <div className="sticky top-0 z-40 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
              >
                <FiArrowRight className="rotate-180" />
                <span>بازگشت به صفحه اصلی</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FiUser className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{doctorInfo.specialty}</p>
                  <p className="font-bold text-blue-700">{doctorInfo.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <FiHash className="text-gray-400 text-xs" />
                    <p className="text-xs text-gray-500 font-mono">{doctorInfo.code}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <FiCalendar className="text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-gray-800">{currentTime}</p>
                  <p className="text-xs text-gray-500">{getPersianDate()}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition duration-300"
              >
                <FiLogOut />
                خروج از سیستم
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div className="max-w-7xl mx-auto p-4">
        {/* هدر بخش پرونده‌ها */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <FiFileText size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">مدیریت پرونده‌های پزشکی</h1>
                <p className="text-blue-100 mt-2">شما در حال مشاهده پرونده‌های بیماران خود هستید</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <p className="text-blue-200 text-sm">تعداد بیماران شما</p>
                  <p className="font-bold text-3xl">{patients.length}</p>
                </div>
                <div className="h-12 w-px bg-white bg-opacity-30"></div>
                <div className="text-center">
                  <p className="text-blue-200 text-sm">آخرین ویزیت</p>
                  <p className="font-bold text-lg">
                    {patients.length > 0 
                      ? patients.reduce((latest, patient) => 
                          patient.lastVisit > latest ? patient.lastVisit : latest, '') 
                      : '---'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* نوار جستجو و اقدامات */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-right"
                  placeholder="جستجو بر اساس نام، کد ملی یا شماره پرونده..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => openModal('add')}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                <FiUserPlus className="w-5 h-5" />
                افزودن بیمار جدید
              </button>
              
              <div className="hidden md:block text-sm text-gray-600">
                <p>کد پزشک: <span className="font-mono font-bold text-blue-600">{doctorInfo.code}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* لیست بیماران */}
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-50 p-6 rounded-full inline-block mb-6">
                <FiFileText className="w-16 h-16 text-blue-400 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-3">پرونده‌ای یافت نشد</h3>
              <p className="text-gray-600 mb-8">
                {searchTerm 
                  ? 'هیچ پرونده‌ای مطابق با جستجوی شما یافت نشد.'
                  : 'شما هنوز هیچ پرونده‌ای ندارید. بیمار جدید اضافه کنید.'}
              </p>
              <button
                onClick={() => openModal('add')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
              >
                <FiUserPlus />
                افزودن اولین بیمار
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 overflow-hidden border border-gray-200">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {renderAvatar(patient.fullName)}
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{patient.fullName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">{patient.age} سال</span>
                          <span className="text-gray-400">•</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            patient.gender === 'مرد' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                          }`}>
                            {patient.gender}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(patient.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <FiMoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                      
                      {dropdownOpen === patient.id && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={() => openModal('view', patient)}
                            className="w-full text-right px-4 py-3 hover:bg-gray-50 flex items-center gap-2 justify-end"
                          >
                            <FiEye className="w-4 h-4" />
                            مشاهده جزئیات
                          </button>
                          <button
                            onClick={() => openModal('edit', patient)}
                            className="w-full text-right px-4 py-3 hover:bg-gray-50 flex items-center gap-2 justify-end"
                          >
                            <FiEdit className="w-4 h-4" />
                            ویرایش اطلاعات
                          </button>
                          <button
                            onClick={() => openModal('delete', patient)}
                            className="w-full text-right px-4 py-3 hover:bg-gray-50 text-red-600 flex items-center gap-2 justify-end"
                          >
                            <FiTrash2 className="w-4 h-4" />
                            حذف بیمار
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* اطلاعات بیمار */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <FiFolder className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        <strong>شماره پرونده:</strong> 
                        <span className="font-mono mr-2">{patient.medicalRecordNumber}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FiHash className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        <strong>کد ملی:</strong> 
                        <span className="font-mono mr-2">{patient.nationalId}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        <strong>آخرین ویزیت:</strong> 
                        <span className="mr-2">{patient.lastVisit}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FiPhone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        <strong>تلفن:</strong> 
                        <span className="font-mono mr-2">{patient.phone}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <span className="text-xs">🩸</span>
                      </div>
                      <span className="text-gray-700">
                        <strong>گروه خونی:</strong> 
                        <span className={`mr-2 px-2 py-1 rounded-full text-xs font-medium ${
                          patient.bloodType.includes('+') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {patient.bloodType}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal('view', patient)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                    >
                      <FiEye className="w-4 h-4" />
                      مشاهده پرونده کامل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* مودال‌ها */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* هدر مودال */}
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  {modalType === 'add' ? 'افزودن بیمار جدید' : 
                   modalType === 'edit' ? 'ویرایش اطلاعات بیمار' : 
                   modalType === 'view' ? 'مشاهده پرونده بیمار' : 
                   'تایید حذف'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* محتوای مودال */}
              <div className="p-6">
                {modalType === 'delete' ? (
                  <div>
                    <p className="text-gray-700 mb-6">
                      آیا از حذف بیمار <strong>{selectedPatient?.fullName}</strong> با شماره پرونده <strong>{selectedPatient?.medicalRecordNumber}</strong> اطمینان دارید؟
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={closeModal}
                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition"
                      >
                        لغو
                      </button>
                      <button
                        onClick={handleDeletePatient}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                      >
                        حذف بیمار
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        نام و نام خانوادگی
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={newPatient.fullName}
                        onChange={handleInputChange}
                        disabled={modalType === 'view'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 text-right"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        کد ملی
                      </label>
                      <input
                        type="text"
                        name="nationalId"
                        value={newPatient.nationalId}
                        onChange={handleInputChange}
                        disabled={modalType === 'view'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 text-right"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        شماره پرونده
                      </label>
                      <input
                        type="text"
                        name="medicalRecordNumber"
                        value={newPatient.medicalRecordNumber}
                        onChange={handleInputChange}
                        disabled={modalType === 'view'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 text-right"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          سن
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={newPatient.age}
                          onChange={handleInputChange}
                          disabled={modalType === 'view'}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 text-right"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          جنسیت
                        </label>
                        <select
                          name="gender"
                          value={newPatient.gender}
                          onChange={handleInputChange}
                          disabled={modalType === 'view'}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 text-right"
                        >
                          <option value="">انتخاب کنید</option>
                          <option value="مرد">مرد</option>
                          <option value="زن">زن</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        شماره تماس
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={newPatient.phone}
                        onChange={handleInputChange}
                        disabled={modalType === 'view'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 text-right"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        گروه خونی
                      </label>
                      <select
                        name="bloodType"
                        value={newPatient.bloodType}
                        onChange={handleInputChange}
                        disabled={modalType === 'view'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 text-right"
                      >
                        <option value="">انتخاب کنید</option>
                        {bloodTypeOptions.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        آخرین ویزیت
                      </label>
                      <input
                        type="text"
                        name="lastVisit"
                        value={newPatient.lastVisit}
                        onChange={handleInputChange}
                        disabled={modalType === 'view'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 text-right"
                      />
                    </div>
                    
                    {/* نمایش پزشک معالج فقط در حالت مشاهده */}
                    {modalType === 'view' && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 mb-1">پزشک معالج:</p>
                        <p className="font-bold text-blue-700">{newPatient.doctorName}</p>
                        <p className="text-xs text-gray-600 mt-1">کد پزشک: {newPatient.doctorId}</p>
                      </div>
                    )}
                    
                    {modalType !== 'view' && (
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={closeModal}
                          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition"
                        >
                          لغو
                        </button>
                        <button
                          onClick={modalType === 'add' ? handleAddPatient : handleEditPatient}
                          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <FiCheck className="w-5 h-5" />
                          {modalType === 'add' ? 'افزودن' : 'ذخیره تغییرات'}
                        </button>
                      </div>
                    )}
                    
                    {modalType === 'view' && (
                      <button
                        onClick={closeModal}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition mt-4"
                      >
                        بستن
                      </button>
                    )}
                  </div>
                )}
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
              <button
                onClick={() => setShowNotification(false)}
                className="p-1 hover:opacity-70 transition"
              >
                <FiX className={`w-4 h-4 ${
                  notification.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}