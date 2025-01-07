export default function patchAttr(el, prop, value) {
  if (value == null) {
    el.removeAttribute(prop);
  } else {
    el.setAttribute(prop, value);
  }
}
