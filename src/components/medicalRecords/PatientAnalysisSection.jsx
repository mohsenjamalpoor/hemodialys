import React, { useMemo, useState } from 'react';
import {
  FiTrendingUp, FiActivity, FiAlertTriangle,
  FiHeart, FiThermometer, FiPackage,
  FiClipboard, FiBarChart2, FiTarget,
  FiDownload, FiPrinter, FiShare2,
  FiChevronRight, FiInfo,
  FiCheck,
  FiUser
} from 'react-icons/fi';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, Legend,
  YAxis,
  CartesianGrid,
  XAxis
} from 'recharts';

const PatientAnalysisSection = ({
  patient,
  medications = [],
  labTests = [],
  vitalSigns = []
}) => {
  const [selectedView, setSelectedView] = useState('overview');

  // محاسبه آمار
  const stats = useMemo(() => {
    const activeMeds = medications.filter(m => m.status === 'در حال مصرف');
    const abnormalTests = labTests.filter(test => {
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

    // آخرین علائم حیاتی
    const lastVital = vitalSigns[vitalSigns.length - 1] || {};

    return {
      activeMedications: activeMeds.length,
      totalMedications: medications.length,
      abnormalTests: abnormalTests.length,
      totalTests: labTests.length,
      lastVital,
      bmiRisk: patient?.bmi ? parseFloat(patient.bmi) >= 30 ? 'high' : parseFloat(patient.bmi) >= 25 ? 'medium' : 'low' : 'unknown',
      ageRisk: patient?.age ? patient.age >= 60 ? 'high' : patient.age >= 40 ? 'medium' : 'low' : 'unknown'
    };
  }, [patient, medications, labTests, vitalSigns]);

  // داده‌های نمودار داروها
  const medicationData = useMemo(() => {
    const statusCount = {
      'در حال مصرف': 0,
      'قطع شده': 0,
      'تک‌دوز': 0,
      'دوره‌ای': 0
    };

    medications.forEach(med => {
      if (statusCount[med.status] !== undefined) {
        statusCount[med.status]++;
      }
    });

    return Object.entries(statusCount).map(([name, value]) => ({
      name: name === 'در حال مصرف' ? 'فعال' : name === 'قطع شده' ? 'قطع' : name,
      value,
      color: name === 'در حال مصرف' ? '#10b981' : 
              name === 'قطع شده' ? '#ef4444' : 
              name === 'تک‌دوز' ? '#3b82f6' : 
              '#8b5cf6'
    }));
  }, [medications]);

  // داده‌های نمودار آزمایشات
  const labData = useMemo(() => {
    const normal = labTests.filter(test => {
      if (!test.result || !test.normalRange) return false;
      try {
        const result = parseFloat(test.result);
        const range = test.normalRange.split('-');
        const min = parseFloat(range[0]);
        const max = parseFloat(range[1]);
        return result >= min && result <= max;
      } catch {
        return false;
      }
    }).length;

    const abnormal = labTests.filter(test => {
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
    }).length;

    return [
      { name: 'نرمال', value: normal, color: '#10b981' },
      { name: 'غیرنرمال', value: abnormal, color: '#ef4444' }
    ];
  }, [labTests]);

  // ارزیابی ریسک
  const riskAssessment = useMemo(() => {
    const risks = [];
    
    // ریسک بر اساس BMI
    if (stats.bmiRisk === 'high') {
      risks.push({
        title: 'ریسک وزن بالا',
        description: 'BMI بیشتر از 30 - نیاز به مداخله',
        severity: 'high',
        icon: FiActivity
      });
    } else if (stats.bmiRisk === 'medium') {
      risks.push({
        title: 'ریسک وزن متوسط',
        description: 'BMI بین 25 تا 30 - نیاز به نظارت',
        severity: 'medium',
        icon: FiActivity
      });
    }

    // ریسک بر اساس سن
    if (stats.ageRisk === 'high') {
      risks.push({
        title: 'ریسک سن بالا',
        description: 'سن بالای 60 سال - نیاز به پیگیری منظم',
        severity: 'high',
        icon: FiUser
      });
    }

    // ریسک بر اساس داروها
    if (stats.activeMedications > 5) {
      risks.push({
        title: 'تعداد داروهای فعال بالا',
        description: `${stats.activeMedications} داروی فعال - خطر تداخل دارویی`,
        severity: 'high',
        icon: FiPackage
      });
    }

    // ریسک بر اساس آزمایشات غیرنرمال
    if (stats.abnormalTests > 0) {
      risks.push({
        title: 'آزمایشات غیرنرمال',
        description: `${stats.abnormalTests} آزمایش غیرنرمال - نیاز به بررسی`,
        severity: stats.abnormalTests > 3 ? 'high' : 'medium',
        icon: FiClipboard
      });
    }

    // ریسک فشار خون
    if (stats.lastVital?.bloodPressureSystolic && stats.lastVital?.bloodPressureDiastolic) {
      const systolic = parseInt(stats.lastVital.bloodPressureSystolic);
      const diastolic = parseInt(stats.lastVital.bloodPressureDiastolic);
      
      if (systolic > 140 || diastolic > 90) {
        risks.push({
          title: 'فشار خون بالا',
          description: `${systolic}/${diastolic} mmHg - نیاز به کنترل`,
          severity: 'high',
          icon: FiTrendingUp
        });
      }
    }

    return risks;
  }, [stats]);

  // توزیع داروها بر اساس راه مصرف
  const medicationRouteData = useMemo(() => {
    const routeCount = {};
    medications.forEach(med => {
      const route = med.route || 'نامشخص';
      routeCount[route] = (routeCount[route] || 0) + 1;
    });

    return Object.entries(routeCount).map(([name, value], index) => ({
      name,
      value,
      color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index] || '#6b7280'
    }));
  }, [medications]);

  // رندر کارت ریسک
  const RiskCard = ({ risk }) => {
    const severityColors = {
      high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
      medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
      low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' }
    };

    const colors = severityColors[risk.severity] || severityColors.medium;

    return (
      <div className={`${colors.bg} border ${colors.border} rounded-xl p-4 hover:shadow-md transition-all duration-200`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${risk.severity === 'high' ? 'bg-red-100' : risk.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>
            <risk.icon className={`w-4 h-4 ${risk.severity === 'high' ? 'text-red-600' : risk.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'}`} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-1">{risk.title}</h4>
            <p className="text-xs text-gray-600 mb-2">{risk.description}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full ${
                risk.severity === 'high' ? 'bg-red-100 text-red-800' :
                risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {risk.severity === 'high' ? 'ریسک بالا' : risk.severity === 'medium' ? 'ریسک متوسط' : 'ریسک پایین'}
              </span>
              <FiChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // رندر کارت آمار
  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend }) => {
    const colors = {
      blue: { bg: 'bg-blue-50', icon: 'bg-blue-100', text: 'text-blue-600' },
      green: { bg: 'bg-green-50', icon: 'bg-green-100', text: 'text-green-600' },
      red: { bg: 'bg-red-50', icon: 'bg-red-100', text: 'text-red-600' },
      purple: { bg: 'bg-purple-50', icon: 'bg-purple-100', text: 'text-purple-600' },
      orange: { bg: 'bg-orange-50', icon: 'bg-orange-100', text: 'text-orange-600' }
    };

    const selectedColor = colors[color] || colors.blue;

    return (
      <div className={`${selectedColor.bg} border ${selectedColor.border} rounded-xl p-4 hover:shadow-sm transition-all duration-200`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`${selectedColor.icon} p-2 rounded-lg`}>
              <Icon className={`${selectedColor.text} w-4 h-4`} />
            </div>
            <span className="text-sm text-gray-700 font-medium">{title}</span>
          </div>
          {trend && (
            <span className={`text-xs px-2 py-1 rounded-full ${trend === 'up' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {trend === 'up' ? '↑' : '↓'}
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

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
      {/* هدر */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
            <FiBarChart2 className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">تجزیه و تحلیل بیمار</h2>
            <p className="text-gray-600 text-sm">تحلیل جامع وضعیت سلامت و ریسک‌ها</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition">
            <FiDownload className="w-4 h-4" />
            خروجی
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition">
            <FiPrinter className="w-4 h-4" />
            چاپ گزارش
          </button>
        </div>
      </div>

      {/* کارت‌های آمار کلی */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="داروهای فعال"
          value={stats.activeMedications}
          subtitle={`از ${stats.totalMedications} دارو`}
          icon={FiPackage}
          color="red"
        />
        <StatCard
          title="آزمایشات غیرنرمال"
          value={stats.abnormalTests}
          subtitle={`از ${stats.totalTests} آزمایش`}
          icon={FiClipboard}
          color="orange"
        />
        <StatCard
          title="سن"
          value={`${patient?.age || '---'}`}
          subtitle={stats.ageRisk === 'high' ? 'ریسک بالا' : stats.ageRisk === 'medium' ? 'ریسک متوسط' : 'ریسک پایین'}
          icon={FiUser}
          color="blue"
        />
        <StatCard
          title="BMI"
          value={patient?.bmi || '---'}
          subtitle={stats.bmiRisk === 'high' ? 'چاقی' : stats.bmiRisk === 'medium' ? 'اضافه وزن' : 'نرمال'}
          icon={FiActivity}
          color="green"
        />
      </div>

      {/* ریسک‌ها */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">ارزیابی ریسک‌ها</h3>
          <span className="text-sm text-gray-600">{riskAssessment.length} مورد ریسک شناسایی شد</span>
        </div>
        
        {riskAssessment.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {riskAssessment.map((risk, index) => (
              <RiskCard key={index} risk={risk} />
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-bold text-green-800 mb-2">وضعیت مطلوب</h4>
            <p className="text-green-700 text-sm">هیچ ریسک قابل توجهی شناسایی نشد</p>
          </div>
        )}
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* نمودار وضعیت داروها */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-800">توزیع داروها بر اساس وضعیت</h4>
            <FiInfo className="text-gray-400 w-4 h-4" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={medicationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {medicationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} دارو`, 'تعداد']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* نمودار آزمایشات */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-800">وضعیت آزمایشات</h4>
            <FiInfo className="text-gray-400 w-4 h-4" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={labData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="تعداد آزمایشات">
                  {labData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* توزیع داروها بر اساس راه مصرف */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-800">توزیع داروها بر اساس راه مصرف</h4>
          <FiInfo className="text-gray-400 w-4 h-4" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={medicationRouteData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="تعداد داروها">
                {medicationRouteData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* خلاصه تحلیلی */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">خلاصه تحلیلی</h3>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiTarget className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-blue-800 mb-2">نتیجه‌گیری تحلیلی</h4>
              <ul className="space-y-2 text-sm text-blue-900">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>بیمار دارای <strong>{stats.activeMedications}</strong> داروی فعال است که نیاز به نظارت منظم دارد</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span><strong>{stats.abnormalTests}</strong> آزمایش غیرنرمال نیاز به پیگیری پزشکی دارد</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>توصیه می‌شود ویزیت‌های منظم هر <strong>2 ماه یکبار</strong> برنامه‌ریزی شود</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>بررسی مجدد داروها برای جلوگیری از تداخلات دارویی ضروری است</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAnalysisSection;