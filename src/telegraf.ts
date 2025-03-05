import * as SessionIdStore from "./SessionIdStore.ts";
import * as Debug from "./debug.ts";
import * as Typebot from "./typebot.ts";
import { TypebotResponse, TypebotMessage } from "./typebot.ts";

export function start(bot): void {
  Debug.log("Bot Launched");
  bot.launch();
}

export function stop(bot): void {
  Debug.log("Bot stopped");
  bot.stop();
}

async function replyMessage(message: TypebotMessage, ctx): void {
  if (message.type == "text") {
    await ctx.reply(message.content);
  } else if (message.type == "image") {
    // TODO: detect when url response is a gif or image
    await ctx.sendAnimation(message.content);
  }
}

export async function onStart(ctx): void {
  const response: TypebotResponse | undefined = await Typebot.startChat();

  Debug.log("START", {
    chadId: ctx.chat.id,
    sessionId: SessionIdStore.get(ctx.chat.id),
  });

  SessionIdStore.add(ctx.chat.id, response?.sessionId);

  for (let msg of response?.messages) {
    Debug.log("START:msg", msg);
    replyMessage(msg, ctx);
  }
}

export async function onQuit(ctx): void {
  SessionIdStore.remove(ctx.chat.id);
  await ctx.leaveChat();
}

export async function onText(ctx): void {
  if (ctx.message === undefined || !("text" in ctx.message)) {
    Debug.log("TEXT:TELEGRAF", "message is undefined or not text");
    return;
  }

  Debug.log("TEXT", {
    chadId: ctx.chat.id,
    sessionId: SessionIdStore.get(ctx.chat.id),
  });

  const sessionId = SessionIdStore.get(ctx.chat.id);
  Debug.assert(sessionId != undefined, "TEXT", "sessionId is undefined");

  const response: TypebotResponse | undefined = await Typebot.continueChat(
    sessionId,
    ctx.message.text,
  );

  // NOTE: This means that typebot has no more messages to reply
  if (response.code == "NOT_FOUND") {
    Debug.log("TEXT", "END OF THE SESSION TYPEBOT");
    return;
  } else if (response == undefined) {
    Debug.log("TEXT", "Response is undefined");
    await ctx.reply("Something went wrong, please try again");
    return;
  }

  for (let msg of response.messages) {
    replyMessage(msg, ctx);
  }
}
