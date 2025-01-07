import { isObject, isString, ShapeFlags } from "@mw/shared";

/**
 * @param {string} type 元素
 * @param {Object} props 属性
 * @param {Array<any>} children
 */
export function h(type, props?, children?) {}
function createVnode(type, props?, children?) {
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

  return vnode;
}
