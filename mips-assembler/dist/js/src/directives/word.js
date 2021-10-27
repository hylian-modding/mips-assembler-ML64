"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("mips-assembler/dist/js/src/types");
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * Writes 32-bit values.
 * .word value[,...]
 * .dw value[,...]
 * @param state Current assembler state.
 */
function word(state) {
    if (state.currentPass === types_1.AssemblerPhase.secondPass) {
        if (!state.evaluatedLineExpressions.length) {
            (0, errors_1.throwError)(".word directive requires arguments", state);
        }
        var numbers = state.evaluatedLineExpressions;
        for (var i = 0; i < numbers.length; i++) {
            var num = numbers[i];
            if (typeof num !== "number") {
                (0, errors_1.throwError)(".word directive requires numeric arguments, saw: " + num, state);
            }
            if (num < 0)
                state.dataView.setInt32(state.outIndex + (i * 4), num);
            else
                state.dataView.setUint32(state.outIndex + (i * 4), num);
        }
    }
    state.outIndex += 4 * state.lineExpressions.length;
    return true;
}
exports.default = word;
var wMatcher = (0, directiveHelpers_1.basicDirectiveMatcher)("word");
var dwMatcher = (0, directiveHelpers_1.basicDirectiveMatcher)("dw");
word.matches = function (state) {
    return wMatcher(state) || dwMatcher(state);
};
