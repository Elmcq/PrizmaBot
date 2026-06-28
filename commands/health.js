const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embeds');
const { getBedrockStatus } = require('../utils/minecraft');
const {
  formatDuration,
  formatLatency,
  formatPlayers,
  formatStatusSource,
  formatVersion,
} = require('../utils/statusFormat');
const logger = require('../utils/logger');

const BOT_VERSION = 'v1.6.1';

function getMemoryUsage() {
  const memory = process.memoryUsage();
  return {
    heapUsedMb: memory.heapUsed / 1024 / 1024,
    rssMb: memory.rss / 1024 / 1024,
  };
}

function formatMemoryUsage(memory) {
  return `${memory.heapUsedMb.toFixed(1)} MB heap / ${memory.rssMb.toFixed(1)} MB RSS`;
}

function getOverallStatus({ discordPing, memory, minecraftOnline }) {
  if (!minecraftOnline || discordPing >= 1000 || memory.heapUsedMb >= 512 || memory.rssMb >= 1024) {
    return '🔴 Critical';
  }

  if (discordPing >= 250 || memory.heapUsedMb >= 256 || memory.rssMb >= 512) {
    return '🟡 Warning';
  }

  return '🟢 Healthy';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('health')
    .setDescription('Show bot and Minecraft server health.'),
  cooldown: 15,
  async execute(interaction) {
    await interaction.deferReply();

    const startedAt = Date.now();
    let minecraftStatus = 'Unavailable';
    let minecraftLatency = 'Unavailable';
    let minecraftSource = 'Unavailable';
    let minecraftVersion = 'Unavailable';
    let minecraftPlayers = 'Unavailable';
    let minecraftOnline = false;

    try {
      const response = await getBedrockStatus();
      minecraftStatus = 'Online';
      minecraftOnline = true;
      minecraftLatency = formatLatency(Date.now() - startedAt);
      minecraftSource = formatStatusSource(response);
      minecraftVersion = formatVersion(response);
      minecraftPlayers = formatPlayers(response);
    } catch (error) {
      logger.warn(`Unable to fetch Minecraft server health for /health: ${error.message}`);
      minecraftLatency = formatLatency(Date.now() - startedAt);
    }

    const discordPing = Math.round(interaction.client.ws.ping);
    const memory = getMemoryUsage();
    const overallStatus = getOverallStatus({ discordPing, memory, minecraftOnline });

    const embed = createEmbed({
      title: 'Health Check',
      fields: [
        { name: 'Overall', value: overallStatus, inline: true },
        { name: 'Bot Version', value: BOT_VERSION, inline: true },
        { name: 'Discord WebSocket', value: `\`${discordPing}ms\``, inline: true },
        { name: 'Bot Uptime', value: `\`${formatDuration(interaction.client.uptime ?? process.uptime() * 1000)}\``, inline: true },
        { name: 'Node.js', value: process.version, inline: true },
        { name: 'Memory', value: formatMemoryUsage(memory), inline: false },
        { name: 'Minecraft Status', value: minecraftStatus, inline: true },
        { name: 'Minecraft Latency', value: minecraftLatency, inline: true },
        { name: 'Minecraft Source', value: minecraftSource, inline: true },
        { name: 'Minecraft Version', value: minecraftVersion, inline: true },
        { name: 'Players', value: minecraftPlayers, inline: true },
      ],
    });

    await interaction.editReply({ embeds: [embed] });
  },
};
