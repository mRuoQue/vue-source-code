import {
  isArray,
  isFunction,
  isObject,
  isString,
  ShapeFlags,
} from "@mw/shared";
import { isTeleport } from "./functionalComponent/Teleport";

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
    : isTeleport(type)
    ? ShapeFlags.TELEPORT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : isFunction(type)
    ? ShapeFlags.FUNCTIONAL_COMPONENT
    : 0;
  const vnode = {
    __v_isVnode: true,
    el: null,
    key: props?.key,
    type,
    props, // 传入的props
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
