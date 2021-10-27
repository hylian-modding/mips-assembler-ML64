"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const macroHelpers_1 = require("mips-assembler/dist/js/src/macros/macroHelpers");
const types_1 = require("mips-assembler/dist/js/src/types");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * beqz reg,dest
 *
 * @param state Current assembler state.
 */
function beqz(state) {
    if (state.currentPass !== types_1.AssemblerPhase.firstPass) {
        (0, errors_1.throwError)("The `beqz` macro shouldn't be present after the first assembly phase", state);
        return;
    }
    if (state.lineExpressions.length !== 2)
        (0, errors_1.throwError)("The `beqz` macro must take a register and label", state);
    state.line = ""; // Delete this line.
    state.linesToInsert = "BEQ " + state.lineExpressions[0] + " R0 " + state.lineExpressions[1];
}
exports.default = beqz;
beqz.matches = (0, macroHelpers_1.basicMacroMatcher)("beqz");
