// packages/shared/src/index.ts
function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

// packages/reactivity/src/effect.ts
var activeEffect;
function effect(fn, options) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });
  _effect.run();
  if (options) {
    Object.assign(_effect, options);
  }
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
var ReactiveEffect = class {
  // 反向记录effect，方便后续diff，最大量复用依赖
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this._running = 0;
    // effec.run()运行中 （避免死循环，state改变，循环调用scheduler）
    this._trackId = 0;
    // 记录执行的次数，避免同一个属性多次收集
    this._depsLength = 0;
    this.deps = [];
    this.fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let nextActiveEffrct = activeEffect;
    try {
      activeEffect = this;
      cleanupPreEffect(this);
      this._running++;
      return this.fn();
    } finally {
      this._running--;
      overflowDepEffect(this);
      activeEffect = nextActiveEffrct;
    }
  }
};
function cleanupPreEffect(effect2) {
  effect2._depsLength = 0;
  effect2._trackId++;
}
function cleanupDepEffect(dep, effect2) {
  dep.delete(effect2);
  if (dep.size == 0) {
    dep?.cleanup();
  }
}
function overflowDepEffect(effect2) {
  if (effect2._depsLength < effect2.deps.length) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      let dep = effect2.deps[i];
      cleanupDepEffect(dep, effect2);
    }
  }
}
function trackEffect(effect2, dep) {
  if (effect2._trackId !== dep.get(effect2)) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
  }
}
function triggerEffect(dep) {
  const effects = dep.keys();
  effects.forEach((effect2) => {
    if (!effect2._running) {
      if (effect2.scheduler) {
        effect2.scheduler();
      }
    }
  });
}

// packages/reactivity/src/reactiveEffect.ts
var targetMap = /* @__PURE__ */ new WeakMap();
function track(target, key) {
  if (activeEffect) {
    let depMap = targetMap.get(target);
    if (!depMap) {
      targetMap.set(target, depMap = /* @__PURE__ */ new Map());
    }
    let dep = depMap.get(key);
    if (!dep) {
      depMap.set(key, dep = createDep(() => depMap.delete(key), key));
    }
    trackEffect(activeEffect, dep);
  }
}
function createDep(cleanup, key) {
  let dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.name = key;
  return dep;
}
function trigger(targer, key, value, oldValue) {
  let depMap = targetMap.get(targer);
  if (!depMap) {
    return;
  }
  let dep = depMap.get(key);
  if (dep) {
    triggerEffect(dep);
  }
}

// packages/reactivity/src/baseHandler.ts
var baseHandlers = {
  get(target, key, receiver) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    track(target, key);
    let res = Reflect.get(target, key, receiver);
    if (isObject(res)) {
      return reactive(res);
    }
    return res;
  },
  set(target, key, value, receiver) {
    let oldValue = target[key];
    let res = Reflect.set(target, key, value, receiver);
    if (oldValue !== value) {
      trigger(target, key, value, oldValue);
    }
    return res;
  }
};

// packages/reactivity/src/reactive.ts
function reactive(target) {
  return createReactiveObject(target);
}
function createReactiveObject(target) {
  if (!isObject(target)) {
    return true;
  }
  if (target["__v_isReactive" /* IS_REACTIVE */]) {
    return true;
  }
  const proxy = new Proxy(target, baseHandlers);
  return proxy;
}
export {
  effect,
  reactive
};
//# sourceMappingURL=reactivity.js.map
