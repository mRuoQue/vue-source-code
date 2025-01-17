import { extend } from "@vue/shared";

import { nodeOptions } from "./nodeOptions";
import { patchProps } from "./patchProps";

import { createRenderer, reactive } from "@mw/runtime-core";
// domAPI
const rendererOptions = extend(nodeOptions, { patchProps });

// 自定义渲染器
export const render = function (vnode, container) {
  return createRenderer(rendererOptions).render(vnode, container);
};

export * from "@mw/runtime-core";
