// packages/shared/src/index.ts
function isObject(obj) {
  return obj !== null && typeof obj === "object";
}
function isFunction(obj) {
  return typeof obj === "function";
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
    this._dirtyLevel = 4 /* Dirty */;
    this.deps = [];
    this.fn = fn;
    this.scheduler = scheduler;
  }
  get dirty() {
    return this._dirtyLevel === 4 /* Dirty */;
  }
  set dirty(value) {
    this._dirtyLevel = value ? 4 /* Dirty */ : 2 /* Clean */;
  }
  run() {
    this._dirtyLevel = 0 /* NoDirty */;
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
    if (effect2._dirtyLevel < 4 /* Dirty */) {
      effect2._dirtyLevel = 4 /* Dirty */;
    }
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
function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}

// packages/reactivity/src/watch.ts
function watch(source, cb, options = {}) {
  return createWatch(source, cb, options);
}
function createWatch(source, cb, { deep }) {
  let oldValue;
  let _oldValue;
  const getter = () => createReactiveGetter(source);
  const createReactiveGetter = (source2) => traverse(source2, deep);
  const _effect = new ReactiveEffect(getter, () => {
    let newValue = _effect.run();
    cb(newValue, _oldValue);
    oldValue = newValue;
  });
  oldValue = _effect.run();
  _oldValue = JSON.parse(JSON.stringify(oldValue));
}
function traverse(source, deep, currentDeep = 0, seen = /* @__PURE__ */ new Set()) {
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

// packages/reactivity/src/ref.ts
function ref(value) {
  return createRef(value);
}
function createRef(value) {
  return new RefImpl(value);
}
var RefImpl = class {
  constructor(rawValue) {
    this.rawValue = rawValue;
    this.__v_isRef = true;
    this.rawValue = rawValue;
    this._value = toReactive(rawValue);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if (newValue !== this.rawValue) {
      this.rawValue = newValue;
      this._value = newValue;
      triggerRefValue(this);
    }
  }
};
function trackRefValue(ref2) {
  if (activeEffect) {
    trackEffect(
      activeEffect,
      ref2.dep = createDep(() => ref2.dep = void 0, "undefined")
    );
  }
}
function triggerRefValue(ref2) {
  if (ref2.dep) {
    triggerEffect(ref2.dep);
  }
}
function toRef(object, key) {
  return new ObjectRefImpl(object, key);
}
function toRefs(object) {
  let res = {};
  for (const key in object) {
    res[key] = toRef(object, key);
  }
  return res;
}
function proxyRefs(objectIsRef) {
  return new Proxy(objectIsRef, {
    get(target, key, reactive2) {
      const res = Reflect.get(target, key, reactive2);
      return res.__v_isRef ? res.value : res;
    },
    set(target, key, value, reactive2) {
      const oldValue = target[key];
      if (oldValue.__v_isRef) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, reactive2);
      }
    }
  });
}
var ObjectRefImpl = class {
  constructor(_object, _key) {
    this._object = _object;
    this._key = _key;
    this.__v_isRef = true;
  }
  get value() {
    return this._object[this._key];
  }
  set value(newValue) {
    this._object[this._key] = newValue;
  }
};

// packages/reactivity/src/computed.ts
function computed(getterOptions) {
  let getter;
  let setter;
  const getterFn = isFunction(getterOptions);
  if (getterFn) {
    getter = getterOptions;
    setter = () => {
      console.log("computed setter fn");
    };
  } else {
    getter = getterOptions.get;
    setter = getterOptions.set;
  }
  return new ComputedRefImpl(getter, setter);
}
var ComputedRefImpl = class {
  // 计算属性的effect
  constructor(getter, setter) {
    this.getter = getter;
    this.setter = setter;
    this._effect = new ReactiveEffect(
      () => getter(this._value),
      () => {
        triggerRefValue(this);
      }
    );
  }
  get value() {
    if (this._effect.dirty) {
      this._value = this._effect.run();
      trackRefValue(this);
    }
    return this._value;
  }
  set value(newValue) {
    this.setter = newValue;
  }
};
export {
  ReactiveEffect,
  activeEffect,
  computed,
  createWatch,
  effect,
  proxyRefs,
  reactive,
  ref,
  toReactive,
  toRef,
  toRefs,
  trackEffect,
  trackRefValue,
  triggerEffect,
  triggerRefValue,
  watch
};
//# sourceMappingURL=reactivity.js.map
