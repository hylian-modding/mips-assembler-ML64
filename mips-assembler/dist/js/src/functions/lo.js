"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lo = void 0;
const errors_1 = require("mips-assembler/dist/js/src/errors");
/** Returns the sign-extended low half of a 32-bit `value`. */
function lo(state, value) {
    if (typeof value === "string")
        (0, errors_1.throwError)("Assembler function lo cannot be called with string \"" + value + "\", value must be a number.", state);
    return value & 0x0000FFFF;
}
exports.lo = lo;
;
