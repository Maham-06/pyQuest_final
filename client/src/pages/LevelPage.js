/*
"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import LevelContent from "../components/LevelContent"
import PythonCompiler from "../components/PythonCompiler"
import LevelCompletionModal from "../components/LevelCompletionModal"
import ExerciseSelector from "../components/ExerciseSelector"
import LoadingSpinner from "../components/LoadingSpinner"
import { useToast } from "../context/ToastContext"
import { ArrowLeft, Book, Code } from "lucide-react"
import api from "../services/api"

const LevelPage = () => {
  const { chapterId, levelId } = useParams()
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [completionData, setCompletionData] = useState(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [activeExercise, setActiveExercise] = useState(0)
  const { addToast } = useToast()

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/api/levels/${levelId}`)

        // Enhance level with multiple exercises if they don't exist
        let levelData = response.data.level
        if (!levelData.exercises || levelData.exercises.length === 0) {
          levelData = {
            ...levelData,
            exercises: [
              {
                id: `${levelId}-ex1`,
                title: "Basic Concepts",
                description: "Learn the fundamental concepts of this topic",
                content: levelData.content,
                initialCode: levelData.initialCode,
                instructions: levelData.instructions,
                completed: response.data.progress?.completed || false,
              },
              {
                id: `${levelId}-ex2`,
                title: "Practical Application",
                description: "Apply what you've learned to solve a practical problem",
                content: `# Practical Application\n\nNow that you understand the basic concepts, let's apply them to a real-world scenario.\n\n${levelData.content.split("\n").slice(1).join("\n")}`,
                initialCode: levelData.initialCode,
                instructions: `Apply your knowledge to solve this practical problem: ${levelData.instructions}`,
                completed: response.data.progress?.completed || false,
              },
              {
                id: `${levelId}-ex3`,
                title: "Advanced Challenge",
                description: "Test your mastery with a more complex challenge",
                content: `# Advanced Challenge\n\nReady to push your skills further? This challenge will test your understanding at a deeper level.\n\n${levelData.content.split("\n").slice(1).join("\n")}`,
                initialCode: levelData.initialCode,
                instructions: `Challenge yourself with this advanced problem: ${levelData.instructions}`,
                completed: response.data.progress?.completed || false,
              },
            ],
          }
        }

        setLevel(levelData)
      } catch (err) {
        console.error("Error fetching level:", err)
        setError("Failed to load level. Please try again later.")
        addToast("Failed to load level", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchLevel()
  }, [levelId, addToast])

  const handleLevelComplete = (data) => {
    setCompletionData(data)
    setShowCompletionModal(true)

    // Play success sound
    const audio = new Audio("/sounds/success.mp3")
    audio.volume = 0.5
    audio.play().catch((e) => console.error("Error playing audio:", e))

    // Show toast notification
    addToast("Quest completed successfully!", "success")

    // Mark current exercise as completed
    if (level && level.exercises) {
      const updatedExercises = [...level.exercises]
      updatedExercises[activeExercise].completed = true
      setLevel({
        ...level,
        exercises: updatedExercises,
      })
    }
  }

  const handleExerciseChange = (index) => {
    setActiveExercise(index)
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

  if (error || !level) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || "Level not found"}</p>
            <Link
              to={`/chapter/${chapterId}`}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md"
            >
              Return to Chapter
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const currentExercise = level.exercises?.[activeExercise] || {
    content: level.content,
    initialCode: level.initialCode,
    instructions: level.instructions,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-4">
        <div className="mb-4 flex justify-between items-center">
          <Link
            to={`/chapter/${chapterId}`}
            className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Chapter</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Level Progress:</span>
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${
                    level.exercises
                      ? (level.exercises.filter((ex) => ex.completed).length / level.exercises.length) * 100
                      : level.progress?.completed
                        ? 100
                        : level.progress?.attempts
                          ? 50
                          : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-bold font-pixel">{level.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{level.description}</p>
        </div>

        {level.exercises && level.exercises.length > 0 && (
          <ExerciseSelector exercises={level.exercises} activeIndex={activeExercise} onChange={handleExerciseChange} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Book size={18} />
              <h2 className="font-semibold">Learning Materials</h2>
            </div>
            <LevelContent content={currentExercise.content} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Code size={18} />
              <h2 className="font-semibold">Coding Challenge</h2>
            </div>
            <PythonCompiler
              initialCode={currentExercise.initialCode}
              instructions={currentExercise.instructions}
              testCases={level.testCases}
              levelId={levelId}
              onComplete={handleLevelComplete}
            />
          </div>
        </div>
      </main>
      <Footer />

      <LevelCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        completionData={completionData}
        chapterId={chapterId}
      />
    </div>
  )
}

export default LevelPage
*/

"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import LevelContent from "../components/LevelContent"
import PythonCompiler from "../components/PythonCompiler"
import LevelCompletionModal from "../components/LevelCompletionModal"
import ExerciseSelector from "../components/ExerciseSelector"
import LoadingSpinner from "../components/LoadingSpinner"
import { useToast } from "../context/ToastContext"
import { ArrowLeft, Book, Code } from "lucide-react"
import levelService from "../services/levelService"

