"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abs = void 0;
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * Absolute value of the given `value`.
 */
function abs(state, value) {
    if (typeof value === "string")
        (0, errors_1.throwError)("Assembler function abs cannot be called with string \"" + value + "\", value must be a number.", state);
    return Math.abs(value);
}
exports.abs = abs;
;
