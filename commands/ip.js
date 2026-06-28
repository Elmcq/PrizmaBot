const { SlashCommandBuilder } = require('discord.js');
const server = require('../config/server.json');
const { createEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Show the Minecraft Bedrock server address.'),
  cooldown: 5,
  async execute(interaction) {
    const embed = createEmbed({
      title: 'Server Address',
      fields: [
        { name: 'IP', value: `\`${server.ip}\``, inline: true },
        { name: 'Port', value: `\`${server.port}\``, inline: true },
        { name: 'Edition', value: 'Minecraft Bedrock', inline: true },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};
