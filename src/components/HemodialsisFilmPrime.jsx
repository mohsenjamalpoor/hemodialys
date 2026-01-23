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
  FaThumbsUp,
  FaUser,
  FaTag,
  FaLayerGroup,
  FaCheckCircle,
  FaCertificate,
  FaMobileAlt
} from "react-icons/fa";
import { FiFilm, FiChevronDown, FiGrid, FiList, FiMonitor } from "react-icons/fi";
import { useState, useEffect } from "react";
import { BsCameraVideo, BsClockHistory } from "react-icons/bs";
import { AiOutlineLike, AiOutlineEye } from "react-icons/ai";

export function HemodialsisFilmPrime() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("همه ویدیوها");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [hoveredVideo, setHoveredVideo] = useState(null);

  const videos = [
    {
      id: 1,
      title: "پرایم دستگاه همودیالیز فریزینیوس 4008S",
      description: "آموزش کامل پرایم کردن دستگاه فریزینیوس با نرمال سالین",
      duration: "12:45",
      category: "پرایم استاندارد",
      date: "۱۴۰۲/۱۰/۱۵",
      views: "۲,۴۵۰",
      likes: 245,
      isFeatured: true,
      rating: 4.8,
      instructor: "دکتر حیدری",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmadi",
      level: "مقدماتی",
      progress: 85,
      details: {
        brand: "Fresenius",
        model: "4008S",
        primingType: "Normal Saline",
        difficulty: "آسان",
        tags: ["پرایم اولیه", "سالین", "آموزش مقدماتی"],
        equipment: ["دستگاه 4008S", "سالین نرمال", "ست دیالیز"]
      }
    },
    {
      id: 2,
      title: "ست کردن دستگاه همودیالیز ببران",
      description: "نحوه صحیح ست کردن و راه اندازی دستگاه همودیالیز ببران",
      duration: "18:30",
      category: "ست کردن دستگاه",
      date: "۱۴۰۲/۱۱/۰۲",
      views: "۱,۸۹۰",
      likes: 189,
      isFeatured: false,
      rating: 4.5,
      instructor: "مهندس جمالپور",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=karimi",
      level: "متوسط",
      progress: 60,
      details: {
        brand: "B.Braun",
        model: "Dialog+",
        primingType: "Heparinized Saline",
        difficulty: "متوسط",
        tags: ["ست کردن", "هپارینه", "راه اندازی"],
        equipment: ["دستگاه Dialog+", "هپارین", "ست مخصوص"]
      }
    },
    {
      id: 3,
      title: "آموزش جامع ست کردن دیالیز",
      description: "مراحل کامل از ست کردن تا شروع دیالیز",
      duration: "25:45",
      category: "آموزش جامع",
      date: "۱۴۰۲/۱۰/۰۵",
      views: "۴,۵۶۰",
      likes: 456,
      isFeatured: false,
      rating: 4.7,
      instructor: "پرستار جمالپور",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rezaei",
      level: "متوسط",
      progress: 100,
      details: {
        brand: "Fresenius",
        model: "4008S",
        primingType: "Complete Setup",
        difficulty: "متوسط",
        tags: ["جامع", "از صفر تا صد", "عملی"],
        equipment: ["کلیه تجهیزات", "دستگاه دیالیز", "لوازم مصرفی"]
      }
    },
    {
      id: 4,
      title: "پرایم دستگاه همودیالیز برای کودکان",
      description: "ملاحظات ویژه پرایم کردن برای بیماران کودکان",
      duration: "14:35",
      category: "پرایم کودکان",
      date: "۱۴۰۲/۱۱/۱۵",
      views: "۱,۲۳۰",
      likes: 123,
      isFeatured: true,
      rating: 4.6,
      instructor: "دکتر حیدری",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammadi",
      level: "پیشرفته",
      progress: 30,
      details: {
        brand: "Fresenius",
        model: "4008S",
        primingType: "Pediatric Priming",
        difficulty: "پیشرفته",
        tags: ["کودکان", "حجم کم", "ویژه"],
        equipment: ["دستگاه مخصوص", "محلول ویژه", "تجهیزات کوچک"]
      }
    },
    {
      id: 5,
      title: "عیب یابی دستگاه همودیالیز",
      description: "آموزش تشخیص و رفع مشکلات رایج دستگاه‌های دیالیز",
      duration: "22:10",
      category: "تعمیر و نگهداری",
      date: "۱۴۰۲/۱۱/۲۰",
      views: "۳,۱۲۰",
      likes: 312,
      isFeatured: false,
      rating: 4.9,
      instructor: "مهندس جمالپور",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=najafi",
      level: "پیشرفته",
      progress: 0,
      details: {
        brand: "Multiple Brands",
        model: "Various",
        primingType: "Troubleshooting",
        difficulty: "پیشرفته",
        tags: ["عیب یابی", "تعمیر", "نگهداری"],
        equipment: ["ابزار تست", "کیت عیب یابی", "مولتی متر"]
      }
    },
    {
      id: 6,
      title: "استانداردهای ایمنی در دیالیز",
      description: "آموزش کامل نکات ایمنی و استانداردهای کار با دستگاه",
      duration: "15:30",
      category: "ایمنی",
      date: "۱۴۰۲/۱۱/۲۵",
      views: "۲,۸۷۰",
      likes: 287,
      isFeatured: true,
      rating: 4.8,
      instructor: "دکتر حیدری",
      instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alizadeh",
      level: "متوسط",
      progress: 45,
      details: {
        brand: "All Brands",
        model: "All Models",
        primingType: "Safety Protocols",
        difficulty: "متوسط",
        tags: ["ایمنی", "استاندارد", "پروتکل"],
        equipment: ["تجهیزات ایمنی", "کیت کمک‌های اولیه", "لوازم حفاظتی"]
      }
    }
  ];

  const categories = [
    { name: "همه ویدیوها", icon: <FiFilm />, count: videos.length },
    { name: "پرایم استاندارد", icon: <BsCameraVideo />, count: videos.filter(v => v.category === "پرایم استاندارد").length },
    { name: "ست کردن دستگاه", icon: <FiMonitor />, count: videos.filter(v => v.category === "ست کردن دستگاه").length },
    { name: "آموزش جامع", icon: <FaLayerGroup />, count: videos.filter(v => v.category === "آموزش جامع").length },
    { name: "ایمنی", icon: <FaCheckCircle />, count: videos.filter(v => v.category === "ایمنی").length },
    { name: "تعمیر و نگهداری", icon: <FaCertificate />, count: videos.filter(v => v.category === "تعمیر و نگهداری").length }
  ];

  const difficulties = ["همه", "آسان", "متوسط", "پیشرفته"];

  // فیلتر ویدیوها
  const filteredVideos = videos.filter(video => {
    const categoryFilter = activeFilter === "همه ویدیوها" || video.category === activeFilter;
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
        return parseInt(b.views) - parseInt(a.views);
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
      case 'آسان': return 'bg-green-100 text-green-800 border-green-300';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'پیشرفته': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'مقدماتی': return 'bg-blue-100 text-blue-800';
      case 'متوسط': return 'bg-purple-100 text-purple-800';
      case 'پیشرفته': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleWatchVideo = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const VideoThumbnail = ({ video, viewMode }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        className={`relative overflow-hidden rounded-2xl ${
          viewMode === "grid" 
            ? "h-48" 
            : "md:w-72 md:flex-shrink-0 h-56"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500`}>
          {/* Pattern Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          
          {/* Equipment Icons */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
              <FiMonitor className="text-white" size={16} />
            </div>
            <span className="text-white text-sm font-medium">{video.details.brand}</span>
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'bg-black/30 backdrop-blur-sm' : ''
        }`}>
          <button
            onClick={() => handleWatchVideo(video.id)}
            className={`transform transition-all duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl group">
              <FaPlay className="text-blue-600 ml-1 group-hover:text-blue-700 transition-colors" size={20} />
            </div>
          </button>
        </div>

        {/* Video Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BsClockHistory className="text-white/90" size={14} />
              <span className="text-white text-sm">{video.duration}</span>
            </div>
            
            {video.isFeatured && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                <FaStar size={10} />
                <span>ویژه</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getLevelColor(video.level)}`}>
              {video.level}
            </span>
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getDifficultyColor(video.details.difficulty)}`}>
              {video.details.difficulty}
            </span>
          </div>
        </div>

        {/* Progress Bar (for watched videos) */}
        {video.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
              style={{ width: `${video.progress}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Navigation Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between">
         
          
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all">
              <FaDownload className="inline ml-2" />
              اپلیکیشن موبایل
            </button>
          </div>
           <div className="flex items-center gap-4">
            <Link
              to="/hemo/hemodialysisPrime"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FaArrowLeft />
              <span className="font-medium">بازگشت</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="mb-6 lg:mb-0 lg:max-w-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              آموزش حرفه‌ای همودیالیز
            </h1>
            <p className="text-blue-100 mb-6 leading-relaxed">
              بزرگترین کتابخانه ویدیوهای آموزشی دیالیز با کیفیت 4K و توضیحات کامل فارسی
            </p>
           
          </div>
          
          <div className="w-full lg:w-auto">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="جستجوی آموزش (پرایم، ست کردن، عیب‌یابی...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:border-white/40"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="lg:w-64 space-y-6">
          {/* Categories */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaTag />
              دسته‌بندی‌ها
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveFilter(cat.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    activeFilter === cat.name
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-blue-500">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs ${
                    activeFilter === cat.name ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Levels */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">سطح آموزش</h3>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((level) => (
                <button
                  key={level}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    level === 'آسان' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                    level === 'متوسط' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                    level === 'پیشرفته' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                    'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">مرتب‌سازی</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="newest">جدیدترین</option>
              <option value="views">پر بازدیدترین</option>
              <option value="likes">پرطرفدارترین</option>
              <option value="rating">بالاترین امتیاز</option>
            </select>
          </div>

          {/* Featured Stats */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="font-bold mb-4">آمار کل</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>ویدیو‌ها</span>
                <span className="font-bold">{videos.length}+</span>
              </div>
              <div className="flex items-center justify-between">
                <span>مجموع بازدید</span>
                <span className="font-bold">
                  {videos.reduce((sum, v) => sum + parseInt(v.views.replace(/,/g, '')), 0).toLocaleString()}+
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>میانگین امتیاز</span>
                <span className="font-bold flex items-center gap-1">
                  ۴.۷ <FaStar className="text-yellow-300" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="flex-1">
          {/* View Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid" ? "bg-white shadow-md text-blue-600" : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <FiGrid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list" ? "bg-white shadow-md text-blue-600" : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <FiList size={20} />
                  </button>
                </div>
                <span className="text-gray-600">
                  {filteredVideos.length} ویدیو یافت شد
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FaMobileAlt />
                <span>پشتیبانی از موبایل و تبلت</span>
              </div>
            </div>
          </div>

          {/* Videos List */}
          {filteredVideos.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4 text-gray-300">🔍</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">ویدیویی یافت نشد</h3>
              <p className="text-gray-600 mb-6">سعی کنید عبارت جستجو را تغییر دهید یا فیلترهای دیگر را امتحان کنید.</p>
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
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {sortedVideos.map((video) => (
                <div
                  key={video.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ${
                    viewMode === "grid" 
                      ? "hover:-translate-y-2" 
                      : "flex flex-col md:flex-row"
                  }`}
                  onMouseEnter={() => setHoveredVideo(video.id)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  {/* Video Thumbnail */}
                  <VideoThumbnail video={video} viewMode={viewMode} />

                  {/* Video Info */}
                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-500">
                        <FaStar size={14} />
                        <span className="text-sm font-semibold">{video.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {video.description}
                    </p>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={video.instructorAvatar} 
                        alt={video.instructor}
                        className="w-10 h-10 rounded-full border-2 border-gray-200"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{video.instructor}</div>
                        <div className="text-xs text-gray-500">مدرس متخصص</div>
                      </div>
                    </div>

                    {/* Video Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <AiOutlineEye />
                          <span>{video.views} بازدید</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AiOutlineLike />
                          <span>{video.likes} پسند</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt size={12} />
                          <span>{video.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {video.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>پیشرفت شما</span>
                          <span>{video.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-500"
                            style={{ width: `${video.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleWatchVideo(video.id)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <FaPlay />
                        {video.progress > 0 ? 'ادامه تماشا' : 'شروع تماشا'}
                      </button>
                      
                      <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                        <FaBookmark />
                      </button>
                      
                      <button className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        <FaHeart />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-12 bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-xl p-8 border border-blue-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            چرا آموزش‌های ویدیویی ما؟
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <FaYoutube className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">کیفیت 4K</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              ویدیوهای با کیفیت فوق العاده با جزئیات دقیق و واضح
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <FaCheckCircle className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">تاییدیه متخصصان</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              تمام آموزش‌ها توسط متخصصان همودیالیز بررسی و تایید شده‌اند
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <FaMobileAlt className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">همیشه همراه شما</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              دسترسی آسان از طریق موبایل، تبلت و کامپیوتر
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <FaCertificate className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">گواهینامه معتبر</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              دریافت گواهینامه معتبر پس از تکمیل هر دوره
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          به خانواده ۵۰۰۰+ یادگیرنده همودیالیز بپیوندید
        </p>
        <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl hover:shadow-2xl transition-all text-lg font-semibold inline-flex items-center gap-3">
          شروع یادگیری رایگان
          <FaPlay />
        </button>
      </div>
    </div>
  );
}

export default HemodialsisFilmPrime;