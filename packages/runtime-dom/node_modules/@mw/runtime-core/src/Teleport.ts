import { ShapeFlags } from "@mw/shared";

export const Teleport = {
  __isTeleport: true,
  process(n1, n2, container, anchor, parentComponent, internals) {
    let { mountChildren, patchChildren, moveTo } = internals;
    if (!n1) {
      const target = (n2.target = document.querySelector(n2.props.to));
      if (target) {
        mountChildren(n2.children, target, anchor);
      }
    } else {
      patchChildren(n1, n2, n2.target, parentComponent);
      if (n2.props.to !== n1.props.to) {
        const newTarget = document.querySelector(n2.props.to);

        n2.children.forEach((child) => {
          moveTo(child, newTarget, anchor);
        });
      }
    }
  },
  remove(vnode, unMountChildren) {
    const { children, shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.TELEPORT) {
      unMountChildren(children);
    }
  },
};

export const isTeleport = (v) => v.__isTeleport;
