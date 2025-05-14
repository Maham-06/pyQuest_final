"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import api from "../services/api"

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/api/users/dashboard")
        setDashboardData(response.data)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500">{error || "Failed to load dashboard"}</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Progress Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">Overall Progress</h2>
              <div className="text-3xl font-bold mb-2">{dashboardData.user.xp} XP</div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.min(100, dashboardData.user.xp % 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">Current Streak</h2>
              <div className="text-3xl font-bold mb-2">{dashboardData.user.streak} days</div>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                      i < dashboardData.user.streak ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">Recent Badges</h2>
              {dashboardData.recentBadges && dashboardData.recentBadges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {dashboardData.recentBadges.map((badge) => (
                    <div key={badge._id} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-300 dark:bg-yellow-600 flex items-center justify-center">
                        {badge.badge.icon || "🏆"}
                      </div>
                      <span className="text-sm">{badge.badge.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No badges earned yet</p>
              )}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Chapter Progress</h2>

          <div className="grid grid-cols-1 gap-6 mb-8">
            {dashboardData.progress &&
              dashboardData.progress.map((chapter) => (
                <div key={chapter._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-2">{chapter.chapterTitle}</h3>
                  <div className="flex justify-between mb-2">
                    <span>Progress: {Math.round((chapter.completedLevels / chapter.totalLevels) * 100)}%</span>
                    <span>
                      {chapter.completedLevels}/{chapter.totalLevels} levels completed
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(chapter.completedLevels / chapter.totalLevels) * 100}%` }}
                    />
                  </div>

                  <div className="mt-4 text-right">
                    <Link
                      to={`/chapter/${chapter._id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md"
                    >
                      Continue Learning
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default DashboardPage
