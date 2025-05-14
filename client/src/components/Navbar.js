/*
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import ThemeSwitcher from "./ThemeSwitcher"
import { Bell, User, LogOut, BarChart2 } from "lucide-react"
import api from "../services/api"

const Navbar = () => {
  const { user, logout } = useAuth()
  const { isDark } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    try {
      let notificationsData = []

      // Check if we're using mock API
      if (api.isMockApi()) {
        console.log("Using mock notifications")
        try {
          // Use mock notifications
          notificationsData = [
            {
              _id: "notif1",
              type: "badge_earned",
              title: "Badge Earned",
              message: "You earned the First Steps badge!",
              read: false,
              createdAt: new Date().toISOString(),
            },
            {
              _id: "notif2",
              type: "level_completed",
              title: "Level Completed",
              message: "You completed Variables & Data Types and earned 50 XP!",
              read: true,
              createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            },
          ]
        } catch (err) {
          console.error("Error with mock notifications:", err)
        }
      } else {
        const response = await api.get("/api/users/notifications")
        notificationsData = response.data.notifications || []
      }

      setNotifications(notificationsData)
      setUnreadCount(notificationsData.filter((n) => !n.read).length)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      // Set empty notifications to prevent further errors
      setNotifications([])
      setUnreadCount(0)
    }
  }

  const markAsRead = async (id) => {
    try {
      if (api.isMockApi()) {
        // Mock implementation
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)))
      } else {
        await api.put(`/api/users/notifications/${id}/read`)
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)))
      }

      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Generate avatar URL using Dicebear
  const getAvatarUrl = () => {
    if (user?.avatar) return user.avatar

    // Use user's name or ID as seed for consistent avatar generation
    const seed = user?.name || user?._id || "anonymous"
    return `https://api.dicebear.com/6.x/adventurer/svg?seed=${encodeURIComponent(seed)}`
  }

  return (
    <nav className="w-full p-4 flex items-center justify-between bg-secondary/50 backdrop-blur-sm">
      <div className="flex items-center">
        <Link to="/">
          <div className="text-primary font-bold text-2xl flex items-center">
            <span className="mr-2">👑</span> PyQuest
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {api.isMockApi() && (
          <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full mr-4">
            Demo Mode
          </div>
        )}
        {user && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">XP: {user.xp || 0}</span>
              <div className="w-24 h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.min(100, (user.xp || 0) % 100)}%` }} />
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 max-h-96 overflow-y-auto">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700 font-medium">Notifications</div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-3 border-b border-gray-200 dark:border-gray-700 ${
                          !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                        }`}
                        onClick={() => markAsRead(notification._id)}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`mt-1 text-lg ${
                              notification.type === "badge_earned"
                                ? "text-yellow-500"
                                : notification.type === "level_completed"
                                  ? "text-green-500"
                                  : notification.type === "chapter_unlocked"
                                    ? "text-blue-500"
                                    : "text-gray-500"
                            }`}
                          >
                            {notification.type === "badge_earned"
                              ? "🏆"
                              : notification.type === "level_completed"
                                ? "✅"
                                : notification.type === "chapter_unlocked"
                                  ? "🔓"
                                  : "📢"}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </div>
                          </div>
                          {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <ThemeSwitcher />

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:brightness-110 transition-all overflow-hidden"
              >
                <img
                  src={getAvatarUrl() || "/placeholder.svg"}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
                <span className="sr-only">User profile</span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || ""}</p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={16} />
                    <span>Profile & Settings</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart2 size={16} />
                    <span>Progress Dashboard</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
*/
"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Menu, X, Sun, Moon, User, LogOut, Home, BarChart2 } from "lucide-react"

const Navbar = () => {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex items-center">
              <span className="text-2xl mr-2">👑</span>
              <span className="font-bold text-xl text-primary">PyQuest</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/home" className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              Home
            </Link>
            <Link to="/dashboard" className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              Dashboard
            </Link>
            <Link to="/profile" className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              Profile
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex items-center ml-4">
              <div className="relative group">
                <button className="flex items-center focus:outline-none">
                  <img
                    src={user?.avatar || `https://api.dicebear.com/6.x/adventurer/svg?seed=${user?.email || "default"}`}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full"
                  />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/home"
              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} className="mr-2" />
              Home
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart2 size={18} className="mr-2" />
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <User size={18} className="mr-2" />
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout()
                setIsMenuOpen(false)
              }}
              className="flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
