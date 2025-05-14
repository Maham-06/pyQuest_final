/*
"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ChapterLevels from "../components/ChapterLevels"
import ChapterIntroModal from "../components/ChapterIntroModal"
import api from "../services/api"
import useLocalStorage from "../hooks/useLocalStorage"
import { ArrowLeft, BookOpen } from "lucide-react"

const ChapterPage = () => {
  const { id } = useParams()
  const [chapter, setChapter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showIntro, setShowIntro] = useState(false)
  const [seenChapterIntros, setSeenChapterIntros] = useLocalStorage("pyquest_seen_chapter_intros", {})

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await api.get(`/api/chapters/${id}`)

        // Enhance the chapter data with more levels and exercises
        const enhancedChapter = enhanceChapterData(response.data.chapter)
        setChapter(enhancedChapter)

        // Check if user has seen this chapter intro before
        if (!seenChapterIntros[id]) {
          setShowIntro(true)
          // Mark this chapter intro as seen
          setSeenChapterIntros({
            ...seenChapterIntros,
            [id]: true,
          })
        }
      } catch (err) {
        console.error("Error fetching chapter:", err)
        setError("Failed to load chapter. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchChapter()
  }, [id, seenChapterIntros, setSeenChapterIntros])

  // Function to enhance chapter data with more levels and exercises
  const enhanceChapterData = (chapterData) => {
    if (!chapterData) return null

    // Get the base levels from the API
    const baseLevels = chapterData.levels || []

    // Create additional levels if needed to have at least 8 levels per chapter
    const enhancedLevels = [...baseLevels]

    // Define level templates based on difficulty
    const levelTemplates = {
      beginner: [
        { title: "Variables & Data Types", description: "Learn about variables and basic data types in Python" },
        { title: "Operators & Expressions", description: "Master arithmetic, comparison, and logical operators" },
        {
          title: "Strings & Text Manipulation",
          description: "Discover how to work with and manipulate text in Python",
        },
        { title: "Input & Output", description: "Learn to interact with users through input and output" },
        { title: "Conditionals", description: "Master if, elif, and else statements for decision making" },
        { title: "Lists & Collections", description: "Work with Python lists and basic data collections" },
        { title: "Loops & Iterations", description: "Explore for and while loops to repeat actions" },
        { title: "Basic Functions", description: "Create and use simple functions to organize code" },
      ],
      intermediate: [
        { title: "Advanced Functions", description: "Master function parameters, returns, and scope" },
        { title: "Dictionaries & Sets", description: "Work with key-value pairs and unique collections" },
        { title: "List Comprehensions", description: "Write elegant and concise list operations" },
        { title: "Error Handling", description: "Learn to catch and handle exceptions gracefully" },
        { title: "File Operations", description: "Read from and write to files on your system" },
        { title: "Modules & Packages", description: "Organize and reuse code with modules and packages" },
        { title: "Classes & Objects", description: "Introduction to object-oriented programming" },
        { title: "Inheritance & Polymorphism", description: "Extend classes and override methods" },
      ],
      advanced: [
        { title: "Decorators", description: "Modify function behavior with decorators" },
        { title: "Generators & Iterators", description: "Create efficient data streams and custom iterators" },
        { title: "Context Managers", description: "Manage resources with context managers and 'with' statements" },
        { title: "Advanced OOP", description: "Master metaclasses, abstract classes, and multiple inheritance" },
        { title: "Concurrency", description: "Run code in parallel with threading and multiprocessing" },
        { title: "Async Programming", description: "Write non-blocking code with async and await" },
        { title: "Design Patterns", description: "Implement common design patterns in Python" },
        { title: "Testing & Debugging", description: "Write tests and debug complex applications" },
      ],
    }

    // Get templates based on chapter difficulty
    const templates = levelTemplates[chapterData.difficulty] || levelTemplates.beginner

    // Fill in missing levels
    while (enhancedLevels.length < 8) {
      const template = templates[enhancedLevels.length]
      if (!template) break

      enhancedLevels.push({
        id: `generated-${chapterData.id}-level-${enhancedLevels.length + 1}`,
        title: template.title,
        description: template.description,
        // Add progress data if needed
        progress: { completed: false, attempts: 0 },
        // Add exercises (3 per level)
        exercises: [
          { id: `ex1-${enhancedLevels.length + 1}`, title: "Basic Concepts", completed: false },
          { id: `ex2-${enhancedLevels.length + 1}`, title: "Practical Application", completed: false },
          { id: `ex3-${enhancedLevels.length + 1}`, title: "Advanced Challenge", completed: false },
        ],
      })
    }

    // Add exercises to existing levels if they don't have them
    enhancedLevels.forEach((level, index) => {
      if (!level.exercises) {
        level.exercises = [
          { id: `ex1-${index}`, title: "Basic Concepts", completed: level.progress?.completed || false },
          { id: `ex2-${index}`, title: "Practical Application", completed: level.progress?.completed || false },
          { id: `ex3-${index}`, title: "Advanced Challenge", completed: level.progress?.completed || false },
        ]
      }

      // Implement level locking logic
      level.isLocked = false
      if (index > 0) {
        // A level is locked if the previous level is not completed
        const previousLevel = enhancedLevels[index - 1]
        level.isLocked = !previousLevel.progress?.completed
      }
    })

    return {
      ...chapterData,
      levels: enhancedLevels,
    }
  }

  // Get chapter intro content based on difficulty
  const getChapterIntroContent = () => {
    if (!chapter) return { title: "", content: "" }

    const introContent = {
      beginner: {
        title: "The Beginner's Valley",
        content:
          "Welcome to the Valley of Beginnings, brave coder! Here, you'll take your first steps into the magical world of Python. The path ahead is gentle but filled with knowledge that will form the foundation of your entire journey. Master the basics of variables, data types, and simple operations as you explore this peaceful valley.",
      },
      intermediate: {
        title: "The Forest of Functions",
        content:
          "You've entered the mysterious Forest of Functions! The trees grow tall with knowledge of advanced programming concepts. Navigate through the winding paths of loops, discover the power of functions, and learn to make decisions at the crossroads of conditional statements. The forest may seem dense, but each challenge conquered brings new clarity.",
      },
      advanced: {
        title: "The Mountains of Mastery",
        content:
          "Before you stand the imposing Mountains of Mastery! Only the most dedicated adventurers dare to climb these peaks. Here, you'll ascend through the clouds of complexity to master object-oriented programming, build mighty class structures, and understand the inheritance of power. The climb is steep, but the view from the summit reveals the true potential of Python.",
      },
    }

    return (
      introContent[chapter.difficulty] || {
        title: chapter.title,
        content: `Welcome to ${chapter.title}! Prepare yourself for exciting Python challenges and adventures.`,
      }
    )
  }

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

  if (error || !chapter) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500">{error || "Chapter not found"}</p>
        </div>
        <Footer />
      </div>
    )
  }

  const introContent = getChapterIntroContent()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Map</span>
            </Link>

            <button
              className="ml-auto flex items-center gap-1 px-3 py-1 text-primary hover:text-primary/80 rounded-md"
              onClick={() => setShowIntro(true)}
            >
              <BookOpen className="h-4 w-4" />
              <span>Chapter Intro</span>
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold font-pixel">{introContent.title}</h1>
            <p className="text-lg">{chapter.description}</p>
          </div>

          <ChapterLevels levels={chapter.levels} chapterId={id} />
        </div>
      </main>
      <Footer />

      <ChapterIntroModal
        isOpen={showIntro}
        onClose={() => setShowIntro(false)}
        title={introContent.title}
        content={introContent.content}
        difficulty={chapter.difficulty}
      />
    </div>
  )
}

export default ChapterPage
*/

