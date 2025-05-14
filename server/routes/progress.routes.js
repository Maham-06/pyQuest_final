const express = require("express")
const progressController = require("../controllers/progress.controller")
const { authenticateJWT } = require("../middleware/auth")

const router = express.Router()

// All routes require authentication
router.use(authenticateJWT)

// Get user progress for all levels
router.get("/", progressController.getUserProgress)

// Get user progress for a specific level
router.get("/level/:levelId", progressController.getLevelProgress)

// Get user progress for a specific chapter
router.get("/chapter/:chapterId", progressController.getChapterProgress)

// Update user progress for a level
router.put("/level/:levelId", progressController.updateLevelProgress)

// Get user progress statistics
router.get("/stats", progressController.getProgressStats)

// Get user streak information
router.get("/streak", progressController.getUserStreak)

// Update user streak
router.put("/streak", progressController.updateStreak)

module.exports = router