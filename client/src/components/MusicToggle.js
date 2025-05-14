"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"

const MusicToggle = () => {
  const { user, updateMusicPreference } = useAuth()
  const [isMusicOn, setIsMusicOn] = useState(user?.musicEnabled || false)
  const [audio] = useState(new Audio("/music/background.mp3"))

  useEffect(() => {
    // Set initial state from user preferences
    if (user) {
      setIsMusicOn(user.musicEnabled)
    }
  }, [user])

  useEffect(() => {
    // Configure audio
    audio.loop = true
    audio.volume = 0.3

    // Play or pause based on state
    if (isMusicOn) {
      audio.play().catch((e) => console.error("Error playing audio:", e))
    } else {
      audio.pause()
    }

    // Cleanup on unmount
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [isMusicOn, audio])

  const toggleMusic = async () => {
    try {
      const newState = !isMusicOn
      setIsMusicOn(newState)

      // Update user preference in database
      if (user) {
        await updateMusicPreference(newState)
      }
    } catch (error) {
      console.error("Error toggling music:", error)
      // Revert state if update fails
      setIsMusicOn(isMusicOn)
    }
  }

  return (
    <button onClick={toggleMusic} className="bg-secondary/70 hover:bg-secondary p-2 rounded-full">
      {isMusicOn ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      )}
      <span className="sr-only">Toggle music</span>
    </button>
  )
}

export default MusicToggle
