import { Link } from "react-router-dom";
import { 
  FaArrowLeft, 

  FaCog,
  FaPlay,
  FaCheckCircle,
  FaShieldAlt,
  FaBookMedical,
  FaVideo,
  FaStar,
  FaClock,
  FaUsers
} from "react-icons/fa";
import { FiFilm, FiSettings, FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";

export function HemodialysisPrime() {
  const features = [
    {
      icon: <FaShieldAlt className="text-blue-500" />,
      title: "ایمنی بالا",
      description: "رعایت تمام پروتکل‌های ایمنی"
    },
    {
      icon: <FaClock className="text-green-500" />,
      title: "صرفه‌جویی در زمان",
      description: "آموزش سریع و مؤثر"
    },
    {
      icon: <FaCheckCircle className="text-emerald-500" />,
      title: "تایید شده",
      description: "بر اساس استانداردهای جهانی"
    },
    {
      icon: <FaUsers className="text-purple-500" />,
      title: "تجربه کاربران",
      description: "بر اساس نظرات پرستاران"
    }
  ];

  const stats = [
    { value: "۹۸٪", label: "رضایت کاربران" },
    { value: "۴۵+", label: "ویدیو آموزشی" },
    { value: "۱۵", label: "دستگاه مختلف" },
    { value: "۱۰۰۰+", label: "دانش‌آموخته" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4 md:p-6">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 -right-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* هدر بهبود یافته */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-white to-blue-50 rounded-3xl shadow-2xl p-8 mb-12 border border-blue-100"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg">
                    <FiSettings className="text-white" size={30} />
                  </div>
                </div>
                <div>
                  <span className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                     پرایم و ست کردن دستگاه همودیالیز
                  </span>
                  <p className="text-gray-600 mt-3 text-lg">
                    آموزش جامع و تخصصی پرایم انواع دستگاه‌های همو دیالیز   
                  </p>
                </div>
              </div>

           
            </div>

            <div className="lg:w-auto">
              <Link
                to="/hemo"
                className="flex items-center gap-3 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:shadow-lg group"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">بازگشت به صفحه اصلی</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* کارت‌های انتخاب بهبود یافته */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* پرایم کردن - کارت چپ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/hemo/priming4008" className="block group">
              <div className="relative h-full overflow-hidden rounded-3xl shadow-2xl">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600"></div>
                
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="relative z-10 p-8 h-full">
                  <div className="flex flex-col items-center text-center h-full">
                    {/* Icon with Animation */}
                    <div className=" mb-8">
                      <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                        <FaCog className="text-white" size={36} />
                      </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4">پرایم دستگاه</h2>
                    
                    <div className="space-y-4 mb-8 flex-1">
                      <div className="flex items-center justify-center gap-3">
                        <FaCheckCircle className="text-emerald-200" />
                        <span className="text-white/90">پرایم استاندارد با نرمال سالین</span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <FaCheckCircle className="text-emerald-200" />
                        <span className="text-white/90">پرایم پیشرفته با هپارین</span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <FaCheckCircle className="text-emerald-200" />
                        <span className="text-white/90">پرایم تخصصی کودکان</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="w-full">
                      <div className="inline-flex items-center gap-3 px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                        <span>شروع پرایم</span>
                        <FaPlay className="mr-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* فیلم های آموزشی - کارت راست */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/hemo/hemodialsisFilmPrime" className="block group">
              <div className="relative h-full overflow-hidden rounded-3xl shadow-2xl">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500"></div>
                
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 -translate-x-1/2"></div>
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-y-1/2 translate-x-1/2"></div>
                </div>

                <div className="relative z-10 p-8 h-full">
                  <div className="flex flex-col items-center text-center h-full">
                    {/* Icon with Animation */}
                    <div className=" mb-8">
                      <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                        <FiFilm className="text-white" size={36} />
                      </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4">آموزش تصویری</h2>
                    
                    <div className="space-y-4 mb-8 flex-1">
                      <div className="flex items-center justify-center gap-3">
                        <FaVideo className="text-blue-200" />
                        <span className="text-white/90">ویدیوهای HD با کیفیت بالا</span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <FaStar className="text-blue-200" />
                        <span className="text-white/90">آموزش‌های عملی و کاربردی</span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <FaBookMedical className="text-blue-200" />
                        <span className="text-white/90">متن‌های آموزشی کامل</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="w-full">
                      <div className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                        <span>مشاهده ویدیوها</span>
                        <FaPlay className="mr-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* ویژگی‌های منحصربه‌فرد */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4"> چرا آموزش‌های ما؟</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              آموزش‌های تخصصی طراحی شده توسط متخصصان همودیالیز با سال‌ها تجربه عملی
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* راهنمای انتخاب پیشرفته */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-r from-white to-amber-50 rounded-3xl shadow-xl p-8 border border-amber-100"
        >
          <div className="flex items-start gap-4 mb-8">
            <div className="bg-amber-100 p-3 rounded-xl">
              <FiAlertTriangle className="text-amber-600" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2"> راهنمای انتخاب مناسب</h3>
              <p className="text-gray-600">
                بر اساس سطح تخصص و نیاز خود، بهترین روش یادگیری را انتخاب کنید
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <FaCog className="text-emerald-600" />
                </div>
                <h4 className="text-xl font-bold text-emerald-700">پرایم کردن دستگاه</h4>
              </div>
              <ul className="space-y-3">
                {[
                  "آموزش گام به گام پرایم استاندارد",
                  "نکات ایمنی و کنترل کیفی",
                  "رفع مشکلات رایج پرایم",
                  "پرایم ویژه کودکان و بیماران خاص",
                  "بررسی خطاها و عیب‌یابی"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <FaCheckCircle className="text-emerald-500 text-sm" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-emerald-200">
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <FaStar className="text-amber-500" />
                  <span>مناسب برای: تکنسین‌های تازه‌کار و پرستاران</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FiFilm className="text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-blue-700">فیلم های آموزشی</h4>
              </div>
              <ul className="space-y-3">
                {[
                  "ویدیوهای Full HD با کیفیت بالا",
                  "آموزش عملی روی دستگاه واقعی",
                  "متن و زیرنویس فارسی",
                  "دانلود و مشاهده آفلاین",
                  "آپدیت ماهانه ویدیوها"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <FaCheckCircle className="text-blue-500 text-sm" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <FaStar className="text-amber-500" />
                  <span>مناسب برای: آموزش‌های تیم‌های درمانی و دانشجویان</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}