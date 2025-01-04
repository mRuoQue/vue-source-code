// packages/shared/src/index.ts
function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

// packages/reactivity/src/baseHandler.ts
var baseHandlers = {
  get(target, key, receiver) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver);
  }
};

// packages/reactivity/src/reactive.ts
function reactive(target) {
  return createReactiveObject(target, baseHandlers);
}
function createReactiveObject(target, baseHandlers2) {
  if (!isObject(target)) {
    return true;
  }
  if (target["__v_isReactive" /* IS_REACTIVE */]) {
    return true;
  }
  const proxy = new Proxy(target, baseHandlers2);
  return proxy;
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
var ReactiveEffect = class {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    // 保存当前的effect到全局变量
    this.activeEffect = this;
    this.fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    this.fn();
  }
};
export {
  effect,
  reactive
};
//# sourceMappingURL=reactivity.js.map
