const express = require("express")
const userController = require("../controllers/user.controller")
const  {authenticateJWT } = require("../middleware/auth")

const router = express.Router()

// All routes require authentication
router.use(authenticateJWT)

// Get user profile
router.get("/profile", userController.getProfile)

// Update user profile
router.put("/profile", userController.updateProfile)

// Update avatar
router.put("/avatar", userController.updateAvatar)

// Update password
router.put("/password", userController.updatePassword)

// Get user progress
router.get("/progress", userController.getUserProgress)

// Get user dashboard
router.get("/dashboard", userController.getDashboard)

module.exports = router
