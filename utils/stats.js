const startedAt = Date.now();

const commandStats = {
  failed: 0,
  lastCommand: null,
  perCommand: {},
  successful: 0,
  total: 0,
  totalDurationMs: 0,
};

function recordCommand({
  commandName = 'unknown',
  durationMs = 0,
  guild = 'Direct Message',
  success = true,
  timestamp = new Date(),
  user = 'Unknown',
} = {}) {
  const normalizedCommand = commandName.startsWith('/') ? commandName : `/${commandName}`;

  commandStats.total += 1;
  commandStats.totalDurationMs += Number.isFinite(durationMs) ? durationMs : 0;
  commandStats.perCommand[normalizedCommand] = (commandStats.perCommand[normalizedCommand] || 0) + 1;
  commandStats.lastCommand = {
    commandName: normalizedCommand,
    guild,
    status: success ? 'success' : 'error',
    success,
    timestamp: timestamp instanceof Date ? timestamp : new Date(timestamp),
    user,
  };

  if (success) {
    commandStats.successful += 1;
  } else {
    commandStats.failed += 1;
  }
}

function getCommandStats() {
  const averageDurationMs = commandStats.total > 0
    ? commandStats.totalDurationMs / commandStats.total
    : 0;
  const mostUsedCommand = Object.entries(commandStats.perCommand)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([commandName, count]) => ({ commandName, count }))[0] || null;

  return {
    averageDurationMs,
    failed: commandStats.failed,
    lastCommand: commandStats.lastCommand,
    mostUsedCommand,
    perCommand: { ...commandStats.perCommand },
    startedAt,
    successful: commandStats.successful,
    total: commandStats.total,
    totalDurationMs: commandStats.totalDurationMs,
  };
}

module.exports = {
  getCommandStats,
  recordCommand,
};
