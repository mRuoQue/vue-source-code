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

// packages/shared/src/regexp.ts
var regSpaces = /^[ \t\r\n]+/;
var regTag = /^<\/?([a-z][^ \t\r\n/>]*)/;
var regAttr = /^[^\t\r\n\f />][^\t\r\n\f />=]*/;
var regSpaceEqual = /^[\t\r\n\f ]*=/;
var regSpaceChar = /[^\t\r\n\f ]/;

// packages/compiler-core/src/index.ts
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
        node.content = node.content.replace(/^[ \t\r\n]+/g, " ");
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
  console.log(ele);
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
export {
  parse
};
//# sourceMappingURL=compiler-core.js.map
