const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const server = require('../config/server.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Show the Minecraft Bedrock server address.'),
  cooldown: 5,
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(server.color)
      .setTitle(`${server.name} Server IP`)
      .addFields(
        { name: 'IP', value: `\`${server.ip}\``, inline: true },
        { name: 'Port', value: `\`${server.port}\``, inline: true },
        { name: 'Edition', value: 'Minecraft Bedrock', inline: true },
      )
      .setTimestamp()
      .setFooter({ text: server.footer });

    await interaction.reply({ embeds: [embed] });
  },
};
