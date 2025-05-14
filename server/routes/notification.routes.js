const express = require("express")
const notificationController = require("../controllers/notification.controller")
const { authenticateJWT } = require("../middleware/auth")

const router = express.Router()

// All routes require authentication
router.use(authenticateJWT)

// Get user notifications
router.get("/", notificationController.getUserNotifications)

// Mark notification as read
router.put("/:id/read", notificationController.markAsRead)

// Mark all notifications as read
router.put("/read-all", notificationController.markAllAsRead)

// Delete notification
router.delete("/:id", notificationController.deleteNotification)

module.exports = router
