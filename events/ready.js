const { Events } = require('discord.js');
const server = require('../config/server.json');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`${server.botName} is online as ${client.user.tag}.`);
  },
};
