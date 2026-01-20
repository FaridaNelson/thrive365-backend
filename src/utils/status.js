function calcEffectiveStatus(goal) {
  // If user paused it, always show paused
  if (goal.status === "paused") return "paused";

  const steps = Array.isArray(goal.steps) ? goal.steps : [];
  if (steps.length > 0 && steps.every((s) => s.done)) return "completed";

  return "active";
}

module.exports = { calcEffectiveStatus };
