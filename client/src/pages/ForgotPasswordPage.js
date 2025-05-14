"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await api.post("/api/auth/forgot-password", { email })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email")
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
          <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
          <p className="text-center text-gray-500 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password
          </p>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">{error}</div>
          )}

          {success ? (
            <div className="p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md">
              <p>Reset link sent! Check your email for instructions to reset your password.</p>
              <div className="mt-4 text-center">
                <Link to="/login" className="text-primary hover:underline">
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  placeholder="m@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
              <div className="text-center">
                <Link to="/login" className="text-primary hover:underline text-sm">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
