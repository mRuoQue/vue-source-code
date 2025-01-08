import { createVnode } from "./createVnode";
import { isObject, isString, isArray, isVnode } from "@mw/shared";
/**
 * @param {string} type 元素
 * @param {Object} props 属性
 * @param {Array<any>} children
 */
export function h(type, props?, children?) {
  // h函数调用传参种类比较多，需要做判断

  const argLen = arguments.length;
  if (argLen === 2) {
    // 如果第二个参数是数组，那么就是children
    if (isArray(props)) {
      return createVnode(type, null, props);
    } else {
      // 否则是个对象，可能是vnode 也可能是props
      if (isVnode(props)) {
        return createVnode(type, null, [props]);
      } else {
        return createVnode(type, props);
      }
    }
  } else {
    if (argLen === 3 && isVnode(children)) {
      children = [children];
    }
    if (argLen > 3) {
      children = Array.from(arguments).slice(2);
    }
  }

  return createVnode(type, props, children);
}
