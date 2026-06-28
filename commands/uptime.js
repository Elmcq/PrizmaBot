const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embeds');
const { formatDuration } = require('../utils/statusFormat');

const BOT_VERSION = 'v1.6.1';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Show how long the bot has been online.'),
  cooldown: 5,
  async execute(interaction) {
    const uptime = formatDuration(interaction.client.uptime ?? process.uptime() * 1000);

    const embed = createEmbed({
      title: 'Uptime',
      fields: [
        { name: 'Uptime', value: `\`${uptime}\``, inline: true },
        { name: 'Bot Version', value: BOT_VERSION, inline: true },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};
