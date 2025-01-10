import { reactive } from "@mw/reactivity";
import { hasOwn, isFunction } from "@mw/shared";

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
    isMounted: false,
    proxy: null, // 代理对象 props.name = proxy.name
  };

  return instance;
}

export function setupComponent(instance) {
  const vnodeProps = instance.vnode.props;
  const { data = () => {}, render } = instance.vnode.type;

  initProps(instance, vnodeProps);
  // 映射属性到proxy上
  instance.proxy = new Proxy(instance, setHandlers);
  if (!isFunction(data)) {
    console.warn("data must be a function");
  } else {
    instance.data = reactive(data.call(instance.proxy));
  }

  instance.render = render;
}

const publicPrototype = {
  $attrs: (instance) => instance.attrs,
};
const setHandlers = {
  get(target, key) {
    const { data, props } = target;
    if (data && hasOwn(data, key)) {
      return data[key];
    } else if (props && hasOwn(props, key)) {
      return props[key];
    }
    const publicGetter = publicPrototype[key]; // 为$attrs添加策略
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
