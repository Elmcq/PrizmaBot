# Prizma Bot

Prizma is a Discord.js v14 Minecraft Bedrock utility bot for Ideology Prizmarine.

## Commands

- `/help` - Show all commands.
- `/ip` - Show the Minecraft Bedrock server IP and port.
- `/status` - Show online/offline status, MOTD, version, and player count.
- `/player` - Show player count and player names if available.
- `/rules` - Show server rules.

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
  "color": "#2dd4bf",
  "footer": "Prizma - Ideology Prizmarine"
}
```

Startup validates `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`, and `config/server.json`. If anything is missing or invalid, the bot exits with a clear console message.

## Deploy Commands

Deploy the existing slash commands to the configured guild:

```bash
npm run deploy
```

## Start Bot

```bash
npm start
```

When the bot starts, it prints a colored startup banner with the bot name, Discord.js version, Node.js version, guild count, loaded command count, and startup time.

## Folder Structure

```text
.
|-- commands
|   |-- help.js
|   |-- ip.js
|   |-- player.js
|   |-- rules.js
|   `-- status.js
|-- config
|   `-- server.json
|-- events
|   |-- interactionCreate.js
|   `-- ready.js
|-- utils
|   |-- config.js
|   |-- embeds.js
|   |-- logger.js
|   `-- minecraft.js
|-- deploy-commands.js
|-- index.js
|-- package-lock.json
|-- package.json
`-- README.md
```

## Notes

- No new slash commands are added in this release.
- `/status` and `/player` try the Bedrock UDP status ping first, then fall back to the mcstatus.io Bedrock HTTP API if UDP is blocked by the runtime environment.
- Both the UDP status ping and HTTP fallback cap Minecraft server checks at 5 seconds.
- Command errors are logged with stack traces and return a friendly embed instead of crashing the bot.
