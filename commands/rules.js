const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const server = require('../config/server.json');

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
    const embed = new EmbedBuilder()
      .setColor(server.color)
      .setTitle(`${server.name} Rules`)
      .setDescription(rules.map((rule, index) => `**${index + 1}.** ${rule}`).join('\n'))
      .setTimestamp()
      .setFooter({ text: server.footer });

    await interaction.reply({ embeds: [embed] });
  },
};
