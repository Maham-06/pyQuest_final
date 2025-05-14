const {supabase } = require("../config/supabase")

// Get user progress for all levels
exports.getUserProgress = async (req, res) => {
  try {
    const { data: progress, error } = await supabase
      .from("progress")
      .select(`
        *,
        level:levels(
          id, 
          title, 
          chapter_id,
          chapter:chapters(
            id, 
            title, 
            difficulty
          )
        )
      `)
      .eq("user_id", req.user.id)

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error getting progress",
        error: error.message,
      })
    }

    res.status(200).json({
      success: true,
      progress,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting user progress",
      error: error.message,
    })
  }
}

// Get user progress for a specific level
exports.getLevelProgress = async (req, res) => {
  try {
    const { levelId } = req.params

    const { data: progress, error } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("level_id", levelId)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      return res.status(500).json({
        success: false,
        message: "Error getting level progress",
        error: error.message,
      })
    }

    // If no progress found, return null
    if (!progress) {
      return res.status(200).json({
        success: true,
        progress: null,
      })
    }

    res.status(200).json({
      success: true,
      progress,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting level progress",
      error: error.message,
    })
  }
}

// Get user progress for a specific chapter
exports.getChapterProgress = async (req, res) => {
  try {
    const { chapterId } = req.params

    // First get all levels in this chapter
    const { data: levels, error: levelsError } = await supabase
      .from("levels")
      .select("id")
      .eq("chapter_id", chapterId)
      .eq("is_active", true)

    if (levelsError) {
      return res.status(500).json({
        success: false,
        message: "Error getting chapter levels",
        error: levelsError.message,
      })
    }

    if (!levels || levels.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No levels found for this chapter",
      })
    }

    // Get progress for these levels
    const levelIds = levels.map((level) => level.id)
    const { data: progress, error } = await supabase
      .from("progress")
      .select(`
        *,
        level:levels(
          id, 
          title, 
          order
        )
      `)
      .eq("user_id", req.user.id)
      .in("level_id", levelIds)

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error getting chapter progress",
        error: error.message,
      })
    }

    // Calculate chapter completion stats
    const totalLevels = levels.length
    const completedLevels = progress.filter((p) => p.completed).length
    const totalStars = progress.reduce((sum, p) => sum + p.stars, 0)
    const maxPossibleStars = totalLevels * 3

    res.status(200).json({
      success: true,
      progress,
      stats: {
        totalLevels,
        completedLevels,
        completionPercentage: Math.round((completedLevels / totalLevels) * 100),
        totalStars,
        maxPossibleStars,
        starPercentage: Math.round((totalStars / maxPossibleStars) * 100),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting chapter progress",
      error: error.message,
    })
  }
}

// Update user progress for a level
exports.updateLevelProgress = async (req, res) => {
  try {
    const { levelId } = req.params
    const { completed, stars, code, timeSpent } = req.body

    // Check if progress record exists
    const { data: existingProgress, error: checkError } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("level_id", levelId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      return res.status(500).json({
        success: false,
        message: "Error checking progress",
        error: checkError.message,
      })
    }

    let result

    if (!existingProgress) {
      // Create new progress record
      const { data, error } = await supabase
        .from("progress")
        .insert({
          user_id: req.user.id,
          level_id: levelId,
          completed: completed || false,
          stars: stars || 0,
          code: code || "",
          time_spent: timeSpent || 0,
          attempts: 1,
          completion_date: completed ? new Date().toISOString() : null,
        })
        .select()
        .single()

      if (error) {
        return res.status(500).json({
          success: false,
          message: "Error creating progress",
          error: error.message,
        })
      }

      result = data
    } else {
      // Update existing progress
      const updates = {}
      if (completed !== undefined) updates.completed = completed
      if (stars !== undefined && stars > existingProgress.stars) updates.stars = stars
      if (code !== undefined) updates.code = code
      if (timeSpent !== undefined) updates.time_spent = existingProgress.time_spent + timeSpent
      if (completed && !existingProgress.completed) updates.completion_date = new Date().toISOString()

      const { data, error } = await supabase
        .from("progress")
        .update(updates)
        .eq("id", existingProgress.id)
        .select()
        .single()

      if (error) {
        return res.status(500).json({
          success: false,
          message: "Error updating progress",
          error: error.message,
        })
      }

      result = data
    }

    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      progress: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating progress",
      error: error.message,
    })
  }
}

// Get user progress statistics
exports.getProgressStats = async (req, res) => {
  try {
    // Get user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("xp, streak")
      .eq("id", req.user.id)
      .single()

    if (userError) {
      return res.status(500).json({
        success: false,
        message: "Error getting user",
        error: userError.message,
      })
    }

    // Get all user progress
    const { data: progress, error: progressError } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", req.user.id)

    if (progressError) {
      return res.status(500).json({
        success: false,
        message: "Error getting progress",
        error: progressError.message,
      })
    }

    // Calculate statistics
    const totalLevelsAttempted = progress.length
    const completedLevels = progress.filter((p) => p.completed).length
    const totalStars = progress.reduce((sum, p) => sum + p.stars, 0)
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.time_spent, 0)

    // Get total levels count
    const { count: totalLevels, error: countError } = await supabase
      .from("levels")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    if (countError) {
      return res.status(500).json({
        success: false,
        message: "Error getting total levels",
        error: countError.message,
      })
    }

    res.status(200).json({
      success: true,
      stats: {
        xp: user.xp,
        streak: user.streak,
        totalLevels,
        totalLevelsAttempted,
        completedLevels,
        completionPercentage: totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0,
        totalStars,
        maxPossibleStars: totalLevels * 3,
        totalTimeSpentMinutes: Math.round(totalTimeSpent / 60),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting progress statistics",
      error: error.message,
    })
  }
}

// Get user streak information
exports.getUserStreak = async (req, res) => {
  try {
    // Get user streak
    const { data: user, error } = await supabase
      .from("users")
      .select("streak, last_active")
      .eq("id", req.user.id)
      .single()

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error getting user streak",
        error: error.message,
      })
    }

    // Check if streak is still valid (within 24 hours of last activity)
    const lastActive = new Date(user.last_active)
    const now = new Date()
    const diffHours = Math.abs(now - lastActive) / 36e5 // Convert to hours

    const streakValid = diffHours < 24

    res.status(200).json({
      success: true,
      streak: user.streak,
      lastActive: user.last_active,
      streakValid,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting user streak",
      error: error.message,
    })
  }
}

// Update user streak
exports.updateStreak = async (req, res) => {
  try {
    // Get current user
    const { data: user, error } = await supabase
      .from("users")
      .select("streak, last_active")
      .eq("id", req.user.id)
      .single()

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error getting user",
        error: error.message,
      })
    }

    // Check if streak should be incremented
    const lastActive = new Date(user.last_active)
    const now = new Date()
    const diffHours = Math.abs(now - lastActive) / 36e5 // Convert to hours
    const diffDays = Math.floor(diffHours / 24)

    let newStreak = user.streak

    if (diffHours < 24) {
      // Same day, no change
    } else if (diffDays === 1) {
      // Next day, increment streak
      newStreak += 1
    } else {
      // More than a day passed, reset streak
      newStreak = 1
    }

    // Update user
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({
        streak: newStreak,
        last_active: now.toISOString(),
      })
      .eq("id", req.user.id)
      .select()
      .single()

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: "Error updating streak",
        error: updateError.message,
      })
    }

    res.status(200).json({
      success: true,
      streak: updatedUser.streak,
      lastActive: updatedUser.last_active,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating streak",
      error: error.message,
    })
  }
}