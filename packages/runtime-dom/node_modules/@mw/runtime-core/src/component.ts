import { proxyRefs, reactive } from "@mw/reactivity";
import { hasOwn, isFunction, ShapeFlags } from "@mw/shared";

export function createComponentInstance(vnode) {
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
  };

  return instance;
}

export function setupComponent(instance) {
  const { vnode } = instance;
  const vnodeProps = vnode.props;
  initProps(instance, vnodeProps);
  initSlots(instance, vnode.children);
  // 映射属性到proxy上
  instance.proxy = new Proxy(instance, setHandlers);
  const { data = () => {}, render, setup } = vnode.type;

  const context = {
    attrs: instance.attrs,
    slots: vnode.children,
    emit: () => {},
    expose: {},
  };

  if (setup) {
    const setupCall = setup(instance.props, context);
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
    const publicGetter = publicPrototype[key]; // 为$attrs添加策略
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
