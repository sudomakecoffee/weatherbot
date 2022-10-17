import { Client, Guild } from "discord.js";
import { BotConfig } from "../config";
import { Commands } from "../botCommands";

export function onReady(client: Client): void {
  client.once("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    await createCommands(client);

    console.log(`${client.user.username} online ... All systems nominal`);
  });
};

export async function createCommands(client: Client): Promise<void> {
  const config = BotConfig.getInstance().config;
  if (config.size > 0) {
    for (let guildId of config.keys()) {
      const guild = client.guilds.cache.get(guildId);
      for (let command of Commands) {
         await guild?.commands.create(command);
      }
    }
  }
}
