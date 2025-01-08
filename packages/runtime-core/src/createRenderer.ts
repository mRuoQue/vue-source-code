import { isSameVnode, ShapeFlags } from "@mw/shared";

// 创建渲染器render，render调用patch差异化diff，调用dom api跟新元素
export function createRenderer(rendererOptions) {
  const {
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    insert: hostInsert,
    remove: hostRemove,
    createText: hostCreateText,
    setText: hostSetText,
    parentNode: hostParentNode,
    nextSbiling: hostnNxtSbiling,
    patchProps: hostPatchProps,
  } = rendererOptions;

  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      patch(null, child, container);
    }
  };
  const unMountChildren = (children) => {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      unMount(child);
    }
  };
  const mountElement = (vnode, container) => {
    const { type, props, children, shapeFlag } = vnode;
    // 创建dom元素
    const el = (vnode.el = hostCreateElement(type));

    if (props) {
      for (const key in props) {
        const val = props[key];
        console.log(key, val);
        hostPatchProps(el, key, null, val);
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el);
    }
    // el插入到 container
    hostInsert(el, container);
  };

  // 更新属性 {style class event attribute}
  const patchProps = (oldProps, newProps, el) => {
    // 追加覆盖
    for (const key in newProps) {
      const prevProp = oldProps[key];
      const nextProp = newProps[key];
      if (prevProp !== nextProp) {
        hostPatchProps(el, key, prevProp, nextProp);
      }
    }

    // 删除旧的
    for (const key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProps(el, key, oldProps[key], null);
      }
    }
  };

  const patchKeyedChildren = (c1, c2, el) => {};

  /**
   * 类型相同，更新 children,分多钟情况处理
   * @param n1
   * @param n2
   * @param el
   * 1. 旧文本，新数组
   * 2. 旧文本，新文本，替换
   * 3. 旧文本，新null ，删除旧的
   * 4. 旧数组，新不是数组，删除旧的
   * 5. 旧数组，新本文，删除旧的
   * 6. 旧数组，新数组，diff
   *
   */
  const patchChildren = (n1, n2, el) => {
    const c1 = n1.children;
    const c2 = n2.children;
    const prevShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unMountChildren(c1);
      }
      // 设置新文本
      if (c1 !== c2) {
        hostSetElementText(el, c2);
      }
    } else {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 都是数组
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
  // 差异化更新 el复用
  const patchElement = (n1, n2, container) => {
    const el = (n2.el = n1.el);
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    patchProps(oldProps, newProps, el);
    patchChildren(n1, n2, el);
  };

  const processElement = (n1, n2, container) => {
    // n1=null初始化 创建元素，否则差异化更新
    if (n1 === null) {
      mountElement(n2, container);
    } else {
      // 类型相同复用 差异化更新
      patchElement(n1, n2, container);
    }
  };

  const patch = (n1, n2, container) => {
    if (n1 === n2) {
      return;
    }
    // 判断是否是同一个vnode,是删除n1，初始化n2
    if (n1 && !isSameVnode(n1, n2)) {
      unMount(n1);
      n1 = null; // 删除n1，走n2初始化
    }
    // 更新元素
    processElement(n1, n2, container);
  };

  const unMount = (vnode) => hostRemove(vnode.el);
  // 调用runtime-dom中创建dom API ,创建元素渲染到 container
  const render = (vnode, container) => {
    // vnode=null,移除当前vnode，删除当前el
    if (vnode === null) {
      unMount(vnode);
    }
    patch(container._vnode || null, vnode, container);
    // 保存上一次的vnode
    container._vnode = vnode;
  };

  return { render };
}
