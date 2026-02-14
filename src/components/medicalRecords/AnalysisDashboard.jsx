import React, { useState, useEffect } from 'react';
import {
  FiTrendingUp,
  FiPieChart,
  FiBarChart2,
  FiFilter,
  FiDownload,
  FiEye,
  FiUsers,
  FiActivity,
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiHeart,
  FiThermometer,
  FiDroplet
} from 'react-icons/fi';

// لیست تشخیص‌های کلیوی
const NEPHROLOGY_DIAGNOSES = [
  { id: 1, code: 'HUS', name: 'سندروم همولیتیک اورمیک (HUS)', category: 'گلومرولوپاتی', color: 'red' },
  { id: 2, code: 'NS', name: 'سندروم نفروتیک', category: 'گلومرولوپاتی', color: 'orange' },
  { id: 3, code: 'AGN', name: 'گلومرولونفریت حاد', category: 'گلومرولوپاتی', color: 'yellow' },
  { id: 4, code: 'CKD', name: 'بیماری مزمن کلیوی', category: 'نارسایی کلیه', color: 'blue' },
  { id: 5, code: 'UTI', name: 'عفونت ادراری', category: 'عفونت‌ها', color: 'green' },
  { id: 6, code: 'VUR', name: 'ریفلاکس وزیکورترال', category: 'ناهنجاری‌های ساختاری', color: 'purple' },
  { id: 7, code: 'PKD', name: 'کیست کلیه پلی‌سیستیک', category: 'ناهنجاری‌های ساختاری', color: 'pink' },
  { id: 8, code: 'HTN', name: 'فشار خون کلیوی', category: 'عوارض کلیوی', color: 'indigo' },
  { id: 9, code: 'DIAB_NEPH', name: 'نفروپاتی دیابتی', category: 'بیماری‌های سیستمیک', color: 'teal' },
  { id: 10, code: 'LUPUS_NEPH', name: 'نفریت لوپوسی', category: 'بیماری‌های سیستمیک', color: 'cyan' }
];

// تابع بررسی غیرنرمال بودن آزمایش - بهبود یافته
const isAbnormalTest = (result, normalRange) => {
  if (!result || !normalRange) return false;
  
  console.log('Checking test:', { result, normalRange });
  
  // اگر نتیجه خالی باشد
  if (result === '' || result === null || result === undefined) return false;
  
  // اگر normalRange خالی باشد
  if (normalRange === '' || normalRange === null || normalRange === undefined) return false;
  
  try {
    // بررسی اگر نتیجه حاوی کاراکترهای غیر عددی باشد (مانند 3+)
    if (result.includes('+') || result.includes('-') || result.includes('منفی')) {
      return result !== normalRange;
    }
    
    const numResult = parseFloat(result.toString().replace(',', ''));
    
    // بررسی اگر normalRange شامل - باشد
    if (normalRange.includes('-')) {
      const rangeParts = normalRange.split('-').map(p => parseFloat(p.toString().trim().replace(',', '')));
      
      if (rangeParts.length === 2 && !isNaN(rangeParts[0]) && !isNaN(rangeParts[1])) {
        const isAbnormal = numResult < rangeParts[0] || numResult > rangeParts[1];
        console.log('Range check:', { numResult, min: rangeParts[0], max: rangeParts[1], isAbnormal });
        return isAbnormal;
      }
    }
    
    // اگر normalRange عدد واحد باشد
    const singleRange = parseFloat(normalRange.toString().replace(',', ''));
    if (!isNaN(singleRange)) {
      const isAbnormal = numResult !== singleRange;
      console.log('Single value check:', { numResult, singleRange, isAbnormal });
      return isAbnormal;
    }
    
    return false;
  } catch (error) {
    console.error('Error in isAbnormalTest:', error);
    return false;
  }
};

const AnalysisDashboard = ({ patients = [] }) => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [showChart, setShowChart] = useState('distribution');
  const [isLoading, setIsLoading] = useState(false);

  // فیلتر بیماران بر اساس تشخیص - بهبود یافته
  useEffect(() => {
    if (!selectedDiagnosis) {
      setFilteredPatients([]);
      setAnalysisData(null);
      return;
    }

    setIsLoading(true);
    
    const filtered = patients.filter(patient => {
      const selectedDiag = NEPHROLOGY_DIAGNOSES.find(diag => diag.code === selectedDiagnosis);
      if (!selectedDiag) return false;
      
      // جستجوی تشخیص در فیلد diagnosis - بهبود یافته
      const patientDiagnosis = patient.diagnosis || '';
      return patientDiagnosis.toLowerCase().includes(selectedDiag.name.toLowerCase()) ||
             patientDiagnosis.toLowerCase().includes(selectedDiag.code.toLowerCase()) ||
             patientDiagnosis.toLowerCase().includes(selectedDiag.category.toLowerCase());
    });
    
    console.log('Filtered patients:', filtered);
    setFilteredPatients(filtered);
    generateAnalysisData(filtered);
    
    setTimeout(() => setIsLoading(false), 500);
  }, [patients, selectedDiagnosis, timeRange]);

  // تولید داده‌های تحلیلی - بهبود یافته
  const generateAnalysisData = (patientList) => {
    console.log('Generating analysis for:', patientList.length, 'patients');
    
    if (patientList.length === 0) {
      console.log('No patients found for analysis');
      setAnalysisData(null);
      return;
    }

    const diagnosisInfo = NEPHROLOGY_DIAGNOSES.find(d => d.code === selectedDiagnosis);
    
    // جمع‌آوری داده‌های آماری
    const stats = {
      totalPatients: patientList.length,
      genderDistribution: {
        male: patientList.filter(p => p.gender === 'مرد').length,
        female: patientList.filter(p => p.gender === 'زن').length
      },
      ageDistribution: {
        under5: patientList.filter(p => parseInt(p.age || 0) <= 5).length,
        '6-12': patientList.filter(p => parseInt(p.age || 0) >= 6 && parseInt(p.age || 0) <= 12).length,
        '13-18': patientList.filter(p => parseInt(p.age || 0) >= 13 && parseInt(p.age || 0) <= 18).length,
        over18: patientList.filter(p => parseInt(p.age || 0) > 18).length
      },
      // آمار آزمایشات - بهبود یافته
      labStats: {
        totalTests: patientList.reduce((sum, p) => sum + (p.labTests?.length || 0), 0),
        abnormalCreatinine: patientList.filter(p => {
          const tests = p.labTests || [];
          return tests.some(test => 
            test.testName && test.testName.includes('کراتینین') && 
            isAbnormalTest(test.result, test.normalRange)
          );
        }).length,
        abnormalBUN: patientList.filter(p => {
          const tests = p.labTests || [];
          return tests.some(test => 
            test.testName && test.testName.includes('BUN') && 
            isAbnormalTest(test.result, test.normalRange)
          );
        }).length,
        abnormalProteinuria: patientList.filter(p => {
          const tests = p.labTests || [];
          return tests.some(test => 
            test.testName && (test.testName.includes('پروتئین') || test.testName.includes('پروتئینوری')) && 
            isAbnormalTest(test.result, test.normalRange)
          );
        }).length,
        abnormalHematuria: patientList.filter(p => {
          const tests = p.labTests || [];
          return tests.some(test => 
            test.testName && test.testName.includes('هماتوری') && 
            isAbnormalTest(test.result, test.normalRange)
          );
        }).length
      },
      // آمار دارویی - بهبود یافته
      medicationStats: {
        activeMeds: patientList.reduce((count, p) => {
          const meds = p.medicationHistory || [];
          return count + meds.filter(m => m.status === 'در حال مصرف').length;
        }, 0),
        commonMeds: getCommonMedications(patientList)
      },
      // آمار کلی - بهبود یافته
      overview: {
        avgAge: patientList.length > 0 
          ? Math.round(patientList.reduce((sum, p) => sum + (parseInt(p.age || 0) || 0), 0) / patientList.length)
          : 0,
        mostCommonBloodType: getMostCommonBloodType(patientList),
        avgLabTests: patientList.length > 0
          ? Math.round(patientList.reduce((sum, p) => sum + (p.labTests?.length || 0), 0) / patientList.length)
          : 0
      }
    };

    console.log('Generated stats:', stats);
    
    setAnalysisData({
      diagnosis: diagnosisInfo,
      stats,
      patients: patientList
    });
  };

  // تشخیص داروهای رایج
  const getCommonMedications = (patients) => {
    const medCounts = {};
    
    patients.forEach(patient => {
      const meds = patient.medicationHistory || [];
      meds.forEach(med => {
        if (med.medicationName) {
          const medName = med.medicationName.trim();
          medCounts[medName] = (medCounts[medName] || 0) + 1;
        }
      });
    });
    
    const commonMeds = Object.entries(medCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    
    console.log('Common meds:', commonMeds);
    return commonMeds;
  };

  // تشخیص گروه خونی رایج
  const getMostCommonBloodType = (patients) => {
    const bloodTypeCounts = {};
    
    patients.forEach(patient => {
      if (patient.bloodType) {
        bloodTypeCounts[patient.bloodType] = (bloodTypeCounts[patient.bloodType] || 0) + 1;
      }
    });
    
    const mostCommon = Object.entries(bloodTypeCounts)
      .sort((a, b) => b[1] - a[1])[0];
    
    const result = mostCommon ? { type: mostCommon[0], count: mostCommon[1] } : null;
    console.log('Most common blood type:', result);
    return result;
  };

  // تولید و دانلود گزارش CSV
  const exportToCSV = () => {
    if (!analysisData) return;

    const csvContent = [
      'گزارش تحلیل تشخیصی,' + analysisData.diagnosis.name,
      'تعداد بیماران,' + analysisData.stats.totalPatients,
      'تاریخ گزارش,' + new Date().toLocaleDateString('fa-IR'),
      '',
      'مشخصات آماری بیماران',
      'توزیع جنسیت',
      'مرد,' + analysisData.stats.genderDistribution.male,
      'زن,' + analysisData.stats.genderDistribution.female,
      '',
      'توزیع سنی',
      'زیر ۵ سال,' + analysisData.stats.ageDistribution.under5,
      '۶-۱۲ سال,' + analysisData.stats.ageDistribution['6-12'],
      '۱۳-۱۸ سال,' + analysisData.stats.ageDistribution['13-18'],
      'بالای ۱۸ سال,' + analysisData.stats.ageDistribution.over18,
      '',
      'آزمایشات',
      'تعداد کل آزمایشات,' + analysisData.stats.labStats.totalTests,
      'کراتینین غیرنرمال,' + analysisData.stats.labStats.abnormalCreatinine,
      'BUN غیرنرمال,' + analysisData.stats.labStats.abnormalBUN,
      'پروتئینوری,' + analysisData.stats.labStats.abnormalProteinuria,
      'هماتوری,' + analysisData.stats.labStats.abnormalHematuria,
      '',
      'داروها',
      'داروهای فعال,' + analysisData.stats.medicationStats.activeMeds,
      '',
      'لیست بیماران',
      'نام بیمار,سن,جنسیت,شماره پرونده,گروه خونی,تشخیص,تعداد آزمایشات,تاریخ آخرین ویزیت',
      ...analysisData.patients.map(patient => 
        `"${patient.fullName}",${patient.age},${patient.gender},${patient.medicalRecordNumber},"${patient.bloodType || '---'}","${patient.diagnosis || '---'}",${patient.labTests?.length || 0},"${patient.lastVisit || '---'}"`
      )
    ].join('\n');

    // ایجاد Blob و دانلود فایل
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis_${selectedDiagnosis}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // محاسبه درصد
  const calculatePercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  // افزودن کانسل کردن تحلیل
  const handleCancelAnalysis = () => {
    setSelectedDiagnosis('');
    setAnalysisData(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100">
            <FiTrendingUp className="text-purple-600 w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800">تحلیل آماری بیماران</h3>
            <p className="text-gray-600 text-sm">آنالیز بیماران بر اساس تشخیص‌های کلیوی</p>
          </div>
        </div>
        
        {analysisData && (
          <div className="flex gap-2">
            <button
              onClick={handleCancelAnalysis}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition text-sm"
            >
              <FiDownload className="w-4 h-4 rotate-45" />
              لغو تحلیل
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm"
            >
              <FiDownload className="w-4 h-4" />
              خروجی CSV
            </button>
          </div>
        )}
      </div>

      {/* فیلترها */}
      <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              انتخاب تشخیص برای تحلیل
            </label>
            <select
              value={selectedDiagnosis}
              onChange={(e) => setSelectedDiagnosis(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="">انتخاب تشخیص...</option>
              {NEPHROLOGY_DIAGNOSES.map(diagnosis => (
                <option key={diagnosis.id} value={diagnosis.code}>
                  {diagnosis.name} ({diagnosis.category})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              محدوده زمانی
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="all">همه زمان‌ها</option>
              <option value="month">۱ ماه گذشته</option>
              <option value="3months">۳ ماه گذشته</option>
              <option value="year">۱ سال گذشته</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع نمودار
            </label>
            <select
              value={showChart}
              onChange={(e) => setShowChart(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="distribution">توزیع جنسیت</option>
              <option value="age">توزیع سنی</option>
              <option value="labs">آزمایشات</option>
              <option value="medications">داروها</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-600">
          <p>💡 نکته: برای تحلیل، ابتدا یک تشخیص انتخاب کنید. سیستم به صورت خودکار بیماران با تشخیص مشابه را پیدا می‌کند.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری تحلیل...</p>
          <p className="text-sm text-gray-500 mt-2">تعداد بیماران: {patients.length}</p>
        </div>
      ) : selectedDiagnosis && analysisData ? (
        <>
          {/* خلاصه آماری */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">تعداد بیماران</p>
                  <p className="text-2xl font-bold text-gray-800">{analysisData.stats.totalPatients}</p>
                </div>
                <FiUsers className="text-blue-600 w-8 h-8" />
              </div>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {calculatePercentage(analysisData.stats.genderDistribution.male, analysisData.stats.totalPatients)}% مرد
                </span>
                <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                  {calculatePercentage(analysisData.stats.genderDistribution.female, analysisData.stats.totalPatients)}% زن
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">میانگین سن</p>
                  <p className="text-2xl font-bold text-gray-800">{analysisData.stats.overview.avgAge} سال</p>
                </div>
                <FiCalendar className="text-green-600 w-8 h-8" />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {analysisData.stats.totalPatients} بیمار
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">آزمایشات</p>
                  <p className="text-2xl font-bold text-gray-800">{analysisData.stats.labStats.totalTests}</p>
                </div>
                <FiActivity className="text-orange-600 w-8 h-8" />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {analysisData.stats.labStats.abnormalCreatinine + analysisData.stats.labStats.abnormalBUN} غیرنرمال
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">داروهای فعال</p>
                  <p className="text-2xl font-bold text-gray-800">{analysisData.stats.medicationStats.activeMeds}</p>
                </div>
                <FiCheckCircle className="text-purple-600 w-8 h-8" />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {analysisData.stats.medicationStats.commonMeds.length} داروی پرتکرار
              </p>
            </div>
          </div>

          {/* نمودارها */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* نمودار توزیع جنسیت */}
            {showChart === 'distribution' && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-bold text-gray-800 mb-4">توزیع جنسیت</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>مرد</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{analysisData.stats.genderDistribution.male}</span>
                      <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${calculatePercentage(analysisData.stats.genderDistribution.male, analysisData.stats.totalPatients)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      <span>زن</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{analysisData.stats.genderDistribution.female}</span>
                      <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-pink-500 rounded-full"
                          style={{ width: `${calculatePercentage(analysisData.stats.genderDistribution.female, analysisData.stats.totalPatients)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* نمودار توزیع سنی */}
            {showChart === 'age' && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-bold text-gray-800 mb-4">توزیع سنی</h4>
                <div className="space-y-3">
                  {Object.entries(analysisData.stats.ageDistribution).map(([range, count]) => (
                    <div key={range} className="flex items-center justify-between">
                      <span>{range === 'under5' ? 'زیر ۵ سال' : 
                             range === '6-12' ? '۶-۱۲ سال' : 
                             range === '13-18' ? '۱۳-۱۸ سال' : 'بالای ۱۸ سال'}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-bold">{count}</span>
                        <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${calculatePercentage(count, analysisData.stats.totalPatients)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* نمودار آزمایشات */}
            {showChart === 'labs' && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-bold text-gray-800 mb-4">آزمایشات غیرنرمال</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>کراتینین غیرنرمال</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{analysisData.stats.labStats.abnormalCreatinine}</span>
                      <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${calculatePercentage(analysisData.stats.labStats.abnormalCreatinine, analysisData.stats.totalPatients)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>BUN غیرنرمال</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{analysisData.stats.labStats.abnormalBUN}</span>
                      <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${calculatePercentage(analysisData.stats.labStats.abnormalBUN, analysisData.stats.totalPatients)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>پروتئینوری</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{analysisData.stats.labStats.abnormalProteinuria}</span>
                      <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500 rounded-full"
                          style={{ width: `${calculatePercentage(analysisData.stats.labStats.abnormalProteinuria, analysisData.stats.totalPatients)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* اطلاعات تشخیص */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-4">اطلاعات تشخیص</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">نام تشخیص:</span>
                  <span className="font-bold text-purple-700">{analysisData.diagnosis.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">دسته‌بندی:</span>
                  <span className="font-medium">{analysisData.diagnosis.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">کد:</span>
                  <span className="font-mono bg-gray-200 px-2 py-1 rounded">{analysisData.diagnosis.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">میانگین آزمایشات:</span>
                  <span className="font-bold">
                    {analysisData.stats.overview.avgLabTests} آزمایش
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">گروه خونی شایع:</span>
                  <span className="font-bold">
                    {analysisData.stats.overview.mostCommonBloodType ? 
                      `${analysisData.stats.overview.mostCommonBloodType.type} (${analysisData.stats.overview.mostCommonBloodType.count} بیمار)` : 
                      '---'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* داروهای رایج */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 mb-3">داروهای پرتکرار</h4>
            {analysisData.stats.medicationStats.commonMeds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {analysisData.stats.medicationStats.commonMeds.map((med, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{med.count}</div>
                      <div className="text-sm text-gray-700 truncate">{med.name}</div>
                      <div className="text-xs text-gray-500 mt-1">بیمار</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                <p className="text-yellow-700">هیچ داده دارویی ثبت نشده است</p>
              </div>
            )}
          </div>

          {/* لیست بیماران */}
          <div className="overflow-x-auto">
            <h4 className="font-bold text-gray-800 mb-3">لیست بیماران ({analysisData.patients.length})</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-right border">نام بیمار</th>
                  <th className="p-3 text-right border">سن</th>
                  <th className="p-3 text-right border">جنسیت</th>
                  <th className="p-3 text-right border">شماره پرونده</th>
                  <th className="p-3 text-right border">تشخیص</th>
                  <th className="p-3 text-right border">آزمایشات</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.patients.slice(0, 5).map((patient, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 border">
                      <div className="font-medium">{patient.fullName}</div>
                    </td>
                    <td className="p-3 border">{patient.age} سال</td>
                    <td className="p-3 border">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        patient.gender === 'مرد' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {patient.gender}
                      </span>
                    </td>
                    <td className="p-3 border font-mono">{patient.medicalRecordNumber}</td>
                    <td className="p-3 border text-sm">{patient.diagnosis || '---'}</td>
                    <td className="p-3 border">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        (patient.labTests?.length || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.labTests?.length || 0} آزمایش
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {analysisData.patients.length > 5 && (
              <div className="text-center mt-4 text-sm text-gray-600">
                و {analysisData.patients.length - 5} بیمار دیگر...
              </div>
            )}
          </div>
        </>
      ) : selectedDiagnosis ? (
        <div className="text-center py-8">
          <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">بیماری با این تشخیص یافت نشد</p>
          <p className="text-sm text-gray-600 mt-2">مطمئن شوید که بیماران دارای تشخیص معتبر هستند</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <FiPieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">لطفا یک تشخیص برای تحلیل انتخاب کنید</p>
          <p className="text-sm text-gray-600 mt-2">ابتدا یک تشخیص از لیست بالا انتخاب نمایید</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisDashboard;