const { recordCommand } = require('./stats');

function timestamp() {
  return new Date().toISOString();
}

function color(code, value) {
  return `\x1b[${code}m${value}\x1b[0m`;
}

function info(message) {
  console.log(`${color(36, '[INFO]')} ${timestamp()} ${message}`);
}

function warn(message) {
  console.warn(`${color(33, '[WARN]')} ${timestamp()} ${message}`);
}

function error(message, err) {
  console.error(`${color(31, '[ERROR]')} ${timestamp()} ${message}`);

  if (err) {
    console.error(err.stack || err);
  }
}

function command(interaction, durationMs, result = {}) {
  const success = result.success !== false;
  const status = success ? 'success' : 'error';
  const user = `${interaction.user.tag || interaction.user.username} / ${interaction.user.id}`;
  const channelName = interaction.channel?.name || 'Direct Message';
  const channelId = interaction.channelId || interaction.channel?.id || 'unknown';
  const guildName = interaction.guild?.name || 'Direct Message';
  const guildId = interaction.guildId || interaction.guild?.id || 'none';
  const errorMessage = result.errorMessage ? ` | error="${result.errorMessage}"` : '';
  const loggedAt = new Date();

  recordCommand({
    commandName: interaction.commandName,
    durationMs,
    guild: `${guildName} / ${guildId}`,
    success,
    timestamp: loggedAt,
    user,
  });

  info([
    `command=/${interaction.commandName}`,
    `status=${status}`,
    `timestamp=${loggedAt.toISOString()}`,
    `duration=${durationMs}ms`,
    `user="${user}"`,
    `channel="${channelName} / ${channelId}"`,
    `guild="${guildName} / ${guildId}"`,
  ].join(' | ') + errorMessage);
}

function banner({ botName, discordVersion, nodeVersion, guildCount, commandCount, startupTimeMs }) {
  const line = color(36, '==================================================');
  console.log(line);
  console.log(color(36, ` ${botName} startup`));
  console.log(line);
  console.log(`${color(32, 'Bot:')} ${botName}`);
  console.log(`${color(32, 'Discord.js:')} ${discordVersion}`);
  console.log(`${color(32, 'Node.js:')} ${nodeVersion}`);
  console.log(`${color(32, 'Guilds:')} ${guildCount}`);
  console.log(`${color(32, 'Commands:')} ${commandCount}`);
  console.log(`${color(32, 'Startup time:')} ${startupTimeMs}ms`);
  console.log(line);
}

module.exports = {
  banner,
  command,
  error,
  info,
  warn,
};
