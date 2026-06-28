const { ActivityType, Events, version } = require('discord.js');
const server = require('../config/server.json');
const logger = require('../utils/logger');
const { startServerMonitor } = require('../utils/monitor');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    client.user.setPresence({
      status: 'online',
      activities: [{ name: server.name, type: ActivityType.Watching }],
    });

    logger.info(`${server.botName} is online as ${client.user.tag}.`);
    logger.banner({
      botName: server.botName,
      discordVersion: version,
      nodeVersion: process.version,
      guildCount: client.guilds.cache.size,
      commandCount: client.commands.size,
      startupTimeMs: Date.now() - client.startupStartedAt,
    });

    client.serverMonitor = startServerMonitor(client);
  },
};
