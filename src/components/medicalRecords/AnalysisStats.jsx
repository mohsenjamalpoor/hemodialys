// DiagnosisStats.jsx
import React, { useState } from 'react';
import { 
  FiPieChart, 
  FiTrendingUp, 
  FiUsers, 
  FiActivity,
  FiBarChart2,
  FiHash,
  FiTag,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';

const AnalysisStats = ({ patients }) => {
  const [isOpen, setIsOpen] = useState(false);

  // محاسبه آمار تشخیص‌ها
  const getDiagnosisStats = () => {
    const stats = {};
    
    patients.forEach(patient => {
      if (patient.diagnosis && patient.diagnosis.trim() !== '') {
        const diagnosis = patient.diagnosis.toLowerCase();
        stats[patient.diagnosis] = (stats[patient.diagnosis] || 0) + 1;
      }
    });
    
    return stats;
  };

  // دسته‌بندی کلی تشخیص‌ها
  const getDiagnosisCategories = () => {
    const categories = {
      'بیماری‌های کلیوی': ['نارسایی کلیه', 'گلومرولونفریت', 'دیالیز', 'کلیوی'],
      'فشار خون': ['فشار خون', 'hypertension', 'blood pressure'],
      'دیابت': ['دیابت', 'diabetes', 'قند خون'],
      'سنگ کلیه': ['سنگ کلیه', 'kidney stone'],
      'عفونت': ['عفونت', 'infection', 'التهاب'],
      'بیماری‌های قلبی': ['قلب', 'cardiac', 'cardiovascular'],
      'کم خونی': ['کم خونی', 'anemia'],
      'سایر': []
    };

    const categoryCounts = {};
    Object.keys(categories).forEach(cat => categoryCounts[cat] = 0);

    patients.forEach(patient => {
      if (patient.diagnosis) {
        const diagnosis = patient.diagnosis.toLowerCase();
        let categorized = false;

        for (const [category, keywords] of Object.entries(categories)) {
          if (keywords.some(keyword => diagnosis.includes(keyword))) {
            categoryCounts[category]++;
            categorized = true;
            break;
          }
        }

        if (!categorized && patient.diagnosis.trim() !== '') {
          categoryCounts['سایر']++;
        }
      }
    });

    return categoryCounts;
  };

  const detailedStats = getDiagnosisStats();
  const categoryStats = getDiagnosisCategories();
  
  // محاسبه درصدها
  const totalPatients = patients.length;
  const patientsWithDiagnosis = patients.filter(p => p.diagnosis && p.diagnosis.trim() !== '').length;
  const patientsWithoutDiagnosis = totalPatients - patientsWithDiagnosis;

  // پیدا کردن شایع‌ترین تشخیص
  const findMostCommonDiagnosis = () => {
    if (Object.keys(detailedStats).length === 0) return { name: 'نامشخص', count: 0 };
    
    const mostCommon = Object.entries(detailedStats).reduce((max, current) => 
      current[1] > max[1] ? current : max
    );
    
    return { name: mostCommon[0], count: mostCommon[1] };
  };

  const mostCommon = findMostCommonDiagnosis();

  // مرتب‌سازی دسته‌بندی‌ها بر اساس تعداد
  const sortedCategories = Object.entries(categoryStats)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  

  return (
    <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
      {/* هدر قابل کلیک */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <FiBarChart2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">آمار و تحلیل تشخیص بیماری‌ها</h2>
              {!isOpen && (
                <p className="text-xs text-gray-500 mt-1">{totalPatients} بیمار با تشخیص</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* خلاصه آمار در حالت بسته */}
            {!isOpen && totalPatients > 0 && (
              <div className="hidden md:flex items-center gap-2">
                <div className="bg-blue-100 px-2 py-1 rounded text-xs text-blue-600">
                  {patientsWithDiagnosis} تشخیص
                </div>
                <div className="bg-green-100 px-2 py-1 rounded text-xs text-green-600">
                  {Object.keys(detailedStats).length} نوع
                </div>
              </div>
            )}
            
            {/* آیکون باز و بسته شدن */}
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

      {/* محتوای بازشونده */}
      {isOpen && (
        <div className="p-6 border-t border-gray-100">
          {/* کارت‌های آمار سریع */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* کارت تعداد کل بیماران */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiUsers className="w-8 h-8 opacity-80" />
                <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">کل بیماران</span>
              </div>
              <p className="text-3xl font-bold">{totalPatients}</p>
              <p className="text-sm opacity-90 mt-1">بیمار فعال</p>
            </div>

            {/* کارت شایع‌ترین تشخیص */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiTrendingUp className="w-8 h-8 opacity-80" />
                <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">شایع‌ترین تشخیص</span>
              </div>
              <p className="text-lg font-bold truncate" title={mostCommon.name}>
                {mostCommon.name.length > 20 ? mostCommon.name.substring(0, 20) + '...' : mostCommon.name}
              </p>
              <p className="text-sm opacity-90 mt-1">
                {mostCommon.count} بیمار ({totalPatients > 0 ? ((mostCommon.count / totalPatients) * 100).toFixed(1) : 0}%)
              </p>
            </div>

            {/* کارت تنوع تشخیص‌ها */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiActivity className="w-8 h-8 opacity-80" />
                <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">تنوع تشخیص</span>
              </div>
              <p className="text-3xl font-bold">{Object.keys(detailedStats).length}</p>
              <p className="text-sm opacity-90 mt-1">نوع تشخیص متفاوت</p>
            </div>

            {/* کارت بیماران بدون تشخیص */}
            <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiTag className="w-8 h-8 opacity-80" />
                <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">بدون تشخیص</span>
              </div>
              <p className="text-3xl font-bold">{patientsWithoutDiagnosis}</p>
              <p className="text-sm opacity-90 mt-1">
                {totalPatients > 0 ? ((patientsWithoutDiagnosis / totalPatients) * 100).toFixed(1) : 0}% از بیماران
              </p>
            </div>
          </div>

          {/* دسته‌بندی تشخیص‌ها */}
          {sortedCategories.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FiHash className="text-purple-500" />
                دسته‌بندی تشخیص‌ها
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedCategories.map(([category, count]) => (
                  <div key={category} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{category}</span>
                      <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-sm">
                        {count} بیمار
                      </span>
                    </div>
                    
                    {/* نوار پیشرفت */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${patientsWithDiagnosis > 0 ? (count / patientsWithDiagnosis) * 100 : 0}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {patientsWithDiagnosis > 0 ? ((count / patientsWithDiagnosis) * 100).toFixed(1) : 0}% از بیماران با تشخیص
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* لیست دقیق تشخیص‌ها */}
          {Object.keys(detailedStats).length > 0 && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FiPieChart className="text-purple-500" />
                تشخیص‌های ثبت شده
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {Object.entries(detailedStats)
                  .sort((a, b) => b[1] - a[1])
                  .map(([diagnosis, count]) => (
                    <div key={diagnosis} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                      <span className="text-sm text-gray-600 ml-2">{count} بیمار</span>
                      <div className="flex-1 mr-3">
                        <span className="text-sm font-medium text-gray-800 block truncate" title={diagnosis}>
                          {diagnosis}
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                        {count}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* پیام وقتی بیمار وجود ندارد */}
          {totalPatients === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 p-6 rounded-full inline-block mb-4">
                <FiBarChart2 className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500">هیچ بیماری برای نمایش آمار وجود ندارد</p>
              <p className="text-sm text-gray-400 mt-2">با افزودن بیمار، آمار تشخیص‌ها نمایش داده می‌شود</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisStats;