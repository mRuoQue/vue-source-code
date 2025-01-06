import { activeEffect, trackEffect, triggerEffect } from "./effect";
import { toReactive } from "./reactive";
import { createDep } from "./reactiveEffect";

export function ref(value) {
  return createRef(value);
}

function createRef(value) {
  return new RefImpl(value);
}

class RefImpl {
  public __v_isRef = true; // 标识当前实例是否是ref类型
  public _value;
  public dep;
  constructor(public rawValue) {
    this.rawValue = rawValue;
    this._value = toReactive(rawValue);
  }
  get value() {
    // 收集依赖
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if (newValue !== this.rawValue) {
      this.rawValue = newValue;
      this._value = newValue;
      // 触发更新
      triggerRefValue(this);
    }
  }
}

export function trackRefValue(ref) {
  if (activeEffect) {
    trackEffect(
      activeEffect,
      (ref.dep = ref.dep || createDep(() => (ref.dep = undefined), "undefined"))
    );
  }
}

export function triggerRefValue(ref) {
  if (ref.dep) {
    triggerEffect(ref.dep);
  }
}

export function toRef(object, key) {
  return new ObjectRefImpl(object, key);
}

export function toRefs(object) {
  let res = {};
  for (const key in object) {
    res[key] = toRef(object, key);
  }

  return res;
}
export function proxyRefs(objectIsRef) {
  return new Proxy(objectIsRef, {
    get(target, key, reactive) {
      const res = Reflect.get(target, key, reactive);
      return res.__v_isRef ? res.value : res;
    },
    set(target, key, value, reactive) {
      const oldValue = target[key];
      if (oldValue.__v_isRef) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, reactive);
      }
    },
  });
}

class ObjectRefImpl {
  public __v_isRef = true;
  constructor(public _object, public _key) {}
  get value() {
    return this._object[this._key];
  }
  set value(newValue) {
    this._object[this._key] = newValue;
  }
}

export function isRef(value) {
  return !!(value && value.__v_isRef);
}
