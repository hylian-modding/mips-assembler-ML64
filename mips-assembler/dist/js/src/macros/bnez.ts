import { basicMacroMatcher } from "mips-assembler/dist/js/src/macros/macroHelpers";
import { AssemblerPhase } from "mips-assembler/dist/js/src/types";
import { throwError } from "mips-assembler/dist/js/src/errors";
/**
 * bnez reg,dest
 *
 * @param state Current assembler state.
 */
export default function bnez(state) {
    if (state.currentPass !== AssemblerPhase.firstPass) {
        throwError("The `bnez` macro shouldn't be present after the first assembly phase", state);
        return;
    }
    if (state.lineExpressions.length !== 2)
        throwError("The `bnez` macro must take a register and label", state);
    state.line = ""; // Delete this line.
    state.linesToInsert = "BNE " + state.lineExpressions[0] + " R0 " + state.lineExpressions[1];
}
bnez.matches = basicMacroMatcher("bnez");
