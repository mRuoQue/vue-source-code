import { isFunction } from "@mw/shared";
import { h } from "../h";
import { ref } from "@mw/reactivity";

export function defineAsyncComponent(options) {
  // 统一 格式 ：options可以是一个函数，可以是选项式
  if (isFunction(options)) {
    options = { loader: options };
  }

  return {
    setup() {
      let loaded = ref(false);
      let errored = ref(false);
      let errReason = ref("");
      let loading = ref(false);
      let loadingtimer = null;
      let renderComponent = null;
      let attempts = 0;

      const {
        loader,
        errorComponent,
        delay,
        loadingComponent,
        timeout,
        onError,
      } = options;
      if (loadingComponent) {
        loadingtimer = setTimeout(() => {
          loading.value = true;
        }, delay);
      }

      if (timeout) {
        setTimeout(() => {
          errored.value = true;
          errReason.value = "loading timeout ...";
          throw new Error("组件加载超时 ...");
        }, timeout);
      }

      function handerLoader() {
        return loader().catch((err) => {
          if (onError) {
            return new Promise((resolve, reject) => {
              const retry = () => resolve(handerLoader());
              const fail = () => reject(err);
              onError(err, retry, fail, ++attempts);
            });
          } else {
            throw err;
          }
        });
      }

      handerLoader()
        .then((component) => {
          renderComponent = component;
          loaded.value = true;
        })
        .catch((err) => {
          errored.value = err;
        })
        .finally(() => {
          loading.value = false;
          clearTimeout(loadingtimer);
        });
      return () => {
        if (loaded.value) {
          return h(renderComponent);
        } else if (errored.value) {
          return errorComponent
            ? h(errorComponent, { reason: errReason.value })
            : h("div", errReason.value);
        } else if (loading.value && loadingComponent) {
          return h(loadingComponent);
        } else {
          // 这里应该返回一个占位符 Common之类的
          return h("div");
        }
      };
    },
  };
}
