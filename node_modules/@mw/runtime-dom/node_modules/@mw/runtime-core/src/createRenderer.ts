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

  const unMount = (vnode) => hostRemove(vnode.el);

  const unMountChildren = (children) => {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      unMount(child);
    }
  };
  const mountElement = (vnode, container, anchor) => {
    const { type, props, children, shapeFlag } = vnode;
    // 创建dom元素
    const el = (vnode.el = hostCreateElement(type));

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
    // el插入到 container
    hostInsert(el, container, anchor);
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

  // diff
  const patchKeyedChildren = (c1, c2, el) => {
    let i = 0; // 记录每次同步的位置
    const l1 = c1.length;
    const l2 = c2.length;
    let e1 = l1 - 1; // 旧节点尾部
    let e2 = l2 - 1; // 新节点尾部
    // 1. 从头同步

    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];

      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el); // 递归更新复用节点
      } else {
        break;
      }
      i++;
    }
    // 2. 从尾部同步
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
    // 3. 增删改中间节点

    if (i > e1) {
      // 新节点添加
      if (i <= e2) {
        const nextPos = e2 + 1;
        // 下一个节点（参照物），有向后插入，没有头部插入
        const anchor = nextPos < l2 ? c2[nextPos].el : null;
        while (i <= e2) {
          patch(null, c2[i], el, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      // 旧节点多 删除
      if (i <= e1) {
        while (i <= e1) {
          unMount(c1[i].el);
          i++;
        }
      }
    } else {
      // 4. 中间位置
      const keyToNewIndexMap = new Map();
      let s1 = i;
      let s2 = i;

      for (let i = s2; i <= e2; i++) {
        const currentVnode = c2[i];
        keyToNewIndexMap.set(currentVnode.key, i);
      }

      for (let i = s1; i <= e1; i++) {
        // 旧节点是否存在,不存在删除
        const oldPos = c1[i];
        const nextPosIndex = keyToNewIndexMap.get(oldPos.key);

        if (nextPosIndex == undefined) {
          unMount(oldPos);
        } else {
          // 复用旧节点
          patch(oldPos, c2[nextPosIndex], el);
        }
      }
      // 倒序插入
      const toBePatched = e2 - s2 + 1;
      for (let i = toBePatched - 1; i >= 0; i--) {
        const newPosIndex = s2 + i;
        const anchor = c2[newPosIndex + 1]?.el;
        const newVnode = c2[newPosIndex];
        if (!newVnode?.el) {
          // 新增
          patch(null, newVnode, el, anchor);
        }
      }
    }
  };

  /**
   * 类型相同，更新 children
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

  const processElement = (n1, n2, container, anchor) => {
    // n1=null初始化 创建元素，否则差异化更新
    if (n1 === null) {
      mountElement(n2, container, anchor);
    } else {
      // 类型相同复用 差异化更新
      patchElement(n1, n2, container);
    }
  };

  const patch = (n1, n2, container, anchor?) => {
    if (n1 === n2) {
      return;
    }
    // 判断是否是同一个vnode,是删除n1，初始化n2
    if (n1 && !isSameVnode(n1, n2)) {
      unMount(n1);
      n1 = null; // 删除n1，走n2初始化
    }
    // 更新元素
    processElement(n1, n2, container, anchor);
  };

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
