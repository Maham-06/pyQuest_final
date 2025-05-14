/*
const  {supabase } = require("../config/supabase")

// Get all chapters
exports.getAllChapters = async (req, res) => {
  try {
    const { data: chapters, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error getting chapters",
        error: error.message,
      })
    }

    res.status(200).json({
      success: true,
      chapters,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting chapters",
      error: error.message,
    })
  }
}

// Get chapter by ID
exports.getChapterById = async (req, res) => {
  try {
    const { id } = req.params

    // Get chapter
    const { data: chapter, error } = await supabase.from("chapters").select("*").eq("id", id).single()

    if (error || !chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      })
    }

    // Get levels for this chapter
    const { data: levels, error: levelsError } = await supabase
      .from("levels")
      .select("*")
      .eq("chapter_id", chapter.id)
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (levelsError) {
      return res.status(500).json({
        success: false,
        message: "Error getting levels",
        error: levelsError.message,
      })
    }

    // If user is authenticated, get their progress for these levels
    let progress = []
    if (req.user) {
      const { data: userProgress, error: progressError } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", req.user.id)
        .in(
          "level_id",
          levels.map((level) => level.id),
        )

      if (!progressError) {
        progress = userProgress
      }
    }

    // Map progress to levels
    const levelsWithProgress = levels.map((level) => {
      const levelProgress = progress.find((p) => p.level_id === level.id)
      return {
        id: level.id,
        title: level.title,
        description: level.description,
        order: level.order,
        xpReward: level.xp_reward,
        progress: levelProgress
          ? {
              completed: levelProgress.completed,
              stars: levelProgress.stars,
              attempts: levelProgress.attempts,
            }
          : null,
      }
    })

    res.status(200).json({
      success: true,
      chapter: {
        id: chapter.id,
        title: chapter.title,
        description: chapter.description,
        difficulty: chapter.difficulty,
        imagePath: chapter.image_path,
        levels: levelsWithProgress,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting chapter",
      error: error.message,
    })
  }
}
*/
/*
const { supabase } = require("../config/supabase")

const chapterController = {
  // Get all chapters
  getAllChapters: async (req, res) => {
    try {
      console.log("Backend: Getting all chapters")

      // Get user ID from auth middleware
      const userId = req.user?.id

      // Fetch all chapters from Supabase
      const { data: chapters, error } = await supabase.from("chapters").select("*").order("display_order", { ascending: true })

      if (error) {
        console.error("Error fetching chapters:", error)
        return res.status(500).json({
          success: false,
          message: "Error fetching chapters",
        })
      }

      // If user is authenticated, fetch their progress to determine locked chapters
      if (userId) {
        const { data: userProgress } = await supabase.from("user_progress").select("*").eq("user_id", userId).single()

        // Mark chapters as locked or unlocked based on user progress
        if (userProgress) {
          const completedChapters = userProgress.completed_chapters || []
          const currentChapter = userProgress.current_chapter || chapters[0]?.id

          chapters.forEach((chapter, index) => {
            if (index === 0) {
              // First chapter is always unlocked
              chapter.isLocked = false
            } else if (
              completedChapters.includes(chapters[index - 1].id) ||
              chapters[index - 1].id === currentChapter
            ) {
              // Unlock if previous chapter is completed or is the current chapter
              chapter.isLocked = false
            } else {
              chapter.isLocked = true
            }
          })
        } else {
          // If no progress, only first chapter is unlocked
          chapters.forEach((chapter, index) => {
            chapter.isLocked = index !== 0
          })
        }
      } else {
        // If not authenticated, don't lock any chapters (for preview)
        chapters.forEach((chapter) => {
          chapter.isLocked = false
        })
      }

      return res.status(200).json({
        success: true,
        chapters,
      })
    } catch (error) {
      console.error("Server error in getAllChapters:", error)
      return res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },

  // Get chapter by ID
  getChapterById: async (req, res) => {
    try {
      const { id } = req.params
      console.log(`Backend: Getting chapter with ID: ${id}`)

      // Fetch chapter from Supabase
      const { data: chapter, error } = await supabase.from("chapters").select("*").eq("id", id).single()

      if (error) {
        console.error(`Error fetching chapter ${id}:`, error)
        return res.status(404).json({
          success: false,
          message: "Chapter not found",
        })
      }

      return res.status(200).json({
        success: true,
        chapter,
      })
    } catch (error) {
      console.error("Server error in getChapterById:", error)
      return res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },

  // Get levels for a chapter
  getChapterLevels: async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user?.id
      console.log(`Backend: Getting levels for chapter ID: ${id}`)

      // Fetch levels from Supabase
      const { data: levels, error } = await supabase
        .from("levels")
        .select("*")
        .eq("chapter_id", id)
        .order("display_order", { ascending: true })

      if (error) {
        console.error(`Error fetching levels for chapter ${id}:`, error)
        return res.status(500).json({
          success: false,
          message: "Error fetching levels",
        })
      }

      // If user is authenticated, fetch their progress to determine locked levels
      if (userId) {
        const { data: userProgress } = await supabase
          .from("user_level_progress")
          .select("*")
          .eq("user_id", userId)
          .in(
            "level_id",
            levels.map((level) => level.id),
          )

        // Add progress data to each level
        levels.forEach((level, index) => {
          const progress = userProgress?.find((p) => p.level_id === level.id)

          if (progress) {
            level.progress = {
              completed: progress.completed,
              stars: progress.stars || 0,
              attempts: progress.attempts || 0,
              lastAttempt: progress.updated_at,
            }
          } else {
            level.progress = {
              completed: false,
              stars: 0,
              attempts: 0,
            }
          }

          // Lock levels based on progress
          if (index === 0) {
            // First level is always unlocked
            level.isLocked = false
          } else if (levels[index - 1].progress?.completed) {
            // Unlock if previous level is completed
            level.isLocked = false
          } else {
            level.isLocked = true
          }
        })
      } else {
        // If not authenticated, only first level is unlocked
        levels.forEach((level, index) => {
          level.isLocked = index !== 0
          level.progress = null
        })
      }

      return res.status(200).json({
        success: true,
        levels,
      })
    } catch (error) {
      console.error("Server error in getChapterLevels:", error)
      return res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },
}

module.exports = chapterController
*/
const { supabase } = require("../config/supabase")

const chapterController = {
  // Get all chapters
  getAllChapters: async (req, res) => {
    try {
      console.log("Backend: Getting all chapters")

      // Get user ID from auth middleware (if authenticated)
      const userId = req.user?.id

      // Fetch all chapters from Supabase
      const { data: chapters, error } = await supabase.from("chapters").select("*").order("display_order", { ascending: true })

      if (error) {
        console.error("Error fetching chapters:", error)
        return res.status(500).json({
          success: false,
          message: "Error fetching chapters",
        })
      }

      // If user is authenticated, fetch their progress to determine locked chapters
      if (userId) {
        const { data: userProgress } = await supabase.from("user_progress").select("*").eq("user_id", userId).single()

        // Mark chapters as locked or unlocked based on user progress
        if (userProgress) {
          const completedChapters = userProgress.completed_chapters || []
          const currentChapter = userProgress.current_chapter || chapters[0]?.id

          chapters.forEach((chapter, index) => {
            if (index === 0) {
              // First chapter is always unlocked
              chapter.isLocked = false
            } else if (
              completedChapters.includes(chapters[index - 1].id) ||
              chapters[index - 1].id === currentChapter
            ) {
              // Unlock if previous chapter is completed or is the current chapter
              chapter.isLocked = false
            } else {
              chapter.isLocked = true
            }
          })
        } else {
          // If no progress, only first chapter is unlocked
          chapters.forEach((chapter, index) => {
            chapter.isLocked = index !== 0
          })
        }
      } else {
        // If not authenticated, don't lock any chapters (for preview)
        chapters.forEach((chapter) => {
          chapter.isLocked = false
        })
      }

      return res.status(200).json({
        success: true,
        chapters,
      })
    } catch (error) {
      console.error("Server error in getAllChapters:", error)
      return res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },

  // Get chapter by ID
  getChapterById: async (req, res) => {
    try {
      const { id } = req.params
      console.log(`Backend: Getting chapter with ID: ${id}`)

      // Fetch chapter from Supabase
      const { data: chapter, error } = await supabase.from("chapters").select("*").eq("id", id).single()

      if (error) {
        console.error(`Error fetching chapter ${id}:`, error)
        return res.status(404).json({
          success: false,
          message: "Chapter not found",
        })
      }

      return res.status(200).json({
        success: true,
        chapter,
      })
    } catch (error) {
      console.error("Server error in getChapterById:", error)
      return res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },

  // Get levels for a chapter
  getChapterLevels: async (req, res) => {
    try {
      const { id } = req.params
      // User ID may be undefined if not authenticated
      const userId = req.user?.id
      console.log(`Backend: Getting levels for chapter ID: ${id}`)

      // Fetch levels from Supabase
      const { data: levels, error } = await supabase
        .from("levels")
        .select("*")
        .eq("chapter_id", id)
        .order("display_order", { ascending: true })

      if (error) {
        console.error(`Error fetching levels for chapter ${id}:`, error)
        return res.status(500).json({
          success: false,
          message: "Error fetching levels",
        })
      }

      // If no levels found, return empty array
      if (!levels || levels.length === 0) {
        return res.status(200).json({
          success: true,
          levels: [],
          message: "No levels found for this chapter",
        })
      }

      // If user is authenticated, fetch their progress to determine locked levels
      if (userId) {
        const { data: userProgress } = await supabase
          .from("user_level_progress")
          .select("*")
          .eq("user_id", userId)
          .in(
            "level_id",
            levels.map((level) => level.id),
          )

        // Add progress data to each level
        levels.forEach((level, index) => {
          const progress = userProgress?.find((p) => p.level_id === level.id)

          if (progress) {
            level.progress = {
              completed: progress.completed,
              stars: progress.stars || 0,
              attempts: progress.attempts || 0,
              lastAttempt: progress.updated_at,
            }
          } else {
            level.progress = {
              completed: false,
              stars: 0,
              attempts: 0,
            }
          }

          // Lock levels based on progress
          if (index === 0) {
            // First level is always unlocked
            level.isLocked = false
          } else if (levels[index - 1].progress?.completed) {
            // Unlock if previous level is completed
            level.isLocked = false
          } else {
            level.isLocked = true
          }
        })
      } else {
        // If not authenticated, only first level is unlocked
        levels.forEach((level, index) => {
          level.isLocked = index !== 0
          level.progress = null
        })
      }

      return res.status(200).json({
        success: true,
        levels,
      })
    } catch (error) {
      console.error("Server error in getChapterLevels:", error)
      return res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },
}

module.exports = chapterController
