/*
const  supabase  = require("../config/supabase")
const { checkBadgeEligibility } = require("../services/badge.service")

// Get level by ID
exports.getLevelById = async (req, res) => {
  try {
    const { id } = req.params

    // Get level with chapter
    const { data: level, error } = await supabase
      .from("levels")
      .select(`
        *,
        chapter:chapters(
          id,
          title,
          difficulty
        )
      `)
      .eq("id", id)
      .single()

    if (error || !level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      })
    }

    // If user is authenticated, get their progress for this level
    let userProgress = null
    if (req.user) {
      const { data: progress, error: progressError } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", req.user.id)
        .eq("level_id", level.id)
        .single()

      if (!progressError && progress) {
        userProgress = progress
      } else {
        // If no progress record exists, create one
        const { data: newProgress, error: createError } = await supabase
          .from("progress")
          .insert({
            user_id: req.user.id,
            level_id: level.id,
            completed: false,
            stars: 0,
            attempts: 0,
            time_spent: 0,
          })
          .select()
          .single()

        if (!createError) {
          userProgress = newProgress
        }
      }
    }

    res.status(200).json({
      success: true,
      level: {
        id: level.id,
        title: level.title,
        description: level.description,
        content: level.content,
        initialCode: level.initial_code,
        instructions: level.instructions,
        chapter: {
          id: level.chapter.id,
          title: level.chapter.title,
          difficulty: level.chapter.difficulty,
        },
        xpReward: level.xp_reward,
      },
      progress: userProgress
        ? {
            completed: userProgress.completed,
            stars: userProgress.stars,
            attempts: userProgress.attempts,
            code: userProgress.code,
          }
        : null,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting level",
      error: error.message,
    })
  }
}

// Submit level solution
exports.submitSolution = async (req, res) => {
  try {
    const { id } = req.params
    const { code, timeSpent } = req.body

    // Find level
    const { data: level, error } = await supabase.from("levels").select("*").eq("id", id).single()

    if (error || !level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      })
    }

    // Find or create progress record
    const { data: progress, error: progressError } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("level_id", level.id)
      .single()

    if (progressError) {
      // Create new progress record
      const { data: newProgress, error: createError } = await supabase
        .from("progress")
        .insert({
          user_id: req.user.id,
          level_id: level.id,
          completed: false,
          stars: 0,
          attempts: 1,
          code,
          last_attempt_date: new Date().toISOString(),
          time_spent: timeSpent || 0,
        })
        .select()
        .single()

      if (createError) {
        return res.status(500).json({
          success: false,
          message: "Error creating progress record",
          error: createError.message,
        })
      }

      return res.status(200).json({
        success: true,
        message: "Solution submitted",
        progress: {
          attempts: newProgress.attempts,
          code: newProgress.code,
        },
      })
    }

    // Update progress
    const { data: updatedProgress, error: updateError } = await supabase
      .from("progress")
      .update({
        attempts: progress.attempts + 1,
        code,
        last_attempt_date: new Date().toISOString(),
        time_spent: progress.time_spent + (timeSpent || 0),
      })
      .eq("id", progress.id)
      .select()
      .single()

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: "Error updating progress",
        error: updateError.message,
      })
    }

    res.status(200).json({
      success: true,
      message: "Solution submitted",
      progress: {
        attempts: updatedProgress.attempts,
        code: updatedProgress.code,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting solution",
      error: error.message,
    })
  }
}

// Complete level
exports.completeLevel = async (req, res) => {
  try {
    const { id } = req.params
    const { code, timeSpent, stars } = req.body

    // Find level
    const { data: level, error } = await supabase.from("levels").select("*").eq("id", id).single()

    if (error || !level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      })
    }

    // Find user
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", req.user.id).single()

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Find or create progress record
    const { data: progress, error: progressError } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("level_id", level.id)
      .single()

    let wasAlreadyCompleted = false
    let progressId

    if (progressError) {
      // Create new progress record
      const { data: newProgress, error: createError } = await supabase
        .from("progress")
        .insert({
          user_id: req.user.id,
          level_id: level.id,
          completed: true,
          stars: stars || 0,
          attempts: 1,
          code,
          completion_date: new Date().toISOString(),
          time_spent: timeSpent || 0,
        })
        .select()
        .single()

      if (createError) {
        return res.status(500).json({
          success: false,
          message: "Error creating progress record",
          error: createError.message,
        })
      }

      progressId = newProgress.id
    } else {
      // Check if already completed
      wasAlreadyCompleted = progress.completed
      progressId = progress.id

      // Update progress
      const updates = {
        completed: true,
        code,
        completion_date: new Date().toISOString(),
        time_spent: progress.time_spent + (timeSpent || 0),
      }

      if (stars && stars > progress.stars) {
        updates.stars = stars
      }

      const { error: updateError } = await supabase.from("progress").update(updates).eq("id", progress.id)

      if (updateError) {
        return res.status(500).json({
          success: false,
          message: "Error updating progress",
          error: updateError.message,
        })
      }
    }

    // If not already completed, award XP
    if (!wasAlreadyCompleted) {
      // Update user XP
      const { error: xpError } = await supabase
        .from("users")
        .update({ xp: user.xp + level.xp_reward })
        .eq("id", req.user.id)

      if (xpError) {
        console.error("Error updating user XP:", xpError)
      }

      // Create notification
      const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: req.user.id,
        type: "level_completed",
        title: "Level Completed",
        message: `You completed ${level.title} and earned ${level.xp_reward} XP!`,
        related_id: level.id,
        on_model: "Level",
      })

      if (notificationError) {
        console.error("Error creating notification:", notificationError)
      }

      // Check for badges
      const earnedBadges = await checkBadgeEligibility(req.user.id)

      // Get next level
      const { data: nextLevel, error: nextLevelError } = await supabase
        .from("levels")
        .select("id, title")
        .eq("chapter_id", level.chapter_id)
        .eq("order", level.order + 1)
        .eq("is_active", true)
        .single()

      return res.status(200).json({
        success: true,
        message: "Level completed",
        xpEarned: level.xp_reward,
        currentXp: user.xp + level.xp_reward,
        earnedBadges,
        nextLevel: nextLevel || null,
      })
    }

    res.status(200).json({
      success: true,
      message: "Level progress updated",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error completing level",
      error: error.message,
    })
  }
}
*/

