/*
"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login, demoLogin } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)
    try {
      const result = await login(formData.email, formData.password)
      if (!result.success) {
        setError(result.message || "Login failed")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    try {
      const result = await demoLogin()
      if (!result.success) {
        setError(result.message || "Demo login failed")
      }
    } catch (err) {
      setError(err.message || "Demo login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/30">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex justify-center mb-4">
            <Link to="/" className="text-primary font-bold text-3xl flex items-center">
              <span className="mr-2">👑</span> PyQuest
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-center">Welcome back</h2>
          <p className="text-center text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                placeholder="m@example.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 px-4 border border-primary text-primary hover:bg-primary/10 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Demo Login (No Backend)"}
              </button>
            </div>
          </form>

          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href="/api/auth/google"
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-center hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Google
            </a>
            <a
              href="/api/auth/github"
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-center hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
*/
"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login, demoLogin } = useAuth()
  const toast = useToast()

  // Create a safe toast function that works even if ToastContext is not available
  const addToast = (message, type) => {
    if (toast && toast.addToast) {
      toast.addToast(message, type)
    } else {
      console.log(`Toast (${type}): ${message}`)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)
    try {
      const result = await login(formData.email, formData.password)
      if (!result.success) {
        setError(result.message || "Login failed")
      } else {
        addToast("Login successful!", "success")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    try {
      const result = await demoLogin()
      if (!result.success) {
        setError(result.message || "Demo login failed")
      } else {
        addToast("Demo login successful!", "success")
      }
    } catch (err) {
      setError(err.message || "Demo login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/30">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex justify-center mb-4">
            <Link to="/" className="text-primary font-bold text-3xl flex items-center">
              <span className="mr-2">👑</span> PyQuest
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-center">Welcome back</h2>
          <p className="text-center text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                placeholder="m@example.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 px-4 border border-primary text-primary hover:bg-primary/10 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Demo Login"}
              </button>
            </div>
          </form>

          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/auth/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href="/api/auth/google"
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-center hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Google
            </a>
            <a
              href="/api/auth/github"
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-center hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
