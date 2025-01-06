import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";
import { isRef } from "./ref";

export function watch(source, cb, options = {} as any) {
  return createWatch(source, cb, options);
}

export function createWatch(source, cb, { deep, immediate }) {
  let oldValue;
  let _oldValue;
  let getter;
  // 将 state包装成函数供 ReactiveEffect使用

  if (isFunction(source)) {
    getter = source;
  } else if (isReactive(source)) {
    getter = () => createReactiveGetter(source);
  } else if (isRef(source)) {
    getter = source.value;
  }

  const createReactiveGetter = (source) => traverse(source, deep);
  const scheduler = () => {
    let newValue = _effect.run();
    cb(newValue, _oldValue);
    oldValue = newValue;
    if (oldValue) {
      _oldValue = JSON.parse(JSON.stringify(oldValue));
    }
  };
  // watch监控的state对应的effect
  const _effect = new ReactiveEffect(getter, scheduler);

  if (cb) {
    // watch
    if (immediate) {
      scheduler();
    } else {
      oldValue = _effect.run();
    }
  } else {
    // watchEffect
  }
}

function traverse(source, deep, currentDeep = 0, seen = new Set()) {
  if (!isObject(source)) {
    return source;
  }
  if (deep) {
    if (deep <= currentDeep) {
      return source;
    }
    currentDeep++;
  }
  if (seen.has(source)) {
    return source;
  }
  for (const key in source) {
    traverse(source[key], deep, currentDeep, seen);
  }
  return source;
}
