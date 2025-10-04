import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { commands } from './commands';
import { handleRoleCommand } from './handlers/roleHandler';

dotenv.config();

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

  if (commandName === 'addrole' || commandName === 'removerole') {
    await handleRoleCommand(interaction);
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
