"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const macroHelpers_1 = require("mips-assembler/dist/js/src/macros/macroHelpers");
const types_1 = require("mips-assembler/dist/js/src/types");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * bnez reg,dest
 *
 * @param state Current assembler state.
 */
function bnez(state) {
    if (state.currentPass !== types_1.AssemblerPhase.firstPass) {
        (0, errors_1.throwError)("The `bnez` macro shouldn't be present after the first assembly phase", state);
        return;
    }
    if (state.lineExpressions.length !== 2)
        (0, errors_1.throwError)("The `bnez` macro must take a register and label", state);
    state.line = ""; // Delete this line.
    state.linesToInsert = "BNE " + state.lineExpressions[0] + " R0 " + state.lineExpressions[1];
}
exports.default = bnez;
bnez.matches = (0, macroHelpers_1.basicMacroMatcher)("bnez");
