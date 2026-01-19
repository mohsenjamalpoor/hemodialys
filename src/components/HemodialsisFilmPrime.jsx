import { Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaPlay,
  FaYoutube,
  FaDownload,
  FaClock,
  FaCalendarAlt,
  FaShareAlt
} from "react-icons/fa";
import { FiFilm } from "react-icons/fi";



export function HemodialsisFilmPrime() {
  const videos = [
    {
      id: 1,
      title: "پرایم دستگاه همودیالیز فریزینیوس 4008S",
      description: "آموزش کامل پرایم کردن دستگاه فریزینیوس با نرمال سالین",
      duration: "12:45",
      category: "پرایم استاندارد",
      date: "۱۴۰۲/۱۰/۱۵",
      views: "۲,۴۵۰ بازدید",
      thumbnailColor: "from-blue-500 to-blue-700",
      details: {
        brand: "Fresenius",
        model: "4008S",
        primingType: "Normal Saline",
        difficulty: "آسان",
        tags: ["پرایم اولیه", "سالین", "آموزش مقدماتی"]
      }
    },
    {
      id: 2,
      title: "ست کردن دستگاه همودیالیز ببران",
      description: "نحوه صحیح ست کردن و راه اندازی دستگاه همودیالیز ببران",
      duration: "18:30",
      category: "ست کردن دستگاه",
      date: "۱۴۰۲/۱۱/۰۲",
      views: "۱,۸۹۰ بازدید",
      thumbnailColor: "from-green-500 to-green-700",
      details: {
        brand: "B.Braun",
        model: "Dialog+",
        primingType: "Heparinized Saline",
        difficulty: "متوسط",
        tags: ["ست کردن", "هپارینه", "راه اندازی"]
      }
    },
    {
      id: 3,
      title: "پرایم با نرمال سالین و هپارین",
      description: "آموزش پرایم کردن دستگاه با محلول سالین هپارینه شده",
      duration: "15:20",
      category: "پرایم پیشرفته",
      date: "۱۴۰۲/۰۹/۲۸",
      views: "۳,۱۲۰ بازدید",
      thumbnailColor: "from-purple-500 to-purple-700",
      details: {
        brand: "Fresenius",
        model: "5008S",
        primingType: "Heparinized Saline",
        difficulty: "متوسط",
        tags: ["هپارینه", "ضدانعقاد", "پیشرفته"]
      }
    },
    {
      id: 4,
      title: "پرایم دستگاه با محلول پرایمینگ",
      description: "آموزش استفاده از محلول های مخصوص پرایم",
      duration: "22:10",
      category: "پرایم تخصصی",
      date: "۱۴۰۲/۱۱/۲۰",
      views: "۹۸۰ بازدید",
      thumbnailColor: "from-orange-500 to-orange-700",
      details: {
        brand: "Multiple Brands",
        model: "Various",
        primingType: "Priming Solution",
        difficulty: "پیشرفته",
        tags: ["پرایمینگ", "محلول مخصوص", "تخصصی"]
      }
    },
    {
      id: 5,
      title: "آموزش جامع ست کردن دیالیز",
      description: "مراحل کامل از ست کردن تا شروع دیالیز",
      duration: "25:45",
      category: "آموزش جامع",
      date: "۱۴۰۲/۱۰/۰۵",
      views: "۴,۵۶۰ بازدید",
      thumbnailColor: "from-red-500 to-red-700",
      details: {
        brand: "Fresenius",
        model: "4008S",
        primingType: "Complete Setup",
        difficulty: "متوسط",
        tags: ["جامع", "از صفر تا صد", "عملی"]
      }
    },
    {
      id: 6,
      title: "پرایم دستگاه همودیالیز برای کودکان",
      description: "ملاحظات ویژه پرایم کردن برای بیماران کودکان",
      duration: "14:35",
      category: "پرایم کودکان",
      date: "۱۴۰۲/۱۱/۱۵",
      views: "۱,۲۳۰ بازدید",
      thumbnailColor: "from-pink-500 to-pink-700",
      details: {
        brand: "Fresenius",
        model: "4008S",
        primingType: "Pediatric Priming",
        difficulty: "پیشرفته",
        tags: ["کودکان", "حجم کم", "ویژه"]
      }
    }
  ];

  const categories = [
    "همه ویدیوها",
    "پرایم استاندارد",
    "ست کردن دستگاه",
    "پرایم پیشرفته",
    "پرایم کودکان",
    "آموزش جامع"
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'آسان': return 'bg-green-100 text-green-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'پیشرفته': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FiFilm className="text-blue-600" size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  فیلم های آموزشی پرایم و ست کردن دستگاه
                </h1>
                <p className="text-gray-600 mt-1">
                  آموزش تصویری پرایم کردن انواع دستگاه های همودیالیز
                </p>
              </div>
            </div>
            <Link
              to="/hemo/hemodialysisPrime"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft />
              <span>بازگشت</span>
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  index === 0 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3">
              <FaYoutube className="text-red-600" size={24} />
              <div>
                <h3 className="font-bold text-gray-800">کانال آموزشی همودیالیز</h3>
                <p className="text-sm text-gray-600">تمامی ویدیوها با کیفیت Full HD</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FaShareAlt />
                <span>اشتراک گذاری</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FaDownload />
                <span>دانلود همه</span>
              </button>
            </div>
          </div>
        </div>

        {/* لیست ویدیوها */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* تامبنیل ویدیو */}
              <div className={`h-48 bg-gradient-to-r ${video.thumbnailColor} relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center group hover:bg-opacity-30 transition-all cursor-pointer">
                    <FaPlay className="text-white ml-1" size={24} />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                    {video.duration}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {video.category}
                  </span>
                </div>
              </div>

              {/* اطلاعات ویدیو */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {video.description}
                </p>

                {/* جزئیات فنی */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">برند:</span>
                    <span className="text-sm font-medium">{video.details.brand}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">مدل:</span>
                    <span className="text-sm font-medium">{video.details.model}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">نوع پرایم:</span>
                    <span className="text-sm font-medium">{video.details.primingType}</span>
                  </div>
                </div>

                {/* سطح دشواری */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">سطح دشواری:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(video.details.difficulty)}`}>
                    {video.details.difficulty}
                  </span>
                </div>

                {/* تگ‌ها */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {video.details.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* اطلاعات آماری */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt />
                      <span>{video.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock />
                      <span>{video.views}</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <FaPlay size={14} />
                    <span>تماشا کنید</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* بخش ویژگی‌ها */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            ویژگی‌های آموزش‌های تصویری
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPlay className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">آموزش عملی</h3>
              <p className="text-gray-600">
                نمایش تمام مراحل به صورت عملی و گام به گام
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-green-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">مدت زمان بهینه</h3>
              <p className="text-gray-600">
                ویدیوهای کوتاه و مؤثر برای یادگیری سریع
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaYoutube className="text-purple-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">کیفیت بالا</h3>
              <p className="text-gray-600">
                کیفیت Full HD با توضیحات کامل صوتی
              </p>
            </div>
          </div>
        </div>

        {/* راهنما */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold mb-4">نکات مهم آموزشی</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="ml-3">🎯</span>
              <span>قبل از انجام پرایم، حتماً دستورالعمل دستگاه را مطالعه کنید</span>
            </li>
            <li className="flex items-start">
              <span className="ml-3">⚠️</span>
              <span>در صورت بروز هرگونه مشکل، ویدیو را متوقف و با سوپروایزر تماس بگیرید</span>
            </li>
            <li className="flex items-start">
              <span className="ml-3">📝</span>
              <span>پس از مشاهده هر ویدیو، حتماً تمرین عملی انجام دهید</span>
            </li>
            <li className="flex items-start">
              <span className="ml-3">💡</span>
              <span>برای دستگاه‌های مختلف، مراحل ممکن است کمی متفاوت باشد</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HemodialsisFilmPrime;