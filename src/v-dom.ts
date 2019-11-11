export type Attrs = { [key: string]: any }

export interface Props {
  attrs: Attrs
  children: VNode[]
}

export type VNodeType = 'element' | 'text'

export interface VNode {
  type: VNodeType
  name: string
  props?: Props
}

export type Component = (attrs: Attrs, children: VNode[]) => VNode

function normalize(children: VNode[]): VNode[] {
  const arr = []
  children.forEach(c => {
    if (c == null || typeof c === 'boolean') return
    if (Array.isArray(c)) {
      arr.push(...normalize(c))
    } else if (typeof c === 'string' || typeof c === 'number') {
      arr.push({ type: 'text', name: c })
    } else {
      arr.push(c)
    }
  })
  return arr
}

export function h(
  name: string | Component,
  attrs: Attrs,
  ...children: any[]
): VNode {
  const props = { attrs: attrs || {}, children: normalize(children) }
  return typeof name === 'function'
    ? name(props.attrs, props.children)
    : { type: 'element', name, props }
}

function setAttr(el: Element, k: string, attr: any) {
  if (/^on/.test(k) || k === 'checked' || k === 'value') {
    el[k] = attr
  } else {
    el.setAttribute(k, attr)
  }
}

function removeAttr(el: Element, k: string) {
  if (/^on/.test || k === 'checked' || k === 'value') {
    el[k] = null
  } else {
    el.removeAttribute(k)
  }
}

function updateAttrs(el: Element, oldAttrs: Attrs, newAttrs: Attrs) {
  for (const k in { ...oldAttrs, ...newAttrs }) {
    oldAttrs[k] !== null && newAttrs[k] == null && removeAttr(el, k)
    newAttrs[k] !== null && setAttr(el, k, newAttrs[k])
  }
}

const getNode = (vnode: any): Node => vnode && vnode._node
const setNode = (vnode: any, node: Node) => (vnode._node = node)

function createElement(vnode: VNode): Node {
  switch (vnode.type) {
    case 'text': {
      const node = document.createTextNode(vnode.name as string)
      setNode(vnode, node)
      return node
    }
    case 'element': {
      const node = document.createElement(vnode.name as string)
      const { attrs, children } = vnode.props
      updateAttrs(node, {}, attrs)
      setNode(vnode, node)
      children.forEach(child => node.appendChild(createElement(child)))
      return node
    }
  }
}

export function createRenderer(container: Element) {
  return function render(vnode: VNode) {
    container.firstChild
      ? container.replaceChild(createElement(vnode), container.firstChild)
      : container.appendChild(createElement(vnode))
  }
}

export const render = createRenderer(document.createElement('div'))



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
