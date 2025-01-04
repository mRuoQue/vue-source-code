// packages/shared/src/index.ts
function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

// packages/reactivity/src/effect.ts
function effect(fn) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });
  _effect.run();
  return _effect;
}
var activeEffect;
var ReactiveEffect = class {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.track_id = 0;
    this.depsLength = 0;
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
      return this.fn();
    } finally {
      activeEffect = nextActiveEffrct;
    }
  }
};
function trackEffect(effect2, dep) {
  dep.set(effect2, effect2.track_id);
  effect2.deps[effect2.depsLength++] = dep;
}
function triggerEffect(dep) {
  const effects = dep.keys();
  effects.forEach((effect2) => {
    if (effect2.scheduler) {
      effect2.scheduler();
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
function createDep(clear, key) {
  let dep = /* @__PURE__ */ new Map();
  dep.delete = clear;
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
    return Reflect.get(target, key, receiver);
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
