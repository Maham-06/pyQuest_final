const express = require("express")
const chapterController = require("../controllers/chapter.controller")
const { authenticateJWT, optionalAuthJWT } = require("../middleware/auth")

const router = express.Router()

// Get all chapters
router.get("/", chapterController.getAllChapters)

// Get chapter by ID with optional authentication
router.get("/:id", optionalAuthJWT, chapterController.getChapterById)


router.get("/:id/levels", chapterController.getChapterLevels)
module.exports = router
