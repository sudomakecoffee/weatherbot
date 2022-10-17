import { pino } from "pino";

const transport = pino.transport({
  target: "pino/file",
  options: { destination: "weatherbot.log" },
});
export const logger = pino({ level: process.env.BOT_LOG_LEVEL || "trace" }, transport);
