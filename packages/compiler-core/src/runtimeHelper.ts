export const TO_DISPLAY_STRING = Symbol("TO_DISPLAY_STRING");
export const CREATE_ELEMENT_VNODE = Symbol("CREATE_ELEMENT_VNODE");
export const CREATE_TEXT_VNODE = Symbol("CREATE_TEXT_VNODE");
export const CREATE_COMMENT = Symbol("CREATE_COMMENT");
export const CREATE_COMMENT_VNODE = Symbol("CREATE_COMMENT_VNODE");
export const Fragment = Symbol("Fragment");
export const OPEN_BLOCK = Symbol("OPEN_BLOCK");
export const CREATE_ELEMENT_BLOCK = Symbol("CREATE_ELEMENT_BLOCK");

export const helperMapName = {
  [TO_DISPLAY_STRING]: "toDisplayString",
  [CREATE_ELEMENT_VNODE]: "createElementVNode",
  [CREATE_TEXT_VNODE]: "createTextVNode",
  [CREATE_COMMENT]: "createCommentVNode",
  [CREATE_COMMENT_VNODE]: "createCommentVNode",
  [Fragment]: "Fragment",
  [OPEN_BLOCK]: "openBlock",
  [CREATE_ELEMENT_BLOCK]: "createElementBlock",
};

export const globalModuleName = "Mwvue";
