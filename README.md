# vue-source-code


## vue3源码阅读，实现核心功能


 **1. reactivity**  

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

 响应式流程：

 **2. runtime-dom & runtime-core**  

      - nodeOptions : dom 节点选项
        - createElement : 创建dom节点
        - patchAttr :  修改dom节点属性(其他类型的属性)
        - patchEvent : 修改dom节点事件(对事件进行缓存，保持引用避免多次创建)
        - patchClass : 修改dom节点class
        - patchStyle : 修改dom节点style

      - createRenderer : 创建render渲染器，可扩展自定义渲染器，跨平台
        - shapeFlags : 节点类型(位运算计算)
        - mountElement : 挂载dom节点，属性的挂载和dom的挂载
        - mountChildren : 挂载dom节点子节点，递归
        - patch : 子节点比较策略
          - n1=null,创建和初始化n2  mountElement(n2, container);
          - patchElement(n1, n2, container)：类型相同，diff
            - patchProps : 节点属性比较策略
            - patchChildren : 节点子节点比较策略（新旧节点比较shapeFlag，执行相应的策略）
            - patchKeyedChildren：节点子节点比较策略（keyed diff）
              - 1. 从头部比较相同节点复用
              - 2. 从尾部比较相同节点复用
              - 3. 新节点多出的，patch(null,newVnode,el,anchor)
              - 4. 旧节点多出的，unMount(oldVnode.el)
              - 5. 中间部分存map表，如果旧节点找到索引，删除旧节点，新节点找到索引，复用（patch(oldPos, c2[nextPosIndex], el)）及创建新节点（patch(null, newVnode, el, anchor)）。
              - 6. 最长递增子序列优化diff，通过新节点构建新旧索引映射表，根据映射表，找到最长递增子序列，倒序构建子序列，记录上一个子索引，找出倒序更新索引，相同的索引则跳过，否则插入

          - processText : 处理文本
          - processFragment : 处理fragment
          - processComponent : 处理组件
            - 1. 创建组件实例
            - 2. 给实例挂载属性，并代理属性
            - 3. 创建effect，执行render，更新dom
            - 4. 更新组件
              - 1. 复用旧组件dom
              - 2. props变化同步新节点vnode，instance上添加标记
              - 3. 调用instance.update()更新dom
              - 4. 

        -setup : setup(props,ctx),返回对象则添加到代理属性上，返回函数则赋值 render
        - $attrs : 代理属性，通过getter获取
        - $slots : 代理属性，通过getter获取
        - emit : 自定义事件，从 组件实例上vnode获取到用户传入的props，匹配事件名，调用emit触发事件
        - expose : 暴露组件实例属性，挂载到instance上 -> exposed
        - unMount : 卸载组件
        - provide/inject : 暴露组件实例，获取父组件上的provide，并且在processElement、processComponent中增加parentComponent实例

        - Teleport : 内置组件，设置shapeFlag,在当前type上添加process方法，渲染使用，传入mountChildren、patchChildren、unMountChildren方法，供外部使用，并且实现moveTo（hostInsert）方法 用来移动当前的Teleport组件到指定位置
        
      - h : 创建虚拟节点
        - 多态判断通过createVnode(type, props, children)创建不同vnode
        - createVnode : 定义vnode格式，创建shapeFlag对应关系
        
      - render : 内置渲染方式，通过patch-diff 调用dom api实现更新
    