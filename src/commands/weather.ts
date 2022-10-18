import { CommandInteraction, Client, GuildBasedChannel, PermissionsBitField, ApplicationCommandOptionType, CacheType, CommandInteractionOptionResolver, ApplicationCommandType } from "discord.js";
import { BotConfig, BotConfigData, WeatherConfig } from "../config";
import { Command } from "../types/command";
import { logger } from "../logger";

const log = logger.child({ module: "commandWeather" });
export const UpdateWeather: Command = {
  name: "wb_weather",
  description: "Manually rolls the weather for the current season",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "set",
      description: "Sets the weather to a desired outcome",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "event",
          description: "The weather event",
          type: ApplicationCommandOptionType.String,
          required: true,
        }
      ],
    },
    {
      name: "roll",
      description: "Rolls the weather randomly",
      type: ApplicationCommandOptionType.Subcommand,
      options: []
    },
  ],
  run: async (client: Client, interaction: CommandInteraction, options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">) => {
    const guildId = interaction.guildId ?? "";

    const subcommand = options.getSubcommand();
    let action: Promise<boolean> = new Promise<boolean>(resolve => resolve(false));

    // Sub-ideal implementation, but let's get it working first
    if (subcommand === "roll") {
      action = updateWeather(client, guildId);
    }
    else if (subcommand === "set") {
      const weatherEvent = options.getString("event", true);
      action = updateWeather(client, guildId, weatherEvent);
    }

    let message = "Weather has been updated";
    await action.catch((reason) => {
      log.error(`couldn't update channel name: ${reason}`);
      message = "Error occurred, couldn't update channel name";
    });

    await interaction.reply({
      ephemeral: true,
      content: message,
    });
  },
};

export async function updateWeather(client: Client, guildId: string, chaos?: string): Promise<boolean> {
  const theGuild = client.guilds.cache.get(guildId);
  if (!theGuild) {
    log.error(`Couldn't get reference to guild ${guildId}`);
    return false;
  }

  const guildConfig = BotConfig.getInstance().config.get(guildId) as BotConfigData;
  const season = guildConfig?.currentSeason ?? "";
  const channelId = guildConfig?.channelId ?? "";

  if (season.length === 0 || channelId.length === 0) {
    throw new Error("No channel or season data found")
  }

  if (!theGuild?.members.me?.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
    throw new Error("Insufficient permissions");
  }

  const weather = WeatherConfig.getInstance().config.get(season);
  const roll = 1 + Math.floor(Math.random() * 100);

  const toBe = chaos ?? weather?.find((w) => roll <= w.cutoff)?.weather;

  log.info(`Updating weather for ${guildId} to ${toBe}`);
  const channel = theGuild?.channels.cache.get(channelId) as GuildBasedChannel;
  await channel.setName(`Weather: ${toBe}`);

  guildConfig.paused = chaos !== undefined;
  BotConfig.getInstance().config.set(guildId, guildConfig);
  BotConfig.getInstance().save();

  return true;
}