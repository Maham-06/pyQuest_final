const mongoose = require("mongoose")

const UserBadgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to ensure a user can only earn a badge once
UserBadgeSchema.index({ user: 1, badge: 1 }, { unique: true })

module.exports = mongoose.model("UserBadge", UserBadgeSchema)
