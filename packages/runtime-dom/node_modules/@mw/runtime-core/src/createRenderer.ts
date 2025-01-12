import {
  isArray,
  isNumber,
  isSameVnode,
  isString,
  ShapeFlags,
} from "@mw/shared";
import longIncSequeue from "./longIncSequeue";
import { ReactiveEffect } from "@mw/reactivity";
import { queueJob } from "./queueJob";
import { createComponentInstance, setupComponent } from "./component";
import { createVnode } from "./createVnode";
import { invokerhooks } from "./Lifecycle";

// 定义元素类型
export const Text = Symbol("Text");
export const Fragment = Symbol("Fragment");
const dealWithChildrenIsString = (children) => {
  for (let i = 0; i < children.length; i++) {
    if (isString(children[i]) || isNumber(children[i])) {
      children[i] = createVnode(Text, null, String(children[i]));
    }
  }
  return children;
};

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

  const mountChildren = (children, container, parentComponent) => {
    dealWithChildrenIsString(children);
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container, parentComponent);
    }
  };

  const unMount = (vnode) => {
    const { type, shapeFlag, component } = vnode;
    if (type === Fragment) {
      unMountChildren(vnode.children);
    } else if (shapeFlag & ShapeFlags.COMPONENT) {
      unMount(component.subTree);
    } else if (shapeFlag & ShapeFlags.TELEPORT) {
      vnode.type.remove(vnode, unMountChildren);
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
  const mountElement = (vnode, container, anchor, parentComponent) => {
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
      mountChildren(children, el, parentComponent);
    }
    // el插入到 container
    hostInsert(el, container, anchor);
  };

  // 创建effect更新 dom
  const setupRenderComponentEffect = (instance, container, anchor) => {
    const { render } = instance;
    const componentUpdateFn = () => {
      const { bm, m } = instance;
      if (!instance.isMounted) {
        // onBeforeMount
        if (bm) {
          invokerhooks(bm);
        }
        // 组件的虚拟节点
        const subTree = render.call(instance.proxy, instance.proxy);
        patch(null, subTree, container, anchor, instance);
        instance.subTree = subTree;
        instance.isMounted = true;
        // onMounted
        if (m) {
          invokerhooks(m);
        }
      } else {
        const { next, bu, u } = instance;
        if (next) {
          // 更新组件的状态属性
          updateComponentPreRender(instance, next);
        }

        //  onBeforeUpdate
        if (bu) {
          invokerhooks(bu);
        }

        const newSubTree = render.call(instance.proxy, instance.proxy);
        // 更新组件状态，添加组件实例instance
        patch(instance.subTree, newSubTree, container, anchor, instance);
        instance.subTree = newSubTree;
        // onUpdated
        if (u) {
          invokerhooks(u);
        }
      }
    };
    const _effect = new ReactiveEffect(componentUpdateFn, () =>
      queueJob(update)
    );
    const update = () => {
      _effect.run();
    };
    instance.update = update;
    update();
  };

  const mountComponent = (n2, container, anchor, parentComponent) => {
    // 创建实例
    const instance = (n2.component = createComponentInstance(
      n2,
      parentComponent
    ));

    // 设置实例对象
    setupComponent(instance);

    // 创建effect更新 dom
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

  // 更新组件的props
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
    updateComponentProps(instance, instance.props, next.props);
  };

  // 组件是否要更新
  const shouldComponentUpdate = (n1, n2) => {
    const { props: preProps, children: preChildren } = n1;
    const { props: nextProps, children: nextChildren } = n2;

    // 更新插槽
    if (preChildren || nextChildren) {
      return true;
    }
    if (preProps === nextProps) {
      return false;
    }
    // 更新props
    return isChangeProps(preProps, nextProps);
  };
  const updateComponent = (n1, n2, container) => {
    const instance = (n2.component = n1.component);
    // props有变化更新instance.props
    if (shouldComponentUpdate(n1, n2)) {
      // 同步新组件的vnode，更新状态时候，自动更新dom
      instance.next = n2;

      instance.update();
    }
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
      // 倒序插入
      let toBePatched = e2 - s2 + 1;
      let newIndexToOldIndexMap = new Array(toBePatched).fill(0);

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
          // 新旧更新节点映射关联 newIndex -> oldIndex
          newIndexToOldIndexMap[nextPosIndex - s2] = i;
          // 复用旧节点
          patch(oldPos, c2[nextPosIndex], el);
        }
      }

      let longIncSeq = longIncSequeue(newIndexToOldIndexMap);

      let lastLongIncSeqIndex = longIncSeq.length - 1;
      for (let i = toBePatched - 1; i >= 0; i--) {
        const newPosIndex = s2 + i;
        const anchor = c2[newPosIndex + 1]?.el;
        const newVnode = c2[newPosIndex];
        if (!newVnode?.el) {
          // 新增
          patch(null, newVnode, el, anchor);
        } else {
          if (i === longIncSeq[lastLongIncSeqIndex]) {
            lastLongIncSeqIndex--;
          } else {
            hostInsert(newVnode.el, el, anchor);
          }
        }
      }
    }
  };

  /**
   * 类型相同，更新 children
   * @param {} n1 旧节点
   * @param {} n2 新节点
   * @param {} el
   * 1. 旧文本，新数组
   * 2. 旧文本，新文本，替换
   * 3. 旧文本，新null ，删除旧的
   * 4. 旧数组，新不是数组，删除旧的
   * 5. 旧数组，新本文，删除旧的
   * 6. 旧数组，新数组，diff
   *
   */
  const patchChildren = (n1, n2, el, parentComponent) => {
    const c1 = n1.children;
    // 兼容一下传入字符串问题
    const c2 = isArray(n2.children)
      ? dealWithChildrenIsString(n2.children)
      : n2.children;
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
          mountChildren(c2, el, parentComponent);
        }
      }
    }
  };
  // 差异化更新 el复用
  const patchElement = (n1, n2, container, parentComponent) => {
    const el = (n2.el = n1.el);
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    patchProps(oldProps, newProps, el);
    patchChildren(n1, n2, el, parentComponent);
  };

  const processElement = (n1, n2, container, anchor, parentComponent) => {
    // n1=null初始化 创建元素，否则差异化更新
    if (n1 === null) {
      mountElement(n2, container, anchor, parentComponent);
    } else {
      // 类型相同复用 差异化更新
      patchElement(n1, n2, container, parentComponent);
    }
  };

  const processText = (n1, n2, container) => {
    if (n1 === null) {
      // 创建文本
      hostInsert((n2.el = hostCreateText(n2.children)), container);
    } else {
      // 更新文本
      const el = (n2.el = n1.el);
      if (n1.children !== n2.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent) => {
    if (n1 === null) {
      // 创建
      mountChildren(n2.children, container, parentComponent);
    } else {
      // 更新
      patchChildren(n1, n2, container, parentComponent);
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent) => {
    if (n1 === null) {
      mountComponent(n2, container, anchor, parentComponent);
    } else {
      updateComponent(n1, n2, container);
    }
  };

  const patch = (n1, n2, container, anchor?, parentComponent?) => {
    if (n1 === n2) {
      return;
    }
    // 判断是否是同一个vnode,是删除n1，初始化n2
    if (n1 && !isSameVnode(n1, n2)) {
      unMount(n1);
      n1 = null; // 删除n1，走n2初始化
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
          // 更新元素
          processElement(n1, n2, container, anchor, parentComponent);
        } else if (shapeFlag & ShapeFlags.TELEPORT) {
          const renderFn = {
            mountChildren,
            patchChildren,
            moveTo(vnode, container, anchor) {
              const el = vnode.component
                ? vnode.component.subTree.el
                : vnode.el;
              hostInsert(el, container, anchor);
            },
          };
          type.process(n1, n2, container, anchor, parentComponent, renderFn);
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
          processComponent(n1, n2, container, anchor, parentComponent);
        }
    }
  };

  // 调用runtime-dom中创建dom API ,创建元素渲染到 container
  const render = (vnode, container) => {
    // vnode=null,移除当前vnode，删除当前el
    if (vnode === null) {
      unMount(container._vnode);
    } else {
      patch(container._vnode || null, vnode, container);
      // 保存上一次的vnode
      container._vnode = vnode;
    }
  };

  return { render };
}
