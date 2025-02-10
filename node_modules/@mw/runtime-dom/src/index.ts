import { extend } from "@mw/shared";

import { nodeOptions } from "./nodeOptions";
import { patchProps } from "./patchProps";

import { createRenderer, reactive } from "@mw/runtime-core";
// domAPI
const rendererOptions = extend(nodeOptions, { patchProps });

// 自定义渲染器
export const render = function (vnode, container) {
  return createRenderer(rendererOptions).render(vnode, container);
};

export const createApp = function (...args) {
  return createRenderer(rendererOptions).createApp(...args);
};

export * from "@mw/runtime-core";
export * from "@mw/compiler-core";
