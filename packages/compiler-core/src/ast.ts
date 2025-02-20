import {
  CREATE_ELEMENT_VNODE,
  CREATE_TEXT_VNODE,
  helperMapName,
  Fragment,
} from "./runtimeHelper";

export const NodeTypes = {
  ROOT: 0,
  "0": "ROOT",
  ELEMENT: 1,
  "1": "ELEMENT",
  TEXT: 2,
  "2": "TEXT",
  COMMENT: 3,
  "3": "COMMENT",
  SIMPLE_EXPRESSION: 4,
  "4": "SIMPLE_EXPRESSION",
  INTERPOLATION: 5,
  "5": "INTERPOLATION",
  ATTRIBUTE: 6,
  "6": "ATTRIBUTE",
  DIRECTIVE: 7,
  "7": "DIRECTIVE",
  COMPOUND_EXPRESSION: 8,
  "8": "COMPOUND_EXPRESSION",
  IF: 9,
  "9": "IF",
  IF_BRANCH: 10,
  "10": "IF_BRANCH",
  FOR: 11,
  "11": "FOR",
  TEXT_CALL: 12,
  "12": "TEXT_CALL",
  VNODE_CALL: 13,
  "13": "VNODE_CALL",
  JS_CALL_EXPRESSION: 14,
  "14": "JS_CALL_EXPRESSION",
  JS_OBJECT_EXPRESSION: 15,
  "15": "JS_OBJECT_EXPRESSION",
  JS_PROPERTY: 16,
  "16": "JS_PROPERTY",
  JS_ARRAY_EXPRESSION: 17,
  "17": "JS_ARRAY_EXPRESSION",
  JS_FUNCTION_EXPRESSION: 18,
  "18": "JS_FUNCTION_EXPRESSION",
  JS_CONDITIONAL_EXPRESSION: 19,
  "19": "JS_CONDITIONAL_EXPRESSION",
  JS_CACHE_EXPRESSION: 20,
  "20": "JS_CACHE_EXPRESSION",
  JS_BLOCK_STATEMENT: 21,
  "21": "JS_BLOCK_STATEMENT",
  JS_TEMPLATE_LITERAL: 22,
  "22": "JS_TEMPLATE_LITERAL",
  JS_IF_STATEMENT: 23,
  "23": "JS_IF_STATEMENT",
  JS_ASSIGNMENT_EXPRESSION: 24,
  "24": "JS_ASSIGNMENT_EXPRESSION",
  JS_SEQUENCE_EXPRESSION: 25,
  "25": "JS_SEQUENCE_EXPRESSION",
  JS_RETURN_STATEMENT: 26,
  "26": "JS_RETURN_STATEMENT",
};

export function createCallExpression(context, args = []) {
  context.helpers.set(CREATE_TEXT_VNODE);

  return {
    type: NodeTypes.JS_CALL_EXPRESSION,
    callee: helperMapName[CREATE_TEXT_VNODE],
    arguments: args,
  };
}

export function createVnodeCall(context, tag, props, children) {
  let key;

  if (tag !== Fragment) {
    key = context.helper(CREATE_ELEMENT_VNODE);
  }
  return {
    type: NodeTypes.VNODE_CALL,
    callee: key,
    tag,
    props,
    children,
  };
}

export function createObjExpression(context, args = []) {
  return {
    type: NodeTypes.JS_OBJECT_EXPRESSION,
    properties: args,
  };
}
