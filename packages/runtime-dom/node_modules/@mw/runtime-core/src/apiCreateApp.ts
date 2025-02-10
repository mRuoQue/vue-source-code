import { createVnode } from "./createVnode";

/**
 * 创建app实例
 */

export function createAppAPI(render) {
  return function createApp(rootComponent, rootProps = null) {
    const app = {
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      mount(container) {
        // 创建虚拟节点
        const vnode = createVnode(rootComponent, rootProps);
        // 渲染虚拟节点
        render(vnode, container);
        // 保存容器
        app._container = container;
      },
    };

    return app;
  };
}
