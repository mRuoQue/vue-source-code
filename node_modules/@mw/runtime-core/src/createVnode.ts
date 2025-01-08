import { isObject, isString, ShapeFlags } from "@mw/shared";

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
