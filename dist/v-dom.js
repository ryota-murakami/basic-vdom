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
