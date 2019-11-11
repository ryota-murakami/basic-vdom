"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const v_dom_1 = require("./v-dom");
exports.App = () => {
    return (v_dom_1.h("div", null,
        v_dom_1.h("h1", null, "App")));
};
v_dom_1.render(v_dom_1.h(exports.App, null));
