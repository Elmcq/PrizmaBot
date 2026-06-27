const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.join(__dirname, '..');
const serverConfigPath = path.join(rootDir, 'config', 'server.json');

function failConfig(message) {
  console.error(`\x1b[31m[CONFIG]\x1b[0m ${message}`);
  process.exit(1);
}

function validateEnv(requiredKeys) {
  const missing = requiredKeys.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    failConfig(`Missing required environment variable(s): ${missing.join(', ')}`);
  }
}

function validateServerConfig() {
  if (!fs.existsSync(serverConfigPath)) {
    failConfig('Missing config/server.json');
  }

  let server;

  try {
    server = JSON.parse(fs.readFileSync(serverConfigPath, 'utf8'));
  } catch (error) {
    failConfig(`config/server.json is not valid JSON: ${error.message}`);
  }

  const requiredFields = ['name', 'botName', 'ip', 'port', 'color', 'footer'];
  const missingFields = requiredFields.filter((field) => server[field] === undefined || server[field] === '');

  if (missingFields.length > 0) {
    failConfig(`config/server.json is missing required field(s): ${missingFields.join(', ')}`);
  }

  if (!Number.isInteger(server.port) || server.port < 1 || server.port > 65535) {
    failConfig('config/server.json port must be an integer between 1 and 65535');
  }

  return server;
}

function validateStartupConfig() {
  validateEnv(['DISCORD_TOKEN', 'CLIENT_ID', 'GUILD_ID']);
  return validateServerConfig();
}

module.exports = {
  serverConfigPath,
  validateEnv,
  validateServerConfig,
  validateStartupConfig,
};
