import { isObject } from "@mw/shared";
import { track, trigger } from "./reactiveEffect";
import { reactive } from "./reactive";
import { ReactiveFlags } from "./constant";

export const baseHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }

    // 收集依赖
    track(target, key);

    let res = Reflect.get(target, key, receiver);
    // 深度代理
    if (isObject(res)) {
      return reactive(res);
    }
    return res;
  },

  set(target, key, value, receiver) {
    let oldValue = target[key];

    let res = Reflect.set(target, key, value, receiver);
    // 触发页面更新
    if (oldValue !== value) {
      trigger(target, key, value, oldValue);
    }
    return res;
  },
};
