import React, { useState, useEffect, useMemo } from 'react';
import {
  FiTrendingUp, FiActivity, FiAlertTriangle,
  FiHeart, FiThermometer, FiPackage,
  FiClipboard, FiBarChart2, FiTarget,
  FiDownload, FiPrinter, FiShare2,
  FiChevronRight, FiInfo, FiUsers,
  FiArrowUp, FiArrowDown, FiFilter,
  FiCalendar, FiUser, FiGrid,
  FiUserPlus
} from 'react-icons/fi';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  ResponsiveContainer, Tooltip, Legend, XAxis, YAxis,
  CartesianGrid, AreaChart, Area
} from 'recharts';

const PatientAnalyticsDashboard = ({ patients }) => {
  const [timeRange, setTimeRange] = useState('all');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('all');
  const [expandedStats, setExpandedStats] = useState(false);

  // استخراج داده‌ها از بیماران
  const analyticsData = useMemo(() => {
    if (!patients || patients.length === 0) {
      return {
        summary: {},
        diagnoses: [],
        trends: [],
        demographics: {},
        riskStats: {}
      };
    }

    // 1. خلاصه کلی
    const totalPatients = patients.length;
    const malePatients = patients.filter(p => p.gender === 'مرد').length;
    const femalePatients = patients.filter(p => p.gender === 'زن').length;
    
    // 2. تحلیل بر اساس سن
    const ageGroups = {
      'کودک (0-18)': patients.filter(p => p.age && p.age <= 18).length,
      'جوان (19-35)': patients.filter(p => p.age && p.age > 18 && p.age <= 35).length,
      'میانسال (36-60)': patients.filter(p => p.age && p.age > 35 && p.age <= 60).length,
      'سالمند (60+)': patients.filter(p => p.age && p.age > 60).length
    };

    // 3. تشخیص‌ها از سوابق پزشکی
    const diagnoses = {};
    patients.forEach(patient => {
      if (patient.medicalHistory && Array.isArray(patient.medicalHistory)) {
        patient.medicalHistory.forEach(history => {
          const diagnosis = history.text || '';
          if (diagnosis) {
            diagnoses[diagnosis] = (diagnoses[diagnosis] || 0) + 1;
          }
        });
      }
    });

    // تبدیل به آرایه و مرتب سازی
    const diagnosisArray = Object.entries(diagnoses)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // 10 تشخیص برتر

    // 4. داروهای فعال
    const activeMedsCount = patients.reduce((total, patient) => {
      if (patient.medicationHistory && Array.isArray(patient.medicationHistory)) {
        const activeMeds = patient.medicationHistory.filter(m => m.status === 'در حال مصرف');
        return total + activeMeds.length;
      }
      return total;
    }, 0);

    // 5. آزمایشات غیرنرمال
    const abnormalTestsCount = patients.reduce((total, patient) => {
      if (patient.labTests && Array.isArray(patient.labTests)) {
        const abnormal = patient.labTests.filter(test => {
          if (!test.result || !test.normalRange) return false;
          try {
            const result = parseFloat(test.result);
            const range = test.normalRange.split('-');
            const min = parseFloat(range[0]);
            const max = parseFloat(range[1]);
            return result < min || result > max;
          } catch {
            return false;
          }
        });
        return total + abnormal.length;
      }
      return total;
    }, 0);

    // 6. ریسک‌ها
    const highRiskPatients = patients.filter(patient => {
      // ریسک بر اساس BMI
      const bmiRisk = patient.bmi && parseFloat(patient.bmi) >= 30;
      
      // ریسک بر اساس سن
      const ageRisk = patient.age && patient.age >= 60;
      
      // ریسک بر اساس داروهای فعال
      const medRisk = patient.medicationHistory && 
                     patient.medicationHistory.filter(m => m.status === 'در حال مصرف').length > 5;
      
      // ریسک بر اساس آزمایشات غیرنرمال
      const testRisk = patient.labTests && patient.labTests.length > 0;
      
      return bmiRisk || ageRisk || medRisk || testRisk;
    }).length;

    // 7. روند زمانی (بر اساس تاریخ آخرین ویزیت)
    const monthlyTrends = {};
    patients.forEach(patient => {
      if (patient.lastVisit) {
        const month = patient.lastVisit.split('/')[1]; // گرفتن ماه
        monthlyTrends[month] = (monthlyTrends[month] || 0) + 1;
      }
    });

    const trendsArray = Object.entries(monthlyTrends)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([month, count]) => ({
        month: `ماه ${month}`,
        patients: count
      }));

    return {
      summary: {
        total: totalPatients,
        male: malePatients,
        female: femalePatients,
        avgAge: Math.round(patients.reduce((sum, p) => sum + (p.age || 0), 0) / totalPatients),
        activeMeds: activeMedsCount,
        abnormalTests: abnormalTestsCount,
        highRisk: highRiskPatients
      },
      ageGroups: Object.entries(ageGroups).map(([group, count]) => ({ group, count })),
      diagnoses: diagnosisArray,
      trends: trendsArray,
      demographics: {
        byBloodType: patients.reduce((acc, patient) => {
          if (patient.bloodType) {
            acc[patient.bloodType] = (acc[patient.bloodType] || 0) + 1;
          }
          return acc;
        }, {}),
        bySmoking: patients.reduce((acc, patient) => {
          const smoking = patient.smoking || 'نامشخص';
          acc[smoking] = (acc[smoking] || 0) + 1;
          return acc;
        }, {})
      },
      riskStats: {
        bmi: patients.filter(p => p.bmi && parseFloat(p.bmi) >= 30).length,
        hypertension: patients.filter(p => p.bloodPressure && 
          (parseInt(p.bloodPressure.split('/')[0]) > 140 || 
           parseInt(p.bloodPressure.split('/')[1]) > 90)).length,
        diabetes: patients.filter(p => 
          p.medicalHistory?.some(h => h.text?.toLowerCase().includes('دیابت'))).length,
        cardiac: patients.filter(p => 
          p.medicalHistory?.some(h => h.text?.toLowerCase().includes('قلب'))).length
      }
    };
  }, [patients]);

  // کامپوننت کارت آمار
  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend, percentage }) => {
    const colors = {
      blue: { bg: 'bg-blue-50', icon: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', icon: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      red: { bg: 'bg-red-50', icon: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      purple: { bg: 'bg-purple-50', icon: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-50', icon: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      teal: { bg: 'bg-teal-50', icon: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' }
    };

    const selectedColor = colors[color] || colors.blue;

    return (
      <div className={`${selectedColor.bg} border ${selectedColor.border} rounded-xl p-4 hover:shadow-md transition-all duration-200`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`${selectedColor.icon} p-2 rounded-lg`}>
              <Icon className={`${selectedColor.text} w-4 h-4`} />
            </div>
            <span className="text-sm text-gray-700 font-medium">{title}</span>
          </div>
          {trend && (
            <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
              trend === 'up' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {trend === 'up' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
              {percentage}%
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    );
  };

  // رندر کارت تشخیص
  const DiagnosisCard = ({ diagnosis, count, index }) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-red-100 text-red-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-teal-100 text-teal-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-yellow-100 text-yellow-800',
      'bg-cyan-100 text-cyan-800'
    ];

    const percentage = Math.round((count / patients.length) * 100);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[index % colors.length]}`}>
            #{index + 1}
          </span>
          <span className="text-xs text-gray-500">{count} بیمار</span>
        </div>
        <h4 className="font-medium text-gray-800 text-sm mb-2 truncate">{diagnosis}</h4>
        <div className="flex items-center justify-between">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full" 
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-600 mr-2">{percentage}%</span>
        </div>
      </div>
    );
  };

  // رندر کارت ریسک
  const RiskCard = ({ title, count, icon: Icon, color, patients: riskPatients }) => {
    const colors = {
      red: { bg: 'bg-red-50', icon: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      orange: { bg: 'bg-orange-50', icon: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      yellow: { bg: 'bg-yellow-50', icon: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
      blue: { bg: 'bg-blue-50', icon: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' }
    };

    const selectedColor = colors[color] || colors.red;
    const percentage = Math.round((count / patients.length) * 100);

    return (
      <div className={`${selectedColor.bg} border ${selectedColor.border} rounded-xl p-4`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`${selectedColor.icon} p-2 rounded-lg`}>
            <Icon className={`${selectedColor.text} w-5 h-5`} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">{title}</h4>
            <p className="text-sm text-gray-600">{count} بیمار</p>
          </div>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{percentage}% از کل بیماران</span>
            <span>{count}/{patients.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-full rounded-full ${color === 'red' ? 'bg-red-500' : color === 'orange' ? 'bg-orange-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        {riskPatients && riskPatients.length > 0 && (
          <div className="text-xs text-gray-600">
            <p className="mb-1">نمونه بیماران:</p>
            <div className="flex flex-wrap gap-1">
              {riskPatients.slice(0, 3).map((patient, idx) => (
                <span key={idx} className="px-2 py-1 bg-white rounded-full border border-gray-300">
                  {patient.fullName.split(' ')[0]}
                </span>
              ))}
              {riskPatients.length > 3 && (
                <span className="px-2 py-1 bg-white rounded-full border border-gray-300">
                  +{riskPatients.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // فیلتر کردن بیماران بر اساس تشخیص
  const filteredPatients = useMemo(() => {
    if (selectedDiagnosis === 'all') return patients;
    
    return patients.filter(patient => {
      if (!patient.medicalHistory || !Array.isArray(patient.medicalHistory)) return false;
      return patient.medicalHistory.some(history => 
        history.text && history.text.includes(selectedDiagnosis)
      );
    });
  }, [patients, selectedDiagnosis]);

  // اگر بیمار وجود ندارد
  if (!patients || patients.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-blue-50 p-6 rounded-full inline-block mb-6">
            <FiBarChart2 className="w-16 h-16 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-3">داده‌ای برای تحلیل وجود ندارد</h3>
          <p className="text-gray-600 mb-6">
            هنوز بیمارانی ثبت نشده‌اند. پس از اضافه کردن بیماران، می‌توانید تجزیه و تحلیل جامع را مشاهده کنید.
          </p>
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
            <FiUserPlus />
            افزودن اولین بیمار
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
      {/* هدر داشبورد */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div className="flex items-center gap-3 mb-4 lg:mb-0">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
            <FiBarChart2 className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">تجزیه و تحلیل بیماران</h2>
            <p className="text-gray-600 text-sm">تحلیل جامع تمام بیماران شما</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">تمام زمان‌ها</option>
              <option value="month">ماه جاری</option>
              <option value="quarter">سه ماهه</option>
              <option value="year">سال جاری</option>
            </select>
            <FiChevronRight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 rotate-180" />
          </div>
          
          <div className="relative">
            <select
              value={selectedDiagnosis}
              onChange={(e) => setSelectedDiagnosis(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">همه تشخیص‌ها</option>
              {analyticsData.diagnoses.map(d => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition">
            <FiDownload className="w-4 h-4" />
            گزارش PDF
          </button>
        </div>
      </div>

      {/* خلاصه آماری */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">خلاصه آماری</h3>
          <button
            onClick={() => setExpandedStats(!expandedStats)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            {expandedStats ? 'نمایش کمتر' : 'نمایش بیشتر'}
            {expandedStats ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
          </button>
        </div>
        
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${expandedStats ? 'mb-6' : ''}`}>
          <StatCard
            title="کل بیماران"
            value={analyticsData.summary.total}
            subtitle={`${analyticsData.summary.male} مرد | ${analyticsData.summary.female} زن`}
            icon={FiUsers}
            color="blue"
            trend="up"
            percentage={12}
          />
          
          <StatCard
            title="داروهای فعال"
            value={analyticsData.summary.activeMeds}
            subtitle="میانگین 4 دارو به ازای هر بیمار"
            icon={FiPackage}
            color="red"
            trend="up"
            percentage={8}
          />
          
          <StatCard
            title="آزمایشات غیرنرمال"
            value={analyticsData.summary.abnormalTests}
            subtitle="نیاز به پیگیری"
            icon={FiClipboard}
            color="orange"
            trend="down"
            percentage={-5}
          />
          
          <StatCard
            title="بیماران پرریسک"
            value={analyticsData.summary.highRisk}
            subtitle={`${Math.round((analyticsData.summary.highRisk / analyticsData.summary.total) * 100)}% از کل`}
            icon={FiAlertTriangle}
            color="purple"
            trend="up"
            percentage={15}
          />
        </div>
        
        {expandedStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <StatCard
              title="میانگین سن"
              value={analyticsData.summary.avgAge || 0}
              subtitle="سال"
              icon={FiUser}
              color="teal"
            />
            
            <StatCard
              title="بیماران با BMI بالا"
              value={analyticsData.riskStats.bmi}
              subtitle="چاقی درجه ۲ یا بیشتر"
              icon={FiActivity}
              color="orange"
            />
            
            <StatCard
              title="فشار خون بالا"
              value={analyticsData.riskStats.hypertension}
              subtitle="بیماران کنترل نشده"
              icon={FiTrendingUp}
              color="red"
            />
            
            <StatCard
              title="دیابت"
              value={analyticsData.riskStats.diabetes}
              subtitle="نوع ۱ و ۲"
              icon={FiThermometer}
              color="green"
            />
          </div>
        )}
      </div>

      {/* تشخیص‌های شایع */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">تشخیص‌های شایع</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {analyticsData.diagnoses.slice(0, 5).map((diagnosis, index) => (
            <DiagnosisCard
              key={diagnosis.name}
              diagnosis={diagnosis.name}
              count={diagnosis.count}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* ریسک‌های مهم */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">ریسک‌های کلیدی</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <RiskCard
            title="چاقی خطرناک"
            count={analyticsData.riskStats.bmi}
            icon={FiActivity}
            color="red"
            patients={patients.filter(p => p.bmi && parseFloat(p.bmi) >= 30)}
          />
          
          <RiskCard
            title="فشار خون بالا"
            count={analyticsData.riskStats.hypertension}
            icon={FiTrendingUp}
            color="orange"
            patients={patients.filter(p => p.bloodPressure && 
              (parseInt(p.bloodPressure.split('/')[0]) > 140 || 
               parseInt(p.bloodPressure.split('/')[1]) > 90))}
          />
          
          <RiskCard
            title="داروهای فعال زیاد"
            count={patients.filter(p => 
              p.medicationHistory && 
              p.medicationHistory.filter(m => m.status === 'در حال مصرف').length > 5
            ).length}
            icon={FiPackage}
            color="yellow"
            patients={patients.filter(p => 
              p.medicationHistory && 
              p.medicationHistory.filter(m => m.status === 'در حال مصرف').length > 5
            )}
          />
          
          <RiskCard
            title="دیابت"
            count={analyticsData.riskStats.diabetes}
            icon={FiThermometer}
            color="blue"
            patients={patients.filter(p => 
              p.medicalHistory?.some(h => h.text?.toLowerCase().includes('دیابت')))
            }
          />
        </div>
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* توزیع سنی */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-800">توزیع سنی بیماران</h4>
            <FiInfo className="text-gray-400 w-4 h-4" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.ageGroups}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="group" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" name="تعداد بیماران" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* روند زمانی */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-800">روند مراجعات</h4>
            <FiInfo className="text-gray-400 w-4 h-4" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  name="تعداد بیماران"
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* توزیع گروه خونی */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-800">توزیع گروه خونی</h4>
          <FiInfo className="text-gray-400 w-4 h-4" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={Object.entries(analyticsData.demographics.byBloodType || {}).map(([name, value]) => ({
                  name,
                  value,
                  color: name.includes('+') ? '#ef4444' : '#3b82f6'
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.entries(analyticsData.demographics.byBloodType || {}).map(([name], index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={name.includes('+') ? '#ef4444' : '#3b82f6'} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} بیمار`, 'تعداد']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* خلاصه تحلیلی */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <FiTarget className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-blue-800 mb-2">تحلیل کلی بیماران شما</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-900 mb-2">
                  <strong>جمعیت بیماران:</strong> شما {analyticsData.summary.total} بیمار دارید که 
                  {` ${analyticsData.summary.male} نفر مرد و ${analyticsData.summary.female} نفر زن هستند.`}
                </p>
                <p className="text-sm text-blue-900 mb-2">
                  <strong>میانگین سن:</strong> میانگین سن بیماران شما {analyticsData.summary.avgAge || 0} سال است.
                  بیشتر بیماران در گروه سنی {analyticsData.ageGroups.reduce((max, group) => 
                    group.count > max.count ? group : max
                  ).group} قرار دارند.
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-900 mb-2">
                  <strong>داروها:</strong> بیماران شما در مجموع {analyticsData.summary.activeMeds} داروی فعال مصرف می‌کنند که 
                  نیاز به نظارت منظم دارد.
                </p>
                <p className="text-sm text-blue-900 mb-2">
                  <strong>ریسک‌ها:</strong> {analyticsData.summary.highRisk} بیمار پرریسک شناسایی شدند که 
                  نیاز به پیگیری ویژه دارند.
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
              <h5 className="font-bold text-blue-800 text-sm mb-2">توصیه‌ها:</h5>
              <ul className="text-xs text-blue-900 space-y-1">
                <li>• برنامه‌ریزی برای ویزیت‌های منظم بیماران پرریسک</li>
                <li>• بررسی تداخلات دارویی برای بیماران با داروهای فعال زیاد</li>
                <li>• پیگیری آزمایشات غیرنرمال</li>
                <li>• مشاوره تغذیه برای بیماران با BMI بالا</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* فیلترهای فعال */}
      {selectedDiagnosis !== 'all' && (
        <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-purple-800 mb-1">بیماران با تشخیص: "{selectedDiagnosis}"</h4>
              <p className="text-sm text-purple-700">
                {filteredPatients.length} بیمار یافت شد
              </p>
            </div>
            <button
              onClick={() => setSelectedDiagnosis('all')}
              className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              حذف فیلتر
            </button>
          </div>
          
          {filteredPatients.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPatients.slice(0, 6).map(patient => (
                <div key={patient.id} className="bg-white rounded-lg border border-purple-200 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-purple-600 w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-800">{patient.fullName}</h5>
                      <p className="text-xs text-gray-600">{patient.age} سال - {patient.gender}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p>شماره پرونده: {patient.medicalRecordNumber}</p>
                    <p>آخرین ویزیت: {patient.lastVisit || '---'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientAnalyticsDashboard;