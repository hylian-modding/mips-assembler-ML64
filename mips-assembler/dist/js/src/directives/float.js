"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("mips-assembler/dist/js/src/types");
const errors_1 = require("mips-assembler/dist/js/src/errors");
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
/**
 * Writes 32-bit float values.
 * .float value[,...]
 * @param state Current assembler state.
 */
function float(state) {
    if (state.currentPass === types_1.AssemblerPhase.secondPass) {
        if (!state.evaluatedLineExpressions.length) {
            (0, errors_1.throwError)(".float directive requires arguments", state);
        }
        if (state.evaluatedLineExpressions.some(function (v) { return typeof v !== "number"; })) {
            (0, errors_1.throwError)(".float directive requires numeric arguments", state);
        }
        var numbers = state.evaluatedLineExpressions;
        for (var i = 0; i < numbers.length; i++) {
            state.dataView.setFloat32(state.outIndex + (i * 4), numbers[i]);
        }
    }
    state.outIndex += 4 * state.lineExpressions.length;
    return true;
}
exports.default = float;
float.matches = (0, directiveHelpers_1.basicDirectiveMatcher)("float");
