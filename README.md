# vue-source-code


## vue3源码阅读，实现核心功能


 1. reactivity
    - reactive
      - createReactiveObject ： 创建响应式对象
      - track : 创建dep，收集依赖,
      - trigger : 触发依赖
    - effect
      - createReactiveEffect : 创建响应式effect
      - run : 执行effect
      - stop : 停止effect
      - scheduler : 调用run，更新数据
    - ref
    - computed
    - watch
    - watchEffect

**响应式流程：**

 2. runtime-dom & runtime-core
    - nodeOptions : dom 节点选项
      - createElement : 创建dom节点
      - patchAttr :  修改dom节点属性(其他类型的属性)
      - patchEvent : 修改dom节点事件(对事件进行缓存，保持引用避免多次创建)
      - patchClass : 修改dom节点class
      - patchStyle : 修改dom节点style

    - createRenderer : 创建render渲染器，可扩展自定义渲染器，跨平台
      - shapeFlags : 节点类型(位运算计算)
      - mountElement : 挂载dom节点
      - mountChildren : 挂载dom节点子节点

    - h : 创建虚拟节点
    - render : 内置渲染方式，通过patch-diff 调用dom api实现更新
    