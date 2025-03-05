import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import "dotenv/config";
import * as Debug from "./debug.js";
import * as Typebot from "./typebot.js";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.command("start", async (ctx) => {
  Debug.log("START " + ctx.text || "NIL");
  await Typebot.startChat();
});

bot.command("quit", async (ctx) => {
  await ctx.leaveChat();
});

bot.on(message("text"), async (ctx) => {
  // Using context shortcut
  await ctx.reply(`Hello ${ctx.state.role}`);
  await ctx.reply(`Your message is "${ctx.text}"`);
});

Debug.log("Bot start");
bot.launch();

function stop() {
  Debug.log("Bot stopped");
  bot.stop();
}

// Enable graceful stop
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
