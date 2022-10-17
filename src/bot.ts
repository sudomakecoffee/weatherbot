import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

import { onReady, onInteractionCreate, onGuildCreate, onTimerElapsed, onProcessExit } from "./listeners";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences]
});

onReady(client);
onInteractionCreate(client);
onGuildCreate(client);

process.on("SIGINT", () => onProcessExit(client));

client.login(process.env.TOKEN);
onTimerElapsed(client);
