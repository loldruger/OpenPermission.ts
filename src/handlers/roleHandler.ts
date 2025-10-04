import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';

export async function handleRoleCommand(interaction: ChatInputCommandInteraction) {
  // Check permissions
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageRoles)) {
    await interaction.reply({
      content: '❌ You need the "Manage Roles" permission to use this command.',
      ephemeral: true,
    });
    return;
  }

  const targetUser = interaction.options.getUser('user', true);
  const role = interaction.options.getRole('role', true);
  
  // Get the actual Role object from guild
  const guildRole = interaction.guild?.roles.cache.get(role.id);
  
  if (!guildRole) {
    await interaction.reply({
      content: '❌ Could not find that role.',
      ephemeral: true,
    });
    return;
  }

  // Get server member
  const member = await interaction.guild?.members.fetch(targetUser.id);

  if (!member) {
    await interaction.reply({
      content: '❌ Could not find that user.',
      ephemeral: true,
    });
    return;
  }

  try {
    if (interaction.commandName === 'addrole') {
      // Check if user already has the role
      if (member.roles.cache.has(guildRole.id)) {
        await interaction.reply({
          content: `⚠️ ${targetUser.tag} already has the ${guildRole.name} role.`,
          ephemeral: true,
        });
        return;
      }

      // Add role
      await member.roles.add(guildRole);
      await interaction.reply({
        content: `✅ Added the ${guildRole.name} role to ${targetUser.tag}.`,
        ephemeral: false,
      });
    } else if (interaction.commandName === 'removerole') {
      // Check if user doesn't have the role
      if (!member.roles.cache.has(guildRole.id)) {
        await interaction.reply({
          content: `⚠️ ${targetUser.tag} doesn't have the ${guildRole.name} role.`,
          ephemeral: true,
        });
        return;
      }

      // Remove role
      await member.roles.remove(guildRole);
      await interaction.reply({
        content: `✅ Removed the ${guildRole.name} role from ${targetUser.tag}.`,
        ephemeral: false,
      });
    }
  } catch (error) {
    console.error('Error managing role:', error);
    await interaction.reply({
      content: '❌ An error occurred while managing the role. Make sure the bot\'s role is higher than the target role.',
      ephemeral: true,
    });
  }
}
