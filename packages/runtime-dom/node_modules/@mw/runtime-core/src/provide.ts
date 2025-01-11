import { currentInstance } from "./component";
export function provide(key, value) {
  // setup中运行
  if (!currentInstance) {
    return;
  }
  let provides = currentInstance.provides;
  const parentProvides = currentInstance?.parent?.provides;

  if (parentProvides === provides) {
    provides = currentInstance.provides = Object.create(provides);
  }

  provides[key] = value;
}

export function inject(key, defaultValue) {
  // setup中运行
  if (!currentInstance) {
    return;
  }
  const provides = currentInstance.parent?.provides;
  if (provides) {
    if (key in provides) {
      return provides[key];
    } else {
      return defaultValue;
    }
  }
}
