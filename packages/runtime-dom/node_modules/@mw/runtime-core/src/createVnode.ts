import { isObject, isString, ShapeFlags } from "@mw/shared";

/**
 * 创建虚拟dom
 * @param {} type 组件类型
 * @param {} props 组件属性
 * @param {} children 组件子节点
 * @returns
 */
export function createVnode(type, props?, children?) {
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0;
  const vnode = {
    __v_isVnode: true,
    el: null,
    key: props && props.key,
    type,
    props,
    children,
    shapeFlag,
  };
  // 为vnode添加shapeFlag
  if (children) {
    vnode.shapeFlag |= isString(children)
      ? ShapeFlags.TEXT_CHILDREN
      : ShapeFlags.ARRAY_CHILDREN;
  }

  return vnode;
}
