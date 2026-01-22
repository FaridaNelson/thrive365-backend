const express = require("express");
const { z } = require("zod");
const { auth } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// GET CURRENT USER

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "email username avatarUrl",
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({
    id: user._id,
    email: user.email,
    username: user.username,
    avatarUrl: user.avatarUrl,
  });
});

const patchSchema = z.object({
  username: z.string().min(1).max(40).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

//EDIT CURRENT USER

router.patch("/", auth, async (req, res) => {
  try {
    const data = patchSchema.parse(req.body);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: data },
      { new: true, runValidators: true, select: "email username avatarUrl" },
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
    });
  } catch (err) {
    if (err.name === "ZodError")
      return res
        .status(400)
        .json({ message: "Invalid input", errors: err.errors });
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
