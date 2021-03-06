import { AssemblerPhase } from "mips-assembler/dist/js/src/types";
import { throwError } from "mips-assembler/dist/js/src/errors";
import { basicDirectiveMatcher } from "mips-assembler/dist/js/src/directives/directiveHelpers";
/**
 * Writes 32-bit float values.
 * .float value[,...]
 * @param state Current assembler state.
 */
export default function float(state) {
    if (state.currentPass === AssemblerPhase.secondPass) {
        if (!state.evaluatedLineExpressions.length) {
            throwError(".float directive requires arguments", state);
        }
        if (state.evaluatedLineExpressions.some(function (v) { return typeof v !== "number"; })) {
            throwError(".float directive requires numeric arguments", state);
        }
        var numbers = state.evaluatedLineExpressions;
        for (var i = 0; i < numbers.length; i++) {
            state.dataView.setFloat32(state.outIndex + (i * 4), numbers[i]);
        }
    }
    state.outIndex += 4 * state.lineExpressions.length;
    return true;
}
float.matches = basicDirectiveMatcher("float");
