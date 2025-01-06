import { isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";

export function watch(source, cb, options = {} as any) {
  return createWatch(source, cb, options);
}

export function createWatch(source, cb, { deep }) {
  let oldValue;
  let _oldValue;
  // 将 state包装成函数供 ReactiveEffect使用
  const getter = () => createReactiveGetter(source);

  const createReactiveGetter = (source) => traverse(source, deep);

  // watch监控的state对应的effect
  const _effect = new ReactiveEffect(getter, () => {
    let newValue = _effect.run();
    cb(newValue, _oldValue);
    oldValue = newValue;
  });

  oldValue = _effect.run();
  _oldValue = JSON.parse(JSON.stringify(oldValue));
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
