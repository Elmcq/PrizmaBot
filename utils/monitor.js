const { ActivityType } = require('discord.js');
const server = require('../config/server.json');
const { createEmbed } = require('./embeds');
const { getBedrockStatus } = require('./minecraft');
const {
  formatCheckedTime,
  formatMotd,
  formatPlayers,
  formatStatusSource,
  formatVersion,
} = require('./statusFormat');
const logger = require('./logger');

const DEFAULT_MONITOR_INTERVAL_MS = 60000;
const OFFLINE_COLOR = 0xef4444;

function getMonitorIntervalMs() {
  return server.monitorIntervalMs || DEFAULT_MONITOR_INTERVAL_MS;
}

function setPresence(client, state) {
  const name = state.online
    ? `🟢 ${formatPlayers(state.response)} Players`
    : '🔴 Server Offline';

  client.user.setPresence({
    status: state.online ? 'online' : 'dnd',
    activities: [{ name, type: ActivityType.Watching }],
  });
}

async function getNotificationChannel(client) {
  if (!server.monitorChannelId) return null;

  const channel = await client.channels.fetch(server.monitorChannelId).catch((error) => {
    logger.error(`Failed to fetch monitor channel ${server.monitorChannelId}`, error);
    return null;
  });

  if (!channel?.isTextBased()) {
    logger.warn(`Monitor channel ${server.monitorChannelId} is not a text channel.`);
    return null;
  }

  return channel;
}

function createOnlineEmbed(state) {
  return createEmbed({
    title: `${server.name} Online`,
    description: 'Minecraft server is back **online**.',
    fields: [
      { name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false },
      { name: 'MOTD', value: formatMotd(state.response), inline: false },
      { name: 'Version', value: formatVersion(state.response), inline: true },
      { name: 'Players', value: formatPlayers(state.response), inline: true },
      { name: 'Source', value: formatStatusSource(state.response), inline: true },
      { name: 'Checked', value: formatCheckedTime(state.checkedAt), inline: false },
    ],
  });
}

function createOfflineEmbed(state) {
  return createEmbed({
    title: `${server.name} Offline`,
    description: 'Minecraft server is now **offline** or unreachable.',
    color: OFFLINE_COLOR,
    fields: [
      { name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false },
      { name: 'Checked', value: formatCheckedTime(state.checkedAt), inline: false },
    ],
  });
}

async function checkServer() {
  const checkedAt = new Date();

  try {
    const response = await getBedrockStatus();
    return { checkedAt, online: true, response };
  } catch (error) {
    return { checkedAt, error, online: false, response: null };
  }
}

function startServerMonitor(client) {
  const intervalMs = getMonitorIntervalMs();
  let previousOnline = null;
  let isChecking = false;

  async function runCheck() {
    if (isChecking) return;
    isChecking = true;

    try {
      const state = await checkServer();
      setPresence(client, state);

      if (state.error) {
        logger.warn(`Minecraft monitor check failed: ${state.error.message}`);
      }

      const changed = previousOnline !== null && previousOnline !== state.online;
      previousOnline = state.online;

      if (!changed) return;

      const channel = await getNotificationChannel(client);
      if (!channel) return;

      const embed = state.online ? createOnlineEmbed(state) : createOfflineEmbed(state);
      await channel.send({ embeds: [embed] });
    } catch (error) {
      logger.error('Minecraft monitor loop failed', error);
    } finally {
      isChecking = false;
    }
  }

  runCheck();
  const interval = setInterval(runCheck, intervalMs);

  logger.info(`Minecraft server monitor started with ${intervalMs}ms interval.`);

  return interval;
}

module.exports = {
  DEFAULT_MONITOR_INTERVAL_MS,
  startServerMonitor,
};
