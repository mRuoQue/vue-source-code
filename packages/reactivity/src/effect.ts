export function effect(fn) {
  const _effect = new ReactiveEffect(fn, () => {
    if (this.scheduler) {
      this.scheduler();
    }
  });

  _effect.run();
  return _effect;
}

export let activeEffect;
class ReactiveEffect {
  constructor(public fn, public scheduler?) {
    this.fn = fn;
    this.scheduler = scheduler;
  }

  // 保存当前的effect到全局变量
  activeEffect = this;
  run() {
    this.fn();
  }
}
