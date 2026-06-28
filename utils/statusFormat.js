function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (!parts.length) parts.push(`${seconds}s`);

  return parts.join(' ');
}

function formatMotd(response) {
  if (typeof response?.motd === 'string') return response.motd;
  if (response?.motd?.clean) return response.motd.clean;
  if (response?.motd?.raw) return response.motd.raw;
  return 'Unavailable';
}

function formatVersion(response) {
  return response?.version?.name || response?.version || 'Unavailable';
}

function formatPlayers(response) {
  const online = response?.players?.online ?? response?.onlinePlayers ?? 'Unknown';
  const max = response?.players?.max ?? response?.maxPlayers ?? 'Unknown';
  return `${online} / ${max}`;
}

function formatEdition(response) {
  return response?.edition || 'Minecraft Bedrock';
}

function formatStatusSource(response) {
  return response?.statusSource || 'UDP';
}

function formatCheckedTime(date = new Date()) {
  return `<t:${Math.floor(date.getTime() / 1000)}:F>`;
}

module.exports = {
  formatCheckedTime,
  formatDuration,
  formatEdition,
  formatMotd,
  formatPlayers,
  formatStatusSource,
  formatVersion,
};
