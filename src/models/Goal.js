const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 200 },
    done: { type: Boolean, default: false },
  },
  { _id: true },
);

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
    },
    slot: { type: Number, required: true, min: 1, max: 4 },
    category: {
      type: String,
      required: true,
      enum: ["Career", "Finance", "Education", "Fitness"],
      trim: true,
      maxlength: 20,
    },
    displayColor: { type: String, default: "#CFCFCF", trim: true },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    definition: { type: String, default: "", trim: true, maxlength: 2000 },
    reason: { type: String, default: "", trim: true, maxlength: 2000 },
    steps: { type: [stepSchema], default: [] },
    notes: { type: String, default: "", trim: true, maxlength: 4000 },
    imageUrls: { type: [String], default: [] },
  },
  { timestamps: true },
);

goalSchema.index({ userId: 1, slot: 1 }, { unique: true });

module.exports = mongoose.model("Goal", goalSchema);
