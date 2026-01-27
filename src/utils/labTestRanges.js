

const labTestRanges = {
  // هماتولوژی - خونشناسی
 
      'WBC': { title: 'گلبول‌های سفید', normalRange: '4.5-11 ×10³/μL', unit: '×10³/μL' },
      'RBC': { title: 'گلبول‌های قرمز', normalRange: '4.7-6.1 ×10⁶/μL (مردان) / 4.2-5.4 ×10⁶/μL (زنان)', unit: '×10⁶/μL' },
      'HGB': { title: 'هموگلوبین', normalRange: '13.5-17.5 g/dL (مردان) / 12.0-15.5 g/dL (زنان)', unit: 'g/dL' },
      'HCT': { title: 'هماتوکریت', normalRange: '41-53% (مردان) / 36-46% (زنان)', unit: '%' },
      'MCV': { title: 'حجم متوسط گلبول قرمز', normalRange: '80-100 fL', unit: 'fL' },
      'MCH': { title: 'هموگلوبین متوسط در گلبول قرمز', normalRange: '27-33 pg', unit: 'pg' },
      'MCHC': { title: 'غلظت متوسط هموگلوبین در گلبول قرمز', normalRange: '32-36 g/dL', unit: 'g/dL' },
      'PLT': { title: 'پلاکت‌ها', normalRange: '150-450 ×10³/μL', unit: '×10³/μL' },
      'RDW': { title: 'توزیع عرض گلبول قرمز', normalRange: '11.5-14.5%', unit: '%' },

  
  // بیوشیمی خون
  'FBS': {
    title: 'قند خون ناشتا',
    normalRange: '70-100 mg/dL',
    unit: 'mg/dL',
    notes: 'بالای 126 دیابت'
  },
  
  'PPBS': {
    title: 'قند خون بعد از غذا',
    normalRange: 'کمتر از 140 mg/dL',
    unit: 'mg/dL',
    notes: '2 ساعت بعد از غذا'
  },
  
  'HbA1c': {
    title: 'هموگلوبین گلیکوزیله',
    normalRange: '4-5.6%',
    unit: '%',
    notes: 'بالای 6.5% دیابت'
  },
  
  'BUN': {
    title: 'نیتروژن اوره خون',
    normalRange: '7-20 mg/dL',
    unit: 'mg/dL'
  },
  
  'Creatinine': {
    title: 'کراتینین',
    normalRange: '0.7-1.3 mg/dL (مردان) / 0.6-1.1 mg/dL (زنان)',
    unit: 'mg/dL'
  },
  
  'Uric Acid': {
    title: 'اسید اوریک',
    normalRange: '3.4-7.0 mg/dL (مردان) / 2.4-6.0 mg/dL (زنان)',
    unit: 'mg/dL'
  },
  
  'Total Cholesterol': {
    title: 'کلسترول تام',
    normalRange: 'کمتر از 200 mg/dL',
    unit: 'mg/dL',
    category: {
      'مطلوب': 'کمتر از 200',
      'مرزی': '200-239',
      'بالا': '240 و بالاتر'
    }
  },
  
  'LDL': {
    title: 'کلسترول بد',
    normalRange: 'کمتر از 100 mg/dL',
    unit: 'mg/dL',
    category: {
      'مطلوب': 'کمتر از 100',
      'نزدیک به مطلوب': '100-129',
      'مرزی': '130-159',
      'بالا': '160-189',
      'خیلی بالا': '190 و بالاتر'
    }
  },
  
  'HDL': {
    title: 'کلسترول خوب',
    normalRange: 'بالای 40 mg/dL (مردان) / بالای 50 mg/dL (زنان)',
    unit: 'mg/dL'
  },
  
  'Triglycerides': {
    title: 'تری‌گلیسیرید',
    normalRange: 'کمتر از 150 mg/dL',
    unit: 'mg/dL'
  },
  
  'AST': {
    title: 'آسپارتات آمینوترانسفراز',
    normalRange: '10-40 U/L',
    unit: 'U/L'
  },
  
  'ALT': {
    title: 'آلانین آمینوترانسفراز',
    normalRange: '7-56 U/L',
    unit: 'U/L'
  },
  
  'ALP': {
    title: 'آلکالین فسفاتاز',
    normalRange: '44-147 U/L',
    unit: 'U/L'
  },
  
  'Total Bilirubin': {
    title: 'بیلی‌روبین تام',
    normalRange: '0.3-1.2 mg/dL',
    unit: 'mg/dL'
  },
  
  'Direct Bilirubin': {
    title: 'بیلی‌روبین مستقیم',
    normalRange: '0-0.3 mg/dL',
    unit: 'mg/dL'
  },
  
  'Total Protein': {
    title: 'پروتئین تام',
    normalRange: '6.4-8.3 g/dL',
    unit: 'g/dL'
  },
  
  'Albumin': {
    title: 'آلبومین',
    normalRange: '3.5-5.0 g/dL',
    unit: 'g/dL'
  },
  
  'Globulin': {
    title: 'گلبولین',
    normalRange: '2.0-3.5 g/dL',
    unit: 'g/dL'
  },
  
  'Na': {
    title: 'سدیم',
    normalRange: '135-145 mEq/L',
    unit: 'mEq/L'
  },
  
  'Potassium': {
    title: 'پتاسیم',
    normalRange: '3.5-5.0 mEq/L',
    unit: 'mEq/L'
  },
  
  'Calcium': {
    title: 'کلسیم',
    normalRange: '8.6-10.2 mg/dL',
    unit: 'mg/dL'
  },
  
  'Phosphorus': {
    title: 'فسفر',
    normalRange: '2.5-4.5 mg/dL',
    unit: 'mg/dL'
  },
  
  'Mg': {
    title: 'منیزیم',
    normalRange: '1.7-2.2 mg/dL',
    unit: 'mg/dL'
  },
  
  // هورمون‌ها
  'TSH': {
    title: 'هورمون تحریک کننده تیروئید',
    normalRange: '0.4-4.0 mIU/L',
    unit: 'mIU/L'
  },
  
  'T4': {
    title: 'تیروکسین',
    normalRange: '4.5-12.5 μg/dL',
    unit: 'μg/dL'
  },
  
  'T3': {
    title: 'تری‌یدوتیرونین',
    normalRange: '80-200 ng/dL',
    unit: 'ng/dL'
  },
  
  'FT4': {
    title: 'تیروکسین آزاد',
    normalRange: '0.8-1.8 ng/dL',
    unit: 'ng/dL'
  },
  
  // آزمایشات ادرار
  'Urine Specific Gravity': {
    title: 'وزن مخصوص ادرار',
    normalRange: '1.005-1.030',
    unit: ''
  },
  
  'Urine pH': {
    title: 'پی‌اچ ادرار',
    normalRange: '4.6-8.0',
    unit: ''
  },
  
  // آنزیم‌ها
  'Amylase': {
    title: 'آمیلاز',
    normalRange: '30-110 U/L',
    unit: 'U/L'
  },
  
  'Lipase': {
    title: 'لیپاز',
    normalRange: '13-60 U/L',
    unit: 'U/L'
  },
  
  // کوانتومان
  'CPK': {
    title: 'کراتین فسفوکیناز',
    normalRange: '30-200 U/L',
    unit: 'U/L'
  },
  
  'LDH': {
    title: 'لاکتات دهیدروژناز',
    normalRange: '140-280 U/L',
    unit: 'U/L'
  },
  
  // نشانگرهای التهابی
  'CRP': {
    title: 'پروتئین واکنشی C',
    normalRange: 'کمتر از 10 mg/L',
    unit: 'mg/L'
  },
  
  'ESR': {
    title: 'سرعت رسوب گلبول قرمز',
    normalRange: '0-20 mm/hr (مردان) / 0-30 mm/hr (زنان)',
    unit: 'mm/hr'
  },
  
  // انعقادی
  'PT': {
    title: 'زمان پروترومبین',
    normalRange: '11-13.5 ثانیه',
    unit: 'ثانیه'
  },
  
  'PTT': {
    title: 'زمان ترومبوپلاستین جزئی',
    normalRange: '25-35 ثانیه',
    unit: 'ثانیه'
  },
  
  'INR': {
    title: 'نسبت نرمال شده بین‌المللی',
    normalRange: '0.8-1.2',
    unit: ''
  },
  
  // آهن
  'Iron': {
    title: 'آهن',
    normalRange: '60-170 μg/dL (مردان) / 50-170 μg/dL (زنان)',
    unit: 'μg/dL'
  },
  
  'TIBC': {
    title: 'ظرفیت کلی اتصال آهن',
    normalRange: '240-450 μg/dL',
    unit: 'μg/dL'
  },
  
  'Ferritin': {
    title: 'فریتین',
    normalRange: '30-400 ng/mL (مردان) / 15-150 ng/mL (زنان)',
    unit: 'ng/mL'
  },
  
  // ویتامین‌ها
  'Vitamin D': {
    title: 'ویتامین D',
    normalRange: '30-100 ng/mL',
    unit: 'ng/mL',
    category: {
      'کمبود شدید': 'کمتر از 10',
      'کمبود': '10-30',
      'کافی': '30-100',
      'زیاد': '100-150',
      'مسمومیت': 'بالای 150'
    }
  },
  
  'Vitamin B12': {
    title: 'ویتامین B12',
    normalRange: '200-900 pg/mL',
    unit: 'pg/mL'
  },
  
  'Folic Acid': {
    title: 'اسید فولیک',
    normalRange: '2.7-17.0 ng/mL',
    unit: 'ng/mL'
  },
  
  // هورمون‌های جنسی
  'Testosterone': {
    title: 'تستوسترون',
    normalRange: '300-1000 ng/dL (مردان) / 15-70 ng/dL (زنان)',
    unit: 'ng/dL'
  },
  
  'Estradiol': {
    title: 'استرادیول',
    normalRange: '10-40 pg/mL (مردان) / 30-400 pg/mL (زنان)',
    unit: 'pg/mL'
  },
  
  'Progesterone': {
    title: 'پروژسترون',
    normalRange: 'کمتر از 1 ng/mL (مردان) / متغیر بر اساس چرخه قاعدگی',
    unit: 'ng/mL'
  }
};

