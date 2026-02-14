// تابع تبدیل تاریخ میلادی به شمسی
const convertToPersianDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    calendar: 'persian',
    
  };
  
  return new Intl.DateTimeFormat('fa-IR', options).format(date);
};

export {convertToPersianDate}