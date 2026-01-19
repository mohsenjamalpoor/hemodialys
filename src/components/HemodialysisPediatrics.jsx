
import { Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaChild, 
  FaHeartbeat, 
  FaBed, 
  FaExclamationTriangle,
} from "react-icons/fa";

export function HemodialysisPediatrics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* هدر */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaChild className="text-blue-600" size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  همودیالیز اطفال
                </h1>
                <p className="text-gray-600 mt-1">
                  انتخاب وضعیت بیمار برای محاسبه تنظیمات دستگاه  همودیالیز
                </p>
              </div>
            </div>
            <Link
              to="/hemo"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft />
              <span>بازگشت</span>
            </Link>
          </div>
        </div>

        {/* کارت‌های انتخاب */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* وضعیت پایدار */}
          <Link
            to="/hemo/dialysisAssistant/stable"
            className="block group"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg p-8 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl h-full">
              <div className="flex flex-col items-center text-center">
                <div className="bg-white bg-opacity-20 p-4 rounded-full mb-6">
                  <FaHeartbeat size={36} />
                </div>
                <h2 className="text-2xl font-bold mb-3">وضعیت پایدار</h2>
                <p className="text-white text-opacity-90 mb-6 leading-relaxed">
                  بیماران همودینامیک پایدار<br />
                  بدون نیاز به ونتیلاتور<br />
                  فشار خون مناسب
                </p>
               
              </div>
            </div>
          </Link>

          {/* وضعیت ناپایدار */}
          <Link
            to="/hemo/dialysisAssistant/unstable"
            className="block group"
          >
            <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-2xl shadow-lg p-8 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl h-full">
              <div className="flex flex-col items-center text-center">
                <div className="bg-white bg-opacity-20 p-4 rounded-full mb-6">
                  <FaBed size={36} />
                </div>
                <h2 className="text-2xl font-bold mb-3">وضعیت ناپایدار / اینتوبه</h2>
                <p className="text-white text-opacity-90 mb-6 leading-relaxed">
                  بیماران تحت ونتیلاتور<br />
                  همودینامیک ناپایدار<br />
                  نیاز به اینوتروپ
                </p>
                
              </div>
            </div>
          </Link>
        </div>

        {/* راهنما */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            راهنمای انتخاب وضعیت
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <h4 className="font-bold text-green-700 mb-2">پایدار (Stable)</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 ml-2">✓</span>
                  <span>همودینامیک پایدار</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 ml-2">✓</span>
                  <span>بدون نیاز به ونتیلاتور</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 ml-2">✓</span>
                  <span>فشار خون مناسب</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 ml-2">✓</span>
                  <span>دیالیز انتخابی</span>
                </li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <h4 className="font-bold text-red-700 mb-2">ناپایدار/اینتوبه (Unstable)</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-red-500 ml-2">✓</span>
                  <span>تحت ونتیلاتور</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 ml-2">✓</span>
                  <span>همودینامیک ناپایدار</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 ml-2">✓</span>
                  <span>نیاز به اینوتروپ</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 ml-2">✓</span>
                  <span>دیالیز اورژانسی</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}