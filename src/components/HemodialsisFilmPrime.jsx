import { Link, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaPlay,
  FaYoutube,
  FaDownload,
  FaClock,
  FaCalendarAlt,
  FaShareAlt,
  FaFilter,
  FaSearch,
  FaStar,
  FaHeart,
  FaEye,
  FaBookmark,
  FaThumbsUp
} from "react-icons/fa";
import { FiFilm, FiChevronDown, FiGrid, FiList } from "react-icons/fi";
import { useState, useEffect } from "react";

export function HemodialsisFilmPrime() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("همه ویدیوها");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  const videos = [
    {
      id: 1,
      title: "پرایم دستگاه همودیالیز فریزینیوس 4008S",
      description: "آموزش کامل پرایم کردن دستگاه فریزینیوس با نرمال سالین",
      duration: "12:45",
      category: "پرایم استاندارد",
      date: "۱۴۰۲/۱۰/۱۵",
      views: "۲,۴۵۰ بازدید",
      likes: 245,
      isFeatured: true,
      rating: 4.8,
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
      likes: 189,
      isFeatured: false,
      rating: 4.5,
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
      likes: 312,
      isFeatured: true,
      rating: 4.9,
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
      likes: 98,
      isFeatured: false,
      rating: 4.2,
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
      likes: 456,
      isFeatured: true,
      rating: 4.7,
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
      likes: 123,
      isFeatured: false,
      rating: 4.6,
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
    { id: "all", name: "همه ویدیوها", count: videos.length },
    { id: "standard", name: "پرایم استاندارد", count: videos.filter(v => v.category === "پرایم استاندارد").length },
    { id: "setup", name: "ست کردن دستگاه", count: videos.filter(v => v.category === "ست کردن دستگاه").length },
    { id: "advanced", name: "پرایم پیشرفته", count: videos.filter(v => v.category === "پرایم پیشرفته").length },
    { id: "kids", name: "پرایم کودکان", count: videos.filter(v => v.category === "پرایم کودکان").length },
    { id: "comprehensive", name: "آموزش جامع", count: videos.filter(v => v.category === "آموزش جامع").length },
    { id: "featured", name: "ویژه", count: videos.filter(v => v.isFeatured).length }
  ];

  const difficulties = ["همه", "آسان", "متوسط", "پیشرفته"];
  const brands = ["همه", "Fresenius", "B.Braun", "Multiple Brands"];

  // فیلتر ویدیوها بر اساس انتخاب کاربر
  const filteredVideos = videos.filter(video => {
    // فیلتر بر اساس دسته‌بندی
    const categoryFilter = activeFilter === "همه ویدیوها" || 
                         (activeFilter === "ویژه" && video.isFeatured) ||
                         video.category === activeFilter;
    
    // فیلتر بر اساس جستجو
    const searchFilter = searchTerm === "" || 
                        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        video.details.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return categoryFilter && searchFilter;
  });

  // مرتب‌سازی ویدیوها
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch(sortBy) {
      case "newest":
        return new Date(b.date.replace(/\//g, '-')) - new Date(a.date.replace(/\//g, '-'));
      case "views":
        return parseInt(b.views.replace(/[^\d]/g, '')) - parseInt(a.views.replace(/[^\d]/g, ''));
      case "likes":
        return b.likes - a.likes;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'آسان': return 'bg-green-100 text-green-800 border-green-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'پیشرفته': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleFavorite = (videoId) => {
    if (favorites.includes(videoId)) {
      setFavorites(favorites.filter(id => id !== videoId));
    } else {
      setFavorites([...favorites, videoId]);
    }
  };

  const handleWatchVideo = (videoId) => {
    // در اینجا می‌توانید به صفحه پخش ویدیو هدایت کنید
    alert(`پخش ویدیو ${videoId}`);
    // یا:
    // navigate(`/video/${videoId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4 md:p-6">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* هدر   */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4 flex-1">
              <div>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg">
                  <FiFilm className="text-white" size={36} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                   آموزش‌های تصویری همودیالیز
                </h1>
                <p className="text-gray-600">
                  آموزش حرفه‌ای پرایم و ست کردن انواع دستگاه‌های دیالیز
                </p>
              </div>
            </div>
            
            <Link
              to="/hemo/hemodialysisPrime"
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:shadow-lg group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">بازگشت</span>
            </Link>
          </div>

          {/* نوار جستجو و فیلتر */}
          <div className="mb-6">
            <div className="relative mb-6">
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="جستجوی ویدیو (عنوان، توضیحات، تگ‌ها)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* دسته‌بندی‌ها */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeFilter === category.name
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* کنترل‌های نمایش */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-md" : "hover:bg-gray-200"}`}
                  >
                    <FiGrid className={viewMode === "grid" ? "text-blue-600" : "text-gray-600"} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-md" : "hover:bg-gray-200"}`}
                  >
                    <FiList className={viewMode === "list" ? "text-blue-600" : "text-gray-600"} />
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                >
                  <option value="newest">جدیدترین</option>
                  <option value="views">پربازدیدترین</option>
                  <option value="likes">پرطرفدارترین</option>
                  <option value="rating">بالاترین امتیاز</option>
                </select>
              </div>
            </div>
          </div>

          {/* اطلاعات فیلتر */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-4">
              <FaFilter className="text-blue-600" />
              <div>
                <span className="text-gray-600">فیلتر فعال:</span>
                <span className="font-bold text-blue-700 mr-2"> {activeFilter}</span>
                {searchTerm && (
                  <>
                    <span className="text-gray-600">، جستجو:</span>
                    <span className="font-bold text-green-700 mr-2"> "{searchTerm}"</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-bold text-blue-600">{filteredVideos.length}</span> ویدیو یافت شد
            </div>
          </div>
        </div>

        {/* لیست ویدیوها */}
        {filteredVideos.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">ویدیویی یافت نشد</h3>
            <p className="text-gray-600 mb-6">لطفاً فیلترهای جستجو را تغییر دهید یا عبارت دیگری جستجو کنید.</p>
            <button
              onClick={() => {
                setActiveFilter("همه ویدیوها");
                setSearchTerm("");
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              نمایش همه ویدیوها
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 mb-12 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {sortedVideos.map((video) => (
              <div
                key={video.id}
                className={`bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 ${
                  viewMode === "grid" 
                    ? "hover:-translate-y-2" 
                    : "flex flex-col md:flex-row"
                }`}
              >
                {/* تامبنیل ویدیو */}
                <div className={`relative overflow-hidden ${
                  viewMode === "grid" 
                    ? "h-56" 
                    : "md:w-64 md:flex-shrink-0 h-48 md:h-auto"
                }`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${video.thumbnailColor}`}>
                    {video.isFeatured && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        ویژه ⭐
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => handleWatchVideo(video.id)}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group hover:bg-white/30 transition-all transform hover:scale-110"
                    >
                      <FaPlay className="text-white ml-1" size={24} />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-black/70 text-white px-3 py-1 rounded-xl text-sm">
                      {video.duration}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-xl text-sm font-semibold shadow-sm">
                      {video.category}
                    </span>
                  </div>
                </div>

                {/* اطلاعات ویدیو */}
                <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                      {video.title}
                    </h3>
                    <button
                      onClick={() => handleFavorite(video.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FaHeart className={favorites.includes(video.id) ? "fill-red-500 text-red-500" : ""} />
                    </button>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {video.description}
                  </p>

                  {/* امتیاز و آمار */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                      <FaStar />
                      <span className="font-bold">{video.rating}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaEye />
                        {video.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaThumbsUp />
                        {video.likes}
                      </span>
                    </div>
                  </div>

                  {/* جزئیات فنی */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
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
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">سطح:</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(video.details.difficulty)} border`}>
                        {video.details.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* تگ‌ها */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {video.details.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                        onClick={() => setSearchTerm(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* تاریخ و دکمه‌ها */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaCalendarAlt />
                      <span>{video.date}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleWatchVideo(video.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                      >
                        <FaPlay size={14} />
                        <span>تماشا</span>
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                        <FaBookmark />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* بخش ویژگی‌ها */}
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-3xl shadow-2xl p-8 mb-8 border border-blue-100">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            ✨ چرا آموزش تصویری؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 hover:bg-white/50 rounded-2xl transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaPlay className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">آموزش عملی</h3>
              <p className="text-gray-600 leading-relaxed">
                مشاهده تمام مراحل به صورت عملی و واقعی در محیط درمانی
              </p>
            </div>
            <div className="text-center p-6 hover:bg-white/50 rounded-2xl transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaClock className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">صرفه‌جویی زمانی</h3>
              <p className="text-gray-600 leading-relaxed">
                یادگیری سریع‌تر با ویدیوهای کوتاه و مؤثر
              </p>
            </div>
            <div className="text-center p-6 hover:bg-white/50 rounded-2xl transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaYoutube className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">کیفیت حرفه‌ای</h3>
              <p className="text-gray-600 leading-relaxed">
                کیفیت 4K با توضیحات کامل صوتی و زیرنویس
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default HemodialsisFilmPrime;