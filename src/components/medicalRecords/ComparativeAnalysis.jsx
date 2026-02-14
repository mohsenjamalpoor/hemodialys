// ComparativeAnalysis.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiActivity,
  FiBarChart2,
  FiHash,
  FiTag,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiFilter,
  FiPieChart,
  FiHeart,
  FiThermometer,
  FiDroplet,
  FiAlertCircle,
  FiClipboard,
  FiCalendar,
  FiClock,
  FiUser,
  FiX
} from 'react-icons/fi';

const ComparativeAnalysis = ({ patients, currentPatient = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('');
  const [analysisType, setAnalysisType] = useState('all'); // 'all', 'current', 'similar'
  const [expandedSections, setExpandedSections] = useState({
    vitalSigns: false,
    allergies: false,
    medicalHistory: false,
    labTests: false,
    medications: false,
    familyHistory: false
  });

 // استخراج تمام تشخیص‌های موجود - بهبود یافته
const allDiagnoses = React.useMemo(() => {
  const diagnoses = new Set();
  patients.forEach(patient => {
    if (patient.diagnosis && patient.diagnosis.trim() !== '') {
      // حذف فاصله‌های اضافی و نرمالایز کردن
      let diagnosis = patient.diagnosis.trim();
      
      // استخراج تشخیص اصلی (قبل از خط تیره، پرانتز، اسلش و ...)
      const separators = /[-–—\/\\\(\)\[\]]/;
      const mainDiagnosis = diagnosis.split(separators)[0].trim();
      
      // اضافه کردن هر دو حالت (اصلی و کامل) برای جستجوی بهتر
      diagnoses.add(mainDiagnosis);
      
      // اگر تشخیص اصلی با تشخیص کامل متفاوت بود، تشخیص کامل هم اضافه کن
      if (mainDiagnosis !== diagnosis) {
        // از تشخیص کامل فقط قسمت‌های غیر تکراری رو بردار
        const fullDiagnosis = diagnosis.replace(separators, ' - ').trim();
        diagnoses.add(fullDiagnosis);
      }
    }
  });
  
  // تبدیل به آرایه و مرتب‌سازی
  return Array.from(diagnoses).sort((a, b) => a.localeCompare(b, 'fa'));
}, [patients]);

// فیلتر بیماران بر اساس تشخیص - بهبود یافته
const filteredPatients = React.useMemo(() => {
  if (!selectedDiagnosis) return [];
  
  return patients.filter(patient => {
    if (!patient.diagnosis) return false;
    
    const patientDiagnosis = patient.diagnosis.trim();
    const selected = selectedDiagnosis.trim();
    
    // بررسی تطابق دقیق
    if (patientDiagnosis === selected) return true;
    
    // بررسی اینکه تشخیص بیمار با selected شروع میشه
    if (patientDiagnosis.startsWith(selected)) return true;
    
    // بررسی اینکه selected با تشخیص بیمار شروع میشه
    if (selected.startsWith(patientDiagnosis)) return true;
    
    // بررسی بر اساس کلمات کلیدی (برای مواردی مثل "HUS" و "Hemolytic Uremic Syndrome")
    const patientWords = patientDiagnosis.split(/\s+/);
    const selectedWords = selected.split(/\s+/);
    
    // اگر حداقل یکی از کلمات مشترک باشه
    const commonWords = patientWords.filter(word => 
      selectedWords.some(selectedWord => 
        word.includes(selectedWord) || selectedWord.includes(word)
      )
    );
    
    if (commonWords.length > 0) return true;
    
    // بررسی با حذف جداکننده‌ها
    const separators = /[-–—\/\\\(\)\[\]]/g;
    const patientNormalized = patientDiagnosis.replace(separators, ' ').replace(/\s+/g, ' ').trim();
    const selectedNormalized = selected.replace(separators, ' ').replace(/\s+/g, ' ').trim();
    
    if (patientNormalized.includes(selectedNormalized) || selectedNormalized.includes(patientNormalized)) {
      return true;
    }
    
    return false;
  });
}, [patients, selectedDiagnosis]);

  // آمار کلی برای تشخیص انتخاب شده
  const diagnosisStats = useMemo(() => {
    if (filteredPatients.length === 0) return null;

    const stats = {
      total: filteredPatients.length,
      gender: { مرد: 0, زن: 0 },
      ageGroups: { '0-18': 0, '19-30': 0, '31-50': 0, '51-70': 0, '70+': 0 },
      bloodTypes: {},
      commonSymptoms: {},
      commonMedications: {},
      labTestPatterns: {},
      allergies: { food: 0, drug: 0 },
      vitalSigns: {
        systolic: [],
        diastolic: [],
        pulse: [],
        temperature: []
      }
    };

    filteredPatients.forEach(patient => {
      // جنسیت
      if (patient.gender) stats.gender[patient.gender]++;

      // گروه‌های سنی
      if (patient.age) {
        const age = parseInt(patient.age);
        if (age <= 18) stats.ageGroups['0-18']++;
        else if (age <= 30) stats.ageGroups['19-30']++;
        else if (age <= 50) stats.ageGroups['31-50']++;
        else if (age <= 70) stats.ageGroups['51-70']++;
        else stats.ageGroups['70+']++;
      }

      // گروه خونی
      if (patient.bloodType) {
        stats.bloodTypes[patient.bloodType] = (stats.bloodTypes[patient.bloodType] || 0) + 1;
      }

      // آلرژی‌ها
      if (patient.foodAllergies?.length > 0) stats.allergies.food += patient.foodAllergies.length;
      if (patient.drugAllergies?.length > 0) stats.allergies.drug += patient.drugAllergies.length;

      // علائم حیاتی (میانگین)
      if (patient.vitalSigns?.length > 0) {
        const latestVitals = patient.vitalSigns[patient.vitalSigns.length - 1];
        if (latestVitals.bloodPressure) {
          const [systolic, diastolic] = latestVitals.bloodPressure.split('/').map(Number);
          if (!isNaN(systolic)) stats.vitalSigns.systolic.push(systolic);
          if (!isNaN(diastolic)) stats.vitalSigns.diastolic.push(diastolic);
        }
        if (latestVitals.pulse) stats.vitalSigns.pulse.push(Number(latestVitals.pulse));
        if (latestVitals.temperature) stats.vitalSigns.temperature.push(Number(latestVitals.temperature));
      }

      // سوابق پزشکی (علائم شایع)
      if (patient.medicalHistory?.length > 0) {
        patient.medicalHistory.forEach(item => {
          stats.commonSymptoms[item.text] = (stats.commonSymptoms[item.text] || 0) + 1;
        });
      }

      // داروهای شایع
      if (patient.medicationHistory?.length > 0) {
        patient.medicationHistory.forEach(med => {
          const key = `${med.medicationName} (${med.dosage || 'نامشخص'})`;
          stats.commonMedications[key] = (stats.commonMedications[key] || 0) + 1;
        });
      }

      // الگوهای آزمایشگاهی
      if (patient.labTests?.length > 0) {
        patient.labTests.forEach(test => {
          if (!stats.labTestPatterns[test.testName]) {
            stats.labTestPatterns[test.testName] = {
              count: 0,
              abnormalCount: 0,
              values: []
            };
          }
          stats.labTestPatterns[test.testName].count++;
          
          // بررسی غیرنرمال بودن
          if (test.result && test.normalRange) {
            try {
              const result = parseFloat(test.result);
              const range = test.normalRange.split('-');
              const min = parseFloat(range[0]);
              const max = parseFloat(range[1]);
              if (result < min || result > max) {
                stats.labTestPatterns[test.testName].abnormalCount++;
              }
              stats.labTestPatterns[test.testName].values.push(result);
            } catch {}
          }
        });
      }
    });

    // محاسبه میانگین‌ها
    if (stats.vitalSigns.systolic.length > 0) {
      stats.vitalSigns.systolicAvg = (stats.vitalSigns.systolic.reduce((a, b) => a + b, 0) / stats.vitalSigns.systolic.length).toFixed(0);
    }
    if (stats.vitalSigns.diastolic.length > 0) {
      stats.vitalSigns.diastolicAvg = (stats.vitalSigns.diastolic.reduce((a, b) => a + b, 0) / stats.vitalSigns.diastolic.length).toFixed(0);
    }
    if (stats.vitalSigns.pulse.length > 0) {
      stats.vitalSigns.pulseAvg = (stats.vitalSigns.pulse.reduce((a, b) => a + b, 0) / stats.vitalSigns.pulse.length).toFixed(0);
    }
    if (stats.vitalSigns.temperature.length > 0) {
      stats.vitalSigns.temperatureAvg = (stats.vitalSigns.temperature.reduce((a, b) => a + b, 0) / stats.vitalSigns.temperature.length).toFixed(1);
    }

    return stats;
  }, [filteredPatients]);

  // پیدا کردن الگوهای مشترک بین بیمار فعلی و بیماران مشابه
  const findSimilarPatterns = useMemo(() => {
    if (!currentPatient || filteredPatients.length <= 1) return null;

    const patterns = {
      commonSymptoms: [],
      commonMedications: [],
      commonAllergies: [],
      commonLabAbnormalities: [],
      ageRange: '',
      genderPredominance: ''
    };

    // علائم مشترک
    if (currentPatient.medicalHistory?.length > 0) {
      const currentSymptoms = new Set(currentPatient.medicalHistory.map(s => s.text));
      const allSymptoms = {};
      
      filteredPatients.forEach(patient => {
        if (patient.id === currentPatient.id) return;
        patient.medicalHistory?.forEach(symptom => {
          allSymptoms[symptom.text] = (allSymptoms[symptom.text] || 0) + 1;
        });
      });

      patterns.commonSymptoms = Object.entries(allSymptoms)
        .filter(([symptom, count]) => currentSymptoms.has(symptom) && count > 0)
        .map(([symptom, count]) => ({ symptom, count: count + 1 })) // +1 برای بیمار فعلی
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }

    // داروهای مشترک
    if (currentPatient.medicationHistory?.length > 0) {
      const currentMeds = new Set(currentPatient.medicationHistory.map(m => m.medicationName));
      const allMeds = {};

      filteredPatients.forEach(patient => {
        if (patient.id === currentPatient.id) return;
        patient.medicationHistory?.forEach(med => {
          const key = med.medicationName;
          allMeds[key] = (allMeds[key] || 0) + 1;
        });
      });

      patterns.commonMedications = Object.entries(allMeds)
        .filter(([med, count]) => currentMeds.has(med) && count > 0)
        .map(([med, count]) => ({ medication: med, count: count + 1 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }

    // آلرژی‌های مشترک
    const currentAllergies = {
      food: new Set(currentPatient.foodAllergies?.map(a => a.text) || []),
      drug: new Set(currentPatient.drugAllergies?.map(a => a.text) || [])
    };

    const allAllergies = { food: {}, drug: {} };

    filteredPatients.forEach(patient => {
      if (patient.id === currentPatient.id) return;
      patient.foodAllergies?.forEach(allergy => {
        allAllergies.food[allergy.text] = (allAllergies.food[allergy.text] || 0) + 1;
      });
      patient.drugAllergies?.forEach(allergy => {
        allAllergies.drug[allergy.text] = (allAllergies.drug[allergy.text] || 0) + 1;
      });
    });

    patterns.commonAllergies = [
      ...Object.entries(allAllergies.food)
        .filter(([allergy, count]) => currentAllergies.food.has(allergy) && count > 0)
        .map(([allergy, count]) => ({ type: 'غذایی', item: allergy, count: count + 1 })),
      ...Object.entries(allAllergies.drug)
        .filter(([allergy, count]) => currentAllergies.drug.has(allergy) && count > 0)
        .map(([allergy, count]) => ({ type: 'دارویی', item: allergy, count: count + 1 }))
    ];

    return patterns;
  }, [currentPatient, filteredPatients]);

  // محاسبه درصدها
  const calculatePercentage = (count, total) => {
    if (!total) return 0;
    return ((count / total) * 100).toFixed(1);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden border border-purple-100">
      {/* هدر */}
      <div 
        className="p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <FiBarChart2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">تحلیل تطبیقی بیماران</h2>
              {!isOpen && selectedDiagnosis && (
                <p className="text-xs text-gray-500 mt-1">
                  {filteredPatients.length} بیمار با تشخیص {selectedDiagnosis}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isOpen && filteredPatients.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                <div className="bg-purple-100 px-2 py-1 rounded text-xs text-purple-600">
                  {filteredPatients.length} بیمار
                </div>
              </div>
            )}
            <button className="p-1 hover:bg-gray-200 rounded-full transition">
              {isOpen ? (
                <FiChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* محتوای اصلی */}
      {isOpen && (
        <div className="p-6 border-t border-gray-100">
          {/* انتخاب تشخیص */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              انتخاب تشخیص برای تحلیل
            </label>
            <div className="flex gap-3">
              <select
                value={selectedDiagnosis}
                onChange={(e) => setSelectedDiagnosis(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="">انتخاب کنید...</option>
                {allDiagnoses.map(diagnosis => (
                  <option key={diagnosis} value={diagnosis}>{diagnosis}</option>
                ))}
              </select>
              
              {currentPatient && (
                <button
                  onClick={() => setSelectedDiagnosis(currentPatient.diagnosis?.split(/[-–—]/)[0].trim() || '')}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition text-sm"
                >
                  تشخیص فعلی
                </button>
              )}
            </div>
          </div>

          {selectedDiagnosis && diagnosisStats ? (
            <div className="space-y-6">
              {/* آمار کلی */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <FiUsers className="w-6 h-6 opacity-80" />
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">تعداد بیماران</span>
                  </div>
                  <p className="text-2xl font-bold">{diagnosisStats.total}</p>
                  <p className="text-xs opacity-90 mt-1">مورد با این تشخیص</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <FiUser className="w-6 h-6 opacity-80" />
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">توزیع جنسیتی</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>مرد: {diagnosisStats.gender.مرد}</span>
                    <span>زن: {diagnosisStats.gender.زن}</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 h-1.5 rounded-full mt-2">
                    <div 
                      className="bg-white h-1.5 rounded-full"
                      style={{ width: `${(diagnosisStats.gender.مرد / diagnosisStats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <FiActivity className="w-6 h-6 opacity-80" />
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">میانگین سنی</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {Object.entries(diagnosisStats.ageGroups)
                      .reduce((acc, [group, count]) => {
                        const ageMap = {'0-18': 9, '19-30': 24.5, '31-50': 40.5, '51-70': 60.5, '70+': 75};
                        return acc + (ageMap[group] * count);
                      }, 0) / diagnosisStats.total | 0}
                  </p>
                  <p className="text-xs opacity-90 mt-1">سال</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <FiDroplet className="w-6 h-6 opacity-80" />
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">گروه خونی شایع</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {Object.entries(diagnosisStats.bloodTypes)
                      .sort((a, b) => b[1] - a[1])[0]?.[0] || '---'}
                  </p>
                  <p className="text-xs opacity-90 mt-1">
                    {Object.entries(diagnosisStats.bloodTypes)[0]?.[1] || 0} بیمار
                  </p>
                </div>
              </div>

              {/* الگوهای مشترک با بیمار فعلی */}
              {currentPatient && findSimilarPatterns && findSimilarPatterns.commonSymptoms.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FiTrendingUp className="text-blue-600" />
                    الگوهای مشترک با بیمار فعلی
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {findSimilarPatterns.commonSymptoms.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">علائم مشترک:</h4>
                        <div className="space-y-2">
                          {findSimilarPatterns.commonSymptoms.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg">
                              <span className="text-sm text-gray-600">{item.symptom}</span>
                              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                                {item.count} بیمار
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {findSimilarPatterns.commonMedications.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">داروهای مشترک:</h4>
                        <div className="space-y-2">
                          {findSimilarPatterns.commonMedications.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg">
                              <span className="text-sm text-gray-600">{item.medication}</span>
                              <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                                {item.count} بیمار
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* توزیع سنی */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiBarChart2 className="text-purple-600" />
                  توزیع سنی بیماران
                </h3>
                <div className="space-y-3">
                  {Object.entries(diagnosisStats.ageGroups).map(([group, count]) => (
                    <div key={group} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-16">{group} سال</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${calculatePercentage(count, diagnosisStats.total)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-12">{count} نفر</span>
                      <span className="text-xs text-gray-500 w-16">{calculatePercentage(count, diagnosisStats.total)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* علائم حیاتی میانگین */}
              {(diagnosisStats.vitalSigns.systolicAvg || diagnosisStats.vitalSigns.pulseAvg) && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('vitalSigns')}
                  >
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FiHeart className="text-red-500" />
                      میانگین علائم حیاتی
                    </h3>
                    {expandedSections.vitalSigns ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  
                  {expandedSections.vitalSigns && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      {diagnosisStats.vitalSigns.systolicAvg && (
                        <div className="bg-white p-3 rounded-lg text-center">
                          <p className="text-xs text-gray-500">فشار خون سیستولیک</p>
                          <p className="text-xl font-bold text-blue-600">{diagnosisStats.vitalSigns.systolicAvg}</p>
                          <p className="text-xs text-gray-400">میانگین</p>
                        </div>
                      )}
                      {diagnosisStats.vitalSigns.diastolicAvg && (
                        <div className="bg-white p-3 rounded-lg text-center">
                          <p className="text-xs text-gray-500">فشار خون دیاستولیک</p>
                          <p className="text-xl font-bold text-green-600">{diagnosisStats.vitalSigns.diastolicAvg}</p>
                          <p className="text-xs text-gray-400">میانگین</p>
                        </div>
                      )}
                      {diagnosisStats.vitalSigns.pulseAvg && (
                        <div className="bg-white p-3 rounded-lg text-center">
                          <p className="text-xs text-gray-500">ضربان قلب</p>
                          <p className="text-xl font-bold text-purple-600">{diagnosisStats.vitalSigns.pulseAvg}</p>
                          <p className="text-xs text-gray-400">ضربان در دقیقه</p>
                        </div>
                      )}
                      {diagnosisStats.vitalSigns.temperatureAvg && (
                        <div className="bg-white p-3 rounded-lg text-center">
                          <p className="text-xs text-gray-500">دما</p>
                          <p className="text-xl font-bold text-orange-600">{diagnosisStats.vitalSigns.temperatureAvg}</p>
                          <p className="text-xs text-gray-400">سانتی‌گراد</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* علائم شایع */}
              {Object.keys(diagnosisStats.commonSymptoms).length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('medicalHistory')}
                  >
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FiClipboard className="text-blue-600" />
                      علائم و سوابق شایع
                    </h3>
                    {expandedSections.medicalHistory ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  
                  {expandedSections.medicalHistory && (
                    <div className="mt-4 space-y-2">
                      {Object.entries(diagnosisStats.commonSymptoms)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 8)
                        .map(([symptom, count]) => (
                          <div key={symptom} className="flex items-center gap-3 bg-white p-2 rounded-lg">
                            <span className="flex-1 text-sm text-gray-700">{symptom}</span>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(count / diagnosisStats.total) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600 w-12">{count}</span>
                            <span className="text-xs text-gray-500 w-16">{calculatePercentage(count, diagnosisStats.total)}%</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* داروهای شایع */}
              {Object.keys(diagnosisStats.commonMedications).length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('medications')}
                  >
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FiActivity className="text-green-600" />
                      داروهای شایع
                    </h3>
                    {expandedSections.medications ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  
                  {expandedSections.medications && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(diagnosisStats.commonMedications)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 6)
                        .map(([medication, count]) => (
                          <div key={medication} className="flex justify-between items-center bg-white p-2 rounded-lg">
                            <span className="text-sm text-gray-700">{medication}</span>
                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                              {count} بیمار ({calculatePercentage(count, diagnosisStats.total)}%)
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* الگوهای آزمایشگاهی */}
              {Object.keys(diagnosisStats.labTestPatterns).length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('labTests')}
                  >
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FiThermometer className="text-orange-600" />
                      الگوهای آزمایشگاهی
                    </h3>
                    {expandedSections.labTests ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  
                  {expandedSections.labTests && (
                    <div className="mt-4 space-y-3">
                      {Object.entries(diagnosisStats.labTestPatterns)
                        .sort((a, b) => b[1].count - a[1].count)
                        .slice(0, 5)
                        .map(([testName, data]) => (
                          <div key={testName} className="bg-white p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-800">{testName}</span>
                              <span className="text-sm text-gray-600">{data.count} بار انجام</span>
                            </div>
                            {data.abnormalCount > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-red-500 h-2 rounded-full"
                                    style={{ width: `${(data.abnormalCount / data.count) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-red-600">
                                  {data.abnormalCount} مورد غیرنرمال ({calculatePercentage(data.abnormalCount, data.count)}%)
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* هشدارها و الگوها */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiAlertCircle className="text-yellow-600" />
                  الگوها و هشدارهای بالینی
                </h3>
                
                <div className="space-y-3">
                  {diagnosisStats.allergies.food > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm text-gray-700">
                        {diagnosisStats.allergies.food} مورد آلرژی غذایی در این گروه ثبت شده
                      </span>
                    </div>
                  )}
                  
                  {diagnosisStats.allergies.drug > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span className="text-sm text-gray-700">
                        {diagnosisStats.allergies.drug} مورد آلرژی دارویی - در تجویز دارو احتیاط شود
                      </span>
                    </div>
                  )}

                  {diagnosisStats.vitalSigns.systolicAvg && diagnosisStats.vitalSigns.systolicAvg > 140 && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm text-gray-700">
                        میانگین فشار خون سیستولیک ({diagnosisStats.vitalSigns.systolicAvg}) بالاتر از حد نرمال
                      </span>
                    </div>
                  )}

                  {Object.entries(diagnosisStats.ageGroups)
                    .filter(([group, count]) => group.includes('70+') && count > diagnosisStats.total * 0.3)
                    .length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-sm text-gray-700">
                        بیش از ۳۰٪ بیماران بالای ۷۰ سال هستند - نیاز به مراقبت ویژه سالمندی
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* لیست بیماران */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiUsers className="text-purple-600" />
                  لیست بیماران با این تشخیص ({filteredPatients.length} نفر)
                </h3>
                
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {filteredPatients.map(patient => (
                    <div 
                      key={patient.id}
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        currentPatient?.id === patient.id 
                          ? 'bg-purple-100 border border-purple-300' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-800">{patient.fullName}</span>
                        <span className="text-sm text-gray-600">{patient.age} سال</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {patient.bloodType && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            {patient.bloodType}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          آخرین ویزیت: {patient.lastVisit || '---'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedDiagnosis ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                <FiUsers className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">بیماری با این تشخیص یافت نشد</p>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                <FiBarChart2 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">لطفاً یک تشخیص را برای تحلیل انتخاب کنید</p>
            </div>
          )}
        </div>
      )}

      <style>{`
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
      `}</style>
    </div>
  );
};

export default ComparativeAnalysis;