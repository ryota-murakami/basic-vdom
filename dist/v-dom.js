"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function normalize(children) {
    const arr = [];
    children.forEach(c => {
        if (c == null || typeof c === 'boolean')
            return;
        if (Array.isArray(c)) {
            arr.push(...normalize(c));
        }
        else if (typeof c === 'string' || typeof c === 'number') {
            arr.push({ type: 'text', name: c });
        }
        else {
            arr.push(c);
        }
    });
    return arr;
}
function h(name, attrs, ...children) {
    const props = { attrs: attrs || {}, children: normalize(children) };
    return typeof name === 'function'
        ? name(props.attrs, props.children)
        : { type: 'element', name, props };
}
exports.h = h;
function setAttr(el, k, attr) {
    if (/^on/.test(k) || k === 'checked' || k === 'value') {
        el[k] = attr;
    }
    else {
        el.setAttribute(k, attr);
    }
}
function removeAttr(el, k) {
    if (/^on/.test || k === 'checked' || k === 'value') {
        el[k] = null;
    }
    else {
        el.removeAttribute(k);
    }
}
function updateAttrs(el, oldAttrs, newAttrs) {
    for (const k in { ...oldAttrs, ...newAttrs }) {
        oldAttrs[k] !== null && newAttrs[k] == null && removeAttr(el, k);
        newAttrs[k] !== null && setAttr(el, k, newAttrs[k]);
    }
}
const getNode = (vnode) => vnode && vnode._node;
const setNode = (vnode, node) => (vnode._node = node);
function createElement(vnode) {
    switch (vnode.type) {
        case 'text': {
            const node = document.createTextNode(vnode.name);
            setNode(vnode, node);
            return node;
        }
        case 'element': {
            const node = document.createElement(vnode.name);
            const { attrs, children } = vnode.props;
            updateAttrs(node, {}, attrs);
            setNode(vnode, node);
            children.forEach(child => node.appendChild(createElement(child)));
            return node;
        }
    }
}
function createRenderer(container) {
    return function render(vnode) {
        container.firstChild
            ? container.replaceChild(createElement(vnode), container.firstChild)
            : container.appendChild(createElement(vnode));
    };
}
exports.createRenderer = createRenderer;
exports.render = createRenderer(document.createElement('div'));
// function patch(parent: Node, old: VNode, vnode
// : VNode) {
//   if (old === vnode) return
//
//   const node = getNode(old)
//
//   if (!old && vnode) {
//     createElementThenInsert(parent, vnode)
//   } else if (old && !vnode) {
//     removeElementThenInsert(old)
//   } else if (old.type !== vnode.type) {
//     if (old.type !== 'text') {
//       node.nodeValue = vnode.name as string
//       setNode(vnode, node)
//       return
//     }
//     createElementThenInsert(parent, vnode, node)
//     removeElement(old)
//   } else {
//     setNode(vnode, node)
//     if (old.type === 'text') return
//     updateElement(node as Element, old.props.attrs, vnode.props.attrs)
//     reconcileChildren(node, old.props.children, vnode.props.children)
//   }
// }
