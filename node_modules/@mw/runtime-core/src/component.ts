import { proxyRefs, reactive } from "@mw/reactivity";
import { hasOwn, isFunction, ShapeFlags } from "@mw/shared";

export let currentInstance = null;

export function createComponentInstance(vnode, parent) {
  let { props: propsOptions = {} } = vnode?.type;

  const instance = {
    data: null,
    vnode,
    subTree: null, // 组件的子树虚拟节点
    update: null,
    props: {}, // 组件props = propsOptions在 vnodeProps找的值
    propsOptions, // 传入的props
    attrs: {}, // 其他属性 = vnodeProps找的值 - propsOptions
    component: null,
    setupState: {},
    isMounted: false,
    proxy: null, // 代理对象 props.name = proxy.name
    exposed: null,
    parent, // 父组件
    provides: parent ? parent.provides : Object.create(null),
  };

  return instance;
}

export function setupComponent(instance) {
  const { vnode } = instance;
  // const vnodeProps = vnode.props;
  initProps(instance, vnode.props);
  initSlots(instance, vnode.children);
  // 映射属性到proxy上
  instance.proxy = new Proxy(instance, setHandlers);
  const { data = () => {}, render, setup } = vnode.type;

  // setup入口取值
  const context = {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: (event, ...args) => initEmit(instance, event, ...args),
    expose: (v) => (instance.exposed = v),
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

  // 优先使用setup中的 render
  if (!instance.render) {
    instance.render = render;
  }
}

const publicPrototype = {
  $attrs: (instance) => instance.attrs,
  $slots: (instance) => instance.slots,
  // $emit: (instance) => instance.emit,
  // $expose: (instance) => instance.expose,
  // $setup: (instance) => instance.setupState,
  // $data: (instance) => instance.data,
  // $props: (instance) => instance.props,
  // $options: (instance) => instance.vnode.type,
};
const setHandlers = {
  get(target, key) {
    const { data, props, setupState, slots } = target;
    if (data && hasOwn(data, key)) {
      return data[key];
    } else if (props && hasOwn(props, key)) {
      return props[key];
    } else if (setupState && hasOwn(setupState, key)) {
      return setupState[key];
    }
    const publicGetter = publicPrototype[key]; // 为$attrs/$slots等向外暴漏的属性添加策略
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
  },
};

/**
 *
 * @param {} instance 组件实例
 * @param {} vnodeProps 总的属性
 */
const initProps = (instance, vnodeProps) => {
  let props = {};
  let attrs = {};
  let propsOptions = instance.propsOptions;

  if (vnodeProps) {
    for (let key in vnodeProps) {
      const value = vnodeProps[key];
      // 分裂props和attrs
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

const initSlots = (instance, children) => {
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    instance.slots = children;
  } else {
    instance.slots = {};
  }
};

const initEmit = (instance, event, ...args) => {
  const eventName = event[0].toUpperCase() + event.slice(1);
  const onEvent = `on${eventName}`;
  const fn = instance.vnode.props?.[onEvent];
  fn && fn(...args);
};

export const getCurrentInstance = () => currentInstance;

export const setCurrentInstance = (instance) => {
  currentInstance = instance;
};
export const unsetCurrentInstance = () => {
  currentInstance = null;
};
