const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.githubId
      },
    },
    avatar: {
      type: String,
      default: function () {
        // Default Dicebear avatar URL
        return `https://api.dicebear.com/6.x/adventurer/svg?seed=${this._id}`
      },
    },
    googleId: {
      type: String,
    },
    githubId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    musicEnabled: {
      type: Boolean,
      default: true,
    },
    xp: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)
