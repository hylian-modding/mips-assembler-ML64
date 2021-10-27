import { AssemblerPhase } from "mips-assembler/dist/js/src/types";
import { basicDirectiveMatcher } from "mips-assembler/dist/js/src/directives/directiveHelpers";
import { throwError } from "mips-assembler/dist/js/src/errors";
/**
 * Writes 16-bit values.
 * .halfword value[,...]
 * .dh value[,...]
 * @param state Current assembler state.
 */
export default function halfword(state) {
    if (state.currentPass === AssemblerPhase.secondPass) {
        if (!state.evaluatedLineExpressions.length) {
            throwError(".halfword directive requires arguments", state);
        }
        var numbers = state.evaluatedLineExpressions;
        for (var i = 0; i < numbers.length; i++) {
            var num = numbers[i];
            if (typeof num !== "number") {
                throwError(".halfword directive requires numeric arguments, saw: " + num, state);
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
var hwMatcher = basicDirectiveMatcher("halfword");
var dhMatcher = basicDirectiveMatcher("dh");
halfword.matches = function (state) {
    return hwMatcher(state) || dhMatcher(state);
};
