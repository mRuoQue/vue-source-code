export function isVnode(value) {
  return value?.__v_isVnode;
}
export function isSameVnode(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
