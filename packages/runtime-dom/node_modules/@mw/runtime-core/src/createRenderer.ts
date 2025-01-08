import { ShapeFlags } from "@mw/shared";

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
  const mountElement = (vnode, container) => {
    console.log(vnode);
    const { type, props, children, shapeFlag } = vnode;
    // 创建dom元素
    const el = hostCreateElement(type);
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
    hostInsert(el, container);
  };
  //
  const patch = (n1, n2, container) => {
    if (n1 === n2) {
      return;
    }
    if (n1 === null) {
      // 创建元素
      mountElement(n2, container);
    }
  };
  // 调用runtime-dom中创建dom API ,创建元素渲染到 container
  const render = (vnode, container) => {
    patch(container._vnode || null, vnode, container);
    // 保存上一次的vnode
    container._vnode = vnode;
  };

  return { render };
}
