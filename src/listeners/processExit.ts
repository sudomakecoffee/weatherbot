import { Client } from "discord.js";
import { onTimerCancel } from "./timerElapsed";
import { logger } from "../logger";

export function onProcessExit(client: Client): void {
    logger.info("Process exit detected, killing client connection");
    logger.flush();
    if (client.user && client.application) {
      onTimerCancel();
      client.destroy();
    }
  }
  
  