export function effect(fn: any) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });

  _effect.run();
  return _effect;
}

export let activeEffect;
/**
 * 依赖收集
 * @param fn 执行函数
 * @param scheduler 触发函数
 * @returns ReactiveEffect
 * @example effect(() => {})
 */
class ReactiveEffect {
  public active: boolean = true;
  track_id = 0;
  depsLength = 0;
  deps = [];

  constructor(public fn: () => void, public scheduler?: () => void) {
    this.fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    if (!this.active) {
      return this.fn();
    }
    // 保留上一次的effect，避免effect 嵌套导致effect的依赖收集错误，保证最后一次的effect是正确
    let nextActiveEffrct = activeEffect;
    try {
      // 保存当前的effect到全局变量
      activeEffect = this;
      return this.fn();
    } finally {
      activeEffect = nextActiveEffrct;
    }
  }
}

export function trackEffect(effect, dep) {
  // 添加依赖
  dep.set(effect, effect.track_id);
  effect.deps[effect.depsLength++] = dep;
}

export function triggerEffect(dep) {
  const effects = dep.keys();
  effects.forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler();
    }
  });
}
