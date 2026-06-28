const { SlashCommandBuilder } = require('discord.js');
const server = require('../config/server.json');
const { createEmbed } = require('../utils/embeds');
const { getBedrockStatus, isTimeoutError } = require('../utils/minecraft');
const logger = require('../utils/logger');

function formatMotd(response) {
  if (typeof response.motd === 'string') return response.motd;
  if (response.motd?.clean) return response.motd.clean;
  if (response.motd?.raw) return response.motd.raw;
  return 'Unavailable';
}

function formatVersion(response) {
  return response.version?.name || response.version || 'Unavailable';
}

function formatPlayers(response) {
  const online = response.players?.online ?? response.onlinePlayers ?? 'Unknown';
  const max = response.players?.max ?? response.maxPlayers ?? 'Unknown';
  return `${online} / ${max}`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check the Minecraft Bedrock server status.'),
  cooldown: 15,
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const response = await getBedrockStatus();

      const embed = createEmbed({
        title: 'Server Status',
        description: 'Server is **online**.',
        fields: [
          { name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false },
          { name: 'MOTD', value: formatMotd(response), inline: false },
          { name: 'Version', value: formatVersion(response), inline: true },
          { name: 'Players', value: formatPlayers(response), inline: true },
        ],
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      logger.error('Failed to ping Bedrock server', error);

      const description = isTimeoutError(error)
        ? 'Minecraft server did not respond.'
        : 'Server is currently offline or under maintenance.';

      const embed = createEmbed({
        title: 'Server Status',
        description,
        color: 0xef4444,
        fields: [
          { name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false },
        ],
      });

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
