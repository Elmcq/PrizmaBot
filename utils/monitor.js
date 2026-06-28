const { ActivityType } = require('discord.js');
const server = require('../config/server.json');
const { createEmbed } = require('./embeds');
const { getBedrockStatus, isTimeoutError } = require('./minecraft');
const {
  formatCheckedTime,
  formatLatency,
  formatMotd,
  formatPlayers,
  formatStatusSource,
  formatVersion,
  getMaxPlayers,
  getOnlinePlayers,
} = require('./statusFormat');
const logger = require('./logger');

const DEFAULT_MONITOR_INTERVAL_MS = 60000;
const OFFLINE_COLOR = 0xef4444;

function getMonitorIntervalMs() {
  return server.monitorIntervalMs || DEFAULT_MONITOR_INTERVAL_MS;
}

function setPresence(client, state) {
  let name = '\uD83D\uDFE1 Checking server';
  let status = 'idle';

  if (state?.online) {
    name = `\uD83D\uDFE2 ${formatPlayers(state.response)} players`;
    status = 'online';
  } else if (state?.status === 'offline') {
    name = '\uD83D\uDD34 Server offline';
    status = 'dnd';
  }

  client.user.setPresence({
    status,
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
    title: 'Server Online',
    description: 'Minecraft server is back **online**.',
    fields: [
      { name: 'Status', value: 'Online', inline: true },
      { name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false },
      { name: 'MOTD', value: formatMotd(state.response), inline: false },
      { name: 'Version', value: formatVersion(state.response), inline: true },
      { name: 'Players', value: formatPlayers(state.response), inline: true },
      { name: 'Latency', value: formatLatency(state.latencyMs), inline: true },
      { name: 'Source', value: formatStatusSource(state.response), inline: true },
      { name: 'Checked', value: formatCheckedTime(state.checkedAt), inline: false },
    ],
  });
}

function createOfflineEmbed(state) {
  return createEmbed({
    title: 'Server Offline',
    description: 'Minecraft server is now **offline** or unreachable.',
    color: OFFLINE_COLOR,
    fields: [
      { name: 'Status', value: 'Offline', inline: true },
      { name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false },
      { name: 'Checked', value: formatCheckedTime(state.checkedAt), inline: false },
    ],
  });
}

function createPlayerChangeEmbed(state, previousSnapshot) {
  return createEmbed({
    title: 'Player Count Changed',
    description: 'Minecraft server player count changed.',
    fields: [
      { name: 'Previous', value: previousSnapshot.playersLabel, inline: true },
      { name: 'Current', value: formatPlayers(state.response), inline: true },
      { name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false },
      { name: 'Checked', value: formatCheckedTime(state.checkedAt), inline: false },
    ],
  });
}

function createVersionChangeEmbed(state, previousSnapshot) {
  return createEmbed({
    title: 'Version Changed',
    description: 'Minecraft server version changed.',
    fields: [
      { name: 'Previous', value: previousSnapshot.version, inline: true },
      { name: 'Current', value: formatVersion(state.response), inline: true },
      { name: 'Address', value: `\`${server.ip}:${server.port}\``, inline: false },
      { name: 'Checked', value: formatCheckedTime(state.checkedAt), inline: false },
    ],
  });
}

async function checkServer() {
  const checkedAt = new Date();
  const startedAt = Date.now();

  try {
    const response = await getBedrockStatus();

    return {
      checkedAt,
      latencyMs: Date.now() - startedAt,
      online: true,
      response,
      status: 'online',
    };
  } catch (error) {
    return {
      checkedAt,
      error,
      latencyMs: Date.now() - startedAt,
      online: false,
      response: null,
      status: isTimeoutError(error) ? 'unknown' : 'offline',
    };
  }
}

function createSnapshot(state) {
  if (!state.online) {
    return {
      online: false,
      playersLabel: 'Unavailable',
      status: state.status,
      version: 'Unavailable',
    };
  }

  return {
    maxPlayers: getMaxPlayers(state.response),
    online: true,
    onlinePlayers: getOnlinePlayers(state.response),
    playersLabel: formatPlayers(state.response),
    status: state.status,
    version: formatVersion(state.response),
  };
}

function getNotificationEmbeds(state, previousSnapshot) {
  if (!previousSnapshot) return [];

  if (previousSnapshot.online !== state.online) {
    return [state.online ? createOnlineEmbed(state) : createOfflineEmbed(state)];
  }

  if (!state.online) return [];

  const currentSnapshot = createSnapshot(state);
  const embeds = [];

  if (previousSnapshot.onlinePlayers !== currentSnapshot.onlinePlayers
    || previousSnapshot.maxPlayers !== currentSnapshot.maxPlayers) {
    embeds.push(createPlayerChangeEmbed(state, previousSnapshot));
  }

  if (previousSnapshot.version !== currentSnapshot.version) {
    embeds.push(createVersionChangeEmbed(state, previousSnapshot));
  }

  return embeds;
}

function startServerMonitor(client) {
  const intervalMs = getMonitorIntervalMs();
  let previousSnapshot = null;
  let isChecking = false;

  async function runCheck() {
    if (isChecking) return;
    isChecking = true;

    try {
      setPresence(client, { online: false, status: 'unknown' });

      const state = await checkServer();
      setPresence(client, state);

      if (state.error) {
        logger.warn(`Minecraft monitor check failed: ${state.error.message}`);
      }

      const embeds = getNotificationEmbeds(state, previousSnapshot);
      previousSnapshot = createSnapshot(state);

      if (embeds.length === 0) return;

      const channel = await getNotificationChannel(client);
      if (!channel) return;

      for (const embed of embeds) {
        await channel.send({ embeds: [embed] });
      }
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
