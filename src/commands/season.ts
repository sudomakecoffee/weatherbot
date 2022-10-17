import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, CacheType, CommandInteractionOptionResolver } from "discord.js";
import { BotConfig, BotConfigData } from "../config";
import { Command } from "../types/command";
import { logger as parentLogger } from "../logger";

const log = parentLogger.child({ module: "commandSeason" });
export const Season: Command = {
  name: "wb_season",
  description: "Sets the current season",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "season",
      description: "Sets the current season",
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "Spring", value: "spring" },
        { name: "Summer", value: "summer" },
        { name: "Autumn", value: "autumn" },
        { name: "Winter", value: "winter" },
      ],
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction, options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">) => {
    const choice = interaction.options.get("season")?.value ?? "unknown";
    const content = `Season has been updated to ${choice}`;

    const guildId = interaction.guildId as string;
    const config = BotConfig.getInstance().config;
    const guildConfig = config.get(guildId) as BotConfigData;

    guildConfig.currentSeason = choice as string;
    config.set(guildId, guildConfig);

    BotConfig.getInstance().save(config);
    log.info(content);

    await interaction.followUp({ ephemeral: true, content });
  },
};
