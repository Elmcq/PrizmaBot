# Prizma

Prizma is a Discord.js v14 Minecraft Bedrock utility bot for Ideology Prizmarine.

## Features

- Slash commands
- Modular command and event structure
- Discord embeds
- Cooldowns
- Basic error handling
- Minecraft Bedrock server status ping

## Commands

- `/help` - Show all commands.
- `/ip` - Show the Minecraft Bedrock server IP and port.
- `/status` - Show online/offline status, MOTD, version, and player count.
- `/player` - Show player count and player names if available.
- `/rules` - Show server rules.

## Server

- IP: `147.185.221.26`
- Port: `59177`
- Edition: Minecraft Bedrock

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your Discord bot credentials:

```env
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_application_client_id_here
GUILD_ID=your_discord_server_guild_id_here
```

3. Deploy slash commands to your Discord guild:

```bash
npm run deploy
```

4. Start the bot:

```bash
npm start
```

## Discord Bot Setup Notes

- Enable the bot application in the Discord Developer Portal.
- Invite the bot with the `bot` and `applications.commands` scopes.
- The bot only needs basic slash command permissions for these commands.

## Project Structure

```text
.
├── commands
│   ├── help.js
│   ├── ip.js
│   ├── player.js
│   ├── rules.js
│   └── status.js
├── config
│   └── server.json
├── events
│   ├── interactionCreate.js
│   └── ready.js
├── .env.example
├── deploy-commands.js
├── index.js
├── package.json
└── README.md
```

## Rules

1. No griefing
2. No stealing
3. No cheating/hack/X-ray
4. No toxic/drama berlebihan
5. Respect admin/member
6. Baca pengumuman
7. Have fun
