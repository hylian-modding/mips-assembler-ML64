"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("mips-assembler/dist/js/src/functions");
const errors_1 = require("mips-assembler/dist/js/src/errors");
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
/**
 * .skip passes over a given amout of bytes without overwriting them.
 * @param state Current assembler state.
 */
function skip(state) {
    if (state.lineExpressions.length !== 1) {
        (0, errors_1.throwError)(".skip directive requires one numeric argument", state);
    }
    var imm = (0, functions_1.runFunction)(state.lineExpressions[0], state);
    if (typeof imm !== "number") {
        (0, errors_1.throwError)("Could not parse .skip immediate " + imm, state);
        return false;
    }
    if (imm < 0)
        (0, errors_1.throwError)(".skip directive cannot skip a negative length.", state);
    state.outIndex += imm;
    return true;
}
exports.default = skip;
skip.matches = (0, directiveHelpers_1.basicDirectiveMatcher)("skip");
