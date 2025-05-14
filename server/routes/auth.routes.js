/*
const express = require("express")
const passport = require("passport")
const authController = require("../controllers/auth.controller")
const { authenticateJWT } = require("../middleware/auth")

const router = express.Router()

// Register
router.post("/register", authController.register)

// Login
router.post("/login", authController.login)

// Demo login (for development)
router.post("/demo-login", authController.demoLogin)

// Verify email
router.get("/verify-email/:token", authController.verifyEmail)

// Forgot password
router.post("/forgot-password", authController.forgotPassword)

// Reset password
router.post("/reset-password/:token", authController.resetPassword)

// Get current user
router.get("/me", authenticateJWT, authController.getCurrentUser)

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

router.get("/google/callback", passport.authenticate("google", { session: false }), authController.googleCallback)

// GitHub OAuth
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }))

router.get("/github/callback", passport.authenticate("github", { session: false }), authController.githubCallback)

router.get("/test", (req, res) => {
  res.json({ message: "Auth route working!" })
})

module.exports = router
*/
const express = require("express")
const authController = require("../controllers/auth.controller")
const { authenticateJWT } = require("../middleware/auth")
const { supabase } = require("../config/supabase")

const router = express.Router()

// Register
router.post("/register", authController.register)

// Login
router.post("/login", authController.login)

// Demo login (for development)
router.post("/demo-login", authController.demoLogin)

// Verify email
router.get("/verify-email/:token", authController.verifyEmail)

// Forgot password
router.post("/forgot-password", authController.forgotPassword)

// Reset password
router.post("/reset-password/:token", authController.resetPassword)

// Get current user
router.get("/me", authenticateJWT, authController.getCurrentUser)

// Logout user
router.post("/logout", authenticateJWT, authController.logout)

// OAuth routes
// These routes now use Supabase Auth instead of Passport

// Google OAuth
router.get("/google", (req, res) => {
  const redirectUrl = `${process.env.CLIENT_URL}/auth/google-callback`
  const { data, error } = supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
    },
  })

  if (error) {
    return res.status(500).json({
      success: false,
      message: "Error initiating Google OAuth",
      error: error.message,
    })
  }

  res.redirect(data.url)
})

// GitHub OAuth
router.get("/github", (req, res) => {
  const redirectUrl = `${process.env.CLIENT_URL}/auth/github-callback`
  const { data, error } = supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: redirectUrl,
    },
  })

  if (error) {
    return res.status(500).json({
      success: false,
      message: "Error initiating GitHub OAuth",
      error: error.message,
    })
  }

  res.redirect(data.url)
})

// OAuth callback handler for frontend
router.post("/oauth-callback", async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "No code provided",
      })
    }

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error exchanging code for session",
        error: error.message,
      })
    }

    // Get user data from custom table
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single()

    // If user doesn't exist in custom table, create one
    if (userDataError && userDataError.code === "PGRST116") {
      const { email, user_metadata } = data.user
      const name = user_metadata?.full_name || email.split("@")[0]
      const avatarUrl = user_metadata?.avatar_url || `https://api.dicebear.com/6.x/adventurer/svg?seed=${email}`

      const { data: newUserData, error: createError } = await supabase
        .from("users")
        .insert({
          id: data.user.id,
          name,
          email,
          avatar: avatarUrl,
          email_verified: true,
          music_enabled: true,
          xp: 0,
          streak: 0,
          role: "user",
          last_active: new Date().toISOString(),
        })
        .select()
        .single()

      if (createError) {
        console.error("Error creating user in custom table:", createError)
      }
    }

    res.json({
      success: true,
      session: data.session,
      user: data.user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing OAuth callback",
      error: error.message,
    })
  }
})

router.get("/test", (req, res) => {
  res.json({ message: "Auth route working!" })
})

module.exports = router
