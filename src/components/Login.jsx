// components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserMd, FaKey, FaHospital } from 'react-icons/fa';

export function Login() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // کدهای نظام پزشکی معتبر (در حالت واقعی باید از سرور چک شود)
  const validCodes = ['656565', '987654', '456789'];

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // شبیه‌سازی تاخیر برای عملیات ورود
    setTimeout(() => {
      if (validCodes.includes(code)) {
        // ذخیره وضعیت ورود در localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('medicalCode', code);
        
        // اگر از صفحه خاصی ریدایرکت شده بودیم، به همان صفحه برگردیم
        const from = location.state?.from?.pathname || '/hemo';
        navigate(from, { replace: true });
      } else {
        setError('کد نظام پزشکی نامعتبر است');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-3 rounded-full">
            <FaHospital className="text-white" size={48} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          سامانه تخصصی همودیالیز اطفال
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          برای دسترسی به سیستم، لطفا کد نظام پزشکی خود را وارد کنید
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="medicalCode" className="block text-sm font-medium text-gray-700 mb-2">
                کد نظام پزشکی
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaUserMd className="text-gray-400" />
                </div>
                <input
                  id="medicalCode"
                  name="medicalCode"
                  type="password"
                  dir="ltr"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="block w-full pr-10 pl-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="XXXXXX"
                  maxLength="6"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                کد 6 رقمی نظام پزشکی خود را وارد کنید
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    در حال ورود...
                  </>
                ) : (
                  <>
                    <FaKey className="ml-2" />
                    ورود به سیستم
                  </>
                )}
              </button>
            </div>

        

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    سیستم همودیالیز کودکان
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}