const LevelPage = () => {
  const { chapterId, levelId } = useParams()
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [completionData, setCompletionData] = useState(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [activeExercise, setActiveExercise] = useState(0)
  const { addToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await levelService.getLevelById(levelId)

        if (response.success) {
          // Enhance level with multiple exercises if they don't exist
          let levelData = response.level

          // Ensure content is a string to prevent split errors
          const content =
            typeof levelData.content === "string"
              ? levelData.content
              : JSON.stringify(levelData.content) || "# No content available"

          if (!levelData.exercises || levelData.exercises.length === 0) {
            // Create a safe content split function
            const splitContent = (content, startIndex = 1) => {
              try {
                return content.split("\n").slice(startIndex).join("\n")
              } catch (err) {
                console.error("Error splitting content:", err)
                return content
              }
            }

            levelData = {
              ...levelData,
              content: content, // Use the sanitized content
              exercises: [
                {
                  id: `${levelId}-ex1`,
                  title: "Basic Concepts",
                  description: "Learn the fundamental concepts of this topic",
                  content: content,
                  initialCode: levelData.initialCode || "# Write your code here",
                  instructions: levelData.instructions || "Complete the exercise",
                  completed: response.progress?.completed || false,
                },
                {
                  id: `${levelId}-ex2`,
                  title: "Practical Application",
                  description: "Apply what you've learned to solve a practical problem",
                  content: `# Practical Application\n\nNow that you understand the basic concepts, let's apply them to a real-world scenario.\n\n${splitContent(content)}`,
                  initialCode: levelData.initialCode || "# Write your code here",
                  instructions: `Apply your knowledge to solve this practical problem: ${levelData.instructions || "Complete the exercise"}`,
                  completed: response.progress?.completed || false,
                },
                {
                  id: `${levelId}-ex3`,
                  title: "Advanced Challenge",
                  description: "Test your mastery with a more complex challenge",
                  content: `# Advanced Challenge\n\nReady to push your skills further? This challenge will test your understanding at a deeper level.\n\n${splitContent(content)}`,
                  initialCode: levelData.initialCode || "# Write your code here",
                  instructions: `Challenge yourself with this advanced problem: ${levelData.instructions || "Complete the exercise"}`,
                  completed: response.progress?.completed || false,
                },
              ],
            }
          }

          setLevel(levelData)
        } else {
          setError(response.message || "Failed to load level")
          addToast(response.message || "Failed to load level", "error")
        }
      } catch (err) {
        console.error("Error fetching level:", err)
        setError("Failed to load level. Please try again later.")
        addToast("Failed to load level", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchLevel()
  }, [levelId, addToast])

  const handleLevelComplete = (data) => {
    setCompletionData(data)
    setShowCompletionModal(true)

    // Play success sound
    const audio = new Audio("/sounds/success.mp3")
    audio.volume = 0.5
    audio.play().catch((e) => console.error("Error playing audio:", e))

    // Show toast notification
    addToast("Quest completed successfully!", "success")

    // Mark current exercise as completed
    if (level && level.exercises) {
      const updatedExercises = [...level.exercises]
      updatedExercises[activeExercise].completed = true
      setLevel({
        ...level,
        exercises: updatedExercises,
      })
    }
  }

  const handleExerciseChange = (index) => {
    setActiveExercise(index)
  }

  const handleRetry = () => {
    window.location.reload()
  }

  const handleBackToChapter = () => {
    navigate(`/chapter/${chapterId}`)
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

  if (error || !level) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Error Loading Level</h2>
            <p className="mb-6">{error || "Level not found"}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={handleRetry} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md">
                Retry
              </button>
              <button
                onClick={handleBackToChapter}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Back to Chapter
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const currentExercise = level.exercises?.[activeExercise] || {
    content: level.content || "# No content available",
    initialCode: level.initialCode || "# Write your code here",
    instructions: level.instructions || "Complete the exercise",
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-4">
        <div className="mb-4 flex justify-between items-center">
          <Link
            to={`/chapter/${chapterId}`}
            className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Chapter</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Level Progress:</span>
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${
                    level.exercises
                      ? (level.exercises.filter((ex) => ex.completed).length / level.exercises.length) * 100
                      : level.progress?.completed
                        ? 100
                        : level.progress?.attempts
                          ? 50
                          : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-bold">{level.title || "Level"}</h1>
          <p className="text-gray-600 dark:text-gray-300">{level.description || "No description available"}</p>
        </div>

        {level.exercises && level.exercises.length > 0 && (
          <ExerciseSelector exercises={level.exercises} activeIndex={activeExercise} onChange={handleExerciseChange} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Book size={18} />
              <h2 className="font-semibold">Learning Materials</h2>
            </div>
            <LevelContent content={currentExercise.content} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Code size={18} />
              <h2 className="font-semibold">Coding Challenge</h2>
            </div>
            <PythonCompiler
              initialCode={currentExercise.initialCode}
              instructions={currentExercise.instructions}
              testCases={level.testCases}
              levelId={levelId}
              onComplete={handleLevelComplete}
            />
          </div>
        </div>
      </main>
      <Footer />

      <LevelCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        completionData={completionData}
        chapterId={chapterId}
      />
    </div>
  )
}

export default LevelPage
