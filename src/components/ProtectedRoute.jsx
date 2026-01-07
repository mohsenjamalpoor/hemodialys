// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    // ذخیره صفحه فعلی برای ریدایرکت بعد از لاگین
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}