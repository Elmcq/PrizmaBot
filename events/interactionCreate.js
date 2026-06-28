const { Events, Collection } = require('discord.js');
const { createErrorEmbed } = require('../utils/embeds');
const logger = require('../utils/logger');

const SAFE_COMMAND_ERROR = '⚠️ Command failed. Please try again later.';

async function sendSafeError(interaction, embed) {
  try {
    if (interaction.deferred && !interaction.replied) {
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (interaction.replied) {
      await interaction.followUp({ embeds: [embed], ephemeral: true });
      return;
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    logger.error('Failed to send safe command error response', error);
  }
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    const startedAt = Date.now();

    if (!command) {
      logger.warn(`No command matching ${interaction.commandName} was found.`);
      logger.command(interaction, Date.now() - startedAt, {
        success: false,
        errorMessage: 'Command not found',
      });
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
        logger.command(interaction, Date.now() - startedAt, {
          success: false,
          errorMessage: 'Cooldown active',
        });
        await interaction.reply({
          content: `Please wait before using \`/${command.data.name}\` again. You can use it <t:${expiredTimestamp}:R>.`,
          ephemeral: true,
        });
        return;
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction);
      logger.command(interaction, Date.now() - startedAt, { success: true });
    } catch (error) {
      logger.error(`Error executing /${interaction.commandName}`, error);
      logger.command(interaction, Date.now() - startedAt, {
        success: false,
        errorMessage: error.message || 'Unknown error',
      });
      await sendSafeError(
        interaction,
        createErrorEmbed(SAFE_COMMAND_ERROR),
      );
    }
  },
};
