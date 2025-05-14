const express = require("express")
const levelController = require("../controllers/level.controller")
const { authenticateJWT, optionalAuthJWT } = require("../middleware/auth")

const router = express.Router()

// Get level by ID
router.get("/:id", optionalAuthJWT, levelController.getLevelById)

// Submit solution
router.post("/:id/submit", authenticateJWT, levelController.submitSolution)

// Complete level
router.post("/:id/complete", authenticateJWT, levelController.completeLevel)

module.exports = router
