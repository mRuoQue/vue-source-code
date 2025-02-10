var Mwvue = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/mwvue/src/index.ts
  var index_exports = {};
  __export(index_exports, {
    Fragment: () => Fragment,
    KeepAlive: () => KeepAlive,
    Lifecycles: () => Lifecycles,
    PatchFlagNames: () => PatchFlagNames,
    PatchFlags: () => PatchFlags,
    ReactiveEffect: () => ReactiveEffect,
    ShapeFlags: () => ShapeFlags,
    Teleport: () => Teleport,
    Text: () => Text,
    Transition: () => Transition,
    _createElementBlock: () => _createElementBlock,
    _openBlock: () => _openBlock,
    activeEffect: () => activeEffect,
    closeBlock: () => closeBlock,
    compile: () => compile,
    computed: () => computed,
    createApp: () => createApp,
    createComponentInstance: () => createComponentInstance,
    createElementBlock: () => createElementBlock,
    createElementVNode: () => createVnode,
    createRenderer: () => createRenderer,
    createVnode: () => createVnode,
    createWatch: () => createWatch,
    currentInstance: () => currentInstance,
    defineAsyncComponent: () => defineAsyncComponent,
    effect: () => effect,
    extend: () => extend,
    getCurrentInstance: () => getCurrentInstance,
    h: () => h,
    hasOwn: () => hasOwn,
    inject: () => inject,
    invokerhooks: () => invokerhooks,
    isArray: () => isArray,
    isFunction: () => isFunction,
    isKeepAlive: () => isKeepAlive,
    isNumber: () => isNumber,
    isObject: () => isObject,
    isReactive: () => isReactive,
    isRef: () => isRef,
    isSameVnode: () => isSameVnode,
    isString: () => isString,
    isTeleport: () => isTeleport,
    isVnode: () => isVnode,
    onBeforeMount: () => onBeforeMount,
    onBeforeUnmount: () => onBeforeUnmount,
    onBeforeUpdate: () => onBeforeUpdate,
    onMounted: () => onMounted,
    onUnmounted: () => onUnmounted,
    onUpdated: () => onUpdated,
    openBlock: () => openBlock,
    parse: () => parse,
    provide: () => provide,
    proxyRefs: () => proxyRefs,
    reactive: () => reactive,
    ref: () => ref,
    regAttr: () => regAttr,
    regSpaceChar: () => regSpaceChar,
    regSpaceEqual: () => regSpaceEqual,
    regSpaces: () => regSpaces,
    regTag: () => regTag,
    render: () => render,
    setCurrentInstance: () => setCurrentInstance,
    setupBlock: () => setupBlock,
    setupComponent: () => setupComponent,
    toDisplayString: () => toDisplayString,
    toReactive: () => toReactive,
    toRef: () => toRef,
    toRefs: () => toRefs,
    trackEffect: () => trackEffect,
    trackRefValue: () => trackRefValue,
    triggerEffect: () => triggerEffect,
    triggerRefValue: () => triggerRefValue,
    unsetCurrentInstance: () => unsetCurrentInstance,
    watch: () => watch,
    watchEffect: () => watchEffect
  });

  // packages/shared/src/utils.ts
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function isObject(value) {
    return value !== null && typeof value === "object";
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  function isString(value) {
    return typeof value === "string";
  }
  function isNumber(value) {
    return typeof value === "number";
  }
  function isArray(value) {
    return Array.isArray(value);
  }
  function extend(a, b) {
    return Object.assign(a, b);
  }
  function hasOwn(value, key) {
    return hasOwnProperty.call(value, key);
  }

  // packages/shared/src/vnode.ts
  function isVnode(value) {
    return value?.__v_isVnode;
  }
  function isSameVnode(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }

  // packages/shared/src/shapeFlags.ts
  var ShapeFlags = {
    ELEMENT: 1,
    "1": "ELEMENT",
    FUNCTIONAL_COMPONENT: 2,
    "2": "FUNCTIONAL_COMPONENT",
    STATEFUL_COMPONENT: 4,
    "4": "STATEFUL_COMPONENT",
    TEXT_CHILDREN: 8,
    "8": "TEXT_CHILDREN",
    ARRAY_CHILDREN: 16,
    "16": "ARRAY_CHILDREN",
    SLOTS_CHILDREN: 32,
    "32": "SLOTS_CHILDREN",
    TELEPORT: 64,
    "64": "TELEPORT",
    SUSPENSE: 128,
    "128": "SUSPENSE",
    COMPONENT_SHOULD_KEEP_ALIVE: 256,
    "256": "COMPONENT_SHOULD_KEEP_ALIVE",
    COMPONENT_KEPT_ALIVE: 512,
    "512": "COMPONENT_KEPT_ALIVE",
    COMPONENT: 6,
    "6": "COMPONENT"
  };

  // packages/shared/src/patchFlags.ts
  var PatchFlags = {
    TEXT: 1,
    "1": "TEXT",
    CLASS: 2,
    "2": "CLASS",
    STYLE: 4,
    "4": "STYLE",
    PROPS: 8,
    "8": "PROPS",
    FULL_PROPS: 16,
    "16": "FULL_PROPS",
    NEED_HYDRATION: 32,
    "32": "NEED_HYDRATION",
    STABLE_FRAGMENT: 64,
    "64": "STABLE_FRAGMENT",
    KEYED_FRAGMENT: 128,
    "128": "KEYED_FRAGMENT",
    UNKEYED_FRAGMENT: 256,
    "256": "UNKEYED_FRAGMENT",
    NEED_PATCH: 512,
    "512": "NEED_PATCH",
    DYNAMIC_SLOTS: 1024,
    "1024": "DYNAMIC_SLOTS",
    DEV_ROOT_FRAGMENT: 2048,
    "2048": "DEV_ROOT_FRAGMENT",
    CACHED: -1,
    "-1": "CACHED",
    BAIL: -2,
    "-2": "BAIL"
  };
  var PatchFlagNames = {
    [1]: `TEXT`,
    [2]: `CLASS`,
    [4]: `STYLE`,
    [8]: `PROPS`,
    [16]: `FULL_PROPS`,
    [32]: `NEED_HYDRATION`,
    [64]: `STABLE_FRAGMENT`,
    [128]: `KEYED_FRAGMENT`,
    [256]: `UNKEYED_FRAGMENT`,
    [512]: `NEED_PATCH`,
    [1024]: `DYNAMIC_SLOTS`,
    [2048]: `DEV_ROOT_FRAGMENT`,
    [-1]: `HOISTED`,
    [-2]: `BAIL`
  };

  // packages/shared/src/regexp.ts
  var regSpaces = /^[ \t\r\n]+/;
  var regTag = /^<\/?([a-z][^ \t\r\n/>]*)/;
  var regAttr = /^[^\t\r\n\f />][^\t\r\n\f />=]*/;
  var regSpaceEqual = /^[\t\r\n\f ]*=/;
  var regSpaceChar = /[^\t\r\n\f ]/;

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
    stop() {
      if (this.active) {
        this.active = false;
        overflowDepEffect(this);
        cleanupPreEffect(this);
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
  function isReactive(value) {
    return !!(value && value["__v_isReactive" /* IS_REACTIVE */]);
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
        ref2.dep = ref2.dep || createDep(() => ref2.dep = void 0, "undefined")
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
      get(target, key, reactive3) {
        const res = Reflect.get(target, key, reactive3);
        return res.__v_isRef ? res.value : res;
      },
      set(target, key, value, reactive3) {
        const oldValue = target[key];
        if (oldValue.__v_isRef) {
          oldValue.value = value;
          return true;
        } else {
          return Reflect.set(target, key, value, reactive3);
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
  function isRef(value) {
    return !!(value && value.__v_isRef);
  }

  // packages/reactivity/src/watch.ts
  function watch(source, cb, options = {}) {
    return createWatch(source, cb, options);
  }
  function watchEffect(getter, options = {}) {
    return createWatch(getter, null, options);
  }
  function createWatch(source, cb, { deep, immediate }) {
    let oldValue;
    let _oldValue;
    let getter;
    let cleanup;
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
    const createReactiveGetter = (source2) => traverse(source2, deep);
    const scheduler = () => {
      if (!cb) {
        _effect.run();
      } else {
        let newValue = _effect.run();
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
    const _effect = new ReactiveEffect(getter, scheduler);
    if (cb) {
      if (immediate) {
        scheduler();
      } else {
        oldValue = _effect.run();
        _oldValue = JSON.parse(JSON.stringify(oldValue));
      }
    } else {
      _effect.run();
    }
    const unWatch = () => {
      _effect.stop();
    };
    return unWatch;
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

  // packages/runtime-core/src/longIncSequeue.ts
  function longIncSequeue(arr) {
    let start, end, middle;
    const result = [0];
    const diffLen = arr.length;
    const prevIndexArr = result.slice(0);
    for (let i = 0; i < diffLen; i++) {
      const cur = arr[i];
      if (cur !== 0) {
        let resLastIndex = result[result.length - 1];
        if (cur > arr[resLastIndex]) {
          prevIndexArr[i] = result[result.length - 1];
          result.push(i);
          continue;
        }
      }
      start = 0;
      end = result.length - 1;
      while (start < end) {
        middle = (start + end) / 2 | 0;
        if (cur > arr[result[middle]]) {
          start = middle + 1;
        } else {
          end = middle;
        }
        if (cur < arr[result[start]]) {
          prevIndexArr[i] = result[start - 1];
          result[start] = i;
        }
      }
    }
    let resultLen = result.length;
    let lastResult = result[resultLen - 1];
    while (resultLen-- > 0) {
      result[resultLen] = lastResult;
      lastResult = prevIndexArr[lastResult];
    }
    return result;
  }

  // packages/runtime-core/src/queueJob.ts
  var queue = [];
  var promiseResolve = Promise.resolve();
  var isFlashing = false;
  function queueJob(job) {
    if (!queue.includes(job)) {
      queue.push(job);
    }
    if (!isFlashing) {
      isFlashing = true;
      promiseResolve.then(() => {
        isFlashing = false;
        const newQueue = queue.slice();
        queue.length = 0;
        for (let i = 0; i < newQueue.length; i++) {
          newQueue[i]();
          newQueue.length = 0;
        }
      });
    }
  }

  // packages/runtime-core/src/component.ts
  var currentInstance = null;
  function createComponentInstance(vnode, parent) {
    let { props: propsOptions = {} } = vnode?.type;
    const instance = {
      data: null,
      vnode,
      subTree: null,
      // 组件的子树虚拟节点
      update: null,
      props: {},
      // 组件props = propsOptions在 vnodeProps找的值
      propsOptions,
      // 传入的props
      attrs: {},
      // 其他属性 = vnodeProps找的值 - propsOptions
      component: null,
      setupState: {},
      isMounted: false,
      proxy: null,
      // 代理对象 props.name = proxy.name
      exposed: null,
      parent,
      // 父组件
      provides: parent ? parent.provides : /* @__PURE__ */ Object.create(null),
      ctx: {}
      // KeepAlive组件存储dom的缓存集合
    };
    return instance;
  }
  function setupComponent(instance) {
    const { vnode } = instance;
    initProps(instance, vnode.props);
    initSlots(instance, vnode.children);
    instance.proxy = new Proxy(instance, setHandlers);
    const { data = () => {
    }, render: render2, setup } = vnode.type;
    const context = {
      attrs: instance.attrs,
      slots: instance.slots,
      emit: (event, ...args) => initEmit(instance, event, ...args),
      expose: (v) => instance.exposed = v
    };
    if (setup) {
      setCurrentInstance(instance);
      const setupCall = setup(instance.props, context);
      unsetCurrentInstance();
      if (isFunction(setupCall)) {
        instance.render = setupCall;
      } else {
        instance.setupState = proxyRefs(setupCall);
      }
    }
    if (!isFunction(data)) {
      console.warn("data must be a function");
    } else {
      instance.data = reactive(data.call(instance.proxy));
    }
    if (!instance.render) {
      instance.render = render2;
    }
  }
  var publicPrototype = {
    $attrs: (instance) => instance.attrs,
    $slots: (instance) => instance.slots
    // $emit: (instance) => instance.emit,
    // $expose: (instance) => instance.expose,
    // $setup: (instance) => instance.setupState,
    // $data: (instance) => instance.data,
    // $props: (instance) => instance.props,
    // $options: (instance) => instance.vnode.type,
  };
  var setHandlers = {
    get(target, key) {
      const { data, props, setupState, slots } = target;
      if (data && hasOwn(data, key)) {
        return data[key];
      } else if (props && hasOwn(props, key)) {
        return props[key];
      } else if (setupState && hasOwn(setupState, key)) {
        return setupState[key];
      }
      const publicGetter = publicPrototype[key];
      if (publicGetter) {
        return publicGetter(target);
      }
    },
    set(target, key, value) {
      const { data, props, setupState, slots } = target;
      if (data && hasOwn(data, key)) {
        data[key] = value;
      } else if (props && hasOwn(props, key)) {
        console.warn(`props is readonly,do not assign to it directly.`);
      } else if (setupState && hasOwn(setupState, key)) {
        setupState[key] = value;
      }
      return true;
    }
  };
  var initProps = (instance, vnodeProps) => {
    let props = {};
    let attrs = {};
    let propsOptions = instance.propsOptions;
    if (vnodeProps) {
      for (let key in vnodeProps) {
        const value = vnodeProps[key];
        if (key in propsOptions) {
          props[key] = value;
        } else {
          attrs[key] = value;
        }
      }
    }
    instance.attrs = attrs;
    instance.props = reactive(props);
  };
  var initSlots = (instance, children) => {
    const { vnode } = instance;
    if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
      instance.slots = children;
    } else {
      instance.slots = {};
    }
  };
  var initEmit = (instance, event, ...args) => {
    const eventName = event[0].toUpperCase() + event.slice(1);
    const onEvent = `on${eventName}`;
    const fn = instance.vnode.props?.[onEvent];
    fn && fn(...args);
  };
  var getCurrentInstance = () => currentInstance;
  var setCurrentInstance = (instance) => {
    currentInstance = instance;
  };
  var unsetCurrentInstance = () => {
    currentInstance = null;
  };

  // packages/runtime-core/src/functionalComponent/Teleport.ts
  var Teleport = {
    __isTeleport: true,
    process(n1, n2, container, anchor, parentComponent, internals) {
      let { mountChildren, patchChildren, moveTo } = internals;
      if (!n1) {
        const target = n2.target = document.querySelector(n2.props.to);
        if (target) {
          mountChildren(n2.children, target, anchor, parentComponent);
        }
      } else {
        patchChildren(n1, n2, n2.target, parentComponent);
        if (n2.props.to !== n1.props.to) {
          const newTarget = document.querySelector(n2.props.to);
          n2.children.forEach((child) => {
            moveTo(child, newTarget, anchor);
          });
        }
      }
    },
    remove(vnode, unMountChildren) {
      const { children, shapeFlag } = vnode;
      if (shapeFlag & ShapeFlags.TELEPORT) {
        unMountChildren(children);
      }
    }
  };
  var isTeleport = (v) => v.__isTeleport;

  // packages/runtime-core/src/createVnode.ts
  function createVnode(type, props, children, patchFlag) {
    const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : isTeleport(type) ? ShapeFlags.TELEPORT : isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : isFunction(type) ? ShapeFlags.FUNCTIONAL_COMPONENT : 0;
    const vnode = {
      __v_isVnode: true,
      el: null,
      key: props?.key,
      type,
      props,
      // 传入的props
      children,
      shapeFlag,
      patchFlag
    };
    if (currentBlock && patchFlag) {
      currentBlock.push(vnode);
    }
    if (children) {
      if (isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
      } else if (isObject(children)) {
        vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN;
      } else {
        children = String(children);
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
      }
    }
    return vnode;
  }
  var currentBlock = null;
  function toDisplayString(v) {
    return isString(v) ? v : v === null ? "" : isObject(v) ? JSON.stringify(v) : String(v);
  }
  function openBlock() {
    currentBlock = [];
  }
  function _openBlock() {
    currentBlock = [];
  }
  function closeBlock() {
    currentBlock = null;
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = currentBlock;
    closeBlock();
    return vnode;
  }
  function createElementBlock(type, props, children, patchFlag) {
    return setupBlock(createVnode(type, props, children, patchFlag));
  }
  function _createElementBlock(type, props, children, patchFlag) {
    return setupBlock(createVnode(type, props, children, patchFlag));
  }

  // packages/runtime-core/src/Lifecycle.ts
  var Lifecycles = /* @__PURE__ */ ((Lifecycles2) => {
    Lifecycles2["BEFORE_MOUNT"] = "bm";
    Lifecycles2["MOUNTED"] = "m";
    Lifecycles2["BEFORE_UPDATE"] = "bu";
    Lifecycles2["UPDATED"] = "u";
    Lifecycles2["BEFORE_UNMOUNT"] = "bum";
    Lifecycles2["UNMOUNTED"] = "um";
    return Lifecycles2;
  })(Lifecycles || {});
  var createHooks = (lifecycle) => {
    return (hook, target = currentInstance) => {
      if (target) {
        const hooks = target[lifecycle] || (target[lifecycle] = []);
        const cacheInstanceForHook = () => {
          setCurrentInstance(target);
          hook();
          unsetCurrentInstance();
        };
        hooks.push(cacheInstanceForHook);
      }
    };
  };
  var invokerhooks = (hooks) => {
    hooks?.forEach((hook) => hook());
  };
  var onBeforeMount = createHooks("bm" /* BEFORE_MOUNT */);
  var onMounted = createHooks("m" /* MOUNTED */);
  var onBeforeUpdate = createHooks("bu" /* BEFORE_UPDATE */);
  var onUpdated = createHooks("u" /* UPDATED */);
  var onBeforeUnmount = createHooks("bum" /* BEFORE_UNMOUNT */);
  var onUnmounted = createHooks("um" /* UNMOUNTED */);

  // packages/runtime-core/src/functionalComponent/KeepAlive.ts
  var KeepAlive = {
    props: {
      max: {
        type: Number,
        default: 5
      }
    },
    __isKeepAlive: true,
    setup(props, { slots }) {
      const { max } = props;
      const keys = /* @__PURE__ */ new Set();
      const cacheKeepAlive = /* @__PURE__ */ new Map();
      const instance = getCurrentInstance();
      let pendingCacheKey = null;
      const { createElement, moveTo, unMount } = instance?.ctx?.renderer;
      const cacheSubTree = () => {
        cacheKeepAlive.set(pendingCacheKey, instance.subTree);
      };
      function handleReset(vnode) {
        let shapeFlag = vnode.shapeFlag;
        if (shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
          shapeFlag -= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;
        }
        if (shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
          shapeFlag -= ShapeFlags.COMPONENT_KEPT_ALIVE;
        }
        vnode.shapeFlag = shapeFlag;
      }
      function handleUnMount(vnode) {
        handleReset(vnode);
        unMount(vnode);
      }
      function purnedCacheEntry(key) {
        const maxKeyCache = cacheKeepAlive.get(key);
        if (maxKeyCache) {
          handleUnMount(maxKeyCache);
          cacheKeepAlive.delete(key);
          keys.delete(key);
        }
      }
      const storageContainer = createElement("div");
      instance.ctx.active = (el, container, anchor) => {
        moveTo(el, container, anchor);
      };
      instance.ctx.deactive = (el) => {
        moveTo(el, storageContainer, null);
      };
      onMounted(cacheSubTree);
      onUpdated(cacheSubTree);
      return (proxy) => {
        const vnode = slots.default();
        const comp = vnode.type;
        const key = vnode.key == null ? comp : vnode.key;
        const cacheVnode = cacheKeepAlive.get(key);
        pendingCacheKey = key;
        if (cacheVnode) {
          vnode.component = cacheVnode.component;
          vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE;
          keys.delete(key);
          keys.add(key);
        } else {
          keys.add(key);
          if (max && keys.size > max) {
            let maxKey = keys.keys().next().value;
            purnedCacheEntry(maxKey);
          }
        }
        vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;
        return vnode;
      };
    }
  };
  var isKeepAlive = (v) => v.type.__isKeepAlive;

  // packages/runtime-core/src/apiCreateApp.ts
  function createAppAPI(render2) {
    return function createApp2(rootComponent, rootProps = null) {
      const app = {
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        mount(container) {
          const vnode = createVnode(rootComponent, rootProps);
          render2(vnode, container);
          app._container = container;
        }
      };
      return app;
    };
  }

  // packages/runtime-core/src/createRenderer.ts
  var Text = Symbol("Text");
  var Fragment = Symbol("Fragment");
  var dealWithChildrenIsString = (children) => {
    for (let i = 0; i < children.length; i++) {
      if (isString(children[i]) || isNumber(children[i])) {
        children[i] = createVnode(Text, null, String(children[i]));
      }
    }
    return children;
  };
  function createRenderer(rendererOptions2) {
    const {
      createElement: hostCreateElement,
      setElementText: hostSetElementText,
      insert: hostInsert,
      remove: hostRemove,
      createText: hostCreateText,
      setText: hostSetText,
      parentNode: hostParentNode,
      nextSbiling: hostnNxtSbiling,
      patchProps: hostPatchProps
    } = rendererOptions2;
    const mountChildren = (children, container, anchor, parentComponent) => {
      dealWithChildrenIsString(children);
      for (let i = 0; i < children.length; i++) {
        patch(null, children[i], container, anchor, parentComponent);
      }
    };
    const unMount = (vnode, parentComponent) => {
      const { type, shapeFlag, component, transition, el } = vnode;
      const handleRemove = () => {
        hostRemove(vnode.el);
      };
      if (vnode.shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
        parentComponent.ctx.deactive(vnode);
      } else if (type === Fragment) {
        unMountChildren(vnode.children, parentComponent);
      } else if (shapeFlag & ShapeFlags.COMPONENT) {
        unMount(component.subTree, parentComponent);
      } else if (shapeFlag & ShapeFlags.TELEPORT) {
        vnode.type.remove(vnode, unMountChildren);
      } else {
        if (transition) {
          transition.leave(el, handleRemove);
        } else {
          handleRemove();
        }
      }
    };
    const unMountChildren = (children, parentComponent) => {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        unMount(child, parentComponent);
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent) => {
      const { type, props, children, shapeFlag, transition } = vnode;
      const el = vnode.el = hostCreateElement(type);
      if (props) {
        for (const key in props) {
          const val = props[key];
          hostPatchProps(el, key, null, val);
        }
      }
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(el, children);
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(children, el, anchor, parentComponent);
      }
      if (transition) {
        transition.beforeEnter(el);
      }
      hostInsert(el, container, anchor);
      if (transition) {
        transition.enter(el);
      }
    };
    function renderComponent(instance) {
      const { render: render3, vnode, proxy, attrs, slots } = instance;
      if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        return render3.call(proxy, proxy);
      } else {
        return vnode.type(attrs, { slots });
      }
    }
    const setupRenderComponentEffect = (instance, container, anchor) => {
      const { render: render3 } = instance;
      const componentUpdateFn = () => {
        const { bm, m } = instance;
        if (!instance.isMounted) {
          if (bm) {
            invokerhooks(bm);
          }
          const subTree = renderComponent(instance);
          patch(null, subTree, container, anchor);
          instance.subTree = subTree;
          instance.isMounted = true;
          if (m) {
            invokerhooks(m);
          }
        } else {
          const { next, bu, u } = instance;
          if (next) {
            updateComponentPreRender(instance, next);
          }
          if (bu) {
            invokerhooks(bu);
          }
          const newSubTree = renderComponent(instance);
          patch(instance.subTree, newSubTree, container, anchor, instance);
          instance.subTree = newSubTree;
          if (u) {
            invokerhooks(u);
          }
        }
      };
      const _effect = new ReactiveEffect(
        componentUpdateFn,
        () => queueJob(update)
      );
      const update = () => {
        _effect.run();
      };
      instance.update = update;
      update();
    };
    const mountComponent = (n2, container, anchor, parentComponent) => {
      const instance = n2.component = createComponentInstance(
        n2,
        parentComponent
      );
      if (isKeepAlive(n2)) {
        instance.ctx.renderer = {
          createElement: hostCreateElement,
          setElementText: hostSetElementText,
          moveTo(vnode, container2, anchor2) {
            hostInsert(vnode.component.subTree.el, container2);
          },
          unMount
        };
      }
      setupComponent(instance);
      setupRenderComponentEffect(instance, container, anchor);
    };
    const isChangeProps = (preProps, nextProps) => {
      const nextKeys = Object.keys(nextProps);
      const preLen = Object.keys(preProps)?.length;
      const nextLen = nextKeys?.length;
      if (nextLen !== preLen) {
        return true;
      }
      for (let i = 0; i < nextLen; i++) {
        const key = nextKeys[i];
        if (nextProps[key] !== preProps[key]) {
          return true;
        }
      }
      return false;
    };
    const updateComponentProps = (instance, preProps, nextProps) => {
      for (const key in nextProps) {
        const prevProp = preProps?.[key];
        const nextProp = nextProps[key];
        if (prevProp !== nextProp) {
          instance.props[key] = nextProp;
        }
      }
      for (const key in preProps) {
        if (!(key in nextProps)) {
          delete instance.props[key];
        }
      }
    };
    const updateComponentPreRender = (instance, next) => {
      instance.next = null;
      instance.vnode = next;
      updateComponentProps(instance, instance.props, next.props = {});
      Object.assign(instance.slots, next.children);
    };
    const shouldComponentUpdate = (n1, n2) => {
      const { props: preProps, children: preChildren } = n1;
      const { props: nextProps, children: nextChildren } = n2;
      if (preChildren || nextChildren) {
        return true;
      }
      if (preProps === nextProps) {
        return false;
      }
      return isChangeProps(preProps, nextProps || {});
    };
    const updateComponent = (n1, n2, container) => {
      const instance = n2.component = n1.component;
      if (shouldComponentUpdate(n1, n2)) {
        instance.next = n2;
        instance.update();
      }
    };
    const patchProps2 = (oldProps, newProps, el) => {
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];
        if (prevProp !== nextProp) {
          hostPatchProps(el, key, prevProp, nextProp);
        }
      }
      for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProps(el, key, oldProps[key], null);
        }
      }
    };
    const patchKeyedChildren = (c1, c2, el, parentComponent) => {
      let i = 0;
      const l1 = c1.length;
      const l2 = c2.length;
      let e1 = l1 - 1;
      let e2 = l2 - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i];
        if (isSameVnode(n1, n2)) {
          patch(n1, n2, el);
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2];
        if (isSameVnode(n1, n2)) {
          patch(n1, n2, el);
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : null;
          while (i <= e2) {
            patch(null, c2[i], el, anchor);
            i++;
          }
        }
      } else if (i > e2) {
        if (i <= e1) {
          while (i <= e1) {
            unMount(c1[i].el, parentComponent);
            i++;
          }
        }
      } else {
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        let s1 = i;
        let s2 = i;
        let toBePatched = e2 - s2 + 1;
        let newIndexToOldIndexMap = new Array(toBePatched).fill(0);
        for (let i2 = s2; i2 <= e2; i2++) {
          const currentVnode = c2[i2];
          keyToNewIndexMap.set(currentVnode.key, i2);
        }
        for (let i2 = s1; i2 <= e1; i2++) {
          const oldPos = c1[i2];
          const nextPosIndex = keyToNewIndexMap.get(oldPos.key);
          if (nextPosIndex == void 0) {
            unMount(oldPos, parentComponent);
          } else {
            newIndexToOldIndexMap[nextPosIndex - s2] = i2;
            patch(oldPos, c2[nextPosIndex], el);
          }
        }
        let longIncSeq = longIncSequeue(newIndexToOldIndexMap);
        let lastLongIncSeqIndex = longIncSeq.length - 1;
        for (let i2 = toBePatched - 1; i2 >= 0; i2--) {
          const newPosIndex = s2 + i2;
          const anchor = c2[newPosIndex + 1]?.el;
          const newVnode = c2[newPosIndex];
          if (!newVnode?.el) {
            patch(null, newVnode, el, anchor);
          } else {
            if (i2 === longIncSeq[lastLongIncSeqIndex]) {
              lastLongIncSeqIndex--;
            } else {
              hostInsert(newVnode.el, el, anchor);
            }
          }
        }
      }
    };
    const patchChildren = (n1, n2, el, anchor, parentComponent) => {
      const c1 = n1.children;
      const c2 = isArray(n2.children) ? dealWithChildrenIsString(n2.children) : n2.children;
      const prevShapeFlag = n1.shapeFlag;
      const shapeFlag = n2.shapeFlag;
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          unMountChildren(c1, parentComponent);
        }
        if (c1 !== c2) {
          hostSetElementText(el, c2);
        }
      } else {
        if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            patchKeyedChildren(c1, c2, el, parentComponent);
          } else {
            unMountChildren(c1, parentComponent);
          }
        } else {
          if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, "");
          }
          if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(c2, el, anchor, parentComponent);
          }
        }
      }
    };
    const patchBlockChildren = (n1, n2, el, anchor, parentComponent) => {
      const { dynamicChildren } = n2;
      for (let i = 0; i < dynamicChildren.length; i++) {
        patch(
          n1.dynamicChildren[i],
          dynamicChildren[i],
          el,
          anchor,
          parentComponent
        );
      }
    };
    const patchElement = (n1, n2, container, anchor, parentComponent) => {
      const el = n2.el = n1.el;
      const oldProps = n1.props || {};
      const newProps = n2.props || {};
      const { dynamicChildren, patchFlag } = n2;
      if (patchFlag) {
        if (patchFlag & PatchFlags.TEXT) {
          if (n1.children !== n2.children) {
            return hostSetElementText(el, n2.children);
          }
        }
      } else {
        patchProps2(oldProps, newProps, el);
      }
      if (dynamicChildren) {
        patchBlockChildren(n1, n2, el, anchor, parentComponent);
      } else {
        patchChildren(n1, n2, el, anchor, parentComponent);
      }
    };
    const processElement = (n1, n2, container, anchor, parentComponent) => {
      if (n1 === null) {
        mountElement(n2, container, anchor, parentComponent);
      } else {
        patchElement(n1, n2, container, anchor, parentComponent);
      }
    };
    const processText = (n1, n2, container) => {
      if (n1 === null) {
        hostInsert(n2.el = hostCreateText(n2.children), container);
      } else {
        const el = n2.el = n1.el;
        if (n1.children !== n2.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent) => {
      if (n1 === null) {
        mountChildren(n2.children, container, anchor, parentComponent);
      } else {
        patchChildren(n1, n2, container, anchor, parentComponent);
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent) => {
      if (n1 === null) {
        if (n2.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
          parentComponent.ctx.active(n2, container, anchor);
        } else {
          mountComponent(n2, container, anchor, parentComponent);
        }
      } else {
        updateComponent(n1, n2, container);
      }
    };
    const patch = (n1, n2, container, anchor, parentComponent) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVnode(n1, n2)) {
        unMount(n1, parentComponent);
        n1 = null;
      }
      const { type, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container);
          break;
        case Fragment:
          processFragment(n1, n2, container, anchor, parentComponent);
          break;
        default:
          if (shapeFlag & ShapeFlags.ELEMENT) {
            processElement(n1, n2, container, anchor, parentComponent);
          } else if (shapeFlag & ShapeFlags.TELEPORT) {
            const renderFn = {
              mountChildren,
              patchChildren,
              moveTo(vnode, container2, anchor2) {
                const el = vnode.component ? vnode.component.subTree.el : vnode.el;
                hostInsert(el, container2, anchor2);
              }
            };
            type.process(n1, n2, container, anchor, parentComponent, renderFn);
          } else if (shapeFlag & ShapeFlags.COMPONENT) {
            processComponent(n1, n2, container, anchor, parentComponent);
          }
      }
    };
    const render2 = (vnode, container) => {
      if (vnode === null) {
        unMount(container._vnode, null);
      } else {
        patch(container._vnode || null, vnode, container);
        container._vnode = vnode;
      }
    };
    return { render: render2, createApp: createAppAPI(render2) };
  }

  // packages/runtime-core/src/h.ts
  function h(type, props, children) {
    const argLen = arguments.length;
    if (argLen === 2) {
      if (isObject(props) && !isArray(props)) {
        if (isVnode(props)) {
          return createVnode(type, null, [props]);
        } else {
          return createVnode(type, props);
        }
      }
      return createVnode(type, null, props);
    } else {
      if (argLen === 3 && isVnode(children)) {
        children = [children];
      }
      if (argLen > 3) {
        children = Array.from(arguments).slice(2);
      }
    }
    return createVnode(type, props, children);
  }

  // packages/runtime-core/src/provide.ts
  function provide(key, value) {
    if (!currentInstance) {
      return;
    }
    let provides = currentInstance.provides;
    const parentProvides = currentInstance?.parent?.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(provides);
    }
    provides[key] = value;
  }
  function inject(key, defaultValue) {
    if (!currentInstance) {
      return;
    }
    const provides = currentInstance.parent?.provides;
    if (provides) {
      if (key in provides) {
        return provides[key];
      } else {
        return defaultValue;
      }
    }
  }

  // packages/runtime-core/src/functionalComponent/Transition.ts
  function Transition(props, { slots }) {
    return h(baseTransitionImpl, resolveTransitionProps(props), slots);
  }
  var resolveTransitionProps = (props) => {
    const {
      name = "mw",
      enterFromClass = `${name}-enter-from`,
      enterActiveClass = `${name}-enter-active`,
      enterToClass = `${name}-enter-to`,
      leaveFromClass = `${name}-leave-from`,
      leaveActiveClass = `${name}-leave-active`,
      leaveToClass = `${name}-leave-to`,
      onBeforeEnter,
      onEnter,
      onLeave,
      appear = false
    } = props;
    return {
      onBeforeEnter(el) {
        onBeforeEnter && onBeforeEnter(el);
        el.classList.add(enterFromClass);
        el.classList.add(enterActiveClass);
      },
      onEnter(el, done) {
        const resolve = () => {
          el.classList.remove(enterFromClass);
          el.classList.remove(enterActiveClass);
          done?.();
        };
        onEnter && onEnter(el, resolve);
        nextFrame(() => {
          el.classList.remove(enterFromClass);
          el.classList.add(enterToClass);
          if (!onEnter || onEnter.length <= 1) {
            el.addEventListener("transitionend", resolve);
          }
        });
      },
      onLeave(el, done) {
        const resolve = () => {
          el.classList.remove(leaveActiveClass);
          el.classList.remove(leaveToClass);
          el.classList.add(enterToClass);
          done?.();
        };
        onLeave && onLeave(el, resolve);
        el.classList.add(leaveFromClass);
        document.body.offsetWidth;
        el.classList.add(leaveActiveClass);
        nextFrame(() => {
          el.classList.remove(leaveFromClass);
          el.classList.add(leaveToClass);
          if (!onLeave || onLeave.length <= 1) {
            el.addEventListener("transitionend", resolve);
          }
        });
      }
    };
  };
  function nextFrame(fn) {
    requestAnimationFrame(() => {
      requestAnimationFrame(fn);
    });
  }
  var baseTransitionImpl = {
    props: {
      onBeforeEnter: Function,
      onEnter: Function,
      onActiveEnter: Function,
      onAfterEnter: Function,
      onEnterCancelled: Function,
      onBeforeLeave: Function,
      onLeave: Function,
      onAfterLeave: Function,
      onLeaveCancelled: Function,
      onBeforeAppear: Function,
      onAppear: Function,
      onAfterAppear: Function
    },
    setup(props, { slots }) {
      return () => {
        const vnode = slots?.default();
        if (!vnode) {
          return;
        }
        vnode.transition = {
          beforeEnter: props.onBeforeEnter,
          enter: props.onEnter,
          activeEnter: props.onActiveEnter,
          afterEnter: props.onAfterEnter,
          beforeLeave: props.onBeforeLeave,
          leave: props.onLeave
        };
        return vnode;
      };
    }
  };

  // packages/runtime-core/src/functionalComponent/defineAsyncComponent.ts
  function defineAsyncComponent(options) {
    if (isFunction(options)) {
      options = { loader: options };
    }
    return {
      setup() {
        let loaded = ref(false);
        let errored = ref(false);
        let errReason = ref("");
        let loading = ref(false);
        let loadingtimer = null;
        let renderComponent = null;
        let attempts = 0;
        const {
          loader,
          errorComponent,
          delay,
          loadingComponent,
          timeout,
          onError
        } = options;
        if (loadingComponent) {
          loadingtimer = setTimeout(() => {
            loading.value = true;
          }, delay);
        }
        if (timeout) {
          setTimeout(() => {
            errored.value = true;
            errReason.value = "loading timeout ...";
            throw new Error("\u7EC4\u4EF6\u52A0\u8F7D\u8D85\u65F6 ...");
          }, timeout);
        }
        function handerLoader() {
          return loader().catch((err) => {
            if (onError) {
              return new Promise((resolve, reject) => {
                const retry = () => resolve(handerLoader());
                const fail = () => reject(err);
                onError(err, retry, fail, ++attempts);
              });
            } else {
              throw err;
            }
          });
        }
        handerLoader().then((component) => {
          renderComponent = component;
          loaded.value = true;
        }).catch((err) => {
          errored.value = err;
        }).finally(() => {
          loading.value = false;
          clearTimeout(loadingtimer);
        });
        return () => {
          if (loaded.value) {
            return h(renderComponent);
          } else if (errored.value) {
            return errorComponent ? h(errorComponent, { reason: errReason.value }) : h("div", errReason.value);
          } else if (loading.value && loadingComponent) {
            return h(loadingComponent);
          } else {
            return h("div");
          }
        };
      }
    };
  }

  // packages/runtime-dom/src/nodeOptions.ts
  var nodeOptions = {
    createElement(tag) {
      return document.createElement(tag);
    },
    setElementText(el, text) {
      el.textContent = text;
    },
    insert(el, parent, anchor = null) {
      parent.insertBefore(el, anchor);
    },
    remove(el) {
      const parent = el?.parentNode;
      if (parent) {
        parent.removeChild(el);
      }
    },
    createText(text) {
      return document.createTextNode(text);
    },
    setText(node, text) {
      node.nodeValue = text;
    },
    parentNode(node) {
      return node.parentNode;
    },
    nextSbiling(node) {
      return node.nextSibling;
    },
    patchProp(el, key, oldValue, newValue) {
    }
  };

  // packages/runtime-dom/src/modules/patchAttr.ts
  function patchAttr(el, prop, value) {
    if (value == null) {
      el.removeAttribute(prop);
    } else {
      el.setAttribute(prop, value);
    }
  }

  // packages/runtime-dom/src/modules/patchEvent.ts
  function patchEvent(el, eventType, handler) {
    const invokers = el._evi || (el._evi = {});
    const eventName = eventType.slice(2).toLowerCase();
    const existingInvoker = invokers[eventType];
    if (handler && existingInvoker) {
      return existingInvoker.value = handler;
    }
    if (handler) {
      const invoker = createInvoker(handler);
      invokers[eventType] = invoker;
      el.addEventListener(eventName, invoker);
    } else if (existingInvoker) {
      el.removeEventListener(eventName, existingInvoker);
      invokers[eventType] = null;
    }
  }
  function createInvoker(handler) {
    const invoker = (e) => invoker.value(e);
    invoker.value = handler;
    return invoker;
  }

  // packages/runtime-dom/src/modules/patchStyle.ts
  function patchStyle(el, prevVal, nextVal) {
    const style = el.style;
    if (nextVal === null) {
      el.removeAttribute("style");
    } else {
      for (let key in nextVal) {
        style[key] = nextVal[key];
      }
      if (prevVal && typeof prevVal !== "string") {
        for (let key in prevVal) {
          if (nextVal[key] == null) {
            style[key] = "";
          }
        }
      }
    }
  }

  // packages/runtime-dom/src/modules/patchClass.ts
  function patchClass(el, value) {
    if (value === null) {
      el.removeAttribute("class");
    } else {
      el.className = value;
    }
  }

  // packages/runtime-dom/src/patchProps.ts
  var patchProps = (el, prop, preVal, nextVal) => {
    if (prop === "class") {
      return patchClass(el, nextVal);
    } else if (prop === "style") {
      return patchStyle(el, preVal, nextVal);
    } else if (/^on[^a-z]/.test(prop)) {
      return patchEvent(el, prop, nextVal);
    } else {
      return patchAttr(el, prop, nextVal);
    }
  };

  // packages/compiler-core/src/runtimeHelper.ts
  var TO_DISPLAY_STRING = Symbol("TO_DISPLAY_STRING");
  var CREATE_ELEMENT_VNODE = Symbol("CREATE_ELEMENT_VNODE");
  var CREATE_TEXT_VNODE = Symbol("CREATE_TEXT_VNODE");
  var CREATE_COMMENT = Symbol("CREATE_COMMENT");
  var CREATE_COMMENT_VNODE = Symbol("CREATE_COMMENT_VNODE");
  var Fragment2 = Symbol("Fragment");
  var OPEN_BLOCK = Symbol("OPEN_BLOCK");
  var CREATE_ELEMENT_BLOCK = Symbol("CREATE_ELEMENT_BLOCK");
  var helperMapName = {
    [TO_DISPLAY_STRING]: "toDisplayString",
    [CREATE_ELEMENT_VNODE]: "createElementVNode",
    [CREATE_TEXT_VNODE]: "createTextVNode",
    [CREATE_COMMENT]: "createCommentVNode",
    [CREATE_COMMENT_VNODE]: "createCommentVNode",
    [Fragment2]: "Fragment",
    [OPEN_BLOCK]: "openBlock",
    [CREATE_ELEMENT_BLOCK]: "createElementBlock"
  };

  // packages/compiler-core/src/ast.ts
  var NodeTypes = {
    ROOT: 0,
    "0": "ROOT",
    ELEMENT: 1,
    "1": "ELEMENT",
    TEXT: 2,
    "2": "TEXT",
    COMMENT: 3,
    "3": "COMMENT",
    SIMPLE_EXPRESSION: 4,
    "4": "SIMPLE_EXPRESSION",
    INTERPOLATION: 5,
    "5": "INTERPOLATION",
    ATTRIBUTE: 6,
    "6": "ATTRIBUTE",
    DIRECTIVE: 7,
    "7": "DIRECTIVE",
    COMPOUND_EXPRESSION: 8,
    "8": "COMPOUND_EXPRESSION",
    IF: 9,
    "9": "IF",
    IF_BRANCH: 10,
    "10": "IF_BRANCH",
    FOR: 11,
    "11": "FOR",
    TEXT_CALL: 12,
    "12": "TEXT_CALL",
    VNODE_CALL: 13,
    "13": "VNODE_CALL",
    JS_CALL_EXPRESSION: 14,
    "14": "JS_CALL_EXPRESSION",
    JS_OBJECT_EXPRESSION: 15,
    "15": "JS_OBJECT_EXPRESSION",
    JS_PROPERTY: 16,
    "16": "JS_PROPERTY",
    JS_ARRAY_EXPRESSION: 17,
    "17": "JS_ARRAY_EXPRESSION",
    JS_FUNCTION_EXPRESSION: 18,
    "18": "JS_FUNCTION_EXPRESSION",
    JS_CONDITIONAL_EXPRESSION: 19,
    "19": "JS_CONDITIONAL_EXPRESSION",
    JS_CACHE_EXPRESSION: 20,
    "20": "JS_CACHE_EXPRESSION",
    JS_BLOCK_STATEMENT: 21,
    "21": "JS_BLOCK_STATEMENT",
    JS_TEMPLATE_LITERAL: 22,
    "22": "JS_TEMPLATE_LITERAL",
    JS_IF_STATEMENT: 23,
    "23": "JS_IF_STATEMENT",
    JS_ASSIGNMENT_EXPRESSION: 24,
    "24": "JS_ASSIGNMENT_EXPRESSION",
    JS_SEQUENCE_EXPRESSION: 25,
    "25": "JS_SEQUENCE_EXPRESSION",
    JS_RETURN_STATEMENT: 26,
    "26": "JS_RETURN_STATEMENT"
  };
  function createCallExpression(context, args = []) {
    context.helpers.set(CREATE_TEXT_VNODE);
    return {
      type: NodeTypes.JS_CALL_EXPRESSION,
      callee: helperMapName[CREATE_TEXT_VNODE],
      arguments: args
    };
  }
  function createVnodeCall(context, tag, props, children) {
    let key;
    if (tag !== Fragment2) {
      key = context.helper(CREATE_ELEMENT_VNODE);
    }
    return {
      type: NodeTypes.VNODE_CALL,
      callee: key,
      tag,
      props,
      children
    };
  }
  function createObjExpression(context, args = []) {
    return {
      type: NodeTypes.JS_OBJECT_EXPRESSION,
      properties: args
    };
  }

  // packages/compiler-core/src/parse.ts
  function parse(template) {
    const context = createParserContext(template);
    return createRoot(parseChildren(context));
  }
  function createRoot(children) {
    return {
      type: NodeTypes.ROOT,
      children
    };
  }
  function createParserContext(content) {
    return {
      originalSource: content,
      source: content,
      line: 1,
      column: 1,
      offset: 0
    };
  }
  function isEnd(context) {
    const s = context.source;
    if (s.startsWith("</")) {
      return true;
    }
    return !s;
  }
  function parseChildren(context) {
    let nodes = [];
    while (!isEnd(context)) {
      let node;
      const c = context.source;
      if (c.startsWith("{{")) {
        node = parseExpression(context);
      } else if (c[0] === "<") {
        node = parseElement(context);
      } else {
        node = parseText(context);
      }
      nodes.push(node);
    }
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      if (node.type === NodeTypes.TEXT) {
        if (!regSpaceChar.test(node.content)) {
          nodes[i] = null;
        } else {
          node.content = node.content.replace(/[ \t\r\n]+/g, " ");
        }
      }
    }
    return nodes.filter((node) => !!node);
  }
  function parseElement(context) {
    const ele = parseTag(context);
    const children = parseChildren(context);
    if (context.source.startsWith("</")) {
      parseTag(context);
    }
    ele.children = children;
    ele.loc = getSelection(context, ele.loc.start);
    return ele;
  }
  function parseTag(context) {
    const start = getCursor(context);
    const match = regTag.exec(context.source);
    const tag = match[1];
    advanceBy(context, match[0].length);
    advanceBySpaces(context);
    let props = parseAttrs(context);
    const isSelfClosing = context.source.startsWith("/>");
    advanceBy(context, isSelfClosing ? 2 : 1);
    return {
      type: NodeTypes.ELEMENT,
      tag,
      props,
      isSelfClosing,
      loc: getSelection(context, start)
    };
  }
  function parseAttrs(context) {
    let props = [];
    while (context.source.length > 0 && !context.source.startsWith(">")) {
      const prop = parseAttr(context);
      props.push(prop);
      advanceBySpaces(context);
    }
    return props;
  }
  function parseAttrValue(context) {
    let value;
    let quote = context.source[0];
    let isQuoted = quote === "'" || quote === '"';
    if (isQuoted) {
      advanceBy(context, 1);
      const endQuoteIndex = context.source.indexOf(quote, 1);
      value = parseTextData(context, endQuoteIndex);
      advanceBy(context, 1);
    } else {
      value = context.source.match(/([^ \t\r\n/>])+/)[1];
      advanceBy(context, value.length);
      advanceBySpaces(context);
    }
    return value;
  }
  function parseAttr(context) {
    const start = getCursor(context);
    let match = regAttr.exec(context.source);
    let name = match[0];
    let value;
    advanceBy(context, name.length);
    if (regSpaceEqual.test(context.source)) {
      advanceBySpaces(context);
      advanceBy(context, 1);
      advanceBySpaces(context);
      value = parseAttrValue(context);
    }
    let valueLoc = getSelection(context, start);
    return {
      type: NodeTypes.ATTRIBUTE,
      name,
      value: {
        type: NodeTypes.TEXT,
        content: value,
        loc: valueLoc
      },
      loc: getSelection(context, start)
    };
  }
  function parseExpression(context) {
    const start = getCursor(context);
    const closeIndex = context.source.indexOf("}}", "{{".length);
    advanceBy(context, 2);
    const innerStart = getCursor(context);
    const innerEnd = getCursor(context);
    const contentLength = closeIndex - "{{".length;
    const preContent = parseTextData(context, contentLength);
    const content = preContent.trim();
    const startOffset = preContent.indexOf(content);
    if (startOffset > 0) {
      advancePositionWithMutation(innerStart, preContent, startOffset);
    }
    const endOffset = startOffset + content.length;
    advancePositionWithMutation(innerEnd, preContent, endOffset);
    advanceBy(context, 2);
    return {
      type: NodeTypes.INTERPOLATION,
      content: {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content,
        loc: getSelection(context, innerStart, innerEnd)
      },
      loc: getSelection(context, start)
    };
  }
  function parseText(context) {
    const tokens = ["<", "{{"];
    let endIndex = context.source.length;
    for (let i = 0; i < tokens.length; i++) {
      const index = context.source.indexOf(tokens[i]);
      if (index !== -1 && index < endIndex) {
        endIndex = index;
      }
    }
    const content = parseTextData(context, endIndex);
    return {
      type: NodeTypes.TEXT,
      content
    };
  }
  function parseTextData(context, endIndex) {
    const content = context.source.slice(0, endIndex);
    advanceBy(context, endIndex);
    return content;
  }
  function advanceBySpaces(context) {
    const match = regSpaces.exec(context.source);
    if (match) {
      advanceBy(context, match[0].length);
    }
  }
  function advanceBy(context, endIndex) {
    let s = context.source;
    advancePositionWithMutation(context, s, endIndex);
    context.source = s.slice(endIndex);
  }
  function advancePositionWithMutation(context, source, endIndex) {
    let linesCount = 0;
    let linePos = -1;
    for (let i = 0; i < endIndex; i++) {
      if (source.charCodeAt(i) === 10) {
        linesCount++;
        linePos = i;
      }
    }
    context.line += linesCount;
    context.column = linePos === -1 ? context.column + endIndex : endIndex - linePos;
    context.offset += endIndex;
  }
  function getSelection(context, start, nextEnd) {
    let end = nextEnd || getCursor(context);
    return {
      start,
      end,
      source: context.originalSource.slice(start.offset, end.offset)
    };
  }
  function getCursor(context) {
    let { line, column, offset } = context;
    return { line, column, offset };
  }

  // packages/compiler-core/src/transform.ts
  function transform(ast) {
    const context = createTransformContext(ast);
    traverseNode(ast, context);
    createRootCodegenNode(ast, context);
    ast.helpers = [...context.helpers.keys()];
  }
  function createRootCodegenNode(ast, context) {
    const { children } = ast;
    if (children.length === 1) {
      const child = children[0];
      if (NodeTypes.ELEMENT === child.type) {
        ast.codegenNode = child.codegenNode;
        context.removeHelper(CREATE_ELEMENT_VNODE);
        context.helper(CREATE_ELEMENT_BLOCK);
        context.helper(OPEN_BLOCK);
        ast.codegenNode.isBlock = true;
      } else {
        ast.codegenNode = child;
      }
    } else if (children.length > 0) {
      ast.codegenNode = createVnodeCall(
        context,
        context.helper(Fragment2),
        null,
        children
      );
      context.helper(CREATE_ELEMENT_BLOCK);
      context.helper(OPEN_BLOCK);
      ast.codegenNode.isBlock = true;
    }
  }
  function traverseNode(node, context) {
    context.currentNode = node;
    let exits = [];
    const transforms = context.transformNode;
    for (let i = 0; i < transforms.length; i++) {
      const transfrom = transforms[i];
      let exit = transfrom(node, context);
      exit && exits.push(exit);
    }
    switch (node.type) {
      case NodeTypes.ROOT:
      // traverseChildren(node, context);
      // break;
      case NodeTypes.ELEMENT:
        for (let i = 0; i < node.children.length; i++) {
          context.parent = node;
          traverseNode(node.children[i], context);
        }
        break;
      // case NodeTypes.TEXT:
      //   // traverseChildren(node, context);
      //   break;
      case NodeTypes.INTERPOLATION:
        context.helper(TO_DISPLAY_STRING);
        break;
    }
    context.currentNode = node;
    let tail = exits.length;
    if (tail > 0) {
      while (tail--) {
        exits[tail]();
      }
    }
  }
  function createTransformContext(root) {
    const context = {
      root,
      currentNode: root,
      parent: null,
      helpers: /* @__PURE__ */ new Map(),
      transformNode: [transformElement, transformText, transformExpression],
      helper(key) {
        let num = context.helpers.get(key) || 0;
        context.helpers.set(key, num + 1);
        return num;
      },
      removeHelper(key) {
        let num = context.helpers.get(key);
        if (num > 1) {
          context.helpers.set(key, num - 1);
        } else {
          context.helpers.delete(key);
        }
      }
    };
    return context;
  }
  function transformElement(node, context) {
    if (NodeTypes.ELEMENT === node.type) {
      return function() {
        const { tag, props, children } = node;
        const vnodeTag = tag;
        let properties = [];
        for (let i = 0; i < props.length; i++) {
          const prop = props[i];
          properties.push({ key: prop.name, value: prop.value.content });
        }
        const propsExpression = properties.length > 0 ? createObjExpression(context) : null;
        let vnodeChildren = null;
        if (children.length === 1) {
          vnodeChildren = children[0];
        } else if (children.length > 1) {
          vnodeChildren = children;
        }
        node.codegenNode = createVnodeCall(
          context,
          vnodeTag,
          propsExpression,
          vnodeChildren
        );
      };
    }
  }
  function transformText(node, context) {
    if (NodeTypes.ELEMENT === node.type || NodeTypes.ROOT === node.type) {
      return function() {
        let hasText = false;
        let container = null;
        const children = node.children;
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (isText(child)) {
            hasText = true;
            for (let j = i + 1; j < children.length; j++) {
              const next = children[j];
              if (isText(next)) {
                if (!container) {
                  container = children[i] = {
                    type: NodeTypes.COMPOUND_EXPRESSION,
                    children: [child]
                  };
                }
                container.children.push(" + ", child);
                children.splice(j, 1);
                j--;
              } else {
                container = null;
                break;
              }
            }
          }
        }
        if (!hasText || children.length === 1) {
          return;
        }
        for (let i = 0; i < children.length; i++) {
          let args = [];
          const child = children[i];
          if (isText(child) || child.type === NodeTypes.COMPOUND_EXPRESSION) {
            args.push(child);
            if (child.type !== NodeTypes.TEXT) {
              args.push(PatchFlags.TEXT);
            }
          }
          children[i] = {
            type: NodeTypes.TEXT_CALL,
            content: child,
            codegenNode: createCallExpression(context, args)
          };
        }
      };
    }
  }
  function isText(node) {
    return node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION;
  }
  function transformExpression(node, context) {
    if (NodeTypes.INTERPOLATION === node.type) {
      node.content.content = `_ctx.${node.content.content}`;
    }
  }

  // packages/compiler-core/src/compile.ts
  function compile(template) {
    const ast = parse(template);
    transform(ast);
    return generate(ast);
  }
  function generate(ast) {
    const context = createCodegenContext(ast);
    const { push, indent, deindent, newLine } = context;
    push(`const _Mwvue = Mwvue`);
    genFunction(ast, context);
    const fnName = "render";
    const args = ["_ctx", "_cache", "$props"];
    push(`return `);
    push(`function ${fnName}(${args.join(",")}){`);
    indent();
    push(`return `);
    if (ast.codegenNode) {
      genNode(ast.codegenNode, context);
    } else {
      push(" null");
    }
    deindent();
    push(`}`);
    return context.code;
  }
  function genNode(node, context) {
    const { push, indent, deindent, newLine } = context;
    switch (node.type) {
      case NodeTypes.TEXT:
        genText(node, context);
        break;
      // case NodeTypes.INTERPOLATION:
      // genComment(node, context);
      // break;
      case NodeTypes.INTERPOLATION:
        genInterpolation(node, context);
        break;
      case NodeTypes.SIMPLE_EXPRESSION:
        genExpression(node, context);
        break;
      case NodeTypes.VNODE_CALL:
        genVnodeCall(node, context);
        break;
    }
  }
  function genText(node, context) {
    context.push(JSON.stringify(node.content));
  }
  function genVnodeCall(node, context) {
    const { push, indent, deindent, newLine, helper } = context;
    const { tag, props, children, isBlock } = node;
    if (isBlock) {
      push(`(${helper(OPEN_BLOCK)}(),`);
    }
    const help = isBlock ? helper(CREATE_ELEMENT_BLOCK) : helper(CREATE_ELEMENT_VNODE);
    push(`${help}(`);
    push(`"div",`);
    push(`null,`);
    push(`123`);
    if (isBlock) {
      push(`)`);
    }
    push(`)`);
  }
  function genExpression(node, context) {
    context.push(node.content);
  }
  function genInterpolation(node, context) {
    const { push, indent, deindent, newLine, helper } = context;
    push(`${helper(TO_DISPLAY_STRING)}(`);
    genNode(node.content, context);
    push(`)`);
  }
  function genFunction(ast, context) {
    const { push, indent, deindent, newLine, helper } = context;
    newLine();
    push(`console.log(333)`);
    newLine();
    if (ast.helpers.length > 0) {
      push(
        `const {${ast.helpers.map(
          (key) => `${helperMapName[key]}:${helper(key)}`
        )}} = _Mwvue`
      );
      newLine();
    }
  }
  function createCodegenContext(ast) {
    const context = {
      code: "",
      level: 0,
      push(source) {
        context.code += source;
      },
      helper(key) {
        return `_${helperMapName[key]}`;
      },
      indent() {
        newLine(++context.level);
      },
      deindent(noLine = false) {
        if (noLine) {
          --context.level;
        } else {
          newLine(--context.level);
        }
      },
      newLine() {
        newLine(context.level);
      }
    };
    function newLine(l) {
      context.push(`
${"  ".repeat(l)}`);
    }
    return context;
  }

  // packages/runtime-dom/src/index.ts
  var rendererOptions = extend(nodeOptions, { patchProps });
  var render = function(vnode, container) {
    return createRenderer(rendererOptions).render(vnode, container);
  };
  var createApp = function(...args) {
    return createRenderer(rendererOptions).createApp(...args);
  };
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=mwvue.js.map
