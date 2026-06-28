const { SlashCommandBuilder } = require('discord.js');
const server = require('../config/server.json');
const { createEmbed } = require('../utils/embeds');
const { getBedrockStatus, isTimeoutError } = require('../utils/minecraft');
const {
  formatCheckedTime,
  formatEdition,
  formatMotd,
  formatPlayers,
  formatStatusSource,
  formatVersion,
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

    try {
      const response = await getBedrockStatus();

      const embed = createEmbed({
        title: `${server.name} Server`,
        description: 'Server is **online**.',
        fields: [
          { name: 'Status', value: 'Online', inline: true },
          { name: 'Edition', value: formatEdition(response), inline: true },
          { name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false },
          { name: 'MOTD', value: formatMotd(response), inline: false },
          { name: 'Version', value: formatVersion(response), inline: true },
          { name: 'Players', value: formatPlayers(response), inline: true },
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
        title: `${server.name} Server`,
        description,
        color: 0xef4444,
        fields: [
          { name: 'Status', value: 'Offline', inline: true },
          { name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false },
          { name: 'Checked', value: formatCheckedTime(checkedAt), inline: false },
        ],
      });

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
