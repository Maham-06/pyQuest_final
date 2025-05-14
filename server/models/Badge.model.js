const mongoose = require("mongoose")

const BadgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    criteria: {
      type: {
        type: String,
        enum: ["level_completion", "xp_milestone", "streak", "custom"],
        required: true,
      },
      value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Badge", BadgeSchema)
