// packages/compiler-core/src/ast.ts
var NodeTypes = {
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
  "26": "JS_RETURN_STATEMENT"
};

// packages/shared/src/patchFlags.ts
var PatchFlags = {
  TEXT: 1,
  "1": "TEXT",
  CLASS: 2,
  "2": "CLASS",
  STYLE: 4,
  "4": "STYLE",
  PROPS: 8,
  "8": "PROPS",
  FULL_PROPS: 16,
  "16": "FULL_PROPS",
  NEED_HYDRATION: 32,
  "32": "NEED_HYDRATION",
  STABLE_FRAGMENT: 64,
  "64": "STABLE_FRAGMENT",
  KEYED_FRAGMENT: 128,
  "128": "KEYED_FRAGMENT",
  UNKEYED_FRAGMENT: 256,
  "256": "UNKEYED_FRAGMENT",
  NEED_PATCH: 512,
  "512": "NEED_PATCH",
  DYNAMIC_SLOTS: 1024,
  "1024": "DYNAMIC_SLOTS",
  DEV_ROOT_FRAGMENT: 2048,
  "2048": "DEV_ROOT_FRAGMENT",
  CACHED: -1,
  "-1": "CACHED",
  BAIL: -2,
  "-2": "BAIL"
};

// packages/shared/src/regexp.ts
var regSpaces = /^[ \t\r\n]+/;
var regTag = /^<\/?([a-z][^ \t\r\n/>]*)/;
var regAttr = /^[^\t\r\n\f />][^\t\r\n\f />=]*/;
var regSpaceEqual = /^[\t\r\n\f ]*=/;
var regSpaceChar = /[^\t\r\n\f ]/;

// packages/compiler-core/src/parse.ts
function parse(template) {
  const context = createParserContext(template);
  return createRoot(parseChildren(context));
}
function createRoot(children) {
  return {
    type: NodeTypes.ROOT,
    children
  };
}
function createParserContext(content) {
  return {
    originalSource: content,
    source: content,
    line: 1,
    column: 1,
    offset: 0
  };
}
function isEnd(context) {
  const s = context.source;
  if (s.startsWith("</")) {
    return true;
  }
  return !s;
}
function parseChildren(context) {
  let nodes = [];
  while (!isEnd(context)) {
    let node;
    const c = context.source;
    if (c.startsWith("{{")) {
      node = parseExpression(context);
    } else if (c[0] === "<") {
      node = parseElement(context);
    } else {
      node = parseText(context);
    }
    nodes.push(node);
  }
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    if (node.type === NodeTypes.TEXT) {
      if (!regSpaceChar.test(node.content)) {
        nodes[i] = null;
      } else {
        node.content = node.content.replace(/[ \t\r\n]+/g, " ");
      }
    }
  }
  return nodes.filter((node) => !!node);
}
function parseElement(context) {
  const ele = parseTag(context);
  const children = parseChildren(context);
  if (context.source.startsWith("</")) {
    parseTag(context);
  }
  ele.children = children;
  ele.loc = getSelection(context, ele.loc.start);
  return ele;
}
function parseTag(context) {
  const start = getCursor(context);
  const match = regTag.exec(context.source);
  const tag = match[1];
  advanceBy(context, match[0].length);
  advanceBySpaces(context);
  let props = parseAttrs(context);
  const isSelfClosing = context.source.startsWith("/>");
  advanceBy(context, isSelfClosing ? 2 : 1);
  return {
    type: NodeTypes.ELEMENT,
    tag,
    props,
    isSelfClosing,
    loc: getSelection(context, start)
  };
}
function parseAttrs(context) {
  let props = [];
  while (context.source.length > 0 && !context.source.startsWith(">")) {
    const prop = parseAttr(context);
    props.push(prop);
    advanceBySpaces(context);
  }
  return props;
}
function parseAttrValue(context) {
  let value;
  let quote = context.source[0];
  let isQuoted = quote === "'" || quote === '"';
  if (isQuoted) {
    advanceBy(context, 1);
    const endQuoteIndex = context.source.indexOf(quote, 1);
    value = parseTextData(context, endQuoteIndex);
    advanceBy(context, 1);
  } else {
    value = context.source.match(/([^ \t\r\n/>])+/)[1];
    advanceBy(context, value.length);
    advanceBySpaces(context);
  }
  return value;
}
function parseAttr(context) {
  const start = getCursor(context);
  let match = regAttr.exec(context.source);
  let name = match[0];
  let value;
  advanceBy(context, name.length);
  if (regSpaceEqual.test(context.source)) {
    advanceBySpaces(context);
    advanceBy(context, 1);
    advanceBySpaces(context);
    value = parseAttrValue(context);
  }
  let valueLoc = getSelection(context, start);
  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value: {
      type: NodeTypes.TEXT,
      content: value,
      loc: valueLoc
    },
    loc: getSelection(context, start)
  };
}
function parseExpression(context) {
  const start = getCursor(context);
  const closeIndex = context.source.indexOf("}}", "{{".length);
  advanceBy(context, 2);
  const innerStart = getCursor(context);
  const innerEnd = getCursor(context);
  const contentLength = closeIndex - "{{".length;
  const preContent = parseTextData(context, contentLength);
  const content = preContent.trim();
  const startOffset = preContent.indexOf(content);
  if (startOffset > 0) {
    advancePositionWithMutation(innerStart, preContent, startOffset);
  }
  const endOffset = startOffset + content.length;
  advancePositionWithMutation(innerEnd, preContent, endOffset);
  advanceBy(context, 2);
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
      loc: getSelection(context, innerStart, innerEnd)
    },
    loc: getSelection(context, start)
  };
}
function parseText(context) {
  const tokens = ["<", "{{"];
  let endIndex = context.source.length;
  for (let i = 0; i < tokens.length; i++) {
    const index = context.source.indexOf(tokens[i]);
    if (index !== -1 && index < endIndex) {
      endIndex = index;
    }
  }
  const content = parseTextData(context, endIndex);
  return {
    type: NodeTypes.TEXT,
    content
  };
}
function parseTextData(context, endIndex) {
  const content = context.source.slice(0, endIndex);
  advanceBy(context, endIndex);
  return content;
}
function advanceBySpaces(context) {
  const match = regSpaces.exec(context.source);
  if (match) {
    advanceBy(context, match[0].length);
  }
}
function advanceBy(context, endIndex) {
  let s = context.source;
  advancePositionWithMutation(context, s, endIndex);
  context.source = s.slice(endIndex);
}
function advancePositionWithMutation(context, source, endIndex) {
  let linesCount = 0;
  let linePos = -1;
  for (let i = 0; i < endIndex; i++) {
    if (source.charCodeAt(i) === 10) {
      linesCount++;
      linePos = i;
    }
  }
  context.line += linesCount;
  context.column = linePos === -1 ? context.column + endIndex : endIndex - linePos;
  context.offset += endIndex;
}
function getSelection(context, start, nextEnd) {
  let end = nextEnd || getCursor(context);
  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset)
  };
}
function getCursor(context) {
  let { line, column, offset } = context;
  return { line, column, offset };
}

