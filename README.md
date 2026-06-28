# Ideology Prizmarine Bot

Official Discord bot for the Ideology Prizmarine Minecraft Bedrock community.

Current version: **v1.6.1**

## Features

- Minecraft Bedrock server status, MOTD, version, player count, and address utilities
- Automatic server monitoring with online/offline, player count, and version-change notifications
- Health diagnostics for Discord websocket ping, uptime, memory, Node.js, and Minecraft status
- Runtime statistics with in-memory command counts, success/error totals, and average duration
- Console command logging with user, channel, guild, result, timestamp, and error details
- Discord presence updates based on Minecraft server availability and player count
- mcstatus.io fallback when Bedrock UDP status checks are unavailable

## Commands

| Command | Description |
| --- | --- |
| `/about` | Show bot, version, community, and uptime information. |
| `/changelog` | Show the latest release notes. |
| `/health` | Show bot/system health and Minecraft server check details. |
| `/help` | Show the command list. |
| `/ip` | Show the Minecraft Bedrock server address and port. |
| `/motd` | Show the Minecraft server MOTD. |
| `/ping` | Show bot latency, Discord API latency, and uptime. |
| `/player` | Show current player count and names when available. |
| `/rules` | Show the server rules. |
| `/server` | Show complete Minecraft Bedrock server information. |
| `/stats` | Show startup runtime statistics and command usage. |
| `/status` | Show online/offline status, MOTD, version, and players. |
| `/uptime` | Show how long the bot has been online. |
| `/version` | Show bot, Node.js, discord.js, and Minecraft server versions. |

## Requirements

- Node.js 20 or newer
- Discord.js 14.26.4
- A Discord application with a bot token

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the project root:

```env
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_application_client_id_here
GUILD_ID=your_discord_server_guild_id_here
```

Configure the Minecraft server in `config/server.json`:

```json
{
  "name": "Ideology Prizmarine",
  "botName": "Prizma",
  "ip": "147.185.221.26",
  "port": 59177,
  "monitorChannelId": "",
  "monitorIntervalMs": 60000,
  "color": "#2dd4bf",
  "footer": "Ideology Prizmarine \u2022 v1.6.1"
}
```

Set `monitorChannelId` to a Discord text channel ID to enable monitor notifications. Leave it empty to update bot presence without sending monitor messages.

Startup validates `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`, and `config/server.json`. If anything is missing or invalid, the bot exits with a clear console message.

## Deploy Commands

Deploy slash commands to the configured guild:

```bash
npm run deploy
```

Run this after adding or changing slash commands so Discord registers the latest command list.

## Start Bot

```bash
npm start
```

When the bot starts, it prints a colored startup banner with the bot name, Discord.js version, Node.js version, guild count, loaded command count, and startup time.

## Monitoring

The bot automatically checks the configured Minecraft Bedrock server on the configured `monitorIntervalMs`. The monitor updates Discord presence with the current server state:

- Online: shows current player count
- Offline: shows server offline
- Checking/unavailable: shows checking state

If `monitorChannelId` is configured, the bot sends clean embed notifications when important values change, including online/offline state, player count, and Minecraft version. It avoids notification spam by only sending messages when monitored values actually change.

Server checks try the Bedrock UDP status ping first. If UDP is blocked or unavailable, the bot falls back to the mcstatus.io Bedrock HTTP API. Successful fallback warnings are rate-limited so they do not repeat every monitor interval; if both UDP and fallback fail, full error details are logged to the console.

## Project Structure

```text
.
|-- commands
|   |-- about.js
|   |-- changelog.js
|   |-- health.js
|   |-- help.js
|   |-- ip.js
|   |-- motd.js
|   |-- ping.js
|   |-- player.js
|   |-- rules.js
|   |-- server.js
|   |-- stats.js
|   |-- status.js
|   |-- uptime.js
|   `-- version.js
|-- config
|   `-- server.json
|-- events
|   |-- interactionCreate.js
|   `-- ready.js
|-- utils
|   |-- config.js
|   |-- embeds.js
|   |-- logger.js
|   |-- minecraft.js
|   |-- monitor.js
|   |-- stats.js
|   `-- statusFormat.js
|-- deploy-commands.js
|-- index.js
|-- package-lock.json
|-- package.json
`-- README.md
```

## Changelog

### v1.6.1

- Improved `/health` status indicator
- Improved `/stats` visibility
- Added per-command in-memory usage tracking
- Added last command and most-used command stats
- Reduced repeated mcstatus.io fallback warning spam

### v1.6.0

- Added `/health` command
- Added `/stats` command
- Added in-memory command statistics
- Improved operational visibility

### v1.5.1

- Added `/uptime` command
- Improved uptime formatting
- Reduced mcstatus.io fallback log spam
- Updated version metadata

## Notes

- Command errors are logged with full console details and return a safe user-facing error embed.
- Runtime statistics are kept in memory only and reset when the bot restarts.
- No database or persistent command log is used.
