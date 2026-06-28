const { SlashCommandBuilder } = require('discord.js');
const server = require('../config/server.json');
const { createEmbed } = require('../utils/embeds');
const { getBedrockStatus, isTimeoutError } = require('../utils/minecraft');
const {
  formatCheckedTime,
  formatEdition,
  formatLatency,
  formatMotd,
  formatStatusSource,
  formatVersion,
  getMaxPlayers,
  getOnlinePlayers,
} = require('../utils/statusFormat');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Show complete Minecraft Bedrock server information.'),
  cooldown: 15,
  async execute(interaction) {
    await interaction.deferReply();

    const checkedAt = new Date();
    const startedAt = Date.now();

    try {
      const response = await getBedrockStatus();
      const latency = Date.now() - startedAt;

      const embed = createEmbed({
        title: 'Minecraft Server',
        description: 'Server is **online**.',
        fields: [
          { name: 'Status', value: 'Online', inline: true },
          { name: 'Edition', value: formatEdition(response), inline: true },
          { name: 'Address', value: `\`${server.ip}\``, inline: true },
          { name: 'Port', value: `\`${server.port}\``, inline: true },
          { name: 'MOTD', value: formatMotd(response), inline: false },
          { name: 'Online Players', value: String(getOnlinePlayers(response) ?? 'Unavailable'), inline: true },
          { name: 'Max Players', value: String(getMaxPlayers(response) ?? 'Unavailable'), inline: true },
          { name: 'Minecraft Version', value: formatVersion(response), inline: true },
          { name: 'Latency', value: formatLatency(latency), inline: true },
          { name: 'Source', value: formatStatusSource(response), inline: true },
          { name: 'Checked', value: formatCheckedTime(checkedAt), inline: false },
        ],
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      logger.error('Failed to fetch complete Bedrock server information', error);

      const description = isTimeoutError(error)
        ? 'Minecraft server did not respond.'
        : 'Server is currently offline or under maintenance.';

      const embed = createEmbed({
        title: 'Minecraft Server',
        description,
        color: 0xef4444,
        fields: [
          { name: 'Status', value: 'Offline', inline: true },
          { name: 'Address', value: `\`${server.ip}\``, inline: true },
          { name: 'Port', value: `\`${server.port}\``, inline: true },
          { name: 'Checked', value: formatCheckedTime(checkedAt), inline: false },
        ],
      });

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
