import { PatchFlags } from "@mw/shared";
import {
  NodeTypes,
  createCallExpression,
  createObjExpression,
  createVnodeCall,
} from "./ast";
import {
  CREATE_ELEMENT_BLOCK,
  CREATE_ELEMENT_VNODE,
  CREATE_TEXT_VNODE,
  OPEN_BLOCK,
  TO_DISPLAY_STRING,
  Fragment,
} from "./runtimeHelper";

export function transform(ast) {
  const context = createTransformContext(ast);
  // 根节点情况
  // 1.文本 2.一个元素createElementVnode - createElmentBlock 3.多个元素  创建Fragment

  traverseNode(ast, context);

  createRootCodegenNode(ast, context);

  ast.helpers = [...context.helpers.keys()];
}

function createRootCodegenNode(ast, context) {
  const { children } = ast;

  if (children.length === 1) {
    const child = children[0];

    if (NodeTypes.ELEMENT === child.type) {
      ast.codegenNode = child.codegenNode;
      context.removeHelper(CREATE_ELEMENT_VNODE);
      context.helper(CREATE_ELEMENT_BLOCK);
      context.helper(OPEN_BLOCK);
      ast.codegenNode.isBlock = true;
    } else {
      ast.codegenNode = child;
    }
  } else if (children.length > 0) {
    ast.codegenNode = createVnodeCall(
      context,
      context.helper(Fragment),
      null,
      children
    );
    context.helper(CREATE_ELEMENT_BLOCK);
    context.helper(OPEN_BLOCK);
    ast.codegenNode.isBlock = true;
  }
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
    removeHelper(key) {
      let num = context.helpers.get(key);
      if (num > 1) {
        context.helpers.set(key, num - 1);
      } else {
        context.helpers.delete(key);
      }
    },
  };

  return context;
}

function transformElement(node, context) {
  if (NodeTypes.ELEMENT === node.type) {
    return function () {
      //createVnodeCall
      const { tag, props, children } = node;

      const vnodeTag = tag;
      let properties = [];

      for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        properties.push({ key: prop.name, value: prop.value.content });
      }

      const propsExpression =
        properties.length > 0 ? createObjExpression(context) : null;

      let vnodeChildren = null;
      if (children.length === 1) {
        vnodeChildren = children[0];
      } else if (children.length > 1) {
        vnodeChildren = children;
      }

      node.codegenNode = createVnodeCall(
        context,
        vnodeTag,
        propsExpression,
        vnodeChildren
      );
    };
  }
}

function transformText(node, context) {
  if (NodeTypes.ELEMENT === node.type || NodeTypes.ROOT === node.type) {
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
    node.content.content = `_ctx.${node.content.content}`;
  }
}
