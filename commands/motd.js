const { SlashCommandBuilder } = require('discord.js');
const server = require('../config/server.json');
const { createEmbed } = require('../utils/embeds');
const { getBedrockStatus, isTimeoutError } = require('../utils/minecraft');
const { formatCheckedTime, formatMotd } = require('../utils/statusFormat');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motd')
    .setDescription('Show the Minecraft Bedrock server MOTD.'),
  cooldown: 15,
  async execute(interaction) {
    await interaction.deferReply();

    const checkedAt = new Date();

    try {
      const response = await getBedrockStatus();

      const embed = createEmbed({
        title: `${server.name} MOTD`,
        description: formatMotd(response),
        fields: [
          { name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false },
          { name: 'Checked', value: formatCheckedTime(checkedAt), inline: false },
        ],
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      logger.error('Failed to fetch Bedrock server MOTD', error);

      const description = isTimeoutError(error)
        ? 'Minecraft server did not respond.'
        : 'Server is currently offline or under maintenance.';

      const embed = createEmbed({
        title: `${server.name} MOTD`,
        description,
        color: 0xef4444,
        fields: [
          { name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false },
          { name: 'Checked', value: formatCheckedTime(checkedAt), inline: false },
        ],
      });

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
