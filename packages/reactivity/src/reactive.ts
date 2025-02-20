import { isObject } from "@mw/shared";
import { baseHandlers } from "./baseHandler";
import { ReactiveFlags } from "./constant";

export function reactive(target) {
  return createReactiveObject(target);
}

function createReactiveObject(target) {
  if (!isObject(target)) {
    return true;
  }
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return true;
  }
  const proxy = new Proxy(target, baseHandlers);

  return proxy;
}

export function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}

export function isReactive(value) {
  return !!(value && value[ReactiveFlags.IS_REACTIVE]);
}
