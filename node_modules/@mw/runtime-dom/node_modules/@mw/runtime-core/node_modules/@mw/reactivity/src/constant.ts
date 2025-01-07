export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive", // 是否是响应式对象,如果是则不在代理
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
}

export enum DirtyLevels {
  Dirty = 4, // 脏,取值会运行计算属性
  Clean = 2,
  NoDirty = 0, // 不脏，用缓存值
}
