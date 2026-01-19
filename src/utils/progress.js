function calcProgressPercent(steps = []) {
  const total = steps.length;
  if (total === 0) return 0;

  const completedCount = steps.filter((step) => step.done).length;
  return Math.round((completedCount / total) * 100);
}

module.exports = { calcProgressPercent };
