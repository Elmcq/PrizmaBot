const { SlashCommandBuilder } = require('discord.js');
const server = require('../config/server.json');
const { EMBED_AUTHOR_NAME, createEmbed } = require('../utils/embeds');
const { formatDuration } = require('../utils/statusFormat');

const BOT_VERSION = 'v1.6.1';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Show information about the bot.'),
  cooldown: 5,
  async execute(interaction) {
    const uptime = formatDuration(interaction.client.uptime ?? process.uptime() * 1000);

    const embed = createEmbed({
      title: 'About',
      description: `Official Minecraft Bedrock utility bot for the **${server.name}** community.`,
      fields: [
        { name: 'Bot', value: EMBED_AUTHOR_NAME, inline: true },
        { name: 'Version', value: BOT_VERSION, inline: true },
        { name: 'Owner / Community', value: server.name, inline: true },
        { name: 'Uptime', value: `\`${uptime}\``, inline: true },
        {
          name: 'About',
          value: 'Check server status, MOTD, latency, player counts, and server details directly from Discord.',
          inline: false,
        },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};
