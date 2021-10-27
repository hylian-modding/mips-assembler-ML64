"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("mips-assembler/dist/js/src/types");
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * Writes 16-bit values.
 * .halfword value[,...]
 * .dh value[,...]
 * @param state Current assembler state.
 */
function halfword(state) {
    if (state.currentPass === types_1.AssemblerPhase.secondPass) {
        if (!state.evaluatedLineExpressions.length) {
            (0, errors_1.throwError)(".halfword directive requires arguments", state);
        }
        var numbers = state.evaluatedLineExpressions;
        for (var i = 0; i < numbers.length; i++) {
            var num = numbers[i];
            if (typeof num !== "number") {
                (0, errors_1.throwError)(".halfword directive requires numeric arguments, saw: " + num, state);
            }
            if (num < 0)
                state.dataView.setInt16(state.outIndex + (i * 2), num);
            else
                state.dataView.setUint16(state.outIndex + (i * 2), num);
        }
    }
    state.outIndex += 2 * state.lineExpressions.length;
    return true;
}
exports.default = halfword;
var hwMatcher = (0, directiveHelpers_1.basicDirectiveMatcher)("halfword");
var dhMatcher = (0, directiveHelpers_1.basicDirectiveMatcher)("dh");
halfword.matches = function (state) {
    return hwMatcher(state) || dhMatcher(state);
};
