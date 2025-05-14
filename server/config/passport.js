const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const GoogleStrategy = require("passport-google-oauth20").Strategy
const GitHubStrategy = require("passport-github2").Strategy
const supabase = require("./supabase")

module.exports = (passport) => {
  // JWT Strategy
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  }

  passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        // Get user from Supabase
        const { data: user, error } = await supabase.from("users").select("*").eq("id", payload.id).single()

        if (error || !user) {
          return done(null, false)
        }

        return done(null, user)
      } catch (error) {
        return done(error, false)
      }
    }),
  )

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          const { data: user, error } = await supabase.from("users").select("*").eq("google_id", profile.id).single()

          if (user) {
            return done(null, user)
          }

          // Check if user exists with the same email
          const { data: existingUser, error: emailError } = await supabase
            .from("users")
            .select("*")
            .eq("email", profile.emails[0].value)
            .single()

          if (existingUser) {
            // Link Google account to existing user
            const { data: updatedUser, error: updateError } = await supabase
              .from("users")
              .update({ google_id: profile.id })
              .eq("id", existingUser.id)
              .select()
              .single()

            if (updateError) {
              return done(updateError, false)
            }

            return done(null, updatedUser)
          }

          // Create new user
          const avatarUrl = `https://api.dicebear.com/6.x/adventurer/svg?seed=${profile.id}`

          const { data: newUser, error: createError } = await supabase
            .from("users")
            .insert({
              name: profile.displayName,
              email: profile.emails[0].value,
              google_id: profile.id,
              avatar: profile.photos[0].value || avatarUrl,
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
            return done(createError, false)
          }

          return done(null, newUser)
        } catch (error) {
          return done(error, false)
        }
      },
    ),
  )

  // GitHub OAuth Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          const { data: user, error } = await supabase.from("users").select("*").eq("github_id", profile.id).single()

          if (user) {
            return done(null, user)
          }

          // Get primary email from GitHub
          const primaryEmail = (profile.emails && profile.emails.find((email) => email.primary)) || profile.emails[0]

          if (!primaryEmail) {
            return done(new Error("No email found from GitHub"), false)
          }

          // Check if user exists with the same email
          const { data: existingUser, error: emailError } = await supabase
            .from("users")
            .select("*")
            .eq("email", primaryEmail.value)
            .single()

          if (existingUser) {
            // Link GitHub account to existing user
            const { data: updatedUser, error: updateError } = await supabase
              .from("users")
              .update({ github_id: profile.id })
              .eq("id", existingUser.id)
              .select()
              .single()

            if (updateError) {
              return done(updateError, false)
            }

            return done(null, updatedUser)
          }

          // Create new user
          const avatarUrl = profile.photos[0].value || `https://api.dicebear.com/6.x/adventurer/svg?seed=${profile.id}`

          const { data: newUser, error: createError } = await supabase
            .from("users")
            .insert({
              name: profile.displayName || profile.username,
              email: primaryEmail.value,
              github_id: profile.id,
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
            return done(createError, false)
          }

          return done(null, newUser)
        } catch (error) {
          return done(error, false)
        }
      },
    ),
  )
}
