"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Lock } from "lucide-react"

const HomeIsland = ({ title, imagePath, description, hoverContent, chapterId, difficulty, isLocked = false }) => {
  const navigate = useNavigate()
  const [isZooming, setIsZooming] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const handleIslandClick = () => {
    if (isLocked) return

    setIsZooming(true)
    // Navigate after zoom animation starts
    setTimeout(() => {
      navigate(`/chapter/${chapterId}`)
    }, 500)
  }

  // Determine background gradient based on difficulty
  const getBgGradient = () => {
    switch (difficulty) {
      case "beginner":
        return "from-green-200 to-green-100 dark:from-green-900 dark:to-green-800"
      case "intermediate":
        return "from-blue-200 to-blue-100 dark:from-blue-900 dark:to-blue-800"
      case "advanced":
        return "from-purple-200 to-purple-100 dark:from-purple-900 dark:to-purple-800"
      default:
        return "from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700"
    }
  }

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <h2 className="text-2xl font-bold mb-2 text-center font-pixel">{title}</h2>

      <div
        className={`island cursor-pointer ${isZooming ? "zoom-transition scale-150" : ""} ${isLocked ? "opacity-70 cursor-not-allowed" : ""}`}
        onClick={handleIslandClick}
      >
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={imagePath || "/placeholder.svg"}
            alt={`${title} island`}
            className="rounded-lg w-full max-w-[300px] transition-transform duration-500 hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-b ${getBgGradient()} opacity-40`}></div>

          {/* Lock overlay for locked chapters */}
          {isLocked && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Lock size={48} className="text-white opacity-80" />
            </div>
          )}
        </div>
      </div>

      <div
        className={`chapter-preview absolute top-full mt-4 z-10 transition-all duration-500 w-full max-w-xs ${
          isHovering ? "opacity-100 transform-none pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-l-4 ${
            difficulty === "beginner"
              ? "border-green-500"
              : difficulty === "intermediate"
                ? "border-blue-500"
                : "border-purple-500"
          }`}
        >
          <p className="text-sm mb-3">{description}</p>
          <p className="text-xs italic text-gray-600 dark:text-gray-400">{hoverContent}</p>

          {isLocked ? (
            <div className="mt-3 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Lock size={14} />
              <span>Complete previous chapters to unlock</span>
            </div>
          ) : (
            <button
              className="mt-3 text-sm text-primary hover:text-primary/80 font-semibold"
              onClick={handleIslandClick}
            >
              Begin this adventure →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomeIsland
