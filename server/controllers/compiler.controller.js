/*
const axios = require("axios")
const {supabase}  = require("../config/supabase")

// Execute Python code
exports.executeCode = async (req, res) => {
  try {
    const { code, input } = req.body

    // Use JDoodle API to execute code
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: code,
      language: "python3",
      versionIndex: "3",
      stdin: input || "",
    })

    res.status(200).json({
      success: true,
      output: response.data.output,
      memory: response.data.memory,
      cpuTime: response.data.cpuTime,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error executing code",
      error: error.message,
    })
  }
}

// Test code against level test cases
exports.testCode = async (req, res) => {
  try {
    const { levelId, code } = req.body

    // Find level
    const { data: level, error } = await supabase.from("levels").select("*").eq("id", levelId).single()

    if (error || !level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      })
    }

    // Get test cases
    const testCases = level.test_cases

    if (!testCases || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No test cases found for this level",
      })
    }

    // Run tests
    const results = []
    let allPassed = true

    for (const testCase of testCases) {
      try {
        const response = await axios.post("https://api.jdoodle.com/v1/execute", {
          clientId: process.env.JDOODLE_CLIENT_ID,
          clientSecret: process.env.JDOODLE_CLIENT_SECRET,
          script: code,
          language: "python3",
          versionIndex: "3",
          stdin: testCase.input || "",
        })

        const output = response.data.output.trim()
        const expected = testCase.expected_output.trim()
        const passed = output === expected

        if (!passed) {
          allPassed = false
        }

        results.push({
          description: testCase.description,
          input: testCase.input,
          expectedOutput: expected,
          actualOutput: output,
          passed,
        })
      } catch (error) {
        allPassed = false
        results.push({
          description: testCase.description,
          input: testCase.input,
          expectedOutput: testCase.expected_output,
          error: error.message,
          passed: false,
        })
      }
    }

    // Calculate stars based on test results
    let stars = 0
    if (allPassed) {
      stars = 3 // All tests passed
    } else {
      // Count passed tests
      const passedCount = results.filter((r) => r.passed).length
      const totalCount = results.length

      // Calculate percentage
      const percentage = (passedCount / totalCount) * 100

      if (percentage >= 75) {
        stars = 2
      } else if (percentage >= 50) {
        stars = 1
      }
    }

    res.status(200).json({
      success: true,
      results,
      allPassed,
      stars,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error testing code",
      error: error.message,
    })
  }
}
*/

/*

const axios = require("axios")
const { supabase } = require("../config/supabase")
const { checkBadgeEligibility } = require("../services/badge.service")

// Execute Python code
exports.executeCode = async (req, res) => {
  try {
    const { code, input } = req.body

    // Use JDoodle API to execute code
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: code,
      language: "python3",
      versionIndex: "3",
      stdin: input || "",
    })

    res.status(200).json({
      success: true,
      output: response.data.output,
      memory: response.data.memory,
      cpuTime: response.data.cpuTime,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error executing code",
      error: error.message,
    })
  }
}

// Test code against level test cases and update progress
exports.testCode = async (req, res) => {
  try {
    const { levelId, code, timeSpent } = req.body

    // Find level
    const { data: level, error } = await supabase.from("levels").select("*").eq("id", levelId).single()

    if (error || !level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      })
    }

    // Get test cases
    const testCases = level.test_cases

    if (!testCases || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No test cases found for this level",
      })
    }

    // Run tests
    const results = []
    let allPassed = true

    for (const testCase of testCases) {
      try {
        const response = await axios.post("https://api.jdoodle.com/v1/execute", {
          clientId: process.env.JDOODLE_CLIENT_ID,
          clientSecret: process.env.JDOODLE_CLIENT_SECRET,
          script: code,
          language: "python3",
          versionIndex: "3",
          stdin: testCase.input || "",
        })

        const output = response.data.output.trim()
        const expected = testCase.expected_output.trim()
        const passed = output === expected

        if (!passed) {
          allPassed = false
        }

        results.push({
          description: testCase.description,
          input: testCase.input,
          expectedOutput: expected,
          actualOutput: output,
          passed,
        })
      } catch (error) {
        allPassed = false
        results.push({
          description: testCase.description,
          input: testCase.input,
          expectedOutput: testCase.expected_output,
          error: error.message,
          passed: false,
        })
      }
    }

    // Calculate stars based on test results
    let stars = 0
    if (allPassed) {
      stars = 3 // All tests passed
    } else {
      // Count passed tests
      const passedCount = results.filter((r) => r.passed).length
      const totalCount = results.length

      // Calculate percentage
      const percentage = (passedCount / totalCount) * 100

      if (percentage >= 75) {
        stars = 2
      } else if (percentage >= 50) {
        stars = 1
      }
    }

    // If all tests passed or some tests passed (earned stars), update progress
    if (stars > 0) {
      // Find user
      const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", req.user.id).single()

      if (userError || !user) {
        console.error("Error finding user:", userError)
        // Continue with the response even if we can't update progress
      } else {
        // Find or create progress record
        const { data: progress, error: progressError } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", req.user.id)
          .eq("level_id", levelId)
          .single()

        let wasAlreadyCompleted = false
        let progressId

        if (progressError) {
          // Create new progress record
          const { data: newProgress, error: createError } = await supabase
            .from("progress")
            .insert({
              user_id: req.user.id,
              level_id: levelId,
              completed: allPassed,
              stars: stars,
              attempts: 1,
              code,
              completion_date: allPassed ? new Date().toISOString() : null,
              time_spent: timeSpent || 0,
            })
            .select()
            .single()

          if (createError) {
            console.error("Error creating progress record:", createError)
          } else {
            progressId = newProgress.id
          }
        } else {
          // Check if already completed
          wasAlreadyCompleted = progress.completed
          progressId = progress.id

          // Update progress
          const updates = {
            code,
            attempts: progress.attempts + 1,
            time_spent: progress.time_spent + (timeSpent || 0),
          }

          // Only update completion status if all tests passed and it wasn't already completed
          if (allPassed && !progress.completed) {
            updates.completed = true
            updates.completion_date = new Date().toISOString()
          }

          // Only update stars if the new star count is higher
          if (stars > progress.stars) {
            updates.stars = stars
          }

          const { error: updateError } = await supabase.from("progress").update(updates).eq("id", progress.id)

          if (updateError) {
            console.error("Error updating progress:", updateError)
          }
        }

        // If all tests passed and it wasn't already completed, award XP
        if (allPassed && !wasAlreadyCompleted) {
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
          try {
            const earnedBadges = await checkBadgeEligibility(req.user.id)

            // Include earned badges in the response if any were earned
            if (earnedBadges && earnedBadges.length > 0) {
              return res.status(200).json({
                success: true,
                results,
                allPassed,
                stars,
                progressUpdated: true,
                xpEarned: level.xp_reward,
                currentXp: user.xp + level.xp_reward,
                earnedBadges,
              })
            }
          } catch (badgeError) {
            console.error("Error checking badge eligibility:", badgeError)
          }

          // Get next level
          const { data: nextLevel, error: nextLevelError } = await supabase
            .from("levels")
            .select("id, title")
            .eq("chapter_id", level.chapter_id)
            .eq("order", level.order + 1)
            .eq("is_active", true)
            .single()

          // Include next level in the response if found
          if (!nextLevelError && nextLevel) {
            return res.status(200).json({
              success: true,
              results,
              allPassed,
              stars,
              progressUpdated: true,
              xpEarned: level.xp_reward,
              currentXp: user.xp + level.xp_reward,
              nextLevel,
            })
          }

          // If we got here, return with XP info but no next level
          return res.status(200).json({
            success: true,
            results,
            allPassed,
            stars,
            progressUpdated: true,
            xpEarned: level.xp_reward,
            currentXp: user.xp + level.xp_reward,
          })
        }
      }
    }

    // Default response if no special conditions were met
    res.status(200).json({
      success: true,
      results,
      allPassed,
      stars,
      progressUpdated: stars > 0,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error testing code",
      error: error.message,
    })
  }
}
*/

