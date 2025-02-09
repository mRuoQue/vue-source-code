import { PatchFlags } from "@mw/shared";
import { NodeTypes } from "./ast";
import { parse } from "./parse";
import { createCallExpression, TO_DISPLAY_STRING } from "./runtimeHelper";
export function compile(template) {
  const ast = parse(template);

  transform(ast);
}

function transform(ast) {
  const context = createTransformContext(ast);

  traverseNode(ast, context);

  ast.helpers = [...context.helpers.keys()];
}

function traverseNode(node, context) {
  context.currentNode = node;
  let exits = []; // 处理完元素本文，可能倒序执行，回溯

  const transforms = context.transformNode;

  for (let i = 0; i < transforms.length; i++) {
    const transfrom = transforms[i];
    let exit = transfrom(node, context);

    exit && exits.push(exit);
  }

  switch (node.type) {
    case NodeTypes.ROOT:
    // traverseChildren(node, context);
    // break;
    case NodeTypes.ELEMENT:
      for (let i = 0; i < node.children.length; i++) {
        context.parent = node;
        traverseNode(node.children[i], context);
      }
      break;
    // case NodeTypes.TEXT:
    //   // traverseChildren(node, context);
    //   break;

    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING);
      break;
  }

  context.currentNode = node; // 还原当前节点

  let tail = exits.length;
  if (tail > 0) {
    while (tail--) {
      exits[tail]();
    }
  }
}

// 创建模版转化上下文
function createTransformContext(root) {
  const context = {
    root,
    currentNode: root,
    parent: null,
    helpers: new Map(),
    transformNode: [transformElement, transformText, transformExpression],

    helper(key) {
      let num = context.helpers.get(key) || 0;
      context.helpers.set(key, num + 1);

      return num;
    },
  };

  return context;
}

function transformElement(node, context) {
  if (NodeTypes.ELEMENT === node.type) {
    console.log(node, "处理元素");
  }

  return function () {};
}

function transformText(node, context) {
  if (NodeTypes.ELEMENT === node.type || NodeTypes.ROOT === node.type) {
    console.log(node, "元素中的文本");
    return function () {
      let hasText = false;
      let container = null;

      const children = node.children;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (isText(child)) {
          hasText = true;

          for (let j = i + 1; j < children.length; j++) {
            const next = children[j];
            if (isText(next)) {
              if (!container) {
                container = children[i] = {
                  type: NodeTypes.COMPOUND_EXPRESSION,
                  children: [child],
                };
              }

              container.children.push(" + ", child);
              children.splice(j, 1);
              j--;
            } else {
              container = null;
              break;
            }
          }
        }
      }

      if (!hasText || children.length === 1) {
        return;
      }

      for (let i = 0; i < children.length; i++) {
        let args = [];

        const child = children[i];
        if (isText(child) || child.type === NodeTypes.COMPOUND_EXPRESSION) {
          args.push(child);
          if (child.type !== NodeTypes.TEXT) {
            args.push(PatchFlags.TEXT);
          }
        }

        children[i] = {
          type: NodeTypes.TEXT_CALL,
          content: child,
          codegenNode: createCallExpression(context, args),
        };
      }
    };
  }
}

function isText(node) {
  return node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION;
}

function transformExpression(node, context) {
  if (NodeTypes.INTERPOLATION === node.type) {
    console.log(node, "处理表达式");
    node.content.content = `_ctx.${node.content.content}`;
  }
}
