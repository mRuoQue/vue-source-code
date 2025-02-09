import { NodeTypes } from "./ast";
import { parse } from "./parse";
import {
  CREATE_ELEMENT_BLOCK,
  CREATE_ELEMENT_VNODE,
  helperMapName,
  OPEN_BLOCK,
  TO_DISPLAY_STRING,
} from "./runtimeHelper";

import { transform } from "./transform";

export function compile(template) {
  const ast = parse(template);

  transform(ast);

  return generate(ast);
}

function generate(ast) {
  const context = createCodegenContext(ast);
  const { push, indent, deindent, newLine } = context;

  genFunction(ast, context);

  indent();
  push(`return `);

  if (ast.codegenNode) {
    // 根据类型生成代码
    genNode(ast.codegenNode, context);
  } else {
    push(" null");
  }

  deindent();
  push(`}`);
  return context.code;
}

function genNode(node, context) {
  const { push, indent, deindent, newLine } = context;

  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context);
      break;
    // case NodeTypes.INTERPOLATION:
    // genComment(node, context);
    // break;
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context);
      break;
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context);

    case NodeTypes.VNODE_CALL:
      genVnodeCall(node, context);
      break;
  }
}

function genText(node, context) {
  context.push(JSON.stringify(node.content));
}

function genVnodeCall(node, context) {
  const { push, indent, deindent, newLine, helper } = context;
  const { tag, props, children, isBlock } = node;

  if (isBlock) {
    push(`(${helper(OPEN_BLOCK)}(),`);
  }

  const help = isBlock
    ? helper(CREATE_ELEMENT_BLOCK)
    : helper(CREATE_ELEMENT_VNODE);
  push(`${help}(`);

  push(`"div",`);
  push(`null,`);
  push(`123,`);

  if (isBlock) {
    push(`)`);
  }

  push(`)`);
}

function genExpression(node, context) {
  context.push(node.content);
}
function genInterpolation(node, context) {
  const { push, indent, deindent, newLine, helper } = context;

  push(`${helper(TO_DISPLAY_STRING)}(`);

  genNode(node.content, context);
  push(`)`);
}
function genFunction(ast, context) {
  const { push, indent, deindent, newLine } = context;

  if (ast.helpers.length > 0) {
    push(
      `const {${ast.helpers.map(
        (key) => `${helperMapName[key]}:${context.helper(key)}`
      )}} = "./runtime-dom.js"`
    );
  }

  newLine();

  push(`return function render(_ctx) {`);
}

function createCodegenContext(ast) {
  const context = {
    code: "",
    level: 0,
    push(source) {
      context.code += source;
    },
    helper(key) {
      return `_${helperMapName[key]}`;
    },
    indent() {
      newLine(++context.level);
    },
    deindent(noLine = false) {
      if (noLine) {
        --context.level;
      } else {
        newLine(--context.level);
      }
    },
    newLine() {
      newLine(context.level);
    },
  };

  function newLine(l) {
    context.push(`\n${"  ".repeat(l)}`);
  }

  return context;
}
