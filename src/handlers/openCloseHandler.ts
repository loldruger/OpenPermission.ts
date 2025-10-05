import { ChatInputCommandInteraction, GuildMember } from 'discord.js';

export async function handleOpenCloseCommand(interaction: ChatInputCommandInteraction) {
  const roleId = process.env.OPEN_ROLE_ID;

  if (!roleId) {
    await interaction.reply({
      content: '❌ OPEN_ROLE_ID is not configured. Please set it in environment variables.',
      ephemeral: true,
    });
    return;
  }

  // Get the role from guild
  const role = interaction.guild?.roles.cache.get(roleId);

  if (!role) {
    await interaction.reply({
      content: '❌ Could not find the configured role. Please check OPEN_ROLE_ID.',
      ephemeral: true,
    });
    return;
  }

  // Get the member who executed the command
  const member = interaction.member as GuildMember;

  if (!member) {
    await interaction.reply({
      content: '❌ Could not fetch member information.',
      ephemeral: true,
    });
    return;
  }

  try {
    if (interaction.commandName === 'open') {
      // Check if user already has the role
      if (member.roles.cache.has(role.id)) {
        await interaction.reply({
          content: `⚠️ You already have the ${role.name} role.`,
          ephemeral: true,
        });
        return;
      }

      // Add role
      await member.roles.add(role);
      await interaction.reply({
        content: `✅ You are now marked as available! Added the ${role.name} role.`,
        ephemeral: false,
      });
    } else if (interaction.commandName === 'close') {
      // Check if user doesn't have the role
      if (!member.roles.cache.has(role.id)) {
        await interaction.reply({
          content: `⚠️ You don't have the ${role.name} role.`,
          ephemeral: true,
        });
        return;
      }

      // Remove role
      await member.roles.remove(role);
      await interaction.reply({
        content: `✅ You are now marked as unavailable! Removed the ${role.name} role.`,
        ephemeral: false,
      });
    }
  } catch (error) {
    console.error('Error managing role:', error);
    await interaction.reply({
      content: '❌ An error occurred while managing the role. Make sure the bot has the "Manage Roles" permission and its role is higher than the target role.',
      ephemeral: true,
    });
  }
}
