// packages/shared/src/index.ts
function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

// packages/reactivity/src/effect.ts
function effect(fn) {
  const _effect = new ReactiveEffect(fn, () => {
    if (this.scheduler) {
      this.scheduler();
    }
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
function trackEffect(effect3, dep) {
  dep.set(effect3, effect3.track_id);
  effect3.deps[effect3.depsLength++] = dep;
  console.log(effect3.deps);
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
    console.log(targetMap);
  }
}
function createDep(clear, key) {
  let dep = /* @__PURE__ */ new Map();
  dep.delete = clear;
  dep.name = key;
  return dep;
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
    return Reflect.set(target, key, value, receiver);
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
