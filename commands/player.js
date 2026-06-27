const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { statusBedrock } = require('minecraft-server-util');
const server = require('../config/server.json');

function getPlayerSummary(response) {
  const online = response.players?.online ?? response.onlinePlayers ?? 'Unknown';
  const max = response.players?.max ?? response.maxPlayers ?? 'Unknown';
  const names = response.players?.list || response.players?.sample || response.playerList || [];

  if (Array.isArray(names) && names.length > 0) {
    const cleanNames = names
      .map((player) => {
        if (typeof player === 'string') return player;
        return player.name || player.username || null;
      })
      .filter(Boolean);

    if (cleanNames.length > 0) {
      return {
        count: `${online} / ${max}`,
        names: cleanNames.join(', '),
      };
    }
  }

  return {
    count: `${online} / ${max}`,
    names: null,
  };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('player')
    .setDescription('Show current server player information.'),
  cooldown: 15,
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const response = await statusBedrock(server.ip, server.port, {
        timeout: 5000,
        enableSRV: false,
      });
      const players = getPlayerSummary(response);

      const embed = new EmbedBuilder()
        .setColor(server.color)
        .setTitle(`${server.name} Players`)
        .setDescription('Current Minecraft Bedrock player information.')
        .addFields({ name: 'Players Online', value: players.count, inline: true })
        .setTimestamp()
        .setFooter({ text: server.footer });

      if (players.names) {
        embed.addFields({ name: 'Player Names', value: players.names, inline: false });
      } else {
        embed.addFields({ name: 'Player Names', value: 'Player names are unavailable from the server ping.', inline: false });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Failed to fetch Bedrock player information:', error);

      const embed = new EmbedBuilder()
        .setColor(0xef4444)
        .setTitle(`${server.name} Players`)
        .setDescription('Server is **offline** or player information is unavailable right now.')
        .addFields({ name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false })
        .setTimestamp()
        .setFooter({ text: server.footer });

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
