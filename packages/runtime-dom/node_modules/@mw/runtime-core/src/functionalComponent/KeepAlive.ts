import { ShapeFlags } from "@mw/shared";
import { getCurrentInstance } from "../component";
import { onMounted, onUpdated } from "../Lifecycle";

export const KeepAlive = {
  props: {
    max: {
      type: Number,
      default: 5,
    },
  },
  __isKeepAlive: true,
  setup(props, { slots }) {
    const { max } = props;
    const keys = new Set();
    const cacheKeepAlive = new Map();
    const instance = getCurrentInstance();
    let pendingCacheKey = null; // 当前组件的key，在onMounted中使用

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
      // vnode.component = null;
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

    // 创建一个容器，存储keepAlive的子树，并不是真的卸载组件
    const storageContainer = createElement("div");
    // 当keppAlive激活时，调用active方法
    instance.ctx.active = (el, container, anchor) => {
      moveTo(el, container, anchor);
    };
    // 当keppAlive卸载时，调用deactive方法
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
        // 为当前vnode添加标记，不在渲染阶段渲染缓存的vnode
        vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE;
        // 刷新 缓存LRU策略
        keys.delete(key);
        keys.add(key);
      } else {
        keys.add(key);
        if (max && keys.size > max) {
          let maxKey = keys.keys().next().value;
          purnedCacheEntry(maxKey);
        }
      }

      // 添加不用卸载dom标记
      vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;
      return vnode;
    };
  },
};
export const isKeepAlive = (v) => v.type.__isKeepAlive;
