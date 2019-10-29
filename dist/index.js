"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const v_dom_1 = require("./v-dom");
const Foo = () => v_dom_1.h("div", null, "foo");
console.log(JSON.stringify(v_dom_1.h("section", { bar: "bar" },
    v_dom_1.h(Foo, null)), null, 2));
