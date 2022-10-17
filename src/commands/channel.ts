import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, SlashCommandBuilder, CommandInteractionOptionResolver, CacheType, ChannelType, Channel } from "discord.js";
import { BotConfig } from "../config";
import { Command } from "../types/command";
import { logger } from "../logger";

const log = logger.child({ module: "commandChannel" });
export const SetChannel: Command = {
  name: "wb_channel",
  description: "Sets the channel the bot uses to note the weather",
  options: [
    {
      name: "name",
      description: "The channel to use",
      type: ApplicationCommandOptionType.Channel,
      required: true,    
    },
  ],
  run: async (_: Client, interaction: CommandInteraction, option: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">) => {
    log.info("Executing command");
    const guildId = interaction.guildId ?? "";
    const channel = option.getChannel("name", true);
    const config = BotConfig.getInstance().config.get(guildId) ?? {
      channelId: "",
      currentSeason: "",
      paused: false,
    };
    config.channelId = channel.id;
    BotConfig.getInstance().config.set(guildId, config);
    BotConfig.getInstance().save();

    interaction.reply({
      ephemeral: true,
      content: `Channel set to ${channel}`,
    });
    log.trace("Command execution complete");
  },
};
