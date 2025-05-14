const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const { supabase } = require("../config/supabase")
const sendEmail = require("../utils/sendEmail")

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      })
    }

    // Check if user already exists in custom table
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      })
    }

    // Create user in Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (signUpError) {
      return res.status(500).json({
        success: false,
        message: "Error creating user in Supabase Auth",
        error: signUpError.message,
      })
    }

    // Generate verification token for our custom system
    const emailVerificationToken = crypto.randomBytes(20).toString("hex")

    // Generate avatar URL
    const avatarUrl = `https://api.dicebear.com/6.x/adventurer/svg?seed=${email}`

    // Create user in custom table
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        id: signUpData.user.id, // Use the same ID from Supabase Auth
        name,
        email,
        password: "", // No need to store password in custom table
        avatar: avatarUrl,
        email_verification_token: emailVerificationToken,
        email_verified: false,
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
      return res.status(500).json({
        success: false,
        message: "Error creating user in custom table",
        error: createError.message,
      })
    }

    // Send welcome email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${emailVerificationToken}`

    try {
      await sendEmail({
        to: email,
        subject: "Welcome to PyQuest - Verify Your Email",
        html: `
          <h1>Welcome to PyQuest!</h1>
          <p>Thank you for registering. Please verify your email by clicking the link below:</p>
          <a href="${verificationUrl}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
      })
    } catch (emailError) {
      console.error("Error sending verification email:", emailError)
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: signUpData.user.id,
        name,
        email,
        avatar: avatarUrl,
        role: "user",
        emailVerified: false,
      },
      session: signUpData.session,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    })
  }
}

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      })
    }

    // Sign in with Supabase Auth
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        error: signInError.message,
      })
    }

    // Get user data from custom table
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("*")
      .eq("id", signInData.user.id)
      .single()

    // If user doesn't exist in custom table but exists in Auth, create entry
    let userInfo = userData
    if (userDataError && userDataError.code === "PGRST116") {
      const avatarUrl = `https://api.dicebear.com/6.x/adventurer/svg?seed=${email}`

      const { data: newUserData, error: createError } = await supabase
        .from("users")
        .insert({
          id: signInData.user.id,
          name: signInData.user.user_metadata?.name || email.split("@")[0],
          email,
          avatar: avatarUrl,
          email_verified: signInData.user.email_confirmed_at !== null,
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
      } else {
        userInfo = newUserData
      }
    }

    // Update last active
    const { error: updateError } = await supabase
      .from("users")
      .update({ last_active: new Date().toISOString() })
      .eq("id", signInData.user.id)

    if (updateError) {
      console.error("Error updating last active:", updateError)
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: signInData.user.id,
        name: userInfo?.name || signInData.user.user_metadata?.name || email.split("@")[0],
        email,
        avatar: userInfo?.avatar,
        role: userInfo?.role || "user",
        emailVerified: signInData.user.email_confirmed_at !== null,
        musicEnabled: userInfo?.music_enabled,
        xp: userInfo?.xp || 0,
      },
      session: signInData.session,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    })
  }
}

