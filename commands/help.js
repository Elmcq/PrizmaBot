const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const server = require('../config/server.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show Prizma command list.'),
  cooldown: 5,
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(server.color)
      .setTitle(`${server.botName} Help`)
      .setDescription(`Minecraft Bedrock utility commands for **${server.name}**.`)
      .addFields(
        { name: '/help', value: 'Show this command list.', inline: false },
        { name: '/ip', value: 'Show the Minecraft Bedrock server IP and port.', inline: false },
        { name: '/status', value: 'Check whether the server is online and show server details.', inline: false },
        { name: '/player', value: 'Show current player count and names if available.', inline: false },
        { name: '/rules', value: 'Show the server rules.', inline: false },
      )
      .setTimestamp()
      .setFooter({ text: server.footer });

    await interaction.reply({ embeds: [embed] });
  },
};
