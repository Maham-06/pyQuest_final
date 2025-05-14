"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the terms of service")
      return
    }

    setIsLoading(true)

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/30">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex justify-center mb-4">
            <Link to="/landing" className="text-primary font-bold text-3xl flex items-center">
              <span className="mr-2">👑</span> PyQuest
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-center">Create an account</h2>
          <p className="text-center text-gray-500 dark:text-gray-400">
            Enter your information to get started with PyQuest
          </p>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Username
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                placeholder="pythonLearner42"
              />
            </div>
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
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
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
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="flex items-center">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="agreeTerms" className="text-sm">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  privacy policy
                </Link>
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md disabled:opacity-50"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
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

export default RegisterPage
