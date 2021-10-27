"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("mips-assembler/dist/js/src/types");
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * .byte value[,...]
 * .db value[,...]
 * @param state Current assembler state.
 */
function byte(state) {
    if (state.currentPass === types_1.AssemblerPhase.secondPass) {
        if (!state.evaluatedLineExpressions.length) {
            (0, errors_1.throwError)(".byte directive requires arguments", state);
        }
        var numbers = state.evaluatedLineExpressions;
        for (var i = 0; i < numbers.length; i++) {
            var num = numbers[i];
            if (typeof num !== "number") {
                (0, errors_1.throwError)(".byte directive requires numeric arguments, saw: " + num, state);
            }
            if (num < 0)
                state.dataView.setInt8(state.outIndex + i, num);
            else
                state.dataView.setUint8(state.outIndex + i, num);
        }
    }
    state.outIndex += state.lineExpressions.length;
    return true;
}
exports.default = byte;
var byteMatcher = (0, directiveHelpers_1.basicDirectiveMatcher)("byte");
var dbMatcher = (0, directiveHelpers_1.basicDirectiveMatcher)("db");
byte.matches = function (state) {
    return byteMatcher(state) || dbMatcher(state);
};
