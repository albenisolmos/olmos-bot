export function log(...args) {
  console.log(...args);
}

export function assert(condition: bool, ...args) {
  if (condition == false) log(...args);
}
