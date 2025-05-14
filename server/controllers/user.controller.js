const {supabase }= require("../config/supabase")
const bcrypt = require("bcryptjs")

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase.from("users").select("*").eq("id", req.user.id).single()

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Remove sensitive data
    delete user.password
    delete user.reset_password_token
    delete user.reset_password_expires
    delete user.email_verification_token

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting profile",
      error: error.message,
    })
  }
}
// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, musicEnabled } = req.body

    // Find user
    const { data: user, error } = await supabase.from("users").select("*").eq("id", req.user.id).single()

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if email is already in use
    if (email && email !== user.email) {
      const { data: existingUser, error: emailError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single()

      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        })
      }
    }

    // Update user
    const updates = {}
    if (name) updates.name = name
    if (email && email !== user.email) updates.email = email
    if (musicEnabled !== undefined) updates.music_enabled = musicEnabled

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update(updates)
      .eq("id", req.user.id)
      .select()
      .single()

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: "Error updating profile",
        error: updateError.message,
      })
    }

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        musicEnabled: updatedUser.music_enabled,
        xp: updatedUser.xp,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    })
  }
}

// Update avatar
exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body

    // Update user
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({ avatar })
      .eq("id", req.user.id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error updating avatar",
        error: error.message,
      })
    }

    res.status(200).json({
      success: true,
      avatar: updatedUser.avatar,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating avatar",
      error: error.message,
    })
  }
}

// Get user progress
exports.getUserProgress = async (req, res) => {
  try {
    // Get user progress
    const { data: progress, error: progressError } = await supabase
      .from("progress")
      .select(`
        *,
        level:levels(
          id, 
          title, 
          chapter:chapters(
            id, 
            title, 
            difficulty
          )
        )
      `)
      .eq("user_id", req.user.id)

    if (progressError) {
      return res.status(500).json({
        success: false,
        message: "Error getting progress",
        error: progressError.message,
      })
    }

    // Get user badges
    const { data: badges, error: badgesError } = await supabase
      .from("user_badges")
      .select(`
        *,
        badge:badges(
          id, 
          name, 
          description, 
          icon
        )
      `)
      .eq("user_id", req.user.id)

    if (badgesError) {
      return res.status(500).json({
        success: false,
        message: "Error getting badges",
        error: badgesError.message,
      })
    }

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

    res.status(200).json({
      success: true,
      progress,
      badges,
      user: {
        xp: user.xp,
        streak: user.streak,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting user progress",
      error: error.message,
    })
  }
}

// Get user dashboard data
exports.getDashboard = async (req, res) => {
  try {
    // Get user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("xp, streak, last_active")
      .eq("id", req.user.id)
      .single()

    if (userError) {
      return res.status(500).json({
        success: false,
        message: "Error getting user",
        error: userError.message,
      })
    }

    // Get completed levels by chapter
    const { data: completedLevels, error: levelsError } = await supabase
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
      .eq("completed", true)

    if (levelsError) {
      return res.status(500).json({
        success: false,
        message: "Error getting completed levels",
        error: levelsError.message,
      })
    }

    // Group by chapter
    const progressByChapter = {}
    completedLevels.forEach((progress) => {
      const chapterId = progress.level.chapter_id
      if (!progressByChapter[chapterId]) {
        progressByChapter[chapterId] = {
          _id: chapterId,
          chapterTitle: progress.level.chapter.title,
          difficulty: progress.level.chapter.difficulty,
          completedLevels: 0,
          totalStars: 0,
          totalTimeSpent: 0,
        }
      }
      progressByChapter[chapterId].completedLevels++
      progressByChapter[chapterId].totalStars += progress.stars
      progressByChapter[chapterId].totalTimeSpent += progress.time_spent
    })

    // Get total levels by chapter
    const { data: chapters, error: chaptersError } = await supabase.from("chapters").select(`
        id,
        levels(count)
      `)

    if (chaptersError) {
      return res.status(500).json({
        success: false,
        message: "Error getting chapters",
        error: chaptersError.message,
      })
    }

    // Map total levels to progress
    const progressWithTotals = Object.values(progressByChapter).map((p) => {
      const chapter = chapters.find((c) => c.id === p._id)
      return {
        ...p,
        totalLevels: chapter ? chapter.levels.length : 0,
      }
    })

    // Get recent badges
    const { data: recentBadges, error: badgesError } = await supabase
      .from("user_badges")
      .select(`
        *,
        badge:badges(
          id,
          name,
          description,
          icon
        )
      `)
      .eq("user_id", req.user.id)
      .order("earned_at", { ascending: false })
      .limit(5)

    if (badgesError) {
      return res.status(500).json({
        success: false,
        message: "Error getting recent badges",
        error: badgesError.message,
      })
    }

    res.status(200).json({
      success: true,
      user: {
        xp: user.xp,
        streak: user.streak,
        lastActive: user.last_active,
      },
      progress: progressWithTotals,
      recentBadges,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting dashboard data",
      error: error.message,
    })
  }
}

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Get user
    const { data: user, error } = await supabase.from("users").select("*").eq("id", req.user.id).single()

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", req.user.id)

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: "Error updating password",
        error: updateError.message,
      })
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating password",
      error: error.message,
    })
  }
}
