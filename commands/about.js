const { SlashCommandBuilder } = require('discord.js');
const server = require('../config/server.json');
const { createEmbed } = require('../utils/embeds');
const { formatDuration } = require('../utils/statusFormat');

const BOT_VERSION = 'v1.5.0';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Show information about Prizma.'),
  cooldown: 5,
  async execute(interaction) {
    const uptime = formatDuration(interaction.client.uptime ?? process.uptime() * 1000);

    const embed = createEmbed({
      title: server.botName,
      description: `Minecraft Bedrock utility bot for **${server.name}**.`,
      fields: [
        { name: 'Bot', value: server.botName, inline: true },
        { name: 'Version', value: BOT_VERSION, inline: true },
        { name: 'Owner / Community', value: server.name, inline: true },
        { name: 'Uptime', value: `\`${uptime}\``, inline: true },
        {
          name: 'About',
          value: 'Prizma helps the Ideology Prizmarine community check server status, MOTD, latency, and server details from Discord.',
          inline: false,
        },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};
