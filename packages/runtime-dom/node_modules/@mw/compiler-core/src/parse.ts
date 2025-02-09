import { NodeTypes } from "./ast";
import {
  regTag,
  regSpaces,
  regAttr,
  regSpaceEqual,
  regSpaceChar,
} from "@mw/shared";

function parse(template) {
  const context = createParserContext(template);
  return createRoot(parseChildren(context));
}

function createRoot(children) {
  return {
    type: NodeTypes.ROOT,
    children,
  };
}

function createParserContext(content) {
  return {
    originalSource: content,
    source: content,
    line: 1,
    column: 1,
    offset: 0,
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
  let nodes = [] as any;
  // 有内容继续循环
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
  // 去除空节点

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

// 解析元素
function parseElement(context) {
  const ele = parseTag(context);
  // 开始标签递归 <div>
  // 掉过结束标签 </div>
  const children = parseChildren(context);
  if (context.source.startsWith("</")) {
    parseTag(context);
  }

  (ele as any).children = children;
  (ele as any).loc = getSelection(context, ele.loc.start);

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
    loc: getSelection(context, start),
  };
}

function parseAttrs(context) {
  let props = [];

  while (context.source.length > 0 && !context.source.startsWith(">")) {
    // 解析属性
    const prop = parseAttr(context);
    props.push(prop);
    advanceBySpaces(context);
  }

  return props;
}

// 解析属性值
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
    // 将>也去除
    value = context.source.match(/([^ \t\r\n/>])+/)[1];
    advanceBy(context, value.length);
    advanceBySpaces(context);
  }

  return value;
}

// 解析属性
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
    name: name,
    value: {
      type: NodeTypes.TEXT,
      content: value,
      loc: valueLoc,
    },
    loc: getSelection(context, start),
  };
}

// 解析表达式  {{ name }}
function parseExpression(context) {
  const start = getCursor(context);
  // 结束}}的下标，跳过开始{{
  const closeIndex = context.source.indexOf("}}", "{{".length);
  // 删除 {{
  advanceBy(context, 2);

  const innerStart = getCursor(context);
  const innerEnd = getCursor(context);
  // 获取content
  const contentLength = closeIndex - "{{".length;
  // 包含空格的内容
  const preContent = parseTextData(context, contentLength);
  const content = preContent.trim();
  const startOffset = preContent.indexOf(content);

  if (startOffset > 0) {
    // 定位前面空格的位置
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
      loc: getSelection(context, innerStart, innerEnd),
    },
    loc: getSelection(context, start),
  };
}

// 解析文本
function parseText(context) {
  const tokens = ["<", "{{"];

  let endIndex = context.source.length;

  for (let i = 0; i < tokens.length; i++) {
    const index = context.source.indexOf(tokens[i]);
    if (index !== -1 && index < endIndex) {
      endIndex = index;
    }
  }
  // 找到文本结束最近的索引
  const content = parseTextData(context, endIndex);

  return {
    type: NodeTypes.TEXT,
    content,
  };
}

// 截取文本
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
    // 换行

    if (source.charCodeAt(i) === 10) {
      linesCount++;
      linePos = i;
    }
  }
  context.line += linesCount;
  context.column =
    linePos === -1 ? context.column + endIndex : endIndex - linePos;
  context.offset += endIndex;
}

function getSelection(context, start, nextEnd?) {
  let end = nextEnd || getCursor(context);
  // eslint 可以根据 start，end找到要报错的位置
  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset),
  };
}

function getCursor(context) {
  let { line, column, offset } = context;
  return { line, column, offset };
}

export { parse };
