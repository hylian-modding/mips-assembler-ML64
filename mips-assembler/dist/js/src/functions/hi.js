"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hi = void 0;
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * Returns the high half of a 32-bit `value`, adjusted for sign extension of
 * the low half.
 */
function hi(state, value) {
    if (typeof value === "string")
        (0, errors_1.throwError)("Assembler function hi cannot be called with string \"" + value + "\", value must be a number.", state);
    var lower = value & 0x0000FFFF;
    var upper = value >>> 16;
    if (lower & 0x8000)
        upper += 1;
    return upper;
}
exports.hi = hi;
;
