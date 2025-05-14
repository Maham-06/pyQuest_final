/*
import axios from "axios"
import mockApi from "./mockApi"

// Create a function to check if we should use mock API
const checkUseMockApi = () => {
  return process.env.REACT_APP_USE_MOCK_API === "true" || localStorage.getItem("use_mock_api") === "true"
}

// Create axios instance for real API calls
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Add token to requests if it exists in localStorage
const token = localStorage.getItem("token")
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

// Add response interceptor for handling token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, clear token and redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      delete axiosInstance.defaults.headers.common["Authorization"]
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Create a real API object with the methods we'll proxy
const realApi = {
  ...axiosInstance,
  setToken: (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken)
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`
    } else {
      localStorage.removeItem("token")
      delete axiosInstance.defaults.headers.common["Authorization"]
    }
  },
  isMockApi: checkUseMockApi,
  toggleMockApi: (useMock) => {
    if (useMock) {
      localStorage.setItem("use_mock_api", "true")
      console.log("Mock API mode enabled")
    } else {
      localStorage.removeItem("use_mock_api")
      console.log("Mock API mode disabled")
    }
    // Reload the page to apply changes
    window.location.reload()
  },
}

// Create a proxy to handle API calls
const api = new Proxy(realApi, {
  get: (target, prop) => {
    // Always check mock API status on each access
    const useMockApi = checkUseMockApi()

    // Return the target property if it's one of our custom methods
    if (prop === "isMockApi" || prop === "toggleMockApi" || prop === "setToken") {
      return target[prop]
    }

    // If using mock API and the method exists in mockApi, use it
    if (useMockApi && typeof mockApi[prop] === "function") {
      console.log(`Using mock API for: ${prop}`)
      return mockApi[prop]
    }

    // Special case for HTTP methods when in mock mode
    if (useMockApi && ["get", "post", "put", "delete", "patch"].includes(prop)) {
      return (...args) => {
        console.log(`Intercepting ${prop.toUpperCase()} request to: ${args[0]}`)

        // Try to find a matching mock handler based on the endpoint
        const endpoint = args[0]

        // Handle common endpoints
        if (endpoint === "/api/auth/me") {
          console.log("Using mock getCurrentUser")
          return Promise.resolve({ data: mockApi.getCurrentUser() })
        }

        if (endpoint === "/api/chapters") {
          console.log("Using mock getAllChapters")
          return Promise.resolve({ data: mockApi.getAllChapters() })
        }

        if (endpoint.startsWith("/api/chapters/")) {
          const id = endpoint.split("/").pop()
          console.log(`Using mock getChapterById with id: ${id}`)
          return Promise.resolve({ data: mockApi.getChapterById(id) })
        }

        if (endpoint === "/api/users/notifications") {
          console.log("Using mock getNotifications")
          // Add a mock implementation for notifications
          return Promise.resolve({
            data: {
              notifications: [],
            },
          })
        }

        if (endpoint === "/api/users/dashboard") {
          console.log("Using mock getDashboard")
          return Promise.resolve({ data: mockApi.getDashboard() })
        }

        if (endpoint === "/api/users/progress") {
          console.log("Using mock getUserProgress")
          return Promise.resolve({ data: mockApi.getUserProgress() })
        }

        // If no specific mock handler is found, return empty success response
        console.warn(`No specific mock handler for: ${endpoint}, returning generic success response`)
        return Promise.resolve({
          data: {
            success: true,
            message: "Mock API generic response",
          },
        })
      }
    }

    // For any other property, return the axios instance property
    return target[prop]
  },
})

// Check if we're in mock mode and log it
if (checkUseMockApi()) {
  console.log("Running in MOCK API mode - no backend connection required")
}

export default api
*/
import axios from "axios"

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  },
)

export default api
