import * as Debug from './debug.ts';
import Valkey from 'iovalkey';

const client = new Valkey({
  host: process.env.VALKEY_HOST || 'localhost',
  port: process.env.VALKEY_PORT || 6379
});

client.on("connect", () => {
  Debug.log("Valkey client established!");
});

client.on('error', (err) => {
  Debug.log('Valkey connection error', err)
})

export async function remove(chatId: string): Promise<void> {
  await client.del(chatId);
}

export async function add(chatId: string, sessionId: string): Promise<void> {
  await client.set(chatId, sessionId);
}

export async function get(chatId: string): Promise<string | null> {
  return await client.get(chatId);
}

export async function disconnect(): Promise<void> {
  await client.quit();
}
