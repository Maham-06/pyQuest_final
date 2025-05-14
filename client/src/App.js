/*
"use client"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import ChapterPage from "./pages/ChapterPage"
import LevelPage from "./pages/LevelPage"
import ProfilePage from "./pages/ProfilePage"
import DashboardPage from "./pages/DashboardPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import VerifyEmailPage from "./pages/VerifyEmailPage"
import NotFoundPage from "./pages/NotFoundPage"
import DebugPanel from "./components/DebugPanel"

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  console.log("ProtectedRoute - Auth State:", { isAuthenticated, loading })

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login")
    return <Navigate to="/auth/login" />
  }

  console.log("Authenticated, rendering children")
  return children
}

const App = () => {
  return (
    <AuthProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/auth/verify-email/:token" element={<VerifyEmailPage />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chapter/:id"
            element={
              <ProtectedRoute>
                <ChapterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chapter/:id/level/:levelId"
            element={
              <ProtectedRoute>
                <LevelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <DebugPanel />
      </div>
    </AuthProvider>
  )
}

export default App
*/
"use client"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import { ToastProvider } from "./context/ToastContext"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import ChapterPage from "./pages/ChapterPage"
import LevelPage from "./pages/LevelPage"
import ProfilePage from "./pages/ProfilePage"
import DashboardPage from "./pages/DashboardPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import VerifyEmailPage from "./pages/VerifyEmailPage"
import NotFoundPage from "./pages/NotFoundPage"
import DebugPanel from "./components/DebugPanel"

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  console.log("ProtectedRoute - Auth State:", { isAuthenticated, loading })

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login")
    return <Navigate to="/auth/login" />
  }

  console.log("Authenticated, rendering children")
  return children
}

const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <div className="app">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/auth/verify-email/:token" element={<VerifyEmailPage />} />

              {/* Protected routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chapter/:id"
                element={
                  <ProtectedRoute>
                    <ChapterPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chapter/:id/level/:levelId"
                element={
                  <ProtectedRoute>
                    <LevelPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>

           
          </div>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
