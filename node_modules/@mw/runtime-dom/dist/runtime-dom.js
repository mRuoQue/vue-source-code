// node_modules/.pnpm/@vue+shared@3.5.13/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
  const map = /* @__PURE__ */ Object.create(null);
  for (const key of str.split(",")) map[key] = 1;
  return (val) => val in map;
}
var EMPTY_OBJ = true ? Object.freeze({}) : {};
var EMPTY_ARR = true ? Object.freeze([]) : [];
var extend = Object.assign;
var isArray = Array.isArray;
var cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
var camelizeRE = /-(\w)/g;
var camelize = cacheStringFunction(
  (str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
  }
);
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
var capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
var toHandlerKey = cacheStringFunction(
  (str) => {
    const s = str ? `on${capitalize(str)}` : ``;
    return s;
  }
);
var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
var isBooleanAttr = /* @__PURE__ */ makeMap(
  specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`
);

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
function isArray2(value) {
  return Array.isArray(value);
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
function createComponentInstance(vnode) {
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
    isMounted: false,
    proxy: null
    // 代理对象 props.name = proxy.name
  };
  return instance;
}
function setupComponent(instance) {
  const vnodeProps = instance.vnode.props;
  const { data = () => {
  }, render: render2 } = instance.vnode.type;
  initProps(instance, vnodeProps);
  instance.proxy = new Proxy(instance, setHandlers);
  if (!isFunction(data)) {
    console.warn("data must be a function");
  } else {
    instance.data = reactive(data.call(instance.proxy));
  }
  instance.render = render2;
}
var publicPrototype = {
  $attrs: (instance) => instance.attrs
};
var setHandlers = {
  get(target, key) {
    const { data, props } = target;
    if (data && hasOwn(data, key)) {
      return data[key];
    } else if (props && hasOwn(props, key)) {
      return props[key];
    }
    const publicGetter = publicPrototype[key];
    if (publicGetter) {
      return publicGetter(target);
    }
  },
  set(target, key, value) {
    const { data, props } = target;
    if (data && hasOwn(data, key)) {
      data[key] = value;
    } else if (props && hasOwn(props, key)) {
      console.warn(`props is readonly,do not assign to it directly.`);
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

// packages/runtime-core/src/createRenderer.ts
var Text = Symbol("Text");
var Fragment = Symbol("Fragment");
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
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      patch(null, child, container);
    }
  };
  const unMount = (vnode) => {
    if (vnode.type === Fragment) {
      unMountChildren(vnode.children);
    } else {
      hostRemove(vnode.el);
    }
  };
  const unMountChildren = (children) => {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      unMount(child);
    }
  };
  const mountElement = (vnode, container, anchor) => {
    const { type, props, children, shapeFlag } = vnode;
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
      mountChildren(children, el);
    }
    hostInsert(el, container, anchor);
  };
  const setupRenderComponentEffect = (instance, container, anchor) => {
    const { render: render3 } = instance;
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        const subTree = render3.call(instance.proxy, instance.proxy);
        patch(null, subTree, container, anchor);
        instance.subTree = subTree;
        instance.isMounted = true;
      } else {
        const { next } = instance;
        if (next) {
          updareComponentPreRender(instance, next);
        }
        const newSubTree = render3.call(instance.proxy, instance.proxy);
        patch(instance.subTree, newSubTree, container, anchor);
        instance.subTree = newSubTree;
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
  const mountComponent = (n2, container, anchor) => {
    const instance = n2.component = createComponentInstance(n2);
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
  const updareComponentPreRender = (instance, next) => {
    instance.next = null;
    instance.vnode = next;
    updateComponentProps(instance, instance.props, next.props);
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
    return isChangeProps(preProps, nextProps);
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
  const patchKeyedChildren = (c1, c2, el) => {
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
          unMount(c1[i].el);
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
          unMount(oldPos);
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
  const patchChildren = (n1, n2, el) => {
    const c1 = n1.children;
    const c2 = n2.children;
    const prevShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unMountChildren(c1);
      }
      if (c1 !== c2) {
        hostSetElementText(el, c2);
      }
    } else {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          patchKeyedChildren(c1, c2, el);
        } else {
          unMountChildren(c1);
        }
      } else {
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(el, "");
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, el);
        }
      }
    }
  };
  const patchElement = (n1, n2, container) => {
    const el = n2.el = n1.el;
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    patchProps2(oldProps, newProps, el);
    patchChildren(n1, n2, el);
  };
  const processElement = (n1, n2, container, anchor) => {
    if (n1 === null) {
      mountElement(n2, container, anchor);
    } else {
      patchElement(n1, n2, container);
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
  const processFragment = (n1, n2, container, anchor) => {
    if (n1 === null) {
      mountChildren(n2.children, container);
    } else {
      patchChildren(n1, n2, container);
    }
  };
  const processComponent = (n1, n2, container, anchor) => {
    if (n1 === null) {
      mountComponent(n2, container, anchor);
    } else {
      updateComponent(n1, n2, container);
    }
  };
  const patch = (n1, n2, container, anchor) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVnode(n1, n2)) {
      unMount(n1);
      n1 = null;
    }
    const { type, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container);
        break;
      case Fragment:
        processFragment(n1, n2, container, anchor);
        break;
      default:
        if (shapeFlag & ShapeFlags.COMPONENT) {
          processComponent(n1, n2, container, anchor);
        } else if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor);
        }
    }
  };
  const render2 = (vnode, container) => {
    if (vnode === null) {
      unMount(vnode);
    } else {
      patch(container._vnode || null, vnode, container);
      container._vnode = vnode;
    }
  };
  return { render: render2 };
}

// packages/runtime-core/src/createVnode.ts
function createVnode(type, props, children) {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0;
  const vnode = {
    __v_isVnode: true,
    el: null,
    key: props?.key,
    type,
    props,
    children,
    shapeFlag
  };
  if (children) {
    vnode.shapeFlag |= isString(children) ? ShapeFlags.TEXT_CHILDREN : ShapeFlags.ARRAY_CHILDREN;
  }
  return vnode;
}

// packages/runtime-core/src/h.ts
function h(type, props, children) {
  const argLen = arguments.length;
  if (argLen === 2) {
    if (isObject(props) && !isArray2(props)) {
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

// packages/runtime-dom/src/index.ts
var rendererOptions = extend(nodeOptions, { patchProps });
var render = function(vnode, container) {
  return createRenderer(rendererOptions).render(vnode, container);
};
export {
  Fragment,
  ReactiveEffect,
  Text,
  activeEffect,
  computed,
  createRenderer,
  createWatch,
  effect,
  h,
  isReactive,
  isRef,
  proxyRefs,
  reactive,
  ref,
  render,
  toReactive,
  toRef,
  toRefs,
  trackEffect,
  trackRefValue,
  triggerEffect,
  triggerRefValue,
  watch,
  watchEffect
};
/*! Bundled license information:

@vue/shared/dist/shared.esm-bundler.js:
  (**
  * @vue/shared v3.5.13
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)
  (*! #__NO_SIDE_EFFECTS__ *)
*/
//# sourceMappingURL=runtime-dom.js.map
