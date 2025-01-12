const hasOwnProperty = Object.prototype.hasOwnProperty;
export function isObject(value) {
  return value !== null && typeof value === "object";
}

export function isFunction(value) {
  return typeof value === "function";
}

export function isString(value) {
  return typeof value === "string";
}
export function isNumber(value) {
  return typeof value === "number";
}

export function isArray(value) {
  return Array.isArray(value);
}
export function extend(a, b) {
  return Object.assign(a, b);
}
export function hasOwn(value, key) {
  return hasOwnProperty.call(value, key);
}
