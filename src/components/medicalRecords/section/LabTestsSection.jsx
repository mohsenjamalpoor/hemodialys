import React, { useState, useRef, useEffect } from 'react';
import { FiDroplet, FiPlus, FiTrash2, FiPrinter, FiEdit2, FiSave, FiX, FiSearch, FiTrendingUp } from 'react-icons/fi';
import { allTests, getTestInfo, checkIfNormal, searchTest } from '../../../utils/labTestRanges';

const LabTestsSection = ({ 
  labTests = [], 
  onAdd, 
  onEdit, 
  onRemove, 
  onPrint,
  showAddButton = true,
  showEditButtons = true
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' یا 'card'
  const [selectedTest, setSelectedTest] = useState(null); // برای مشاهده روند یک آزمایش خاص
  const [newTest, setNewTest] = useState({
    testName: '',
    date: new Date().toLocaleDateString('fa-IR'),
    result: '',
    normalRange: '',
    notes: ''
  });
  const [editData, setEditData] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // برای جستجوی کلی
  
  const testNameRef = useRef(null);
  const editRefs = useRef({});
  const suggestionsRef = useRef(null);

  const safeItems = Array.isArray(labTests) ? labTests : [];

  // تابع تبدیل تاریخ شمسی به عدد
  function convertPersianDateToNumber(dateStr) {
    if (!dateStr) return 0;
    const parts = dateStr.split('/').map(part => parseInt(part) || 0);
    if (parts.length !== 3) return 0;
    return parts[0] * 10000 + parts[1] * 100 + parts[2];
  }

  // گروه‌بندی آزمایشات بر اساس نام
  const groupedTests = safeItems.reduce((groups, test) => {
    const testName = test.testName || '';
    if (!testName) return groups;
    
    if (!groups[testName]) {
      groups[testName] = [];
    }
    groups[testName].push(test);
    return groups;
  }, {});

  // مرتب کردن هر گروه بر اساس تاریخ
  Object.keys(groupedTests).forEach(testName => {
    groupedTests[testName].sort((a, b) => {
      const dateA = convertPersianDateToNumber(a.date);
      const dateB = convertPersianDateToNumber(b.date);
      return dateB - dateA; // نزولی (جدیدترین اول)
    });
  });

  // فیلتر کردن موارد بر اساس جستجو
  const filteredItems = searchQuery 
    ? safeItems.filter(item => {
        const testInfo = getTestInfo(item.testName || '');
        const title = testInfo?.title || item.testName || '';
        return title.toLowerCase().includes(searchQuery.toLowerCase()) || 
               (item.testName || '').toLowerCase().includes(searchQuery.toLowerCase());
      })
    : safeItems;

  // تابع جستجوی آزمایش برای autocomplete
  const handleSearchTest = (query) => {
    if (query.length > 1) {
      const results = searchTest(query);
      setSuggestions(results || []);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // انتخاب آزمایش از لیست
  const handleSelectTest = (test) => {
    const testInfo = getTestInfo(test.value);
    if (testInfo) {
      setNewTest(prev => ({
        ...prev,
        testName: test.value,
        normalRange: testInfo.normalRange || ''
      }));
    } else {
      setNewTest(prev => ({
        ...prev,
        testName: test.value,
        normalRange: ''
      }));
    }
    setShowSuggestions(false);
  };

  // تابع اضافه کردن آزمایش
  const handleAddTest = () => {
    if (newTest.testName.trim() && onAdd) {
      const testData = {
        id: Date.now() + Math.random(),
        ...newTest
      };
      
      onAdd(testData);
      setIsAdding(false);
      setNewTest({
        testName: '',
        date: new Date().toLocaleDateString('fa-IR'),
        result: '',
        normalRange: '',
        notes: ''
      });
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // تابع ذخیره ویرایش
  const handleSaveEdit = () => {
    if (editingId && editData.testName?.trim() && onEdit) {
      onEdit(editingId, editData);
      setEditingId(null);
      setEditData({});
    }
  };

  // تابع حذف آزمایش
  const handleRemoveTest = (id) => {
    if (onRemove) {
      setRemovingId(id);
      setTimeout(() => {
        onRemove(id);
        setRemovingId(null);
      }, 300);
    }
  };

  // مشاهده روند یک آزمایش خاص
  const handleViewTrend = (testName) => {
    setSelectedTest(selectedTest === testName ? null : testName);
  };

  // تابع پرینت
  const handlePrintTest = (test) => {
    if (onPrint && test) {
      onPrint(test);
    }
  };

  // تابع پرینت همه
  const handlePrintAll = () => {
    if (onPrint) {
      onPrint(null, 'all');
    }
  };

  // تابع شروع ویرایش
  const handleStartEdit = (test) => {
    setEditingId(test.id);
    setEditData({ 
      testName: test.testName || '',
      date: test.date || '',
      result: test.result || '',
      normalRange: test.normalRange || '',
      notes: test.notes || ''
    });
    
    // فوکوس روی فیلد نام آزمایش
    setTimeout(() => {
      if (editRefs.current[test.id]) {
        editRefs.current[test.id].focus();
      }
    }, 100);
  };

  // تابع لغو ویرایش
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // تابع تغییر ویرایش
  const handleEditChange = (field, value) => {
    const updatedEditData = { ...editData, [field]: value };
    
    // اگر نام آزمایش تغییر کرد، محدوده نرمال را آپدیت کن
    if (field === 'testName' && value) {
      const testInfo = getTestInfo(value);
      if (testInfo?.normalRange) {
        updatedEditData.normalRange = testInfo.normalRange;
      } else {
        updatedEditData.normalRange = '';
      }
    }
    
    setEditData(updatedEditData);
  };

  // تابع لغو افزودن
  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewTest({
      testName: '',
      date: new Date().toLocaleDateString('fa-IR'),
      result: '',
      normalRange: '',
      notes: ''
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // تغییر در فیلدهای اضافه کردن
  const handleNewTestChange = (field, value) => {
    setNewTest(prev => ({ ...prev, [field]: value }));
    
    // اگر نام آزمایش تغییر کرد، محدوده نرمال را آپدیت کن
    if (field === 'testName' && value) {
      const testInfo = getTestInfo(value);
      if (testInfo?.normalRange) {
        setNewTest(prev => ({ 
          ...prev, 
          testName: value,
          normalRange: testInfo.normalRange 
        }));
      }
    }
  };

  // کلیک خارج از suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // فوکوس روی فیلدها
  useEffect(() => {
    if (isAdding && testNameRef.current) {
      setTimeout(() => {
        testNameRef.current.focus();
      }, 100);
    }
  }, [isAdding]);

  // محاسبه روند (افزایش/کاهش)
  const calculateTrend = (tests) => {
    if (!Array.isArray(tests) || tests.length < 2) {
      return { direction: 'stable', percent: 0, firstResult: 0, lastResult: 0 };
    }
    
    const sortedTests = [...tests].sort((a, b) => {
      const dateA = convertPersianDateToNumber(a.date);
      const dateB = convertPersianDateToNumber(b.date);
      return dateA - dateB; // قدیمی به جدید
    });
    
    const firstResult = parseFloat(sortedTests[0].result) || 0;
    const lastResult = parseFloat(sortedTests[sortedTests.length - 1].result) || 0;
    
    if (firstResult === 0) {
      return { direction: 'stable', percent: 0, firstResult, lastResult };
    }
    
    const percentChange = ((lastResult - firstResult) / firstResult) * 100;
    
    return {
      direction: percentChange > 5 ? 'up' : percentChange < -5 ? 'down' : 'stable',
      percent: Math.abs(percentChange).toFixed(1),
      firstResult,
      lastResult
    };
  };

  // تابعی برای بررسی آیا آزمایش ویرایش شده با آزمایش اصلی متفاوت است
  const isEditChanged = (original, edited) => {
    if (!original || !edited) return false;
    
    const fields = ['testName', 'date', 'result', 'normalRange', 'notes'];
    return fields.some(field => {
      const originalValue = original[field] || '';
      const editedValue = edited[field] || '';
      return originalValue !== editedValue;
    });
  };

  // تابع برای پیدا کردن آزمون اصلی بر اساس id
  const findOriginalTest = (id) => {
    return safeItems.find(item => item.id === id);
  };

  // بررسی وضعیت نرمال بودن
  const getNormalStatus = (testName, result) => {
    try {
      return checkIfNormal(testName, result);
    } catch (error) {
      console.error('Error checking normal status:', error);
      return 'unknown';
    }
  };

  // گرفتن اطلاعات آزمایش
  const getTestTitle = (testName) => {
    try {
      const testInfo = getTestInfo(testName);
      return testInfo?.title || testName || 'بدون نام';
    } catch (error) {
      console.error('Error getting test info:', error);
      return testName || 'بدون نام';
    }
  };

  // فیلدهای ویرایش برای یک آزمایش خاص
  const getEditFieldValue = (field, testId) => {
    if (editingId === testId) {
      return editData[field] || '';
    }
    return '';
  };

  // محتوای اصلی کامپوننت
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      {/* هدر */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-100">
            <FiDroplet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">آزمایشات پزشکی</h3>
            <p className="text-sm text-gray-500">
              {safeItems.length} آزمایش ثبت شده در {Object.keys(groupedTests).length} نوع آزمایش
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* جستجو */}
          {safeItems.length > 0 && (
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-auto">
                <FiSearch className="text-gray-400 ml-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی آزمایش..."
                  className="outline-none text-right w-full sm:w-48"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
          
          {safeItems.length > 0 && (
            <>
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded text-sm ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  جدولی
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`px-3 py-1 rounded text-sm ${viewMode === 'card' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  کارتی
                </button>
              </div>
              
              <button
                onClick={handlePrintAll}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                title="پرینت همه آزمایشات"
              >
                <FiPrinter className="w-5 h-5" />
                <span className="hidden md:inline">پرینت همه</span>
              </button>
            </>
          )}
          
          {showAddButton && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
              title="افزودن آزمایش جدید"
            >
              <FiPlus className="w-5 h-5" />
              <span className="hidden md:inline">افزودن آزمایش</span>
            </button>
          )}
        </div>
      </div>

      {/* نمایش بر اساس فیلتر جستجو */}
      {searchQuery && filteredItems.length === 0 && safeItems.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-center">
            نتیجه‌ای برای جستجوی "{searchQuery}" یافت نشد.
          </p>
        </div>
      )}

      {/* جدول آزمایشات */}
      {viewMode === 'table' && filteredItems.length > 0 && (
        <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">نام آزمایش</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">تعداد</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">آخرین نتیجه</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">آخرین تاریخ</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">وضعیت</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">روند</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedTests)
                .filter(testName => {
                  // فیلتر بر اساس جستجو
                  if (!searchQuery) return true;
                  const testInfo = getTestInfo(testName);
                  const title = testInfo?.title || testName || '';
                  return title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         testName.toLowerCase().includes(searchQuery.toLowerCase());
                })
                .map((testName, index) => {
                const tests = groupedTests[testName];
                const latestTest = tests[0];
                if (!latestTest) return null;
                
                const testInfo = getTestInfo(testName);
                const status = getNormalStatus(testName, latestTest.result);
                const trend = calculateTrend(tests);
                
                return (
                  <React.Fragment key={testName}>
                    <tr className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">
                            {getTestTitle(testName)}
                          </span>
                          <button
                            onClick={() => handleViewTrend(testName)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            title="مشاهده روند"
                          >
                            <FiTrendingUp className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {tests.length}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${status === 'normal' ? 'text-green-600' : status === 'abnormal' ? 'text-red-600' : 'text-yellow-600'}`}>
                          {latestTest.result || '---'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{latestTest.date || '---'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          status === 'normal' ? 'bg-green-100 text-green-800' :
                          status === 'abnormal' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {status === 'normal' ? 'نرمال' : 
                           status === 'abnormal' ? 'غیرنرمال' : 
                           'نامشخص'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {trend.direction === 'up' ? (
                          <span className="text-red-600 flex items-center gap-1 text-sm">
                            <span>▲</span> {trend.percent}%
                          </span>
                        ) : trend.direction === 'down' ? (
                          <span className="text-green-600 flex items-center gap-1 text-sm">
                            <span>▼</span> {trend.percent}%
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">ثابت</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePrintTest(latestTest)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            title="پرینت"
                          >
                            <FiPrinter className="w-4 h-4" />
                          </button>
                          {showEditButtons && (
                            <button
                              onClick={() => handleStartEdit(latestTest)}
                              className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded"
                              title="ویرایش"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveTest(latestTest.id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="حذف"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* روند آزمایش */}
                    {selectedTest === testName && (
                      <tr className="bg-blue-50 border-b border-blue-100">
                        <td colSpan="7" className="py-4 px-4">
                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <h4 className="font-bold text-gray-800 text-lg">روند آزمایش {getTestTitle(testName)}</h4>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">
                                  {tests.length} بار انجام شده
                                </span>
                                {trend.direction !== 'stable' && (
                                  <span className={`text-sm font-medium ${trend.direction === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                                    {trend.direction === 'up' ? 'روند افزایشی' : 'روند کاهشی'} ({trend.percent}%)
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="bg-blue-100 border-b border-blue-200">
                                    <th className="py-2 px-3 text-right text-xs font-semibold text-gray-700">ردیف</th>
                                    <th className="py-2 px-3 text-right text-xs font-semibold text-gray-700">تاریخ</th>
                                    <th className="py-2 px-3 text-right text-xs font-semibold text-gray-700">نتیجه</th>
                                    <th className="py-2 px-3 text-right text-xs font-semibold text-gray-700">وضعیت</th>
                                    <th className="py-2 px-3 text-right text-xs font-semibold text-gray-700">یادداشت</th>
                                    <th className="py-2 px-3 text-right text-xs font-semibold text-gray-700">عملیات</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {tests.map((test, idx) => {
                                    const testStatus = getNormalStatus(testName, test.result);
                                    const isEditingThis = editingId === test.id;
                                    
                                    return (
                                      <tr key={test.id || idx} className="border-b border-blue-50 hover:bg-white transition-colors">
                                        <td className="py-2 px-3 text-center text-sm text-gray-600">{idx + 1}</td>
                                        <td className="py-2 px-3 text-sm text-gray-700">
                                          {isEditingThis ? (
                                            <input
                                              type="text"
                                              value={getEditFieldValue('date', test.id)}
                                              onChange={(e) => handleEditChange('date', e.target.value)}
                                              className="w-full px-2 py-1 border border-gray-300 rounded text-right text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                          ) : (
                                            test.date || '---'
                                          )}
                                        </td>
                                        <td className="py-2 px-3">
                                          {isEditingThis ? (
                                            <input
                                              type="text"
                                              value={getEditFieldValue('result', test.id)}
                                              onChange={(e) => handleEditChange('result', e.target.value)}
                                              className="w-full px-2 py-1 border border-gray-300 rounded text-right text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                          ) : (
                                            <span className={`font-medium ${testStatus === 'normal' ? 'text-green-600' : testStatus === 'abnormal' ? 'text-red-600' : 'text-yellow-600'}`}>
                                              {test.result || '---'}
                                            </span>
                                          )}
                                        </td>
                                        <td className="py-2 px-3">
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            isEditingThis ? 
                                              (getNormalStatus(getEditFieldValue('testName', test.id) || test.testName, getEditFieldValue('result', test.id) || test.result) === 'normal' ? 'bg-green-100 text-green-800' :
                                               getNormalStatus(getEditFieldValue('testName', test.id) || test.testName, getEditFieldValue('result', test.id) || test.result) === 'abnormal' ? 'bg-red-100 text-red-800' :
                                               'bg-yellow-100 text-yellow-800') :
                                              (testStatus === 'normal' ? 'bg-green-100 text-green-800' :
                                               testStatus === 'abnormal' ? 'bg-red-100 text-red-800' :
                                               'bg-yellow-100 text-yellow-800')
                                          }`}>
                                            {isEditingThis ? 
                                              (getNormalStatus(getEditFieldValue('testName', test.id) || test.testName, getEditFieldValue('result', test.id) || test.result) === 'normal' ? 'نرمال' : 
                                               getNormalStatus(getEditFieldValue('testName', test.id) || test.testName, getEditFieldValue('result', test.id) || test.result) === 'abnormal' ? 'غیرنرمال' : 
                                               'نامشخص') :
                                              (testStatus === 'normal' ? 'نرمال' : 
                                               testStatus === 'abnormal' ? 'غیرنرمال' : 
                                               'نامشخص')}
                                          </span>
                                        </td>
                                        <td className="py-2 px-3">
                                          {isEditingThis ? (
                                            <textarea
                                              value={getEditFieldValue('notes', test.id)}
                                              onChange={(e) => handleEditChange('notes', e.target.value)}
                                              className="w-full px-2 py-1 border border-gray-300 rounded text-right text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                              rows="1"
                                            />
                                          ) : (
                                            <span className="text-xs text-gray-600 max-w-xs truncate inline-block">
                                              {test.notes || '---'}
                                            </span>
                                          )}
                                        </td>
                                        <td className="py-2 px-3">
                                          {isEditingThis ? (
                                            <div className="flex items-center gap-2">
                                              <button
                                                onClick={handleSaveEdit}
                                                className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="ذخیره"
                                                disabled={!editData.testName?.trim()}
                                              >
                                                <FiSave className="w-3 h-3" />
                                              </button>
                                              <button
                                                onClick={handleCancelEdit}
                                                className="p-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                                                title="لغو"
                                              >
                                                <FiX className="w-3 h-3" />
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="flex items-center gap-2">
                                              {showEditButtons && (
                                                <button
                                                  onClick={() => handleStartEdit(test)}
                                                  className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded"
                                                  title="ویرایش"
                                                >
                                                  <FiEdit2 className="w-3 h-3" />
                                                </button>
                                              )}
                                              <button
                                                onClick={() => handleRemoveTest(test.id)}
                                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                                title="حذف"
                                              >
                                                <FiTrash2 className="w-3 h-3" />
                                              </button>
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* حالت کارتی */}
      {viewMode === 'card' && filteredItems.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              if (removingId === item.id) {
                return (
                  <div key={item.id} className="p-4 bg-red-50 border border-red-200 rounded-lg transition-all duration-300 opacity-50 transform scale-95">
                    <div className="flex items-center justify-center py-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-red-600"></div>
                      <span className="mr-2 text-red-600 text-sm">در حال حذف...</span>
                    </div>
                  </div>
                );
              }

              const testInfo = getTestInfo(item.testName || '');
              const status = getNormalStatus(item.testName, item.result);
              const isEditing = editingId === item.id;
              
              return (
                <div key={item.id} className={`p-4 rounded-lg border transition-all duration-300 ${isEditing ? 'bg-blue-50 border-blue-300 shadow-md' : 'bg-white border-gray-200 hover:shadow-md'}`}>
                  {isEditing ? (
                    // حالت ویرایش
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          ref={(el) => editRefs.current[item.id] = el}
                          type="text"
                          value={editData.testName || ''}
                          onChange={(e) => handleEditChange('testName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="نام آزمایش"
                        />
                        {editData.testName && (
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {editData.testName}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">تاریخ</label>
                          <input
                            type="text"
                            value={editData.date || ''}
                            onChange={(e) => handleEditChange('date', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                            placeholder="1402/11/15"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">نتیجه</label>
                          <input
                            type="text"
                            value={editData.result || ''}
                            onChange={(e) => handleEditChange('result', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                            placeholder="مقدار"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">محدوده نرمال</label>
                        <input
                          type="text"
                          value={editData.normalRange || ''}
                          onChange={(e) => handleEditChange('normalRange', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                          placeholder="مثلاً: 70-110"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">یادداشت</label>
                        <textarea
                          value={editData.notes || ''}
                          onChange={(e) => handleEditChange('notes', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                          rows="2"
                          placeholder="یادداشت‌های اضافی"
                        />
                      </div>
                      
                      {/* نمایش وضعیت در حالت ویرایش */}
                      {editData.testName && editData.result && (
                        <div className="p-2 bg-gray-100 rounded">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">وضعیت:</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              getNormalStatus(editData.testName, editData.result) === 'normal' 
                                ? 'bg-green-100 text-green-800' 
                                : getNormalStatus(editData.testName, editData.result) === 'abnormal'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {getNormalStatus(editData.testName, editData.result) === 'normal' 
                                ? 'نرمال' 
                                : getNormalStatus(editData.testName, editData.result) === 'abnormal'
                                  ? 'غیرنرمال'
                                  : 'نامشخص'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleSaveEdit}
                          className={`flex-1 py-2 text-white text-sm rounded-lg transition flex items-center justify-center gap-1 ${
                            isEditChanged(item, editData) 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-gray-400 cursor-not-allowed'
                          }`}
                          disabled={!isEditChanged(item, editData) || !editData.testName?.trim()}
                        >
                          <FiSave className="w-4 h-4" />
                          ذخیره
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm rounded-lg transition flex items-center justify-center gap-1"
                        >
                          <FiX className="w-4 h-4" />
                          لغو
                        </button>
                      </div>
                    </div>
                  ) : (
                    // حالت نمایش
                    <>
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-bold text-gray-800 text-right">
                            {testInfo?.title || item.testName || 'بدون نام'}
                          </h4>
                          {item.testName && (
                            <p className="text-xs text-gray-500 text-right mt-1">
                              {item.testName}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handlePrintTest(item)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition"
                            title="پرینت"
                          >
                            <FiPrinter className="w-4 h-4" />
                          </button>
                          {showEditButtons && (
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded transition"
                              title="ویرایش"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveTest(item.id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition"
                            title="حذف"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">نتیجه</p>
                          <p className={`text-lg font-bold ${status === 'normal' ? 'text-green-600' : status === 'abnormal' ? 'text-red-600' : 'text-yellow-600'}`}>
                            {item.result || '---'}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">تاریخ</p>
                          <p className="text-lg font-medium text-gray-700">{item.date || '---'}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">محدوده نرمال:</span>
                          <span className="text-xs text-gray-700">{item.normalRange || '---'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">وضعیت:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            status === 'normal' ? 'bg-green-100 text-green-800' :
                            status === 'abnormal' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {status === 'normal' ? 'نرمال' : 
                             status === 'abnormal' ? 'غیرنرمال' : 
                             'نامشخص'}
                          </span>
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs text-gray-500 mb-1">یادداشت:</p>
                          <p className="text-sm text-gray-700 text-right line-clamp-2">{item.notes}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* پیام وقتی هیچ آزمایشی وجود ندارد */}
      {safeItems.length === 0 && !isAdding && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <div className="text-gray-400 mb-4 text-5xl">🔬</div>
          <p className="text-gray-500 text-lg mb-2">هیچ آزمایشی ثبت نشده است</p>
          {showAddButton && (
            <>
              <p className="text-sm text-gray-400 mb-4">برای شروع اولین آزمایش را اضافه کنید</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition inline-flex items-center gap-2"
              >
                <FiPlus className="w-5 h-5" />
                افزودن اولین آزمایش
              </button>
            </>
          )}
        </div>
      )}

      {/* پیام وقتی فیلتر جستجو نتیجه‌ای نداشت */}
      {searchQuery && filteredItems.length === 0 && safeItems.length > 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <div className="text-gray-400 mb-3 text-3xl">🔍</div>
          <p className="text-gray-500">هیچ آزمایشی با این مشخصات یافت نشد</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            مشاهده همه آزمایشات
          </button>
        </div>
      )}

      {/* فرم افزودن جدید */}
      {isAdding && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-800">افزودن آزمایش جدید</h4>
              <button
                onClick={handleCancelAdd}
                className="text-gray-500 hover:text-gray-700"
                title="بستن"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            {/* نام آزمایش با autocomplete */}
            <div className="relative" ref={suggestionsRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                نام آزمایش
              </label>
              <div className="relative">
                <input
                  ref={testNameRef}
                  type="text"
                  value={newTest.testName}
                  onChange={(e) => {
                    handleNewTestChange('testName', e.target.value);
                    handleSearchTest(e.target.value);
                  }}
                  onFocus={() => newTest.testName.length > 1 && setShowSuggestions(true)}
                  placeholder="نام آزمایش را تایپ کنید (مثلاً: PLT، Na، FBS)"
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              
              {/* لیست پیشنهادات */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((test, index) => {
                    const testInfo = getTestInfo(test.value);
                    return (
                      <div
                        key={index}
                        onClick={() => handleSelectTest(test)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="text-right">
                            <p className="font-medium text-gray-800">{test.label}</p>
                            {testInfo?.normalRange && (
                              <p className="text-xs text-gray-500 mt-1">محدوده نرمال: {testInfo.normalRange}</p>
                            )}
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {test.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  تاریخ آزمایش
                </label>
                <input
                  type="text"
                  value={newTest.date}
                  onChange={(e) => handleNewTestChange('date', e.target.value)}
                  placeholder="1402/11/15"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  نتیجه
                </label>
                <input
                  type="text"
                  value={newTest.result}
                  onChange={(e) => handleNewTestChange('result', e.target.value)}
                  placeholder="مثلاً: 120"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                محدوده نرمال
              </label>
              <input
                type="text"
                value={newTest.normalRange}
                onChange={(e) => handleNewTestChange('normalRange', e.target.value)}
                placeholder="مثلاً: 70-110 (به صورت خودکار پر می‌شود)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                یادداشت (اختیاری)
              </label>
              <textarea
                value={newTest.notes}
                onChange={(e) => handleNewTestChange('notes', e.target.value)}
                placeholder="یادداشت‌های اضافی"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right"
                rows="3"
              />
            </div>
            
            {/* نمایش وضعیت */}
            {newTest.testName && newTest.result && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">وضعیت:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getNormalStatus(newTest.testName, newTest.result) === 'normal' 
                      ? 'bg-green-100 text-green-800' 
                      : getNormalStatus(newTest.testName, newTest.result) === 'abnormal'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getNormalStatus(newTest.testName, newTest.result) === 'normal' 
                      ? 'نرمال' 
                      : getNormalStatus(newTest.testName, newTest.result) === 'abnormal'
                        ? 'غیرنرمال'
                        : 'نامشخص'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>آزمایش: {getTestTitle(newTest.testName)}</p>
                  {newTest.normalRange && (
                    <p className="mt-1">محدوده نرمال: {newTest.normalRange}</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddTest}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={!newTest.testName.trim() || !newTest.result.trim()}
              >
                <FiSave className="w-5 h-5" />
                ثبت آزمایش
              </button>
              <button
                onClick={handleCancelAdd}
                className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl transition font-medium flex items-center justify-center gap-2"
              >
                <FiX className="w-5 h-5" />
                لغو
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTestsSection;