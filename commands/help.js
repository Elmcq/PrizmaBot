const { SlashCommandBuilder } = require('discord.js');
const server = require('../config/server.json');
const { createEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show Prizma command list.'),
  cooldown: 5,
  async execute(interaction) {
    const embed = createEmbed({
      title: `${server.botName} Help`,
      description: `Minecraft Bedrock utility commands for **${server.name}**.`,
      fields: [
        { name: '/about', value: 'Show bot, community, version, and uptime information.', inline: false },
        { name: '/changelog', value: 'Show the latest Prizma changelog.', inline: false },
        { name: '/help', value: 'Show this command list.', inline: false },
        { name: '/ip', value: 'Show the Minecraft Bedrock server IP and port.', inline: false },
        { name: '/ping', value: 'Show bot latency, Discord API latency, and uptime.', inline: false },
        { name: '/status', value: 'Check whether the server is online and show server details.', inline: false },
        { name: '/server', value: 'Show complete Minecraft Bedrock server information.', inline: false },
        { name: '/motd', value: 'Show the Minecraft server MOTD.', inline: false },
        { name: '/player', value: 'Show current player count and names if available.', inline: false },
        { name: '/rules', value: 'Show the server rules.', inline: false },
        { name: '/version', value: 'Show bot, runtime, Discord, and Minecraft server versions.', inline: false },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};
