import { SlashCommandBuilder } from 'discord.js';

export const commands = [
  new SlashCommandBuilder()
    .setName('enable')
    .setDescription('Mark yourself as available (adds the configured role)')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('disable')
    .setDescription('Mark yourself as unavailable (removes the configured role)')
    .toJSON(),
];
