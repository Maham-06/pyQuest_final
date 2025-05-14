"use client"

import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import api from "../services/api"

const VerifyEmailPage = () => {
  const { token } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.get(`/api/auth/verify-email/${token}`)
        setSuccess(true)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to verify email")
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/30">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Verifying Email</h2>
            <p>Please wait while we verify your email address...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/30">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <Link to="/landing" className="text-primary font-bold text-3xl flex items-center">
              <span className="mr-2">👑</span> PyQuest
            </Link>
          </div>

          {success ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
              <p className="mb-6">Your email has been successfully verified. You can now log in to your account.</p>
              <Link to="/login">
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md">Go to Login</button>
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
              <p className="text-red-600 dark:text-red-400 mb-6">{error || "Invalid or expired verification link"}</p>
              <Link to="/login">
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md">
                  Back to Login
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
