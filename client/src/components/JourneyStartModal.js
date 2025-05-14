"use client"

import { useState, useEffect } from "react"
import useLocalStorage from "../hooks/useLocalStorage"

const JourneyStartModal = () => {
  const [showModal, setShowModal] = useState(false)
  const [hasSeenIntro, setHasSeenIntro] = useLocalStorage("pyquest_seen_intro", false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (!hasSeenIntro) {
      setShowModal(true)

      // Set the flag to true so it only shows once
      setHasSeenIntro(true)
    }
  }, [hasSeenIntro, setHasSeenIntro])

  const handleClose = () => {
    setFadeOut(true)
    setTimeout(() => {
      setShowModal(false)
    }, 1000)
  }

  if (!showModal) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 ${fadeOut ? "opacity-0" : "opacity-100"}`}
      onClick={handleClose}
    >
      <div className="text-center p-8 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-pixel text-primary mb-8 animate-pulse">And your journey starts...</h1>
        <p className="text-white text-xl md:text-2xl mb-12 opacity-80">
          Welcome to the magical realm of Python, brave adventurer!
        </p>
        <div className="text-sm text-gray-400 animate-bounce">Click anywhere to continue</div>
      </div>
    </div>
  )
}

export default JourneyStartModal
