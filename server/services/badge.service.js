/*
const supabase = require("../config/supabase")

// Check if user is eligible for any badges
exports.checkBadgeEligibility = async (userId) => {
  try {
    // Get user
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (userError || !user) {
      throw new Error("User not found")
    }

    // Get all badges
    const { data: badges, error: badgesError } = await supabase.from("badges").select("*")

    if (badgesError) {
      throw new Error("Error getting badges")
    }

    // Get user's existing badges
    const { data: userBadges, error: userBadgesError } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", userId)

    if (userBadgesError) {
      throw new Error("Error getting user badges")
    }

    const userBadgeIds = userBadges.map((ub) => ub.badge_id)

    // Get user progress
    const { data: progress, error: progressError } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId)
      .eq("completed", true)

    if (progressError) {
      throw new Error("Error getting user progress")
    }

    // Check each badge
    const earnedBadges = []

    for (const badge of badges) {
      // Skip if user already has this badge
      if (userBadgeIds.includes(badge.id)) {
        continue
      }

      let isEligible = false

      switch (badge.criteria_type) {
        case "xp_milestone":
          isEligible = user.xp >= badge.criteria_value
          break

        case "level_completion":
          // Check if specific level is completed
          if (badge.criteria_value.levelId) {
            isEligible = progress.some((p) => p.level_id === badge.criteria_value.levelId)
          }
          // Check if number of levels completed
          else if (badge.criteria_value.count) {
            isEligible = progress.length >= badge.criteria_value.count
          }
          // Check if specific chapter is completed
          else if (badge.criteria_value.chapterId) {
            // Get all levels in chapter
            const { data: levels, error: levelsError } = await supabase
              .from("levels")
              .select("id")
              .eq("chapter_id", badge.criteria_value.chapterId)

            if (levelsError) {
              console.error("Error getting chapter levels:", levelsError)
              continue
            }

            const levelIds = levels.map((l) => l.id)

            // Check if all levels are completed
            const completedLevels = progress.filter((p) => levelIds.includes(p.level_id))

            isEligible = completedLevels.length === levels.length
          }
          break

        case "streak":
          isEligible = user.streak >= badge.criteria_value
          break

        case "custom":
          // Custom criteria would be handled here
          break
      }

      if (isEligible) {
        // Award badge
        const { error: awardError } = await supabase.from("user_badges").insert({
          user_id: userId,
          badge_id: badge.id,
          earned_at: new Date().toISOString(),
          seen: false,
        })

        if (awardError) {
          console.error("Error awarding badge:", awardError)
          continue
        }

        // Create notification
        const { error: notificationError } = await supabase.from("notifications").insert({
          user_id: userId,
          type: "badge_earned",
          title: "Badge Earned",
          message: `You earned the ${badge.name} badge!`,
          related_id: badge.id,
          on_model: "Badge",
          read: false,
        })

        if (notificationError) {
          console.error("Error creating notification:", notificationError)
        }

        earnedBadges.push({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
        })
      }
    }

    return earnedBadges
  } catch (error) {
    console.error("Error checking badge eligibility:", error)
    return []
  }
}
*/
/*
const { supabase } = require("../config/supabase")

// Check badge eligibility
exports.checkBadgeEligibility = async (userId) => {
  try {
    // Get user progress
    const { data: progress, error: progressError } = await supabase.from("progress").select("*").eq("user_id", userId)

    if (progressError) {
      console.error("Error getting progress:", progressError)
      return []
    }

    // Get user badges
    const { data: userBadges, error: badgesError } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", userId)

    if (badgesError) {
      console.error("Error getting user badges:", badgesError)
      return []
    }

    // Get all badges
    const { data: allBadges, error: allBadgesError } = await supabase.from("badges").select("*")

    if (allBadgesError) {
      console.error("Error getting all badges:", allBadgesError)
      return []
    }

    // Calculate stats
    const completedLevels = progress.filter((p) => p.completed).length
    const totalStars = progress.reduce((sum, p) => sum + p.stars, 0)
    const perfectLevels = progress.filter((p) => p.stars === 3).length

    // Check which badges the user is eligible for
    const userBadgeIds = userBadges.map((ub) => ub.badge_id)
    const earnedBadges = []

    for (const badge of allBadges) {
      // Skip if user already has this badge
      if (userBadgeIds.includes(badge.id)) continue

      let isEligible = false

      // Check eligibility based on badge criteria
      switch (badge.criteria_type) {
        case "levels_completed":
          isEligible = completedLevels >= badge.criteria_value
          break
        case "stars_earned":
          isEligible = totalStars >= badge.criteria_value
          break
        case "perfect_levels":
          isEligible = perfectLevels >= badge.criteria_value
          break
        // Add more criteria types as needed
      }

      if (isEligible) {
        // Award badge to user
        const { data: newBadge, error: awardError } = await supabase
          .from("user_badges")
          .insert({
            user_id: userId,
            badge_id: badge.id,
            earned_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (awardError) {
          console.error("Error awarding badge:", awardError)
          continue
        }

        // Create notification
        const { error: notificationError } = await supabase.from("notifications").insert({
          user_id: userId,
          type: "badge_earned",
          title: "Badge Earned",
          message: `You earned the ${badge.name} badge!`,
          related_id: badge.id,
          on_model: "Badge",
        })

        if (notificationError) {
          console.error("Error creating notification:", notificationError)
        }

        earnedBadges.push({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
        })
      }
    }

    return earnedBadges
  } catch (error) {
    console.error("Error checking badge eligibility:", error)
    return []
  }
}
*/

const { supabase } = require("../config/supabase")

// Check if user is eligible for any badges
const checkBadgeEligibility = async (userId) => {
  try {
    // Get user's completed levels
    const { data: completedLevels } = await supabase
      .from("user_level_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("completed", true)

    if (!completedLevels || completedLevels.length === 0) {
      return []
    }

    // Get user's badges
    const { data: userBadges } = await supabase.from("user_badges").select("badge_id").eq("user_id", userId)

    const earnedBadgeIds = userBadges ? userBadges.map((ub) => ub.badge_id) : []

    // Get all available badges
    const { data: allBadges } = await supabase.from("badges").select("*")

    if (!allBadges) {
      return []
    }

    const earnedBadges = []

    // Check each badge criteria
    for (const badge of allBadges) {
      // Skip if user already has this badge
      if (earnedBadgeIds.includes(badge.id)) {
        continue
      }

      let isEligible = false

      switch (badge.criteria_type) {
        case "completed_levels":
          isEligible = completedLevels.length >= badge.criteria_value
          break

        case "perfect_levels":
          const perfectLevels = completedLevels.filter((level) => level.stars === 3)
          isEligible = perfectLevels.length >= badge.criteria_value
          break

        case "streak":
          // Get user's streak from users table
          const { data: user } = await supabase.from("users").select("streak").eq("id", userId).single()
          isEligible = user && user.streak >= badge.criteria_value
          break

        // Add more criteria types as needed
      }

      if (isEligible) {
        // Award badge to user
        await supabase.from("user_badges").insert({
          user_id: userId,
          badge_id: badge.id,
          earned_at: new Date().toISOString(),
        })

        // Add to earned badges list
        earnedBadges.push({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
        })
      }
    }

    return earnedBadges
  } catch (error) {
    console.error("Error checking badge eligibility:", error)
    return []
  }
}

module.exports = {
  checkBadgeEligibility,
}
