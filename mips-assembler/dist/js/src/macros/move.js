"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const macroHelpers_1 = require("mips-assembler/dist/js/src/macros/macroHelpers");
const types_1 = require("mips-assembler/dist/js/src/types");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * move dest,reg
 *
 * @param state Current assembler state.
 */
function move(state) {
    if (state.currentPass !== types_1.AssemblerPhase.firstPass) {
        (0, errors_1.throwError)("The `move` macro shouldn't be present after the first assembly phase", state);
        return;
    }
    if (state.lineExpressions.length !== 2)
        (0, errors_1.throwError)("The `move` macro must take two registers", state);
    state.line = ""; // Delete this line.
    state.linesToInsert = "ADDU " + state.lineExpressions[0] + " " + state.lineExpressions[1] + " R0";
}
exports.default = move;
move.matches = (0, macroHelpers_1.basicMacroMatcher)("move");
