import { isFunction } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { trackRefValue, triggerRefValue } from "./ref";
export function computed(getterOptions) {
  let getter;
  let setter;
  const getterFn = isFunction(getterOptions);

  if (getterFn) {
    getter = getterOptions;
    setter = () => {
      console.log("computed setter fn");
    };
  } else {
    getter = getterOptions.get;
    setter = getterOptions.set;
  }

  return new ComputedRefImpl(getter, setter);
}

class ComputedRefImpl {
  public dep;
  public _value; // 缓存旧值
  public _effect; // 计算属性的effect
  constructor(public getter, public setter) {
    this._effect = new ReactiveEffect(
      () => getter(this._value),
      () => {
        // effcet-> scheduler
        triggerRefValue(this);
      }
    );
  }
  get value() {
    if (this._effect.dirty) {
      this._value = this._effect.run();

      // 收集effect
      trackRefValue(this);
    }
    return this._value;
  }

  set value(newValue) {
    this.setter = newValue;
  }
}
