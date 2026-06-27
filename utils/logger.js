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

function command(interaction, durationMs, failed = false) {
  const guild = interaction.guild?.name || interaction.guildId || 'Direct Message';
  const user = `${interaction.user.tag} (${interaction.user.id})`;
  const status = failed ? 'failed' : 'completed';

  info(`/${interaction.commandName} ${status} in ${durationMs}ms | user=${user} | guild=${guild}`);
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
