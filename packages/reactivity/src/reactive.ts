import { isObject } from "@vue/shared";
import { baseHandlers, ReactiveFlags } from "./baseHandler";

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