const { executePythonCode, testPythonCode } = require("../services/compilerService")
const { supabase } = require("../config/supabase")

const compilerController = {
  // Execute Python code
  executeCode: async (req, res) => {
    try {
      const { code, input } = req.body

      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Code is required",
        })
      }

      const result = await executePythonCode(code, input || "")

      return res.status(result.success ? 200 : 400).json(result)
    } catch (error) {
      console.error("Error in executeCode:", error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  },

  // Test Python code against test cases
  testCode: async (req, res) => {
    try {
      const { levelId, code, timeSpent } = req.body
      const userId = req.user?.id

      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Code is required",
        })
      }

      // Get level to retrieve test cases
      const { data: level, error: levelError } = await supabase.from("levels").select("*").eq("id", levelId).single()

      if (levelError || !level) {
        return res.status(404).json({
          success: false,
          message: "Level not found",
        })
      }

      // Get test cases from level
      let testCases = level.test_cases || []

      // Ensure test cases are properly formatted
      testCases = testCases.map((tc) => ({
        input: tc.input || "",
        expectedOutput: tc.expectedOutput || "",
        description: tc.description || "Test case",
      }))

      // If no test cases, create some default ones
      if (testCases.length === 0) {
        console.log("No test cases found for level, using default test cases")
        // Create some default test cases based on level content
        testCases.push(
          {
            input: "",
            expectedOutput: "Hello, PyQuest!",
            description: "Basic output test",
          },
          {
            input: "42",
            expectedOutput: "42",
            description: "Input echo test",
          },
        )
      }

      // Test the code
      const testResult = await testPythonCode(code, testCases)

      // If user is authenticated, update their progress
      if (userId && testResult.allPassed) {
        try {
          // Find or create progress record
          const { data: progress, error: progressError } = await supabase
            .from("progress")
            .select("*")
            .eq("user_id", userId)
            .eq("level_id", levelId)
            .single()

          if (progressError) {
            // Create new progress record
            await supabase.from("progress").insert({
              user_id: userId,
              level_id: levelId,
              completed: true,
              stars: testResult.stars,
              attempts: 1,
              code,
              completion_date: new Date().toISOString(),
              time_spent: timeSpent || 0,
            })
          } else {
            // Update existing progress record
            const updates = {
              completed: true,
              code,
              completion_date: new Date().toISOString(),
              time_spent: (progress.time_spent || 0) + (timeSpent || 0),
              attempts: (progress.attempts || 0) + 1,
            }

            // Only update stars if new stars are higher
            if (testResult.stars > (progress.stars || 0)) {
              updates.stars = testResult.stars
            }

            await supabase.from("progress").update(updates).eq("id", progress.id)
          }

          // Update user XP if all tests passed
          if (testResult.allPassed) {
            const { data: user } = await supabase.from("users").select("xp").eq("id", userId).single()

            if (user) {
              const xpReward = level.xp_reward || 50
              await supabase
                .from("users")
                .update({ xp: (user.xp || 0) + xpReward })
                .eq("id", userId)

              // Add XP reward to response
              testResult.xpEarned = xpReward
            }
          }
        } catch (error) {
          console.error("Error updating user progress:", error)
        }
      }

      return res.status(200).json(testResult)
    } catch (error) {
      console.error("Error in testCode:", error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  },
}

module.exports = compilerController
