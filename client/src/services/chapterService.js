import api from "./api"

// Helper function to handle API errors
const handleApiError = (error, fallbackMessage = "An error occurred") => {
  console.error("API Error:", error)

  // Extract error message from response if available
  const errorMessage = error.response?.data?.message || error.message || fallbackMessage

  return {
    success: false,
    message: errorMessage,
    error,
  }
}

const chaptersService = {
  // Get all chapters
  getAllChapters: async () => {
    try {
      console.log("Fetching all chapters...")
      const response = await api.get("/api/chapters")
      console.log("Chapters response:", response.data)
      return response.data
    } catch (error) {
      return handleApiError(error, "Failed to load chapters")
    }
  },

  // Get chapter by ID
  getChapterById: async (chapterId) => {
    try {
      console.log(`Fetching chapter with ID: ${chapterId}`)
      const response = await api.get(`/api/chapters/${chapterId}`)
      console.log("Chapter response:", response.data)
      return response.data
    } catch (error) {
      return handleApiError(error, `Failed to load chapter ${chapterId}`)
    }
  },

  // Get levels for a chapter
  getChapterLevels: async (chapterId) => {
    try {
      console.log(`Fetching levels for chapter ID: ${chapterId}`)
      const response = await api.get(`/api/chapters/${chapterId}/levels`)
      console.log("Chapter levels response:", response.data)
      return response.data
    } catch (error) {
      return handleApiError(error, `Failed to load levels for chapter ${chapterId}`)
    }
  },
}

export default chaptersService
