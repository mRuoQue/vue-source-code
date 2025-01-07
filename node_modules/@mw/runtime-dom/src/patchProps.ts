import patchAttr from "./modules/patchAttr";
import patchEvent from "./modules/patchEvent";
import patchStyle from "./modules/patchStyle";
import patchClass from "./modules/patchClass";

/**
 * @description: 比较当前dom的属性（class，style，evnet，自定义属性）
 * @param { el } 当前元素
 * @return {prop} 属性
 * @param { preVal } 旧值
 * @param { nextVal } 新值
 */
export const patchProps = (el, prop, preVal, nextVal) => {
  if (prop === "class") {
    return patchClass(el, nextVal);
  } else if (prop === "style") {
    return patchStyle(el, preVal, nextVal);
  } else if (/^on[^a-z]/.test(prop)) {
    return patchEvent(el, prop, nextVal);
  } else {
    return patchAttr(el, prop, nextVal);
  }
};
