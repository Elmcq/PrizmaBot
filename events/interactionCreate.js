const { Events, Collection } = require('discord.js');
const { createErrorEmbed } = require('../utils/embeds');
const logger = require('../utils/logger');

async function sendSafeError(interaction, embed) {
  if (interaction.deferred || interaction.replied) {
    await interaction.followUp({ embeds: [embed], ephemeral: true });
    return;
  }

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      logger.warn(`No command matching ${interaction.commandName} was found.`);
      await sendSafeError(interaction, createErrorEmbed('Command not found.'));
      return;
    }

    const { cooldowns } = interaction.client;

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 5;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        await interaction.reply({
          content: `Please wait before using \`/${command.data.name}\` again. You can use it <t:${expiredTimestamp}:R>.`,
          ephemeral: true,
        });
        return;
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    const startedAt = Date.now();

    try {
      await command.execute(interaction);
      logger.command(interaction, Date.now() - startedAt);
    } catch (error) {
      logger.error(`Error executing /${interaction.commandName}`, error);
      logger.command(interaction, Date.now() - startedAt, true);
      await sendSafeError(
        interaction,
        createErrorEmbed('Sorry, that command failed unexpectedly. Please try again in a moment.'),
      );
    }
  },
};
