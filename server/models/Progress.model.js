const mongoose = require("mongoose")

const ProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    stars: {
      type: Number,
      default: 0,
      min: 0,
      max: 3,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastAttemptDate: {
      type: Date,
    },
    completionDate: {
      type: Date,
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0,
    },
    code: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to ensure a user can only have one progress record per level
ProgressSchema.index({ user: 1, level: 1 }, { unique: true })

module.exports = mongoose.model("Progress", ProgressSchema)
