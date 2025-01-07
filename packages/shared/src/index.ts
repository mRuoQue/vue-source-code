export function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

export function isFunction(obj) {
  return typeof obj === "function";
}

export function extend(a, b) {
  return Object.assign(a, b);
}

export * from "./shapeFlags";
