"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("mips-assembler/dist/js/src/functions");
const errors_1 = require("mips-assembler/dist/js/src/errors");
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
/**
 * .org changes the effective memory position.
 * @param state Current assembler state.
 */
function org(state) {
    if (state.lineExpressions.length !== 1) {
        (0, errors_1.throwError)(".org directive requires one numeric argument", state);
    }
    var imm = (0, functions_1.runFunction)(state.lineExpressions[0], state);
    if (typeof imm !== "number") {
        (0, errors_1.throwError)("Could not parse .org immediate " + imm, state);
        return false;
    }
    if (imm < 0)
        (0, errors_1.throwError)(".org directive cannot be negative", state);
    state.memPos = imm >>> 0; // Better be 32-bit
    return true;
}
exports.default = org;
org.matches = (0, directiveHelpers_1.basicDirectiveMatcher)("org");
