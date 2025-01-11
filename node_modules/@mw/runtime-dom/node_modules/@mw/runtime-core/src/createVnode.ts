import { isArray, isObject, isString, ShapeFlags } from "@mw/shared";

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
    key: props?.key,
    type,
    props,
    children,
    shapeFlag,
  };
  // 为vnode添加shapeFlag
  if (children) {
    if (isArray(children)) {
      vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
    } else if (isObject(children)) {
      // 组件的children是slot，且 h的第二个参数必须要传
      vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN;
    } else {
      children = String(children);
      vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
    }
  }

  return vnode;
}
