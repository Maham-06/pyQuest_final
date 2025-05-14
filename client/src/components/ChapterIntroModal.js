"use client"

import { useState } from "react"

const ChapterIntroModal = ({ isOpen, onClose, title, content, difficulty }) => {
  const [fadeOut, setFadeOut] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    setFadeOut(true)
    setTimeout(() => {
      setFadeOut(false)
      onClose()
    }, 500)
  }

  // Get background based on difficulty
  const getBgClass = () => {
    switch (difficulty) {
      case "beginner":
        return "bg-gradient-to-br from-green-900 to-green-700"
      case "intermediate":
        return "bg-gradient-to-br from-blue-900 to-blue-700"
      case "advanced":
        return "bg-gradient-to-br from-purple-900 to-purple-700"
      default:
        return "bg-gradient-to-br from-gray-900 to-gray-700"
    }
  }

  // Get icon based on difficulty
  const getIcon = () => {
    switch (difficulty) {
      case "beginner":
        return "🏕️"
      case "intermediate":
        return "🌲"
      case "advanced":
        return "⛰️"
      default:
        return "📚"
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <div
        className={`relative max-w-2xl w-full rounded-lg shadow-2xl overflow-hidden transition-transform duration-500 ${fadeOut ? "scale-95" : "scale-100"}`}
      >
        <div className={`${getBgClass()} p-8`}>
          <button onClick={handleClose} className="absolute top-4 right-4 text-white opacity-70 hover:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">{getIcon()}</div>
            <h2 className="text-3xl font-bold text-white font-pixel">{title}</h2>
          </div>

          <div className="bg-white bg-opacity-10 p-6 rounded-lg text-white">
            <p className="text-lg leading-relaxed">{content}</p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-white text-gray-900 rounded-md font-semibold hover:bg-opacity-90 transition-colors"
            >
              Begin Your Quest
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterIntroModal
