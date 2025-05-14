const { supabase } = require("../config/supabase")

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error getting notifications",
        error: error.message,
      })
    }

    res.status(200).json({
      success: true,
      notifications,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting notifications",
      error: error.message,
    })
  }
}

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params

    // Check if notification exists and belongs to user
    const { data: notification, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single()

    if (error || !notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    // Update notification
    const { error: updateError } = await supabase.from("notifications").update({ read: true }).eq("id", id)

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: "Error marking notification as read",
        error: updateError.message,
      })
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking notification as read",
      error: error.message,
    })
  }
}

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", req.user.id)
      .eq("read", false)

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error marking notifications as read",
        error: error.message,
      })
    }

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking notifications as read",
      error: error.message,
    })
  }
}

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params

    // Check if notification exists and belongs to user
    const { data: notification, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single()

    if (error || !notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    // Delete notification
    const { error: deleteError } = await supabase.from("notifications").delete().eq("id", id)

    if (deleteError) {
      return res.status(500).json({
        success: false,
        message: "Error deleting notification",
        error: deleteError.message,
      })
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    })
  }
}
