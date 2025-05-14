const express = require("express")
const { supabase, supabaseClient } = require("../config/supabase")
const { authenticateJWT } = require("../middleware/auth")

const router = express.Router()

// Test Supabase connection
router.get("/ping", async (req, res) => {
  try {
    const { data, error } = await supabase.from("chapters").select("*").limit(1)

    if (error) {
      return res.status(500).json({ success: false, error: error.message })
    }

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Test authentication
router.get("/auth-test", authenticateJWT, (req, res) => {
  res.json({
    success: true,
    message: "Authentication successful",
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role || "user",
    },
  })
})

// Generate a test token (for development only)
router.post("/generate-token", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
        error: error.message,
      })
    }

    res.json({
      success: true,
      message: "Token generated successfully",
      session: data.session,
      user: data.user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating token",
      error: error.message,
    })
  }
})

module.exports = router
