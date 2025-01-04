import { isObject } from "@vue/shared";
import { baseHandlers, ReactiveFlags } from "./baseHandler";

export function reactive(target) {
  return createReactiveObject(target, baseHandlers);
}

function createReactiveObject(target, baseHandlers) {
  if (!isObject(target)) {
    return true;
  }
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return true;
  }
  const proxy = new Proxy(target, baseHandlers);

  return proxy;
}
