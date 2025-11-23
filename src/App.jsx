import React, { useEffect } from 'react'
import { Container } from '@mui/material'
import Videos from './pages/Videos'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Homepage from './pages/Homepage'
import CoursesPage from './pages/CoursesPage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import BlogDetailPage from './pages/BlogDetailPage'
import ProfilePage from './pages/ProfilePage'
import DashboardPage from './pages/DashboardPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import EmailVerificationPage from './pages/EmailVerificationPage'
import OAuthCallbackPage from './pages/OAuthCallbackPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import UsersManagement from './pages/admin/UsersManagement'
import AuditLogs from './pages/admin/AuditLogs'
import CoursesManagement from './pages/admin/CoursesManagement'
import CourseFormPage from './pages/admin/CourseFormPage'
import BlogManagement from './pages/admin/BlogManagement'
import BlogFormPage from './pages/admin/BlogFormPage'
import PaymentManagement from './pages/admin/PaymentManagement'
import CouponManagement from './pages/admin/CouponManagement'
import APIAnalytics from './pages/admin/APIAnalytics'
import CheckoutPage from './pages/CheckoutPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import QuizTakingPage from './pages/QuizTakingPage'
import AdminRoute from './components/admin/AdminRoute'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { isTokenExpired, getRefreshToken, clearAuthData } from './utils/authUtils'

export default function App() {
  // Check token validity on app initialization
  useEffect(() => {
    console.log('[App] Checking token validity on load...');
    const tokenExpired = isTokenExpired();
    const refreshToken = getRefreshToken();
    
    console.log('[App] Token status:', { tokenExpired, hasRefreshToken: !!refreshToken });
    
    // If access token expired and no refresh token, clear everything
    if (tokenExpired && !refreshToken) {
      console.log('[App] Token expired with no refresh token, clearing auth data');
      clearAuthData();
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes with Header/Footer */}
          <Route path="/" element={<><Header /><Homepage /><Footer /></>} />
          <Route path="/courses" element={<><Header /><CoursesPage /><Footer /></>} />
          <Route path="/about" element={<><Header /><AboutPage /><Footer /></>} />
          <Route path="/blog" element={<><Header /><BlogPage /><Footer /></>} />
          <Route path="/blog/:id" element={<><Header /><BlogDetailPage /><Footer /></>} />
          <Route path="/dashboard" element={<><Header /><DashboardPage /><Footer /></>} />
          <Route path="/profile" element={<><Header /><ProfilePage /><Footer /></>} />
          <Route path="/login" element={<><Header /><Container sx={{ mt: 4, minHeight: '60vh' }}><LoginPage /></Container><Footer /></>} />
          <Route path="/register" element={<><Header /><Container sx={{ mt: 4, minHeight: '60vh' }}><RegisterPage /></Container><Footer /></>} />
          <Route path="/forgot-password" element={<><Header /><ForgotPasswordPage /><Footer /></>} />
          <Route path="/reset-password" element={<><Header /><ResetPasswordPage /><Footer /></>} />
          <Route path="/verify-email" element={<><Header /><EmailVerificationPage /><Footer /></>} />
          <Route path="/oauth-callback" element={<><Header /><OAuthCallbackPage /><Footer /></>} />
          <Route path="/videos" element={<><Header /><Container sx={{ mt: 4, minHeight: '60vh' }}><Videos /></Container><Footer /></>} />
          
          {/* Payment Routes */}
          <Route path="/checkout/:courseId" element={<><Header /><CheckoutPage /><Footer /></>} />
          <Route path="/payment/success" element={<><Header /><PaymentSuccessPage /><Footer /></>} />
          
          {/* Quiz Routes */}
          <Route path="/quiz/:quizId" element={<><Header /><QuizTakingPage /><Footer /></>} />
          
          {/* Admin Routes (no Header/Footer) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UsersManagement /></AdminRoute>} />
          <Route path="/admin/courses" element={<AdminRoute><CoursesManagement /></AdminRoute>} />
          <Route path="/admin/courses/new" element={<AdminRoute><CourseFormPage /></AdminRoute>} />
          <Route path="/admin/courses/edit/:id" element={<AdminRoute><CourseFormPage /></AdminRoute>} />
          <Route path="/admin/blog" element={<AdminRoute><BlogManagement /></AdminRoute>} />
          <Route path="/admin/blog/new" element={<AdminRoute><BlogFormPage /></AdminRoute>} />
          <Route path="/admin/blog/edit/:id" element={<AdminRoute><BlogFormPage /></AdminRoute>} />
          <Route path="/admin/payments" element={<AdminRoute><PaymentManagement /></AdminRoute>} />
          <Route path="/admin/coupons" element={<AdminRoute><CouponManagement /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><APIAnalytics /></AdminRoute>} />
          <Route path="/admin/audit-logs" element={<AdminRoute><AuditLogs /></AdminRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
