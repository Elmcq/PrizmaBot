const { EmbedBuilder } = require('discord.js');
const server = require('../config/server.json');

function createEmbed({ title, description, color = server.color, fields = [] } = {}) {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setAuthor({ name: server.botName })
    .setTimestamp()
    .setFooter({ text: server.footer });

  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (fields.length > 0) embed.addFields(fields);

  return embed;
}

function createErrorEmbed(description = 'Something went wrong while running this command.') {
  return createEmbed({
    title: 'Command Error',
    description,
    color: 0xef4444,
  });
}

module.exports = {
  createEmbed,
  createErrorEmbed,
};
