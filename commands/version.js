const { SlashCommandBuilder, version: discordVersion } = require('discord.js');
const { createEmbed } = require('../utils/embeds');
const { getBedrockStatus } = require('../utils/minecraft');
const { formatVersion } = require('../utils/statusFormat');
const logger = require('../utils/logger');

const BOT_VERSION = 'v1.5.0';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('version')
    .setDescription('Show Prizma runtime and server versions.'),
  cooldown: 15,
  async execute(interaction) {
    await interaction.deferReply();

    let minecraftVersion = 'Unavailable';

    try {
      const response = await getBedrockStatus();
      minecraftVersion = formatVersion(response);
    } catch (error) {
      logger.warn(`Unable to fetch Minecraft server version for /version: ${error.message}`);
    }

    const embed = createEmbed({
      title: 'Prizma Version',
      fields: [
        { name: 'Bot Version', value: BOT_VERSION, inline: true },
        { name: 'Node.js', value: process.version, inline: true },
        { name: 'discord.js', value: discordVersion, inline: true },
        { name: 'Minecraft Server', value: minecraftVersion, inline: true },
      ],
    });

    await interaction.editReply({ embeds: [embed] });
  },
};
