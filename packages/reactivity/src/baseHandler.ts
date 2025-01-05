import { isObject } from "@vue/shared";
import { track, trigger } from "./reactiveEffect";
import { reactive } from "./reactive";
export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive", // 是否是响应式对象,如果是则不在代理
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
}

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
