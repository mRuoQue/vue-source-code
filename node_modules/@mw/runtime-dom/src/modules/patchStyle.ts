export default function patchStyle(el, prevVal, nextVal) {
  const style = el.style;

  if (nextVal === null) {
    el.removeAttribute("style");
  } else {
    for (let key in nextVal) {
      style[key] = nextVal[key];
    }
    if (prevVal && typeof prevVal !== "string") {
      for (let key in prevVal) {
        if (nextVal[key] == null) {
          style[key] = "";
        }
      }
    }
  }
}