"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ChapterLevels from "../components/ChapterLevels"
import ChapterIntroModal from "../components/ChapterIntroModal"
import LoadingSpinner from "../components/LoadingSpinner"
import { useToast } from "../context/ToastContext"
import chaptersService from "../services/chapterService"

const ChapterPage = () => {
  const { id } = useParams()
  const [chapter, setChapter] = useState(null)
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showIntro, setShowIntro] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch chapter details
        const chapterResponse = await chaptersService.getChapterById(id)

        if (!chapterResponse.success) {
          setError(chapterResponse.message || "Failed to load chapter")
          addToast(chapterResponse.message || "Failed to load chapter", "error")
          return
        }

        setChapter(chapterResponse.chapter)

        // Show intro modal if it's the first visit
        const hasSeenIntro = localStorage.getItem(`pyquest_seen_chapter_${id}`)
        if (!hasSeenIntro) {
          setShowIntro(true)
          localStorage.setItem(`pyquest_seen_chapter_${id}`, "true")
        }

        // Fetch chapter levels
        const levelsResponse = await chaptersService.getChapterLevels(id)

        if (levelsResponse.success) {
          setLevels(levelsResponse.levels)
        } else {
          addToast(levelsResponse.message || "Failed to load levels", "warning")
          // Don't set error here, we still want to show the chapter even if levels fail
        }
      } catch (err) {
        console.error("Error fetching chapter data:", err)
        setError("Failed to load chapter data. Please try again later.")
        addToast("Failed to load chapter data. Please try again later.", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchChapterData()
  }, [id, addToast])

  const handleCloseIntro = () => {
    setShowIntro(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-red-100 dark:bg-red-900 p-6 rounded-lg max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">Error</h2>
            <p className="mb-4">{error}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/home")}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{chapter?.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{chapter?.description}</p>
          </div>

          <ChapterLevels levels={levels} chapterId={id} />
        </div>
      </main>

      <Footer />

      <ChapterIntroModal
        isOpen={showIntro}
        onClose={handleCloseIntro}
        title={chapter?.title}
        content={chapter?.long_description || chapter?.description}
        difficulty={chapter?.difficulty}
      />
    </div>
  )
}

export default ChapterPage
