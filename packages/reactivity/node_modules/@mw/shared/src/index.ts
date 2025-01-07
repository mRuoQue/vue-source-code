export function isObject(value) {
  return value !== null && typeof value === "object";
}

export function isFunction(value) {
  return typeof value === "function";
}

export function isString(value) {
  return typeof value === "string";
}

export function extend(a, b) {
  return Object.assign(a, b);
}

export * from "./shapeFlags";
