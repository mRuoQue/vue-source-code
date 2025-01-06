import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";
import { isRef } from "./ref";

export function watch(source, cb, options = {} as any) {
  return createWatch(source, cb, options);
}

export function watchEffect(getter, options = {} as any) {
  return createWatch(getter, null, options);
}

export function createWatch(source, cb, { deep, immediate }) {
  let oldValue;
  let _oldValue;
  let getter;
  let cleanup; // 闭包储存清理回调
  // 将 state包装成函数供 ReactiveEffect使用

  if (isFunction(source)) {
    getter = source;
  } else if (isReactive(source)) {
    getter = () => createReactiveGetter(source);
  } else if (isRef(source)) {
    getter = source.value;
  }
  const onCleanup = (fn) => {
    cleanup = () => {
      fn();
      cleanup = null;
    };
  };

  const createReactiveGetter = (source) => traverse(source, deep);
  const scheduler = () => {
    if (!cb) {
      _effect.run();
    } else {
      let newValue = _effect.run();
      // 清理上一次的回调，避免多次调用时间紊乱
      // 第一次请求的后到，应该取最后一次的结果，所以取消掉之前的回调
      if (cleanup) {
        cleanup();
      }

      cb(newValue, _oldValue, onCleanup);
      oldValue = newValue;
      if (oldValue) {
        _oldValue = JSON.parse(JSON.stringify(oldValue));
      }
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
      //   _oldValue = JSON.parse(JSON.stringify(oldValue));
    }
  } else {
    // watchEffect
    _effect.run();
  }
  const unWatch = () => {
    _effect.stop();
  };
  return unWatch;
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
