"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const symbols_1 = require("mips-assembler/dist/js/src/symbols");
const labels_1 = require("mips-assembler/dist/js/src/labels");
const errors_1 = require("mips-assembler/dist/js/src/errors");
var equRegex = new RegExp("^\\s*(" + labels_1.LABEL_REGEX_STR + ")\\s+equ(?:$|(?:\\s+(.+)$))", "i");
/**
 * `equ` is used for direct text replacement.
 * @param state Current assembler state.
 */
function equ(state) {
    var match = state.line.match(equRegex);
    if (!match) {
        (0, errors_1.throwError)("equ directive was not able to be parsed", state);
    }
    // lineExpressions only has ["equ", value] and might split the value, so use regex.
    var name = match[1];
    var value = match[2] || "";
    (0, symbols_1.addSymbol)(state, name, value);
    return true; // Symbol added
}
exports.default = equ;
equ.matches = function (state) {
    var results = state.line.match(equRegex);
    return results !== null;
};
