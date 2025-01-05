export let activeEffect;

export function effect(fn: any, options?) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });

  _effect.run();

  // 添加options，手动更新scheduler
  if (options) {
    Object.assign(_effect, options);
  }
  // 方便用户手动调用
  const runner = _effect.run.bind(_effect);
  // 暴漏出去effect的引用
  runner.effect = _effect;
  return runner;
}

/**
 * 依赖收集
 * @param fn 执行函数
 * @param scheduler 触发函数，会执行effect.run()更新视图
 * @returns ReactiveEffect
 * @example effect(() => {})
 */
class ReactiveEffect {
  public active: boolean = true;
  _running = 0; // effec.run()运行中 （避免死循环，state改变，循环调用scheduler）
  _trackId = 0; // 记录执行的次数，避免同一个属性多次收集
  _depsLength = 0;
  deps = []; // 反向记录effect，方便后续diff，最大量复用依赖

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
      // console.log("effect run ...");
      // 清除上次的依赖
      cleanupPreEffect(this);
      this._running++;
      return this.fn();
    } finally {
      this._running--;
      overflowDepEffect(this);
      activeEffect = nextActiveEffrct;
    }
  }
}

// 清除上一次的依赖关系，重新diff 依赖，最大限度复用
function cleanupPreEffect(effect) {
  effect._depsLength = 0;
  effect._trackId++;
}
// 清除依赖
function cleanupDepEffect(dep, effect) {
  dep.delete(effect);
  if (dep.size == 0) {
    dep?.cleanup();
  }
}

// 溢出的依赖，需要清除掉
function overflowDepEffect(effect) {
  if (effect._depsLength < effect.deps.length) {
    for (let i = effect._depsLength; i < effect.deps.length; i++) {
      let dep = effect.deps[i];
      cleanupDepEffect(dep, effect);
    }
  }
}

/***
 * 添加依赖,如果需要重新收集依赖，尽可能复用旧的依赖，不需要的清除掉
 * @param effect 当前的effect
 * @param dep 当前的依赖 -> {ReactiveEffect, _trackId}
 */
export function trackEffect(effect, dep) {
  // 优化多次收集相同属性
  if (effect._trackId !== dep.get(effect)) {
    // 添加依赖
    dep.set(effect, effect._trackId);

    // 取之前的effect
    const oldDep = effect.deps[effect._depsLength];
    // 没oldDep，说明是新的依赖，需要保存到effect中
    if (oldDep !== dep) {
      // 保存过，需要删除旧的依赖
      if (oldDep) {
        cleanupDepEffect(oldDep, effect);
      }
      // 保存依赖到effect中,最新的dep
      effect.deps[effect._depsLength++] = dep;
    } else {
      // 相同，说明是同一个依赖，不用重复收集,比较下一个
      effect._depsLength++;
    }
  }
}

export function triggerEffect(dep) {
  const effects = dep.keys();
  effects.forEach((effect) => {
    if (!effect._running) {
      if (effect.scheduler) {
        effect.scheduler();
      }
    }
  });
}
