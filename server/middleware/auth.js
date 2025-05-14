/*
const passport = require("passport")
const jwt = require("jsonwebtoken")
const  supabase = require("../config/supabase")

// Middleware to authenticate JWT
exports.authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err)
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      })
    }

    req.user = user
    next()
  })(req, res, next)
}

// Middleware for optional JWT authentication
exports.optionalAuthJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (user) {
      req.user = user
    }
    next()
  })(req, res, next)
}

// Generate JWT token
exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role || "user",
    },
    process.env.JWT_SECRET || "your-secret-key",
    {
      expiresIn: "7d",
    },
  )
}

// Middleware to authenticate with Supabase token
exports.authenticateSupabaseToken = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
      })
    }

    // Extract the token
    const token = authHeader.split(" ")[1]

    // Verify the token with Supabase Auth
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      })
    }

    // Set the user in the request
    req.user = user

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    })
  }
}

// Middleware for optional Supabase authentication
exports.optionalSupabaseAuth = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization

    if (authHeader) {
      // Extract the token
      const token = authHeader.split(" ")[1]

      // Verify the token with Supabase Auth
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token)

      if (!error && user) {
        // Set the user in the request
        req.user = user
      }
    }

    next()
  } catch (error) {
    // Continue without setting user
    next()
  }
}

// Generate Supabase session
exports.generateSupabaseSession = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  return data
}
*/
/*
const jwt = require("jsonwebtoken")
const { supabase} = require("../config/supabase")

// Middleware to authenticate with Supabase JWT
exports.authenticateJWT = async (req, res, next) => {
  try {
    console.log("=== SUPABASE AUTH DEBUGGING ===")
    // Get the authorization header
    const authHeader = req.headers.authorization
    console.log("Authorization header:", authHeader ? "Present" : "Missing")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid authorization header")
      return res.status(401).json({
        success: false,
        message: "No valid authorization header",
      })
    }

    // Extract the token
    const token = authHeader.split(" ")[1]
    console.log("Token extracted:", token ? token.substring(0, 10) + "..." : "None")

    // Check if supabase.auth is available
    if (!supabase.auth) {
      console.error("ERROR: supabase.auth is undefined. Using fallback JWT verification.")

      // Fallback to manual JWT verification
      try {
        // Decode the JWT to get the user ID
        // Note: This is less secure than using Supabase's verification
        const decoded = jwt.decode(token)

        if (!decoded || !decoded.sub) {
          return res.status(401).json({
            success: false,
            message: "Invalid token format",
          })
        }

        // Get the user from the database using the sub claim (user ID)
        const { data: user, error } = await supabase.from("users").select("*").eq("id", decoded.sub).single()

        if (error || !user) {
          return res.status(401).json({
            success: false,
            message: "User not found",
            error: error ? error.message : "No user with this ID",
          })
        }

        // Set the user in the request
        req.user = user
        next()
      } catch (jwtError) {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
          error: jwtError.message,
        })
      }
      return
    }

    // If supabase.auth is available, use it to verify the token
    try {
      const { data, error } = await supabase.auth.getUser(token)

      if (error) {
        console.log("Supabase auth error:", error.message)
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
          error: error.message,
        })
      }

      if (!data.user) {
        console.log("No user found for token")
        return res.status(401).json({
          success: false,
          message: "No user found for token",
        })
      }

      console.log("Supabase auth successful for user:", data.user.id)

      // Get additional user data from the database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (userError) {
        console.log("Error fetching user data:", userError.message)
        // We still have the authenticated user, so we can proceed
        // but with limited user data
        req.user = data.user
      } else {
        // Combine auth user with database user data
        req.user = { ...data.user, ...userData }
      }

      next()
    } catch (authError) {
      console.error("Error calling supabase.auth.getUser:", authError)
      return res.status(401).json({
        success: false,
        message: "Authentication error",
        error: authError.message,
      })
    }
  } catch (error) {
    console.error("Authentication error:", error.message)
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    })
  }
}

// Middleware for optional JWT authentication
exports.optionalAuthJWT = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Extract the token
      const token = authHeader.split(" ")[1]

      // Check if supabase.auth is available
      if (!supabase.auth) {
        // Just continue without authentication
        return next()
      }

      try {
        // Verify the token with Supabase Auth
        const { data, error } = await supabase.auth.getUser(token)

        if (!error && data.user) {
          // Get additional user data
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single()

          if (!userError && userData) {
            // Combine auth user with database user data
            req.user = { ...data.user, ...userData }
          } else {
            req.user = data.user
          }
        }
      } catch (authError) {
        console.error("Error in optional auth:", authError)
        // Continue without setting user
      }
    }

    next()
  } catch (error) {
    // Continue without setting user
    next()
  }
}

// Alternative authentication method using JWT directly
exports.manualJwtAuth = async (req, res, next) => {
  try {
    console.log("=== MANUAL JWT AUTH ===")
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No valid authorization header",
      })
    }

    const token = authHeader.split(" ")[1]

    // Decode the JWT without verification
    // Note: This is less secure than proper verification
    const decoded = jwt.decode(token)

    if (!decoded || !decoded.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      })
    }

    // Get user from database using the sub claim (user ID)
    const { data: user, error } = await supabase.from("users").select("*").eq("id", decoded.sub).single()

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        error: error ? error.message : "No user with this ID",
      })
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    console.error("Manual JWT Auth Error:", error)
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    })
  }
}
*/
const { supabase } = require("../config/supabase")

