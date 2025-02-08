export const regSpaces = /^[ \t\r\n]+/; // 匹配空格

export const regTag = /^<\/?([a-z][^ \t\r\n/>]*)/; // 匹配标签

export const regAttr = /^[^\t\r\n\f />][^\t\r\n\f />=]*/; // 匹配属性名

export const regSpaceEqual = /^[\t\r\n\f ]*=/; // 匹配空格 =

export const regSpaceChar = /[^\t\r\n\f ]/; // 匹配空白字符
