export const filters = [
  {
    id: "F4",
    name: "F4",
    suitableFor: "نوزادان و شیرخواران کم‌وزن (<15 کیلوگرم)",
    description: "صافی کوچک با حجم پرایم کم - مناسب برای بیماران ناپایدار و نوزادان",
    minWeight: 0,
    maxWeight: 14.9,
    volume: "33 mL",  
    surfaceArea: "0.4 m²", 
    koa: "280 mL/min",   
    uf: "3.6 mL/h/mmHg", 
    tmp: "600 mmHg",
    bloodVolume: "33-45 mL", 
    preferredForUnstable: true,
    heparinVolume: "1.5-2 mL",  
    primeWith: "نرمال سالین یا آلبومین ۵٪"
  },
  {
    id: "F6",
    name: "F6",
    suitableFor: "شیرخواران و کودکان کوچک (15-20 کیلوگرم)",
    description: "توان پاکسازی متوسط - فشار مناسب برای بیماران با وضعیت بحرانی",
    minWeight: 15,
    maxWeight: 20,
    volume: "48 mL",
    surfaceArea: "0.6 m²",
    koa: "550 mL/min",
    uf: "6.3 mL/h/mmHg",
    tmp: "600 mmHg",
    bloodVolume: "48-65 mL",
    preferredForUnstable: true,
    heparinVolume: "2-3 mL",
    primeWith: "نرمال سالین یا آلبومین ۵٪"
  },
  {
    id: "PS10",
    name: "PS10",
    suitableFor: "کودکان (15-25 کیلوگرم)",
    description: "مناسب برای کودکان با وزن متوسط - کارایی خوب در حالت پایدار",
    minWeight: 15,
    maxWeight: 25,
    volume: "55 mL",
    surfaceArea: "1.0 m²",
    koa: "680 mL/min",
    uf: "6.4 mL/h/mmHg",
    tmp: "500 mmHg",
    bloodVolume: "55-75 mL",
    preferredForUnstable: false,
    heparinVolume: "3-4 mL",
    primeWith: "نرمال سالین"
  },
  {
    id: "PS13",
    name: "PS13",
    suitableFor: "کودکان بزرگ و نوجوانان (20-40 کیلوگرم)",
    description: "صافی بزرگ‌تر برای کودکان با وزن بالا - کارایی عالی در دیالیز مزمن",
    minWeight: 20,
    maxWeight: 40,
    volume: "75 mL",
    surfaceArea: "1.3 m²",
    koa: "880 mL/min",
    uf: "7.5 mL/h/mmHg",
    tmp: "500 mmHg",
    bloodVolume: "75-100 mL",
    preferredForUnstable: false,
    heparinVolume: "4-5 mL",
    primeWith: "نرمال سالین"
  },
  
  {
    id: "F3",
    name: "F3",
    suitableFor: "نوزادان با وزن بسیار کم (<5 کیلوگرم)",
    description: "کوچک‌ترین صافی - مخصوص نوزادان نارس و وزن بسیار کم",
    minWeight: 0,
    maxWeight: 5,
    volume: "25 mL",
    surfaceArea: "0.3 m²",
    koa: "180 mL/min",
    uf: "2.8 mL/h/mmHg",
    tmp: "500 mmHg",
    bloodVolume: "25-35 mL",
    preferredForUnstable: true,
    heparinVolume: "1-1.5 mL",
    primeWith: "آلبومین ۵٪ یا FFP"
  },
  {
    id: "F8",
    name: "F8",
    suitableFor: "کودکان 25-35 کیلوگرم",
    description: "تعادل خوب بین حجم و کارایی - برای کودکان با وزن متوسط رو به بالا",
    minWeight: 25,
    maxWeight: 35,
    volume: "65 mL",
    surfaceArea: "0.8 m²",
    koa: "720 mL/min",
    uf: "6.8 mL/h/mmHg",
    tmp: "600 mmHg",
    bloodVolume: "65-85 mL",
    preferredForUnstable: false,
    heparinVolume: "3.5-4.5 mL",
    primeWith: "نرمال سالین"
  }
];

// همچنین می‌توانید توابع کمکی اضافه کنید:
export const getRecommendedFilter = (weight, isUnstable = false) => {
  const availableFilters = filters.filter(f => 
    weight >= f.minWeight && weight <= f.maxWeight
  );
  
  if (availableFilters.length === 0) return null;
  
  // اولویت برای بیماران ناپایدار
  if (isUnstable) {
    const unstableFilters = availableFilters.filter(f => f.preferredForUnstable);
    if (unstableFilters.length > 0) {
      return unstableFilters[0]; // اولین فیلتر مناسب برای ناپایدار
    }
  }
  
  // برای بیماران پایدار، فیلتر با سطح تماس متوسط را انتخاب می‌کنیم
  return availableFilters[0];
};

export const getFilterByWeight = (weight) => {
  return filters.find(f => weight >= f.minWeight && weight <= f.maxWeight);
};

export const getAllFiltersForWeight = (weight) => {
  return filters.filter(f => weight >= f.minWeight && weight <= f.maxWeight);
};