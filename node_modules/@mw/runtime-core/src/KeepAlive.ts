export const KeepAlive = {
  __isKeepAlive: true,
  setup(props, { slots }) {
    return (proxy) => {
      const vnode = slots.default();
      vnode.transition = props;

      return vnode;
    };
  },
};
export const isKeepAlive = (v) => v.__isKeepAlive;
