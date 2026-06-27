const { SlashCommandBuilder } = require('discord.js');
const server = require('../config/server.json');
const { createEmbed } = require('../utils/embeds');

const rules = [
  'No griefing',
  'No stealing',
  'No cheating/hack/X-ray',
  'No toxic/drama berlebihan',
  'Respect admin/member',
  'Baca pengumuman',
  'Have fun',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Show the Ideology Prizmarine server rules.'),
  cooldown: 5,
  async execute(interaction) {
    const embed = createEmbed({
      title: `${server.name} Rules`,
      description: rules.map((rule, index) => `**${index + 1}.** ${rule}`).join('\n'),
    });

    await interaction.reply({ embeds: [embed] });
  },
};
