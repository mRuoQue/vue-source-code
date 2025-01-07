/**
 * 事件绑定
 * @param {*} el DOM
 * @param {*} eventType 事件类型
 * @param {*} handler 事件处理函数
 * @returns void
 */
export default function patchEvent(el, eventType, handler) {
  const invokers = el._evi || (el._evi = {});
  const eventName = eventType.slice(2).toLowerCase();

  const existingInvoker = invokers[eventType];

  if (handler && existingInvoker) {
    // 同名事件重新绑定，缓存里取
    return (existingInvoker.value = handler);
  }
  // 缓存里没有，创建一个
  if (handler) {
    const invoker = createInvoker(handler);
    invokers[eventType] = invoker;
    el.addEventListener(eventName, invoker);
  } else if (existingInvoker) {
    // 缓存里有，当前事件没有绑定，删除缓存
    el.removeEventListener(eventName, existingInvoker);
    invokers[eventType] = null;
  }
}

// 创建新的事件调用函数
function createInvoker(handler) {
  const invoker = (e) => invoker.value(e);
  invoker.value = handler;
  return invoker;
}
