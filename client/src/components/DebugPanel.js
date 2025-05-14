"use client"

import { useState } from "react"
import api from "../services/api"

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [useMockApi, setUseMockApi] = useState(api.isMockApi())
  const [logs, setLogs] = useState([])

  // Add a log message
  const addLog = (message, type = "info") => {
    setLogs((prevLogs) => [
      { id: Date.now(), message, type, timestamp: new Date().toLocaleTimeString() },
      ...prevLogs.slice(0, 19), // Keep only the last 20 logs
    ])
  }

  // Toggle mock API
  const toggleMockApi = () => {
    const newValue = !useMockApi
    setUseMockApi(newValue)
    api.toggleMockApi(newValue)
    addLog(`Mock API ${newValue ? "enabled" : "disabled"}`, newValue ? "warning" : "success")
  }

  // Clear local storage
  const clearLocalStorage = () => {
    localStorage.clear()
    addLog("Local storage cleared", "warning")
  }

  // Test API connection
  const testApiConnection = async () => {
    try {
      addLog("Testing API connection...", "info")
      const response = await fetch(process.env.REACT_APP_API_URL || "http://localhost:5000/api/health")
      const data = await response.json()
      addLog(`API connection: ${data.status || "OK"}`, "success")
    } catch (error) {
      addLog(`API connection failed: ${error.message}`, "error")
    }
  }

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        {isOpen ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Debug Panel</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span>Mock API:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={useMockApi} onChange={toggleMockApi} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearLocalStorage}
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Clear Storage
                </button>
                <button
                  onClick={testApiConnection}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Test API
                </button>
              </div>
            </div>

            <div className="border-t pt-2">
              <h4 className="font-medium text-sm mb-2">Logs:</h4>
              <div className="space-y-1 text-xs">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-1 rounded ${
                      log.type === "error"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : log.type === "warning"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : log.type === "success"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <span className="text-xs opacity-75">{log.timestamp}</span> {log.message}
                  </div>
                ))}
                {logs.length === 0 && <div className="text-gray-500 dark:text-gray-400">No logs yet</div>}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gray-800 dark:bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600"
          >
            🛠️
          </button>
        )}
      </div>
    )
  }

  return null // Don't render in production
}

export default DebugPanel
