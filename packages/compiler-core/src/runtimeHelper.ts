import { NodeTypes } from "./ast";

export const TO_DISPLAY_STRING = Symbol("TO_DISPLAY_STRING");
export const CREATE_ELEMENT_VNODE = Symbol("CREATE_ELEMENT_VNODE");
export const CREATE_TEXT_VNODE = Symbol("CREATE_TEXT_VNODE");
export const CREATE_COMMENT = Symbol("CREATE_COMMENT");
export const CREATE_COMMENT_VNODE = Symbol("CREATE_COMMENT_VNODE");
export const CREATE_FRAGMENT = Symbol("CREATE_FRAGMENT");

export const helperMapName = {
  [TO_DISPLAY_STRING]: "toDisplayString",
  [CREATE_ELEMENT_VNODE]: "createElementVNode",
  [CREATE_TEXT_VNODE]: "createTextVNode",
  [CREATE_COMMENT]: "createCommentVNode",
  [CREATE_COMMENT_VNODE]: "createCommentVNode",
  [CREATE_FRAGMENT]: "createFragment",
};

export function createCallExpression(context, args = []) {
  context.helpers.set(CREATE_TEXT_VNODE);

  return {
    type: NodeTypes.JS_CALL_EXPRESSION,
    callee: helperMapName[CREATE_TEXT_VNODE],
    arguments: args,
  };
}
