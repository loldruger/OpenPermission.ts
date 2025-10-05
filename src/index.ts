import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import express from 'express';
import { commands } from './commands';
import { handleOpenCloseCommand } from './handlers/openCloseHandler';

// 필수 환경 변수 확인
const requiredEnvVars = ['DISCORD_TOKEN', 'CLIENT_ID', 'GUILD_ID', 'OPEN_ROLE_ID'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1); // 프로세스 종료
  }
}

// Create HTTP server for Cloud Run health checks
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    bot: client.user?.tag || 'Not logged in',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

// Bot ready event
client.once('ready', () => {
  console.log(`✅ Bot logged in as ${client.user?.tag}!`);
});

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'open' || commandName === 'close') {
    await handleOpenCloseCommand(interaction);
  }
});

// Register slash commands
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
      { body: commands },
    );

    console.log('✅ Successfully registered slash commands!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

// Start bot
registerCommands();
client.login(process.env.DISCORD_TOKEN);
