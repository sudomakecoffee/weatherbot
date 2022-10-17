import { CommandInteraction, Client, Interaction, CacheType, CommandInteractionOptionResolver } from "discord.js";
import { Commands } from "../botCommands";
import { logger } from "../logger";

const log = logger.child({ module: "interactionCreate" });
export function onInteractionCreate(client: Client): void {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      const options = interaction.options;
      await handleSlashCommand(client, interaction, options);
    }
  });
};

const handleSlashCommand = async (
  client: Client,
  interaction: CommandInteraction,
  options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
): Promise<void> => {
  const slashCommand = Commands.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    log.error(`Couldn't find Command for ${interaction.commandName}`);
    await interaction.reply({ content: "An error has occurred" });
    return;
  }
  await slashCommand.run(client, interaction, options);
};
