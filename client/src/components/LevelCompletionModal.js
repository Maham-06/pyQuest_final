/*
"use client"
import { useNavigate } from "react-router-dom"
import { Award, ArrowRight } from "lucide-react"
import ConfettiExplosion from "react-confetti-explosion"

const LevelCompletionModal = ({ isOpen, onClose, completionData, chapterId }) => {
  const navigate = useNavigate()

  const handleContinue = () => {
    if (completionData?.nextLevel) {
      navigate(`/chapter/${chapterId}/level/${completionData.nextLevel.id}`)
    } else {
      navigate(`/chapter/${chapterId}`)
    }
    onClose()
  }

  if (!completionData || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        {isOpen && <ConfettiExplosion duration={3000} particleCount={100} width={1600} />}

        <div className="bg-gradient-to-b from-primary/20 to-transparent p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2 font-pixel">Quest Completed!</h2>
            <p className="text-gray-600 dark:text-gray-300">
              You've successfully conquered this challenge, brave adventurer!
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-300">XP Earned:</span>
              <span className="font-bold text-primary">+{completionData.xpEarned}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Total XP:</span>
              <span className="font-bold">{completionData.currentXp}</span>
            </div>
            <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${Math.min(100, completionData.currentXp % 100)}%` }}
              ></div>
            </div>
          </div>

          {completionData.earnedBadges && completionData.earnedBadges.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Treasures Discovered:</h3>
              <div className="flex justify-center gap-4 flex-wrap">
                {completionData.earnedBadges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-yellow-300 dark:bg-yellow-600 flex items-center justify-center mb-2">
                      <span className="text-2xl">{badge.icon || "🏆"}</span>
                    </div>
                    <span className="font-medium text-center">{badge.name}</span>
                    <span className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                      {badge.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-md font-semibold flex items-center gap-2"
            >
              {completionData.nextLevel ? "Continue Your Adventure" : "Return to Chapter Map"}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LevelCompletionModal
*/

"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Star, Award, ArrowRight } from "lucide-react"

const LevelCompletionModal = ({ isOpen, onClose, completionData, chapterId }) => {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      // Play success sound
      const audio = new Audio("/sounds/success.mp3")
      audio.volume = 0.5
      audio.play().catch((e) => console.error("Error playing audio:", e))
    } else {
      setShowConfetti(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full relative">
        {showConfetti && <Confetti />}

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Level Completed!</h2>
          <p className="text-gray-600 dark:text-gray-300">Congratulations! You've successfully completed this level.</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <span>XP Earned</span>
            <span className="font-bold">+{completionData?.xpEarned || 0} XP</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <span>Stars Earned</span>
            <div className="flex">
              {Array.from({ length: completionData?.stars || 0 }).map((_, i) => (
                <Star key={i} className="text-yellow-500 fill-yellow-500" size={18} />
              ))}
              {Array.from({ length: 3 - (completionData?.stars || 0) }).map((_, i) => (
                <Star key={i} className="text-gray-300" size={18} />
              ))}
            </div>
          </div>

          {completionData?.earnedBadges && completionData.earnedBadges.length > 0 && (
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-md">
              <h3 className="font-bold mb-2">New Badges Earned!</h3>
              <div className="flex flex-wrap gap-2">
                {completionData.earnedBadges.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-yellow-300 dark:bg-yellow-600 flex items-center justify-center">
                      {badge.icon || "🏆"}
                    </div>
                    <span className="text-sm">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Close
          </button>

          {completionData?.nextLevel ? (
            <Link
              to={`/chapter/${chapterId}/level/${completionData.nextLevel.id}`}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md flex items-center justify-center gap-1"
              onClick={onClose}
            >
              Next Level <ArrowRight size={16} />
            </Link>
          ) : (
            <Link
              to={`/chapter/${chapterId}`}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md"
              onClick={onClose}
            >
              Back to Chapter
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// Simple confetti effect
const Confetti = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const colors = ["#FFC700", "#FF0055", "#2BD1FC", "#F222FF", "#F96D00"]
    const newParticles = []

    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 100,
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 1 + Math.random() * 3,
      })
    }

    setParticles(newParticles)

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          y: p.y + p.speed,
          x: p.x + (Math.random() - 0.5) * 2,
        })),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  )
}

export default LevelCompletionModal
