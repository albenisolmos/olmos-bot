import * as Debug from "./debug.js";

export interface TypebotMessage {
  type: string;
  content: string;
}

export interface TypebotResponse {
  code: string;
  sessionId: string | undefined;
  messages: Array<TypebotMessage>;
}

function mapMessages(messages): Array<TypebotMessage> {
  return messages.map((element) => {
    if (element.type === "text") {
      return {
        type: element.type,
        content: element.content.richText[0].children[0].text,
      };
    } else if (element.type === "image") {
      return {
        type: element.type,
        content: element.content.url,
      };
    }
  });
}

export async function startChat(): Promise<TypebotResponse | undefined> {
  const PUBLIC_ID = process.env.PUBLIC_ID;
  const url = `https://typebot.io/api/v1/typebots/${PUBLIC_ID}/startChat`;

  Debug.log("STARTCHAT " + url);
  const fetchResponse = await fetch(url, { method: "POST" });

  if (!fetchResponse.ok) {
    Debug.log(fetchResponse.status, fetchResponse.text);
    return;
  }

  const json = await fetchResponse.json();

  const response: TypebotResponse = {
    sessionId: json.sessionId,
    messages: mapMessages(json.messages),
  };

  return response;
}

export async function continueChat(
  sessionId: string,
  text: string,
): Promise<TypebotResponse | undefined> {
  const url = `https://typebot.io/api/v1/sessions/${sessionId}/continueChat`;

  Debug.log("CONTINUECHAT", { url: url, sessionId: sessionId });

  const fetchResponse = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: {
        type: "text",
        text: text,
        attachedFileUrls: ["<string>"],
      },
      textBubbleContentFormat: "richText",
    }),
  });

  if (!fetchResponse.ok) {
    const text = JSON.parse(await fetchResponse.text());

    return {
      code: text.code,
      sessionId: undefined,
      messages: [],
    };
  }

  const json = await fetchResponse.json();

  return {
    code: json.code,
    sessionId: undefined,
    messages: mapMessages(json.messages),
  };
}
