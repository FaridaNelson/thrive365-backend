const express = require("express");
const { z } = require("zod");
const { auth } = require("../middleware/auth");
const Goal = require("../models/Goal");
const { calcProgressPercent } = require("../utils/progress");
const { calcEffectiveStatus } = require("../utils/status");

const router = express.Router();

const stepSchema = z.object({
  text: z.string().min(1).max(200),
  done: z.boolean().default(false),
});

const createSchema = z.object({
  slot: z.number().int().min(1).max(4),
  title: z.string().min(1).max(80),
  definition: z.string().max(2000).optional(),
  reason: z.string().max(2000).optional(),
  notes: z.string().max(4000).optional(),
  imageUrls: z.array(z.string().url()).optional(),
  steps: z.array(stepSchema).optional(),
  status: z.enum(["active", "paused", "completed"]).optional(),
});


//GET GOALS

router.get("/goals", auth, async (req, res) => {
  const goals = await Goal.find({ userId: req.user.id })
    .sort({ slot: 1 })
    .select("slot title imageUrls steps status");

  const shaped = goals.map((g) => ({
    id: g._id,
    slot: g.slot,
    title: g.title,
    coverImageUrl: g.imageUrls?.[0] || "",
    progressPercent: calcProgressPercent(g.steps),
    status: calcEffectiveStatus(g),
  }));

  return res.json(shaped);
});


//CREATE GOAL

router.post("/goal", auth, async (req, res) => {
  try {
    const data = createSchema.parse(req.body);

    const created = await Goal.create({
      userId: req.user.id,
      slot: data.slot,
      title: data.title,
      definition: data.definition ?? "",
      reason: data.reason ?? "",
      notes: data.notes ?? "",
      imageUrls: data.imageUrls ?? [],
      status: data.status ?? "active",
      steps: (data.steps ?? []).map((s) => ({ text: s.text, done: !!s.done })),
    });

    return res.status(201).json({
      id: created._id,
      slot: created.slot,
      title: created.title,
      progressPercent: calcProgressPercent(created.steps),
      status: calcEffectiveStatus(created),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message:
          "That slot already has a goal. Choose slot 1-4 that is not already used.",
      });
    }
    if (err.name === "ZodError")
      return res
        .status(400)
        .json({ message: "Invalid input", errors: err.errors });
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET A SINGLE GOAL

router.get("/:goalId", auth, async (req, res) => {
  const goal = await Goal.findOne({
    _id: req.params.goalId,
    userId: req.user.id,
  });
  if (!goal) return res.status(404).json({ message: "Goal not found" });

  return res.json({
    id: goal._id,
    slot: goal.slot,
    title: goal.title,
    definition: goal.definition,
    reason: goal.reason,
    notes: goal.notes,
    imageUrls: goal.imageUrls,
    steps: goal.steps,
    progressPercent: calcProgressPercent(goal.steps),
    status: calcEffectiveStatus(goal),
  });
});

const patchSchema = createSchema.partial().omit({ slot: true }); // slot stays fixed after creation


//EDIT GOAL
router.patch("/:goalId", auth, async (req, res) => {
  try {
    const data = patchSchema.parse(req.body);

    const goal = await Goal.findOne({
      _id: req.params.goalId,
      userId: req.user.id,
    });
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    if (data.title !== undefined) goal.title = data.title;
    if (data.definition !== undefined) goal.definition = data.definition;
    if (data.reason !== undefined) goal.reason = data.reason;
    if (data.notes !== undefined) goal.notes = data.notes;
    if (data.status !== undefined) goal.status = data.status;
    if (data.imageUrls !== undefined) goal.imageUrls = data.imageUrls;
    if (data.steps !== undefined)
      goal.steps = data.steps.map((s) => ({ text: s.text, done: !!s.done }));

    await goal.save();

    return res.json({
      id: goal._id,
      progressPercent: calcProgressPercent(goal.steps),
      status: calcEffectiveStatus(goal),
      goal,
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

//DELETE GOAL

router.delete("/:goalId", auth, async (req, res) => {
  const deleted = await Goal.findOneAndDelete({
    _id: req.params.goalId,
    userId: req.user.id,
  });
  if (!deleted) return res.status(404).json({ message: "Goal not found" });
  return res.json({ ok: true });
});

module.exports = router;
