"use client"

import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import api from "../services/api"

const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsSubmitting(true)

    try {
      await api.post(`/api/auth/reset-password/${token}`, {
        password: formData.password,
      })
      setSuccess(true)
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password")
    } finally {
      setIsSubmitting(false)
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
          <h2 className="text-2xl font-bold text-center">Reset Password</h2>
          <p className="text-center text-gray-500 dark:text-gray-400">Enter your new password below</p>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">{error}</div>
          )}

          {success ? (
            <div className="p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md">
              <p>Password reset successful! You will be redirected to the login page shortly.</p>
              <div className="mt-4 text-center">
                <Link to="/login" className="text-primary hover:underline">
                  Go to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  New Password
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
                  Confirm New Password
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
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md disabled:opacity-50"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
