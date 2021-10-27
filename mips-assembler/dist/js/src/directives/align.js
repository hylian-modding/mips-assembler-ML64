"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("mips-assembler/dist/js/src/types");
const functions_1 = require("mips-assembler/dist/js/src/functions");
const errors_1 = require("mips-assembler/dist/js/src/errors");
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
/**
 * .align pads zeroes until the output position is aligned
 * with the specified alignment.
 * @param state Current assembler state.
 */
function align(state) {
    if (state.lineExpressions.length !== 1) {
        (0, errors_1.throwError)(".align requires one power of two number argument", state);
    }
    var imm = (0, functions_1.runFunction)(state.lineExpressions[0], state);
    if (imm === null)
        (0, errors_1.throwError)("Could not parse .align immediate " + state.lineExpressions, state);
    if (typeof imm !== "number") {
        (0, errors_1.throwError)(".align requires one power of two number argument", state);
        return false;
    }
    if (imm % 2)
        (0, errors_1.throwError)(".align directive requires a power of two.", state);
    if (imm < 0)
        (0, errors_1.throwError)(".align directive cannot align by a negative value.", state);
    while (state.outIndex % imm) {
        if (state.currentPass === types_1.AssemblerPhase.secondPass) {
            state.dataView.setUint8(state.outIndex, 0);
        }
        state.outIndex++;
    }
    return true;
}
exports.default = align;
align.matches = (0, directiveHelpers_1.basicDirectiveMatcher)("align");
