import { getCurrentInstance } from "../component";
import { h } from "../h";

export function Transition(props, { slots }) {
  return h(baseTransitionImpl, resolveTransitionProps(props), slots);
}

const resolveTransitionProps = (props) => {
  const {
    name = "mw",
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`,

    onBeforeEnter,
    onEnter,
    onLeave,
    appear = false,
  } = props;

  return {
    onBeforeEnter(el) {
      onBeforeEnter && onBeforeEnter(el);
      el.classList.add(enterFromClass);
      el.classList.add(enterActiveClass);
    },
    onEnter(el, done) {
      const resolve = () => {
        el.classList.remove(enterFromClass);
        el.classList.remove(enterActiveClass);
        done?.();
      };
      onEnter && onEnter(el, resolve);

      nextFrame(() => {
        el.classList.remove(enterFromClass);
        el.classList.add(enterToClass);
        if (!onEnter || onEnter.length <= 1) {
          el.addEventListener("transitionend", resolve);
        }
      });
    },
    onLeave(el, done) {
      const resolve = () => {
        el.classList.remove(leaveActiveClass);
        el.classList.remove(leaveToClass);
        el.classList.add(enterToClass);
        done?.();
      };
      onLeave && onLeave(el, resolve);
      el.classList.add(leaveFromClass);
      document.body.offsetWidth;
      el.classList.add(leaveActiveClass);
      nextFrame(() => {
        el.classList.remove(leaveFromClass);
        el.classList.add(leaveToClass);
        if (!onLeave || onLeave.length <= 1) {
          el.addEventListener("transitionend", resolve);
        }
      });
    },
  };
};
function nextFrame(fn) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
}
const baseTransitionImpl = {
  props: {
    onBeforeEnter: Function,
    onEnter: Function,
    onActiveEnter: Function,
    onAfterEnter: Function,
    onEnterCancelled: Function,
    onBeforeLeave: Function,
    onLeave: Function,
    onAfterLeave: Function,
    onLeaveCancelled: Function,
    onBeforeAppear: Function,
    onAppear: Function,
    onAfterAppear: Function,
  },
  setup(props, { slots }) {
    return () => {
      const vnode = slots?.default();

      if (!vnode) {
        return;
      }

      vnode.transition = {
        beforeEnter: props.onBeforeEnter,
        enter: props.onEnter,
        activeEnter: props.onActiveEnter,
        afterEnter: props.onAfterEnter,
        beforeLeave: props.onBeforeLeave,
        leave: props.onLeave,
      };

      return vnode;
    };
  },
};
