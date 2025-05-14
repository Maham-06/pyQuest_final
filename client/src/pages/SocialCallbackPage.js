"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const SocialCallbackPage = () => {
  const { setAuthToken } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleCallback = () => {
      // Get token from URL query params
      const params = new URLSearchParams(location.search)
      const token = params.get("token")

      if (token) {
        // Set token in auth context
        setAuthToken(token)
        navigate("/home")
      } else {
        setError("Authentication failed. No token received.")
        setTimeout(() => {
          navigate("/auth/login", { 
            state: { error: "Authentication failed. Please try again." } 
          })
        }, 3000)
      }
    }

    handleCallback()
  }, [location, navigate, setAuthToken])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/30">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 text-center">
          {error ? (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-red-500">Authentication Failed</h2>
              <p className="mb-4">{error}</p>
              <p>Redirecting to login page...</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4">Authenticating...</h2>
              <p>Please wait while we complete your authentication.</p>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SocialCallbackPage