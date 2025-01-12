import {
  currentInstance,
  setCurrentInstance,
  unsetCurrentInstance,
} from "./component";

export const enum Lifecycles {
  BEFORE_MOUNT = "bm",
  MOUNTED = "m",
  BEFORE_UPDATE = "bu",
  UPDATED = "u",
  BEFORE_UNMOUNT = "bum",
  UNMOUNTED = "um",
}

const createHooks = (lifecycle) => {
  return (hook, target = currentInstance) => {
    if (target) {
      const hooks = target[lifecycle] || (target[lifecycle] = []);

      // setup执行完后组件的instance会重置为null，导致 hooks执行时instance为null
      // 在hook执行时候保存一份instance，hook调用完成重置为null
      const cacheInstanceForHook = () => {
        setCurrentInstance(target);
        hook();
        unsetCurrentInstance();
      };
      hooks.push(cacheInstanceForHook);
    }
  };
};
export const invokerhooks = (hooks) => {
  hooks?.forEach((hook) => hook());
};
export const onBeforeMount = createHooks(Lifecycles.BEFORE_MOUNT);
export const onMounted = createHooks(Lifecycles.MOUNTED);
export const onBeforeUpdate = createHooks(Lifecycles.BEFORE_UPDATE);
export const onUpdated = createHooks(Lifecycles.UPDATED);
export const onBeforeUnmount = createHooks(Lifecycles.BEFORE_UNMOUNT);
export const onUnmounted = createHooks(Lifecycles.UNMOUNTED);
