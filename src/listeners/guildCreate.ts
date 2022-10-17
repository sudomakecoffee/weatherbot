import { Client } from "discord.js";
import { Commands } from "../botCommands";
import { BotConfig } from "../config";
import { logger } from "../logger";

const log = logger.child({ module: "guildCreate" });
export function onGuildCreate(client: Client): void {
  /**
   * Fires whenever the bot joins a guild (server).
   */
  client.on("guildCreate", async function (guild) {
    log.debug("Handling guildCreate event");
    // when we join for the first time, create our commands
    const config = BotConfig.getInstance().config;
    guild.commands.set(Commands);
    if (!config.has(guild.id)) {
      config.set(guild.id, {
        channelId: "",
        currentSeason: "spring",
        paused: true,
      });
      BotConfig.getInstance().save(config);
    }
  });
};
