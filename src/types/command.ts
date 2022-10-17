import {
  CommandInteraction,
  ChatInputApplicationCommandData,
  Client,
  CommandInteractionOptionResolver,
  CacheType,
} from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
  run: (client: Client, interaction: CommandInteraction, options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">) => Promise<void>;
}