// لیست تمام آزمایشات برای autocomplete
const allTests = Object.keys(labTestRanges).map(key => ({
  value: key,
  label: labTestRanges[key].title,
  normalRange: labTestRanges[key].normalRange
}));

// تابع جستجوی آزمایش
const searchTest = (query) => {
  const searchTerm = query.toLowerCase();
  return allTests.filter(test => 
    test.label.toLowerCase().includes(searchTerm) || 
    test.value.toLowerCase().includes(searchTerm)
  );
};

// تابع گرفتن اطلاعات آزمایش بر اساس نام
const getTestInfo = (testName) => {
  return labTestRanges[testName] || null;
};

// تابع بررسی نرمال بودن نتیجه
const checkIfNormal = (testName, result) => {
  const testInfo = getTestInfo(testName);
  if (!testInfo || !testInfo.normalRange || !result) return 'unknown';
  
  try {
    const numResult = parseFloat(result);
    const rangeStr = testInfo.normalRange.toString();
    
    // بررسی انواع مختلف محدوده
    if (rangeStr.includes('-')) {
      const rangeParts = rangeStr.split('-').map(p => parseFloat(p.trim()));
      if (rangeParts.length === 2 && !isNaN(numResult)) {
        return numResult >= rangeParts[0] && numResult <= rangeParts[1] ? 'normal' : 'abnormal';
      }
    } else if (rangeStr.includes('کمتر از')) {
      const limit = parseFloat(rangeStr.replace('کمتر از', '').trim());
      return numResult < limit ? 'normal' : 'abnormal';
    } else if (rangeStr.includes('بالاتر از') || rangeStr.includes('بالای')) {
      const limit = parseFloat(rangeStr.replace(/بالاتر از|بالای/g, '').trim());
      return numResult > limit ? 'normal' : 'abnormal';
    }
    
    return 'unknown';
  } catch {
    return 'unknown';
  }
};

export {
  labTestRanges,
  allTests,
  searchTest,
  getTestInfo,
  checkIfNormal
};