/*
const { supabase } = require("../config/supabase")
const { checkBadgeEligibility } = require("../services/badge.service")

// Get level by ID
exports.getLevelById = async (req, res) => {
  try {
    const { id } = req.params

    // Get level with chapter
    const { data: level, error } = await supabase
      .from("levels")
      .select(`
        *,
        chapter:chapters(
          id,
          title,
          difficulty
        )
      `)
      .eq("id", id)
      .single()

    if (error || !level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      })
    }

    // If user is authenticated, get their progress for this level
    let userProgress = null
    if (req.user) {
      const { data: progress, error: progressError } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", req.user.id)
        .eq("level_id", level.id)
        .single()

      if (!progressError && progress) {
        userProgress = progress
      } else {
        // If no progress record exists, create one
        const { data: newProgress, error: createError } = await supabase
          .from("progress")
          .insert({
            user_id: req.user.id,
            level_id: level.id,
            completed: false,
            stars: 0,
            attempts: 0,
            time_spent: 0,
          })
          .select()
          .single()

        if (!createError) {
          userProgress = newProgress
        }
      }
    }

    res.status(200).json({
      success: true,
      level: {
        id: level.id,
        title: level.title,
        description: level.description,
        content: level.content,
        initialCode: level.initial_code,
        instructions: level.instructions,
        chapter: {
          id: level.chapter.id,
          title: level.chapter.title,
          difficulty: level.chapter.difficulty,
        },
        xpReward: level.xp_reward,
      },
      progress: userProgress
        ? {
            completed: userProgress.completed,
            stars: userProgress.stars,
            attempts: userProgress.attempts,
            code: userProgress.code,
          }
        : null,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting level",
      error: error.message,
    })
  }
}

// Submit level solution
exports.submitSolution = async (req, res) => {
  try {
    const { id } = req.params
    const { code, timeSpent } = req.body

    // Find level
    const { data: level, error } = await supabase.from("levels").select("*").eq("id", id).single()

    if (error || !level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      })
    }

    // Find or create progress record
    const { data: progress, error: progressError } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("level_id", level.id)
      .single()

    if (progressError) {
      // Create new progress record
      const { data: newProgress, error: createError } = await supabase
        .from("progress")
        .insert({
          user_id: req.user.id,
          level_id: level.id,
          completed: false,
          stars: 0,
          attempts: 1,
          code,
          last_attempt_date: new Date().toISOString(),
          time_spent: timeSpent || 0,
        })
        .select()
        .single()

      if (createError) {
        return res.status(500).json({
          success: false,
          message: "Error creating progress record",
          error: createError.message,
        })
      }

      return res.status(200).json({
        success: true,
        message: "Solution submitted",
        progress: {
          attempts: newProgress.attempts,
          code: newProgress.code,
        },
      })
    }

    // Update progress
    const { data: updatedProgress, error: updateError } = await supabase
      .from("progress")
      .update({
        attempts: progress.attempts + 1,
        code,
        last_attempt_date: new Date().toISOString(),
        time_spent: progress.time_spent + (timeSpent || 0),
      })
      .eq("id", progress.id)
      .select()
      .single()

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: "Error updating progress",
        error: updateError.message,
      })
    }

    res.status(200).json({
      success: true,
      message: "Solution submitted",
      progress: {
        attempts: updatedProgress.attempts,
        code: updatedProgress.code,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting solution",
      error: error.message,
    })
  }
}

// Complete level
exports.completeLevel = async (req, res) => {
  try {
    const { id } = req.params
    const { code, timeSpent, stars } = req.body

    // Find level
    const { data: level, error } = await supabase.from("levels").select("*").eq("id", id).single()

    if (error || !level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      })
    }

    // Find user
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", req.user.id).single()

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Find or create progress record
    const { data: progress, error: progressError } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("level_id", level.id)
      .single()

    let wasAlreadyCompleted = false
    let progressId

    if (progressError) {
      // Create new progress record
      const { data: newProgress, error: createError } = await supabase
        .from("progress")
        .insert({
          user_id: req.user.id,
          level_id: level.id,
          completed: true,
          stars: stars || 0,
          attempts: 1,
          code,
          completion_date: new Date().toISOString(),
          time_spent: timeSpent || 0,
        })
        .select()
        .single()

      if (createError) {
        return res.status(500).json({
          success: false,
          message: "Error creating progress record",
          error: createError.message,
        })
      }

      progressId = newProgress.id
    } else {
      // Check if already completed
      wasAlreadyCompleted = progress.completed
      progressId = progress.id

      // Update progress
      const updates = {
        completed: true,
        code,
        completion_date: new Date().toISOString(),
        time_spent: progress.time_spent + (timeSpent || 0),
      }

      if (stars && stars > progress.stars) {
        updates.stars = stars
      }

      const { error: updateError } = await supabase.from("progress").update(updates).eq("id", progress.id)

      if (updateError) {
        return res.status(500).json({
          success: false,
          message: "Error updating progress",
          error: updateError.message,
        })
      }
    }

    // If not already completed, award XP
    if (!wasAlreadyCompleted) {
      // Update user XP
      const { error: xpError } = await supabase
        .from("users")
        .update({ xp: user.xp + level.xp_reward })
        .eq("id", req.user.id)

      if (xpError) {
        console.error("Error updating user XP:", xpError)
      }

      // Create notification
      const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: req.user.id,
        type: "level_completed",
        title: "Level Completed",
        message: `You completed ${level.title} and earned ${level.xp_reward} XP!`,
        related_id: level.id,
        on_model: "Level",
      })

      if (notificationError) {
        console.error("Error creating notification:", notificationError)
      }

      // Check for badges
      const earnedBadges = await checkBadgeEligibility(req.user.id)

      // Get next level
      const { data: nextLevel, error: nextLevelError } = await supabase
        .from("levels")
        .select("id, title")
        .eq("chapter_id", level.chapter_id)
        .eq("order", level.order + 1)
        .eq("is_active", true)
        .single()

      return res.status(200).json({
        success: true,
        message: "Level completed",
        xpEarned: level.xp_reward,
        currentXp: user.xp + level.xp_reward,
        earnedBadges,
        nextLevel: nextLevel || null,
      })
    }

    res.status(200).json({
      success: true,
      message: "Level progress updated",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error completing level",
      error: error.message,
    })
  }
}
  */


