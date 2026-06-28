const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embeds');
const { getCommandStats } = require('../utils/stats');
const { formatDuration, formatLatency } = require('../utils/statusFormat');

const BOT_VERSION = 'v1.6.1';

function formatDiscordTime(date) {
  return `<t:${Math.floor(date.getTime() / 1000)}:F>`;
}

function formatLastCommand(lastCommand) {
  if (!lastCommand) return 'No commands yet.';
  return `${lastCommand.commandName} by ${lastCommand.user} (${lastCommand.status})`;
}

function formatMostUsedCommand(mostUsedCommand) {
  if (!mostUsedCommand) return 'No commands yet.';
  return `${mostUsedCommand.commandName} (${mostUsedCommand.count})`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Show startup command statistics.'),
  cooldown: 10,
  async execute(interaction) {
    const stats = getCommandStats();

    const embed = createEmbed({
      title: 'Bot Statistics',
      fields: [
        { name: 'Bot Version', value: BOT_VERSION, inline: true },
        { name: 'Bot Uptime', value: `\`${formatDuration(interaction.client.uptime ?? process.uptime() * 1000)}\``, inline: true },
        { name: 'Startup Time', value: formatDiscordTime(new Date(stats.startedAt)), inline: false },
        { name: 'Guilds', value: String(interaction.client.guilds.cache.size), inline: true },
        { name: 'Commands Loaded', value: String(interaction.client.commands.size), inline: true },
        { name: 'Total Commands', value: String(stats.total), inline: true },
        { name: 'Successful', value: String(stats.successful), inline: true },
        { name: 'Failed', value: String(stats.failed), inline: true },
        { name: 'Average Duration', value: formatLatency(stats.averageDurationMs), inline: true },
        { name: 'Last Command', value: formatLastCommand(stats.lastCommand), inline: false },
        { name: 'Most Used Command', value: formatMostUsedCommand(stats.mostUsedCommand), inline: false },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};