// Middleware to authenticate with Supabase JWT
exports.authenticateJWT = async (req, res, next) => {
  try {
    console.log("=== SUPABASE AUTH DEBUGGING ===")
    // Get the authorization header
    const authHeader = req.headers.authorization
    console.log("Authorization header:", authHeader ? "Present" : "Missing")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid authorization header")
      return res.status(401).json({
        success: false,
        message: "No valid authorization header",
      })
    }

    // Extract the token
    const token = authHeader.split(" ")[1]
    console.log("Token extracted:", token ? token.substring(0, 10) + "..." : "None")

    // Verify the token with Supabase Auth
    try {
      const { data, error } = await supabase.auth.getUser(token)

      if (error) {
        console.log("Supabase auth error:", error.message)
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
          error: error.message,
        })
      }

      if (!data.user) {
        console.log("No user found for token")
        return res.status(401).json({
          success: false,
          message: "No user found for token",
        })
      }

      console.log("Supabase auth successful for user:", data.user.id)

      // Get additional user data from the database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (userError) {
        console.log("Error fetching user data:", userError.message)
        // We still have the authenticated user, so we can proceed
        // but with limited user data
        req.user = data.user
      } else {
        // Combine auth user with database user data
        req.user = { ...data.user, ...userData }
      }

      next()
    } catch (authError) {
      console.error("Error calling supabase.auth.getUser:", authError)

      // Try to decode the token manually as a fallback
      try {
        // Get user ID from token (this is a simplified approach)
        const base64Url = token.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const payload = JSON.parse(Buffer.from(base64, "base64").toString())

        if (payload.sub) {
          // Get user from database using the sub claim (user ID)
          const { data: user, error } = await supabase.from("users").select("*").eq("id", payload.sub).single()

          if (!error && user) {
            req.user = user
            return next()
          }
        }
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError)
      }

      return res.status(401).json({
        success: false,
        message: "Authentication error",
        error: authError.message,
      })
    }
  } catch (error) {
    console.error("Authentication error:", error.message)
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    })
  }
}

// Middleware for optional JWT authentication
exports.optionalAuthJWT = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Extract the token
      const token = authHeader.split(" ")[1]

      try {
        // Verify the token with Supabase Auth
        const { data, error } = await supabase.auth.getUser(token)

        if (!error && data.user) {
          // Get additional user data
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single()

          if (!userError && userData) {
            // Combine auth user with database user data
            req.user = { ...data.user, ...userData }
          } else {
            req.user = data.user
          }
        }
      } catch (authError) {
        // Continue without setting user
        console.error("Error in optional auth:", authError)
      }
    }

    next()
  } catch (error) {
    // Continue without setting user
    next()
  }
}

// Generate a session URL for client-side login
exports.generateSessionUrl = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  return data
}

// Sign up a new user
exports.signUpUser = async (email, password, userData) => {
  // First create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: userData.name,
      },
    },
  })

  if (authError) throw authError

  // Then add the user to the users table with additional data
  if (authData.user) {
    const { data: dbUser, error: dbError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        email: email,
        name: userData.name,
        avatar: userData.avatar || `https://api.dicebear.com/6.x/adventurer/svg?seed=${authData.user.id}`,
        music_enabled: true,
        xp: 0,
        streak: 0,
        role: "user",
        last_active: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      // If there was an error creating the user record, we should clean up the auth user
      console.error("Error creating user in database:", dbError)
      throw dbError
    }

    return { authData, dbUser }
  }

  return { authData }
}