const { supabase } = require("../config/supabase")

// Helper function to check badge eligibility
const checkBadgeEligibility = async (userId) => {
  try {
    // This is a simplified version - you'll need to implement the actual badge logic
    const { data: completedLevels } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId)
      .eq("completed", true)

    const earnedBadges = []

    // Example: Award a badge for completing 5 levels
    if (completedLevels && completedLevels.length >= 5) {
      earnedBadges.push({
        id: "beginner_badge",
        name: "Python Beginner",
        description: "Completed 5 levels",
        icon: "🥉",
      })
    }

    // Example: Award a badge for getting 3 stars on 3 levels
    const threeStarLevels = completedLevels?.filter((level) => level.stars === 3) || []
    if (threeStarLevels.length >= 3) {
      earnedBadges.push({
        id: "perfectionist",
        name: "Perfectionist",
        description: "Got 3 stars on 3 levels",
        icon: "⭐",
      })
    }

    return earnedBadges
  } catch (error) {
    console.error("Error checking badge eligibility:", error)
    return []
  }
}

const levelController = {
  // Get level by ID
  getLevelById: async (req, res) => {
    try {
      const { id } = req.params
      console.log(`Backend: Getting level with ID: ${id}`)

      // Fetch level from Supabase
      const { data: level, error } = await supabase
        .from("levels")
        .select(`
          *,
          chapter:chapters(
            id,
            title,
            difficulty
          )
        `)
        .eq("id", id)
        .single()

      if (error || !level) {
        console.error(`Error fetching level ${id}:`, error)
        return res.status(404).json({
          success: false,
          message: "Level not found",
        })
      }

      // If user is authenticated, get their progress for this level
      let userProgress = null
      if (req.user) {
        const { data: progress, error: progressError } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", req.user.id)
          .eq("level_id", level.id)
          .single()

        if (!progressError && progress) {
          userProgress = progress
        } else {
          // If no progress record exists, create one
          const { data: newProgress, error: createError } = await supabase
            .from("progress")
            .insert({
              user_id: req.user.id,
              level_id: level.id,
              completed: false,
              stars: 0,
              attempts: 0,
              time_spent: 0,
            })
            .select()
            .single()

          if (!createError) {
            userProgress = newProgress
          }
        }
      }

      return res.status(200).json({
        success: true,
        level: {
          id: level.id,
          title: level.title,
          description: level.description,
          content:
            typeof level.content === "string"
              ? level.content
              : JSON.stringify(level.content) || "# No content available",
          initialCode: level.initial_code || "# Write your code here",
          instructions: level.instructions || "Complete this exercise",
          chapter: {
            id: level.chapter.id,
            title: level.chapter.title,
            difficulty: level.chapter.difficulty,
          },
          xpReward: level.xp_reward,
          display_order: level.display_order,
          testCases: level.test_cases || [],
        },
        progress: userProgress
          ? {
              completed: userProgress.completed,
              stars: userProgress.stars,
              attempts: userProgress.attempts,
              code: userProgress.code,
            }
          : null,
      })
    } catch (error) {
      console.error("Server error in getLevelById:", error)
      return res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },

  // Submit level solution
  submitSolution: async (req, res) => {
    try {
      const { id } = req.params
      const { code, timeSpent } = req.body
      console.log(`Backend: Submitting solution for level ID: ${id}`)

      // Find level
      const { data: level, error } = await supabase.from("levels").select("*").eq("id", id).single()

      if (error || !level) {
        console.error(`Error fetching level ${id}:`, error)
        return res.status(404).json({
          success: false,
          message: "Level not found",
        })
      }

      // Find or create progress record
      const { data: progress, error: progressError } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", req.user.id)
        .eq("level_id", level.id)
        .single()

      if (progressError) {
        // Create new progress record
        const { data: newProgress, error: createError } = await supabase
          .from("progress")
          .insert({
            user_id: req.user.id,
            level_id: level.id,
            completed: false,
            stars: 0,
            attempts: 1,
            code,
            last_attempt_date: new Date().toISOString(),
            time_spent: timeSpent || 0,
          })
          .select()
          .single()

        if (createError) {
          console.error("Error creating progress record:", createError)
          return res.status(500).json({
            success: false,
            message: "Error creating progress record",
          })
        }

        return res.status(200).json({
          success: true,
          message: "Solution submitted",
          progress: {
            attempts: newProgress.attempts,
            code: newProgress.code,
          },
        })
      }

      // Update progress
      const { data: updatedProgress, error: updateError } = await supabase
        .from("progress")
        .update({
          attempts: progress.attempts + 1,
          code,
          last_attempt_date: new Date().toISOString(),
          time_spent: progress.time_spent + (timeSpent || 0),
        })
        .eq("id", progress.id)
        .select()
        .single()

      if (updateError) {
        console.error("Error updating progress:", updateError)
        return res.status(500).json({
          success: false,
          message: "Error updating progress",
        })
      }

      return res.status(200).json({
        success: true,
        message: "Solution submitted",
        progress: {
          attempts: updatedProgress.attempts,
          code: updatedProgress.code,
        },
      })
    } catch (error) {
      console.error("Server error in submitSolution:", error)
      return res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },

  // Complete level
  completeLevel: async (req, res) => {
    try {
      const { id } = req.params
      const { code, timeSpent, stars } = req.body
      console.log(`Backend: Completing level ID: ${id}`)

      // Find level
      const { data: level, error } = await supabase.from("levels").select("*").eq("id", id).single()

      if (error || !level) {
        console.error(`Error fetching level ${id}:`, error)
        return res.status(404).json({
          success: false,
          message: "Level not found",
        })
      }

      // Find user
      const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", req.user.id).single()

      if (userError || !user) {
        console.error("Error fetching user:", userError)
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      // Find or create progress record
      const { data: progress, error: progressError } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", req.user.id)
        .eq("level_id", level.id)
        .single()

      let wasAlreadyCompleted = false

      if (progressError) {
        // Create new progress record
        const { data: newProgress, error: createError } = await supabase
          .from("progress")
          .insert({
            user_id: req.user.id,
            level_id: level.id,
            completed: true,
            stars: stars || 0,
            attempts: 1,
            code,
            completion_date: new Date().toISOString(),
            time_spent: timeSpent || 0,
          })
          .select()
          .single()

        if (createError) {
          console.error("Error creating progress record:", createError)
          return res.status(500).json({
            success: false,
            message: "Error creating progress record",
          })
        }
      } else {
        // Check if already completed
        wasAlreadyCompleted = progress.completed

        // Update progress
        const updates = {
          completed: true,
          code,
          completion_date: new Date().toISOString(),
          time_spent: progress.time_spent + (timeSpent || 0),
        }

        if (stars && stars > progress.stars) {
          updates.stars = stars
        }

        const { error: updateError } = await supabase.from("progress").update(updates).eq("id", progress.id)

        if (updateError) {
          console.error("Error updating progress:", updateError)
          return res.status(500).json({
            success: false,
            message: "Error updating progress",
          })
        }
      }

      // If not already completed, award XP
      if (!wasAlreadyCompleted) {
        // Update user XP
        const { error: xpError } = await supabase
          .from("users")
          .update({ xp: user.xp + level.xp_reward })
          .eq("id", req.user.id)

        if (xpError) {
          console.error("Error updating user XP:", xpError)
        }

        // Check for badges
        const earnedBadges = await checkBadgeEligibility(req.user.id)

        // Get next level
        const { data: nextLevel, error: nextLevelError } = await supabase
          .from("levels")
          .select("id, title")
          .eq("chapter_id", level.chapter_id)
          .eq("display_order", level.display_order + 1)
          .eq("is_active", true)
          .single()

        return res.status(200).json({
          success: true,
          message: "Level completed",
          xpEarned: level.xp_reward,
          stars: stars || 0,
          currentXp: user.xp + level.xp_reward,
          earnedBadges,
          nextLevel: nextLevel || null,
        })
      }

      return res.status(200).json({
        success: true,
        message: "Level progress updated",
      })
    } catch (error) {
      console.error("Server error in completeLevel:", error)
      return res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },
}

module.exports = levelController
