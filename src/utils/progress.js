function calcProgressPercent(steps = []) {
  const list = Array.isArray(steps) ? steps : [];
  if (list.length === 0) return 0;
  const doneCount = list.filter((s) => s.done).length;
  return Math.round((doneCount / list.length) * 100);
}

module.exports = { calcProgressPercent };