// Demo login (for development)
exports.demoLogin = async (req, res) => {
  try {
    const demoEmail = "demo@pyquest.com"
    const demoPassword = "demo123"

    // Try to sign in with demo credentials
    let signInData = null
    const { data: initialSignInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    })

    // If sign in fails, create the demo user
    if (signInError) {
      // Create demo user in Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          data: {
            name: "Demo User",
          },
        },
      })

      if (signUpError) {
        return res.status(500).json({
          success: false,
          message: "Error creating demo user in Supabase Auth",
          error: signUpError.message,
        })
      }

      // Try signing in again
      const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      })

      if (newSignInError) {
        return res.status(500).json({
          success: false,
          message: "Error signing in demo user",
          error: newSignInError.message,
        })
      }

      signInData = newSignInData
    } else {
      signInData = initialSignInData
    }

    // Check if demo user exists in custom table
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("email", demoEmail)
      .single()

    let user

    if (!existingUser) {
      // Create demo user in custom table
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          id: signInData.user.id,
          name: "Demo User",
          email: demoEmail,
          avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=demo",
          email_verified: true,
          music_enabled: true,
          xp: 100,
          streak: 3,
          role: "user",
          last_active: new Date().toISOString(),
        })
        .select()
        .single()

      if (createError) {
        return res.status(500).json({
          success: false,
          message: "Error creating demo user in custom table",
          error: createError.message,
        })
      }

      user = newUser
    } else {
      user = existingUser
    }

    res.status(200).json({
      success: true,
      message: "Demo login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        emailVerified: true,
        musicEnabled: user.music_enabled,
        xp: user.xp,
      },
      session: signInData.session,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error with demo login",
      error: error.message,
    })
  }
}

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params

    // Find user with token in custom table
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email_verification_token", token)
      .single()

    if (error || !user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      })
    }

    // Update user in custom table
    const { error: updateError } = await supabase
      .from("users")
      .update({
        email_verified: true,
        email_verification_token: null,
      })
      .eq("id", user.id)

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: "Error verifying email in custom table",
        error: updateError.message,
      })
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying email",
      error: error.message,
    })
  }
}

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    // Use Supabase Auth's built-in password reset
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CLIENT_URL}/reset-password`,
    })

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error sending password reset email",
        error: error.message,
      })
    }

    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending reset email",
      error: error.message,
    })
  }
}

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    // For Supabase Auth, password reset is handled via the resetPasswordForEmail flow
    // This endpoint is kept for compatibility with the existing frontend

    // Find user with token in custom table
    const { data: user, error } = await supabase.from("users").select("*").eq("reset_password_token", token).single()

    if (error || !user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      })
    }

    // Check if token is expired
    const now = new Date()
    const expires = new Date(user.reset_password_expires)

    if (now > expires) {
      return res.status(400).json({
        success: false,
        message: "Reset token has expired",
      })
    }

    // Update user in custom table
    const { error: customUpdateError } = await supabase
      .from("users")
      .update({
        reset_password_token: null,
        reset_password_expires: null,
      })
      .eq("id", user.id)

    if (customUpdateError) {
      console.error("Error updating custom user table:", customUpdateError)
    }

    res.status(200).json({
      success: true,
      message: "Password reset link has been processed. Please use the Supabase reset flow to complete the process.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    })
  }
}

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No valid authorization header",
      })
    }

    const token = authHeader.split(" ")[1]

    // Get user from Supabase Auth
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        error: error ? error.message : "No user found",
      })
    }

    // Get additional user data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (userError) {
      console.error("Error fetching user data:", userError)
    }

    res.json({
      success: true,
      user: userData || data.user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting current user",
      error: error.message,
    })
  }
}

// Logout user
exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "No valid authorization header",
      })
    }

    const token = authHeader.split(" ")[1]

    // Sign out with Supabase Auth
    const { error } = await supabase.auth.signOut()

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error logging out",
        error: error.message,
      })
    }

    res.json({
      success: true,
      message: "Logout successful",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    })
  }
}

// Google OAuth callback
exports.googleCallback = (req, res) => {
  try {
    // Get the user from the request (set by Passport)
    const user = req.user

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=Authentication failed`)
    }

    // Redirect to frontend with session
    res.redirect(`${process.env.CLIENT_URL}/auth/social-callback?id=${user.id}`)
  } catch (error) {
    console.error("Error in Google callback:", error)
    res.redirect(`${process.env.CLIENT_URL}/login?error=Authentication failed`)
  }
}

// GitHub OAuth callback
exports.githubCallback = (req, res) => {
  try {
    // Get the user from the request (set by Passport)
    const user = req.user

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=Authentication failed`)
    }

    // Redirect to frontend with session
    res.redirect(`${process.env.CLIENT_URL}/auth/social-callback?id=${user.id}`)
  } catch (error) {
    console.error("Error in GitHub callback:", error)
    res.redirect(`${process.env.CLIENT_URL}/login?error=Authentication failed`)
  }
}
