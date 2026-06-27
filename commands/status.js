const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { statusBedrock } = require('minecraft-server-util');
const server = require('../config/server.json');

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
      const response = await statusBedrock(server.ip, server.port, {
        timeout: 5000,
        enableSRV: false,
      });

      const embed = new EmbedBuilder()
        .setColor(server.color)
        .setTitle(`${server.name} Status`)
        .setDescription('Server is **online**.')
        .addFields(
          { name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false },
          { name: 'MOTD', value: formatMotd(response), inline: false },
          { name: 'Version', value: formatVersion(response), inline: true },
          { name: 'Players', value: formatPlayers(response), inline: true },
        )
        .setTimestamp()
        .setFooter({ text: server.footer });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Failed to ping Bedrock server:', error);

      const embed = new EmbedBuilder()
        .setColor(0xef4444)
        .setTitle(`${server.name} Status`)
        .setDescription('Server is **offline** or unreachable right now.')
        .addFields(
          { name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false },
          { name: 'Details', value: 'Please try again later.', inline: false },
        )
        .setTimestamp()
        .setFooter({ text: server.footer });

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
