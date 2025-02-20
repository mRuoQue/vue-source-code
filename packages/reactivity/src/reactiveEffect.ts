import { activeEffect, triggerEffect, trackEffect } from "./effect";

let targetMap = new WeakMap();
/**
 * dep的数据格式
 *  {name:'xiaoma',age:18} : {
 *      name: { effect : 0 }
 *   }
 * }
 *
 */

// 依赖收集
export function track(target, key) {
  // 取到全局存的effect，构建依赖关系 targer->{map:key->map:effect}
  if (activeEffect) {
    let depMap = targetMap.get(target);
    if (!depMap) {
      targetMap.set(target, (depMap = new Map()));
    }
    let dep = depMap.get(key);
    if (!dep) {
      depMap.set(key, (dep = createDep(() => depMap.delete(key), key)));
    }
    // 将effect 收集到dep中，构建收集器集合
    trackEffect(activeEffect, dep);
  }
}

export function createDep(cleanup, key) {
  let dep = new Map() as any;
  dep.cleanup = cleanup;
  dep.name = key;

  return dep;
}

export function trigger(targer, key, value, oldValue) {
  let depMap = targetMap.get(targer);
  if (!depMap) {
    return;
  }

  let dep = depMap.get(key);
  if (dep) {
    triggerEffect(dep);
  }
}
