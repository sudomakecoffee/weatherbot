import { Client } from "discord.js";
import { updateWeather } from "../commands";
import { BotConfig } from "../config";
import { logger } from "../logger";

let waitForIt: NodeJS.Timeout;
export async function onTimerElapsed(client: Client) {
  let runTime = new Date();

  runTime.setHours(8, 0, 0, 0);
  if (runTime < new Date()) {
    runTime.setDate(runTime.getDate() + 1);
    logger.info("Today's timer has passed, aiming for tomorrow");
  }
  let timeLeft = runTime.getTime() - new Date().getTime();

  waitForIt = setTimeout(async function tick() {
    for (let key of BotConfig.getInstance().config.keys()) {
      if (!(BotConfig.getInstance().config.get(key)?.paused ?? false)) {
        updateWeather(client, key).catch((err) => {
          logger.error(`Couldn't update ${key}, likely permissions issue`);
        });
      }
    }
    runTime.setDate(runTime.getDate() + 1);
    timeLeft = runTime.getTime() - new Date().getTime();
    logger.info("Tick done, next run time " + runTime.toString());
    waitForIt = setTimeout(tick, timeLeft);
  }, timeLeft);
}

export function onTimerCancel() {
  if (waitForIt) {
    clearTimeout(waitForIt);
  }
}
