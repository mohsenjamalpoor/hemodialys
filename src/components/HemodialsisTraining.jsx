import React, { useState } from 'react';

export default function HemodialsisTraining() {
  const [info, setInfo] = useState('');

  const handleArterialPressure = () => {
    setInfo(
      `✅ فشار شریانی (Arterial Pressure):
محدوده نرمال: -250 تا -100 mmHg

🔹 فشار خیلی منفی (مثلاً -300): احتمال گرفتگی در مسیر خون یا سرعت جریان بیش از حد
🔹 فشار نزدیک صفر: مشکل در دسترسی شریانی یا جابه‌جایی سوزن`
    );
  };

  const handleVenousPressure = () => {
    setInfo(
      `✅ فشار وریدی (Venous Pressure):
محدوده نرمال: +100 تا +250 mmHg

🔹 بالای +250: احتمال لخته یا جاگذاری نامناسب سوزن وریدی
🔹 خیلی پایین: شل بودن اتصال یا نشتی در مسیر بازگشت`
    );
  };

  const handleMembraneTypes = () => {
    setInfo(
      `🧪 انواع غشاء صافی:
🔹 Low-flux: نفوذپذیری کمتر – برای اورمی ساده
🔹 High-flux: نفوذپذیری بالا – حذف سموم با وزن مولکولی بالا
🔹 High-efficiency: سطح بیشتر – حذف سریع‌تر مواد
🔹 MCO/Super HF: برای مولکول‌های متوسط – نزدیک به هموفیلتراسیون`
    );
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-center">آموزش همودیالیز</h1>
      
      <div className="flex flex-col gap-2">
        <button
          onClick={handleArterialPressure}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          فشار شریانی
        </button>
        <button
          onClick={handleVenousPressure}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          فشار وریدی
        </button>
        <button
          onClick={handleMembraneTypes}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          انواع غشاء صافی
        </button>
      </div>

      {info && (
        <div className="bg-gray-100 p-4 rounded text-right whitespace-pre-wrap font-[IRANSans] leading-relaxed">
          {info}
        </div>
      )}
    </div>
  );
}
