import { ChatInputCommandInteraction, GuildMember } from 'discord.js';

export async function handleOpenCloseCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const roleId = process.env.OPEN_ROLE_ID!;

  // Get the role from guild
  const role = interaction.guild?.roles.cache.get(roleId);

  if (!role) {
    await interaction.editReply({
      content: '❌ Could not find the configured role. Please check OPEN_ROLE_ID.',
    });
    return;
  }

  // Get the member who executed the command
  const member = interaction.member;

  // member가 GuildMember의 인스턴스인지 확인
  if (!(member instanceof GuildMember)) {
    await interaction.editReply({
      content: '❌ Could not fetch member information.',
    });
    return;
  }

  try {
    if (interaction.commandName === 'enable') {
      // Check if user already has the role
      if (member.roles.cache.has(role.id)) {
        await interaction.editReply({
          content: `⚠️ You already have the ${role.name} role.`,
        });
        return;
      }

      // Add role
      await member.roles.add(role);
      await interaction.editReply({
        content: `✅ You are now marked as available! Added the ${role.name} role.`,
      });
    } else if (interaction.commandName === 'disable') {
      // Check if user doesn't have the role
      if (!member.roles.cache.has(role.id)) {
        await interaction.editReply({
          content: `⚠️ You don't have the ${role.name} role.`,
        });
        return;
      }

      // Remove role
      await member.roles.remove(role);
      await interaction.editReply({
        content: `✅ You are now marked as unavailable! Removed the ${role.name} role.`,
      });
    }
  } catch (error) {
    console.error('Error managing role:', error);
    // editReply는 실패할 수 있으므로 followUp으로 처리
    await interaction.followUp({ content: '❌ An error occurred while managing the role. Make sure the bot has the "Manage Roles" permission and its role is higher than the target role.', ephemeral: true });
  }
}
