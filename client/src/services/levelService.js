import api from "./api"

// Helper function to handle API errors
const handleApiError = (error, fallbackMessage = "An error occurred") => {
  console.error("API Error:", error)
  const errorMessage = error.response?.data?.message || error.message || fallbackMessage
  return {
    success: false,
    message: errorMessage,
    error,
  }
}

const levelService = {
  // Get level by ID
  getLevelById: async (levelId) => {
    try {
      console.log(`Fetching level with ID: ${levelId}`)
      const response = await api.get(`/api/levels/${levelId}`)
      console.log("Level response:", response.data)
      return response.data
    } catch (error) {
      return handleApiError(error, `Failed to load level ${levelId}`)
    }
  },

  // Submit level solution
  submitSolution: async (levelId, code, timeSpent) => {
    try {
      console.log(`Submitting solution for level ID: ${levelId}`)
      const response = await api.post(`/api/levels/${levelId}/submit`, { code, timeSpent })
      console.log("Submit solution response:", response.data)
      return response.data
    } catch (error) {
      return handleApiError(error, "Failed to submit solution")
    }
  },

  // Complete level
  completeLevel: async (levelId, code, timeSpent, stars) => {
    try {
      console.log(`Completing level ID: ${levelId}`)
      const response = await api.post(`/api/levels/${levelId}/complete`, { code, timeSpent, stars })
      console.log("Complete level response:", response.data)
      return response.data
    } catch (error) {
      return handleApiError(error, "Failed to complete level")
    }
  },
}

export default levelService
