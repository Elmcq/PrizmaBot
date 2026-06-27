const { SlashCommandBuilder } = require('discord.js');
const server = require('../config/server.json');
const { createEmbed } = require('../utils/embeds');
const { getBedrockStatus, isTimeoutError } = require('../utils/minecraft');
const logger = require('../utils/logger');

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
      const response = await getBedrockStatus();
      const players = getPlayerSummary(response);

      const embed = createEmbed({
        title: `${server.name} Players`,
        description: 'Current Minecraft Bedrock player information.',
        fields: [{ name: 'Players Online', value: players.count, inline: true }],
      });

      if (players.names) {
        embed.addFields({ name: 'Player Names', value: players.names, inline: false });
      } else {
        embed.addFields({ name: 'Player Names', value: 'Player names are unavailable from the server ping.', inline: false });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      logger.error('Failed to fetch Bedrock player information', error);

      const description = isTimeoutError(error)
        ? 'Minecraft server did not respond.'
        : 'Server is currently offline or under maintenance.';

      const embed = createEmbed({
        title: `${server.name} Players`,
        description,
        color: 0xef4444,
        fields: [{ name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false }],
      });

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
