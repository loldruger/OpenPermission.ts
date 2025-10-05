import { SlashCommandBuilder } from 'discord.js';

export const commands = [
  new SlashCommandBuilder()
    .setName('open')
    .setDescription('Mark yourself as available (adds the configured role)')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('close')
    .setDescription('Mark yourself as unavailable (removes the configured role)')
    .toJSON(),
];
