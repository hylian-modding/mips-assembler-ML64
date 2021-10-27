import { basicMacroMatcher } from "mips-assembler/dist/js/src/macros/macroHelpers";
import { AssemblerPhase } from "mips-assembler/dist/js/src/types";
import { throwError } from "mips-assembler/dist/js/src/errors";
/**
 * move dest,reg
 *
 * @param state Current assembler state.
 */
export default function move(state) {
    if (state.currentPass !== AssemblerPhase.firstPass) {
        throwError("The `move` macro shouldn't be present after the first assembly phase", state);
        return;
    }
    if (state.lineExpressions.length !== 2)
        throwError("The `move` macro must take two registers", state);
    state.line = ""; // Delete this line.
    state.linesToInsert = "ADDU " + state.lineExpressions[0] + " " + state.lineExpressions[1] + " R0";
}
move.matches = basicMacroMatcher("move");
