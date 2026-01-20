const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    username: {
      type: String,
      required: true,
      default: "New User",
      trim: true,
      maxlength: 40,
    },
    avatarUrl: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