// packages/compiler-core/src/runtimeHelper.ts
var TO_DISPLAY_STRING = Symbol("TO_DISPLAY_STRING");
var CREATE_ELEMENT_VNODE = Symbol("CREATE_ELEMENT_VNODE");
var CREATE_TEXT_VNODE = Symbol("CREATE_TEXT_VNODE");
var CREATE_COMMENT = Symbol("CREATE_COMMENT");
var CREATE_COMMENT_VNODE = Symbol("CREATE_COMMENT_VNODE");
var CREATE_FRAGMENT = Symbol("CREATE_FRAGMENT");
var helperMapName = {
  [TO_DISPLAY_STRING]: "toDisplayString",
  [CREATE_ELEMENT_VNODE]: "createElementVNode",
  [CREATE_TEXT_VNODE]: "createTextVNode",
  [CREATE_COMMENT]: "createCommentVNode",
  [CREATE_COMMENT_VNODE]: "createCommentVNode",
  [CREATE_FRAGMENT]: "createFragment"
};
function createCallExpression(context, args = []) {
  context.helpers.set(CREATE_TEXT_VNODE);
  return {
    type: NodeTypes.JS_CALL_EXPRESSION,
    callee: helperMapName[CREATE_TEXT_VNODE],
    arguments: args
  };
}

// packages/compiler-core/src/compile.ts
function compile(template) {
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
  let exits = [];
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
  context.currentNode = node;
  let tail = exits.length;
  if (tail > 0) {
    while (tail--) {
      exits[tail]();
    }
  }
}
function createTransformContext(root) {
  const context = {
    root,
    currentNode: root,
    parent: null,
    helpers: /* @__PURE__ */ new Map(),
    transformNode: [transformElement, transformText, transformExpression],
    helper(key) {
      let num = context.helpers.get(key) || 0;
      context.helpers.set(key, num + 1);
      return num;
    }
  };
  return context;
}
function transformElement(node, context) {
  if (NodeTypes.ELEMENT === node.type) {
    console.log(node, "\u5904\u7406\u5143\u7D20");
  }
  return function() {
  };
}
function transformText(node, context) {
  if (NodeTypes.ELEMENT === node.type || NodeTypes.ROOT === node.type) {
    console.log(node, "\u5143\u7D20\u4E2D\u7684\u6587\u672C");
    return function() {
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
                  children: [child]
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
          codegenNode: createCallExpression(context, args)
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
    console.log(node, "\u5904\u7406\u8868\u8FBE\u5F0F");
    node.content.content = `_ctx.${node.content.content}`;
  }
}
export {
  compile,
  parse
};
//# sourceMappingURL=compiler-core.js.map
