/*
"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

// Create the context
const AuthContext = createContext()

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Check if we're using mock API
        const useMockApi = localStorage.getItem("use_mock_api") === "true"

        if (useMockApi) {
          // For mock API, check if we have a demo user in localStorage
          const demoUser = JSON.parse(localStorage.getItem("demo_user") || "null")
          if (demoUser) {
            setUser(demoUser)
            setIsAuthenticated(true)
          }
        } else {
          // For real API, check if we have a token
          const token = localStorage.getItem("token")
          if (token) {
            try {
              const res = await loadUser()
              if (res && res.user) {
                setUser(res.user)
                setIsAuthenticated(true)
              }
            } catch (err) {
              console.error("Error loading user:", err)
              localStorage.removeItem("token")
            }
          }
        }
      } catch (err) {
        console.error("Error checking login status:", err)
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  // Load user data
  const loadUser = async () => {
    try {
      const res = await api.get("/api/auth/me")
      return res.data
    } catch (err) {
      console.error("Error loading user:", err)
      throw err
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true)
      const res = await api.post("/api/auth/login", { email, password })

      if (res.data.token) {
        api.setToken(res.data.token)
        setUser(res.data.user)
        setIsAuthenticated(true)
        navigate("/home")
        return { success: true }
      }

      return { success: false, message: "Login failed" }
    } catch (err) {
      console.error("Login error:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Login failed. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  // Demo login (no backend)
  const demoLogin = () => {
    try {
      setLoading(true)

      // Set mock API flag
      localStorage.setItem("use_mock_api", "true")

      // Create demo user
      const demoUser = {
        _id: "demo123",
        name: "Demo User",
        email: "demo@example.com",
        role: "user",
        progress: {
          completedLevels: [],
          currentLevel: 1,
          currentChapter: 1,
          xp: 0,
        },
      }

      // Store demo user in localStorage for persistence
      localStorage.setItem("demo_user", JSON.stringify(demoUser))

      // Update state
      setUser(demoUser)
      setIsAuthenticated(true)

      console.log("Demo login successful, navigating to /home")
      navigate("/home")

      return { success: true }
    } catch (err) {
      console.error("Demo login error:", err)
      return {
        success: false,
        message: "Demo login failed. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true)
      const res = await api.post("/api/auth/register", userData)

      if (res.data.success) {
        return { success: true, message: res.data.message }
      }

      return { success: false, message: "Registration failed" }
    } catch (err) {
      console.error("Registration error:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("demo_user")
    api.setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    navigate("/")
  }

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true)
      const res = await api.post("/api/auth/forgot-password", { email })

      if (res.data.success) {
        return { success: true, message: res.data.message }
      }

      return { success: false, message: "Failed to send reset email" }
    } catch (err) {
      console.error("Forgot password error:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to send reset email. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setLoading(true)
      const res = await api.post(`/api/auth/reset-password/${token}`, { password })

      if (res.data.success) {
        return { success: true, message: res.data.message }
      }

      return { success: false, message: "Failed to reset password" }
    } catch (err) {
      console.error("Reset password error:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to reset password. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  // Verify email
  const verifyEmail = async (token) => {
    try {
      setLoading(true)
      const res = await api.get(`/api/auth/verify-email/${token}`)

      if (res.data.success) {
        return { success: true, message: res.data.message }
      }

      return { success: false, message: "Failed to verify email" }
    } catch (err) {
      console.error("Verify email error:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to verify email. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  // Update profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true)
      const res = await api.put("/api/users/profile", userData)

      if (res.data.success) {
        setUser(res.data.user)
        return { success: true, message: "Profile updated successfully" }
      }

      return { success: false, message: "Failed to update profile" }
    } catch (err) {
      console.error("Update profile error:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update profile. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true)
      const res = await api.put("/api/users/change-password", { currentPassword, newPassword })

      if (res.data.success) {
        return { success: true, message: res.data.message }
      }

      return { success: false, message: "Failed to change password" }
    } catch (err) {
      console.error("Change password error:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to change password. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        demoLogin,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
*/
"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { useToast } from "./ToastContext"

// Create the context
const AuthContext = createContext()

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { addToast } = useToast()

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          try {
            const res = await api.get("/api/auth/me")
            if (res.data.success && res.data.user) {
              setUser(res.data.user)
              setIsAuthenticated(true)
            }
          } catch (err) {
            console.error("Error loading user:", err)
            localStorage.removeItem("token")
          }
        }
      } catch (err) {
        console.error("Error checking login status:", err)
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true)
      const res = await api.post("/api/auth/login", { email, password })

      if (res.data.success) {
        // Store the token
        const token = res.data.session?.access_token || res.data.token
        localStorage.setItem("token", token)

        // Store the user
        setUser(res.data.user)
        setIsAuthenticated(true)

        // Navigate to home
        navigate("/home")
        addToast("Login successful!", "success")
        return { success: true }
      }

      return { success: false, message: "Login failed" }
    } catch (err) {
      console.error("Login error:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Login failed. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  // Demo login
  const demoLogin = async () => {
    try {
      setLoading(true)
      const res = await api.post("/api/auth/demo-login")

      if (res.data.success) {
        // Store the token
        const token = res.data.session?.access_token || res.data.token
        localStorage.setItem("token", token)

        // Store the user
        setUser(res.data.user)
        setIsAuthenticated(true)

        // Navigate to home
        navigate("/home")
        addToast("Demo login successful!", "success")
        return { success: true }
      }

      return { success: false, message: "Demo login failed" }
    } catch (err) {
      console.error("Demo login error:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Demo login failed. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true)
      const res = await api.post("/api/auth/register", userData)

      if (res.data.success) {
        addToast("Registration successful! Please check your email to verify your account.", "success")
        navigate("/auth/login")
        return { success: true, message: res.data.message }
      }

      return { success: false, message: "Registration failed" }
    } catch (err) {
      console.error("Registration error:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = async () => {
    try {
      await api.post("/api/auth/logout")
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      localStorage.removeItem("token")
      setUser(null)
      setIsAuthenticated(false)
      navigate("/")
      addToast("Logged out successfully", "info")
    }
  }

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true)
      const res = await api.post("/api/auth/forgot-password", { email })

      if (res.data.success) {
        addToast("Password reset email sent. Please check your inbox.", "success")
        return { success: true, message: res.data.message }
      }

      return { success: false, message: "Failed to send reset email" }
    } catch (err) {
      console.error("Forgot password error:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to send reset email. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setLoading(true)
      const res = await api.post(`/api/auth/reset-password/${token}`, { password })

      if (res.data.success) {
        addToast("Password reset successful!", "success")
        return { success: true, message: res.data.message }
      }

      return { success: false, message: "Failed to reset password" }
    } catch (err) {
      console.error("Reset password error:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to reset password. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  // Update profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true)
      const res = await api.put("/api/users/profile", userData)

      if (res.data.success) {
        setUser(res.data.user)
        addToast("Profile updated successfully", "success")
        return { success: true, message: "Profile updated successfully" }
      }

      return { success: false, message: "Failed to update profile" }
    } catch (err) {
      console.error("Update profile error:", err)
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update profile. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        demoLogin,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
