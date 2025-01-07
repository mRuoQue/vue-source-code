export const nodeOptions = {
  createElement(tag) {
    return document.createElement(tag);
  },
  setElementText(el, text) {
    el.textContent = text;
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor);
  },
  remove(el) {
    const parent = el.parentNode;
    if (parent) {
      parent.removeChild(el);
    }
  },
  createText(text) {
    return document.createTextNode(text);
  },
  setText(node, text) {
    node.nodeValue = text;
  },
  parentNode(node) {
    return node.parentNode;
  },
  nextSbiling(node) {
    return node.nextSibling;
  },
  patchProp(el, key, oldValue, newValue) {},
};
