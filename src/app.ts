import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import "dotenv/config";
import { onStart, onQuit, onText, start, stop } from "./telegraf.ts";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.command("start", onStart);
bot.command("quit", onQuit);
bot.on(message("text"), onText);

process.once("SIGINT", stop);
process.once("SIGTERM", stop);

start(bot);
