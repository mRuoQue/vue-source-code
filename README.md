# vue-source-code


## vue3源码阅读，实现核心功能


 1. reactivity
    - reactive
       
    - ref
    - computed
    - watch
    - watchEffect

**响应式流程：**

 2. runtime-dom & runtime-core
    - nodeOptions : dom 节点选项
    - createRenderer : 渲染器，可扩展自定义渲染器，跨平台
    - h : 创建虚拟节点
    - render : 内置渲染方式
    