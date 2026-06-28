const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('changelog')
    .setDescription('Show the latest Prizma changelog.'),
  cooldown: 5,
  async execute(interaction) {
    const embed = createEmbed({
      title: 'Changelog - v1.5.0 Phase 1',
      description: [
        '- Fixed /about command',
        '- Added /version command',
        '- Added /changelog command',
        '- Improved embed consistency',
      ].join('\n'),
    });

    await interaction.reply({ embeds: [embed] });
  },
};
