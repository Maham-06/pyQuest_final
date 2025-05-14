const mongoose = require("mongoose")

const TestCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    default: "",
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

const LevelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    initialCode: {
      type: String,
      default: "# Write your code here\n\n",
    },
    instructions: {
      type: String,
      required: true,
    },
    testCases: [TestCaseSchema],
    xpReward: {
      type: Number,
      default: 50,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Level",
      },
    ],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Level", LevelSchema)
