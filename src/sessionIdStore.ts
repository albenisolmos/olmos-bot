const sessionIdStore = new Map();

export function remove(chatId: string): void {
  sessionIdStore.delete(chatId);
}

export function add(chatId: string, sessionId: string): void {
  sessionIdStore.set(chatId, sessionId);
}

export function get(key: any) {
  return sessionIdStore.get(key);
}
