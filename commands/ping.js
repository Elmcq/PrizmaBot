const { SlashCommandBuilder } = require('discord.js');
const server = require('../config/server.json');
const { createEmbed } = require('../utils/embeds');
const { formatDuration } = require('../utils/statusFormat');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Show Prizma latency and uptime.'),
  cooldown: 5,
  async execute(interaction) {
    await interaction.deferReply();

    const botLatency = Date.now() - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);
    const uptime = formatDuration(interaction.client.uptime ?? process.uptime() * 1000);

    const embed = createEmbed({
      title: `${server.botName} Ping`,
      fields: [
        { name: 'Bot Latency', value: `\`${botLatency}ms\``, inline: true },
        { name: 'Discord API', value: `\`${apiLatency}ms\``, inline: true },
        { name: 'Uptime', value: `\`${uptime}\``, inline: true },
      ],
    });

    await interaction.editReply({ embeds: [embed] });
  },
};
