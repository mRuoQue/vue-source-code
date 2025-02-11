import { isArray, isString } from "@mw/shared";
import { NodeTypes } from "./ast";
import {
  CREATE_ELEMENT_BLOCK,
  CREATE_ELEMENT_VNODE,
  helperMapName,
  OPEN_BLOCK,
  TO_DISPLAY_STRING,
  globalModuleName,
} from "./runtimeHelper";

export function generate(ast) {
  // 生成codegen上下文
  const context = createCodegenContext(ast);
  const { push, indent, deindent, newLine } = context;

  const renderFnName = "render";
  const args = ["_ctx", "_cache", "$props"];

  genFunction(ast, context);

  push(`return `);
  push(`function ${renderFnName}(${args.join(",")}){`);

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

function genFunction(ast, context) {
  const { push, indent, deindent, newLine, helper } = context;

  push(`const _${globalModuleName} = ${globalModuleName}`);
  newLine();

  if (ast.helpers.length > 0) {
    push(
      `const {${ast.helpers.map(
        (key) => `${helperMapName[key]}:${helper(key)}`
      )}} = _${globalModuleName}`
    );
    newLine();
  }

  // deindent();
  // push(`export `);
}

function genNode(node, context) {
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
      break;
    case NodeTypes.VNODE_CALL:
    case NodeTypes.TEXT_CALL:
      genVnodeCall(node, context);
      break;
  }
}

function genText(node, context) {
  context.push(JSON.stringify(node.content));
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
function genVnodeCall(node, context) {
  const { push, indent, deindent, newLine, helper } = context;
  const { tag, props, children, isBlock, patchFlag, dynamicProps } = node;

  if (isBlock) {
    push(`(${helper(OPEN_BLOCK)}(),`);
  }

  const help = isBlock
    ? helper(CREATE_ELEMENT_BLOCK)
    : helper(CREATE_ELEMENT_VNODE);
  push(`${help}(`);

  const args = genNullableArgs([tag, props, children, patchFlag, dynamicProps]);
  //   const args = [tag, props, children, patchFlag, dynamicProps];
  //   createElementBlock('div',null,[])
  genNodeList(args, context);

  if (isBlock) {
    push(`)`);
  }

  push(`)`);
}

/**
 * 
 * [tag, props, children, patchFlag, dynamicProps]
*
* [ "div", "null",{ "type": 2, "content": "333"}, "null","null"]
* 
 * return (_openBlock(),_createElementBlock("div", null, "333", null, null)){
 * 
 * return (_openBlock(), _createElementBlock("div", null, [
    _createTextVNode("123"),
    _createElementVNode("div"),
    _createTextVNode("555")
  ]))
 */

function genNodeList(nodes, context) {
  const { push, indent, deindent, newLine } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node === "null") {
      push(null);
    } else if (isString(node) && node !== "null") {
      push(node !== "null" ? JSON.stringify(node) : node);
    } else if (isArray(node)) {
      genNodeListToArray(node, context);
    } else {
      if (node.codegenNode) {
        genNode(node.codegenNode, context);
      } else {
        genNode(node, context);
      }
    }

    if (i < nodes.length - 1) {
      push(", ");
    }
  }
}

function genNullableArgs(args = []) {
  let i = args.length;
  while (i--) {
    if (args[i] !== null) {
      break;
    }
  }
  return args.slice(0, i + 1).map((arg) => arg || `null`);
}

function genNodeListToArray(nodes, context) {
  const { push, indent, deindent, newLine } = context;

  push(`[`);
  genNodeList(nodes, context);
  push(`]`);
}
