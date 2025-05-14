const express = require("express")
const compilerController = require("../controllers/compiler.controller")
const { authenticateJWT } = require("../middleware/auth")

const router = express.Router()

// Execute code
router.post("/execute", compilerController.executeCode)

// Test code
router.post("/test", authenticateJWT, compilerController.testCode)

module.exports = router
