"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/30">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 text-center">
          <h2 className="text-4xl font-bold mb-4">404</h2>
          <h3 className="text-2xl font-semibold mb-4">Page Not Found</h3>
          <p className="mb-6">The page you are looking for doesn't exist or has been moved.</p>
          <Link to={isAuthenticated ? "/" : "/landing"}>
            <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md">
              {isAuthenticated ? "Back to Home" : "Back to Landing Page"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
