/*
"use client"

import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import HomeIsland from "../components/HomeIsland"
import MusicToggle from "../components/MusicToggle"
import JourneyStartModal from "../components/JourneyStartModal"
import api from "../services/api"

const HomePage = () => {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Adventure-themed narratives for each chapter
  const chapterNarratives = {
    beginner: {
      title: "The Beginner's Valley",
      description:
        "Start your journey in the peaceful valley where Python basics await. Learn variables, data types, and simple operations.",
      hoverContent:
        "In the Valley of Beginnings, young coders take their first steps into the world of Python. Here, you'll discover the ancient arts of variables, the mystical data types, and the fundamental spells of programming. The path is gentle, but the knowledge you gain will be the foundation of your entire journey.",
    },
    intermediate: {
      title: "The Forest of Functions",
      description:
        "Venture into the mysterious forest where you'll master functions, loops, and conditional statements.",
      hoverContent:
        "The Forest of Functions is a place of transformation and growth. Among its towering trees, you'll learn to craft powerful functions, navigate the winding paths of loops, and make decisions at the crossroads of conditional statements. The forest may seem dense, but each challenge conquered brings new clarity.",
    },
    advanced: {
      title: "The Mountains of Mastery",
      description: "Climb the challenging mountains to learn object-oriented programming, classes, and inheritance.",
      hoverContent:
        "The Mountains of Mastery stand tall against the sky, challenging only the most dedicated adventurers. Here, you'll ascend through the clouds of complexity to master object-oriented programming, build mighty class structures, and understand the inheritance of power. The climb is steep, but the view from the summit reveals the true potential of Python.",
    },
  }

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        let chaptersData = []

        // Check if we're using mock API
        if (api.isMockApi()) {
          console.log("Using mock chapters data")
          try {
            // Use mock chapters
            chaptersData = [
              {
                _id: "chapter1",
                title: "Beginner",
                description: "Start your Python journey with the basics",
                difficulty: "beginner",
                order: 1,
                imagePath: "/placeholder.svg?height=300&width=300",
              },
              {
                _id: "chapter2",
                title: "Intermediate",
                description: "Deepen your Python knowledge",
                difficulty: "intermediate",
                order: 2,
                imagePath: "/placeholder.svg?height=300&width=300",
                isLocked: true,
              },
              {
                _id: "chapter3",
                title: "Advanced",
                description: "Master Python with advanced topics",
                difficulty: "advanced",
                order: 3,
                imagePath: "/placeholder.svg?height=300&width=300",
                isLocked: true,
              },
            ]
          } catch (err) {
            console.error("Error with mock chapters:", err)
          }
        } else {
          const response = await api.get("/api/chapters")
          chaptersData = response.data.chapters
        }

        // Enhance chapters with adventure narratives
        const enhancedChapters = chaptersData.map((chapter) => {
          const narrative = chapterNarratives[chapter.difficulty] || {
            title: chapter.title,
            description: chapter.description,
            hoverContent: "Embark on this exciting chapter of your Python journey!",
          }

          return {
            ...chapter,
            narrativeTitle: narrative.title,
            narrativeDescription: narrative.description,
            hoverContent: narrative.hoverContent,
          }
        })

        setChapters(enhancedChapters)
      } catch (err) {
        console.error("Error fetching chapters:", err)
        setError("Failed to load chapters. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchChapters()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <JourneyStartModal />
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center p-4 relative">
        <div className="absolute top-4 right-4">
          <MusicToggle />
        </div>

        <h1 className="text-4xl font-bold text-primary mb-2 font-pixel">PyQuest</h1>
        <p className="text-lg mb-8 text-center max-w-2xl">
          Choose your path, brave coder! Each island holds unique Python challenges and adventures.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {chapters.map((chapter) => (
            <HomeIsland
              key={chapter._id}
              title={chapter.narrativeTitle || chapter.title}
              imagePath={chapter.imagePath || "/placeholder.svg?height=300&width=300"}
              description={chapter.narrativeDescription || chapter.description}
              hoverContent={chapter.hoverContent}
              chapterId={chapter._id}
              difficulty={chapter.difficulty}
              isLocked={chapter.isLocked}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage
*/
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import HomeIsland from "../components/HomeIsland"
import JourneyStartModal from "../components/JourneyStartModal"
import LoadingSpinner from "../components/LoadingSpinner"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import chaptersService from "../services/chapterService"

const HomePage = () => {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await chaptersService.getAllChapters()

        if (response.success) {
          setChapters(response.chapters)
        } else {
          setError(response.message || "Failed to load chapters")
          addToast(response.message || "Failed to load chapters", "error")
        }
      } catch (err) {
        console.error("Error fetching chapters:", err)
        setError("Failed to load chapters. Please try again later.")
        addToast("Failed to load chapters. Please try again later.", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchChapters()
  }, [addToast])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || "Adventurer"}!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Continue your Python journey by selecting a chapter below.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-md text-red-700 dark:text-red-300">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters.map((chapter) => (
                <HomeIsland
                  key={chapter.id}
                  title={chapter.title}
                  imagePath={chapter.image_path || `/placeholder.svg?height=300&width=300&text=${chapter.title}`}
                  description={chapter.description}
                  hoverContent={`Difficulty: ${chapter.difficulty}\nLevels: ${chapter.level_count || "Multiple"}`}
                  chapterId={chapter.id}
                  difficulty={chapter.difficulty}
                  isLocked={chapter.isLocked}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <JourneyStartModal />
    </div>
  )
}

export default HomePage
