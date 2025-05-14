"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("achievements")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    musicEnabled: true,
  })
  const [userBadges, setUserBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        musicEnabled: user.musicEnabled !== undefined ? user.musicEnabled : true,
      })
    }

    const fetchUserProgress = async () => {
      try {
        const response = await api.get("/api/users/progress")
        setUserBadges(response.data.badges || [])
      } catch (err) {
        console.error("Error fetching user progress:", err)
        setError("Failed to load user progress")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProgress()
  }, [user])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage("")

    try {
      await updateProfile(formData)
      setSuccessMessage("Profile updated successfully")
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile")
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">User Info</h2>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Username:</span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Joined:</span>
                  <span className="font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">XP Points</span>
                    <span className="text-sm font-medium">{user?.xp || 0}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, (user?.xp || 0) % 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Stats</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Badges:</span>
                  <span className="font-medium">{userBadges.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Streak:</span>
                  <span className="font-medium">{user?.streak || 0} days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 ${activeTab === "achievements" ? "border-b-2 border-primary font-medium" : ""}`}
              onClick={() => setActiveTab("achievements")}
            >
              Achievements
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "settings" ? "border-b-2 border-primary font-medium" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>

          {activeTab === "achievements" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Your Achievements</h2>
              {userBadges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {userBadges.map((userBadge) => (
                    <div
                      key={userBadge._id}
                      className="flex flex-col items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="w-16 h-16 rounded-full bg-yellow-300 dark:bg-yellow-600 flex items-center justify-center mb-2">
                        {userBadge.badge.icon || "🏆"}
                      </div>
                      <span className="text-sm font-medium text-center">{userBadge.badge.name}</span>
                      <span className="text-xs text-center text-gray-500 dark:text-gray-400">
                        {userBadge.badge.description}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No badges earned yet. Keep learning to earn badges!
                </p>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="musicEnabled"
                    name="musicEnabled"
                    checked={formData.musicEnabled}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="musicEnabled" className="text-sm font-medium">
                    Enable Background Music
                  </label>
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md">
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProfilePage
