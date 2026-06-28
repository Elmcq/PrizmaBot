const { statusBedrock } = require('minecraft-server-util');
const server = require('../config/server.json');

const MINECRAFT_TIMEOUT_MS = 5000;

function isTimeoutError(error) {
  const message = String(error?.message || '').toLowerCase();
  return error?.code === 'MINECRAFT_TIMEOUT'
    || error?.code === 'ETIMEDOUT'
    || error?.name === 'AbortError'
    || message.includes('timed out')
    || message.includes('timeout');
}

async function getBedrockStatus() {
  let timeoutId;

  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const error = new Error('Minecraft server did not respond.');
      error.code = 'MINECRAFT_TIMEOUT';
      reject(error);
    }, MINECRAFT_TIMEOUT_MS);
  });

  try {
    return await Promise.race([
      statusBedrock(server.ip, server.port, {
        timeout: MINECRAFT_TIMEOUT_MS,
        enableSRV: false,
      }),
      timeout,
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = {
  MINECRAFT_TIMEOUT_MS,
  getBedrockStatus,
  isTimeoutError,
};
