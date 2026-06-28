const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('changelog')
    .setDescription('Show the latest bot changelog.'),
  cooldown: 5,
  async execute(interaction) {
    const embed = createEmbed({
      title: 'Changelog',
      description: [
        '- Improved /health status indicator',
        '- Improved /stats visibility',
        '- Added per-command in-memory usage tracking',
        '- Added last command and most-used command stats',
      ].join('\n'),
    });

    await interaction.reply({ embeds: [embed] });
  },
};
