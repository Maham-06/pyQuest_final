const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const passport = require("passport")
const cookieParser = require("cookie-parser")
const path = require("path")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const chapterRoutes = require("./routes/chapter.routes")
const levelRoutes = require("./routes/level.routes")
const progressRoutes = require("./routes/progress.routes")
const compilerRoutes = require("./routes/compiler.routes")
const notificationRoutes = require("./routes/notification.routes")


const testRoutes = require("./routes/test.routes")


// Initialize Express app
const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(cookieParser())

// Initialize Passport
app.use(passport.initialize())
require("./config/passport")(passport)

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/chapters", chapterRoutes)
app.use("/api/levels", levelRoutes)
app.use("/api/progress", progressRoutes)
app.use("/api/compiler", compilerRoutes)
app.use("/api/notifications", notificationRoutes)

app.use("/api/test", testRoutes)

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

module.exports = app // For testing
