import { AssemblerPhase } from "mips-assembler/dist/js/src/types";
import { runFunction } from "mips-assembler/dist/js/src/functions";
import { throwError } from "mips-assembler/dist/js/src/errors";
import { basicDirectiveMatcher } from "mips-assembler/dist/js/src/directives/directiveHelpers";
/**
 * .fill length[,value]
 * @param state Current assembler state.
 */
export default function fill(state) {
    if (!state.lineExpressions.length || state.lineExpressions.length > 2) {
        throwError(".fill directive takes a length and optional value", state);
    }
    var length, value;
    length = runFunction(state.lineExpressions[0], state);
    if (typeof length !== "number") {
        throwError("Could not parse .fill length " + state.lineExpressions[0], state);
        return false;
    }
    if (length < 0)
        throwError(".fill length must be positive.", state);
    if (state.lineExpressions.length > 1) {
        value = runFunction(state.lineExpressions[1], state);
        if (typeof value !== "number") {
            throwError("Could not parse .fill value " + state.lineExpressions[1], state);
            return false;
        }
    }
    else
        value = 0;
    if (state.currentPass === AssemblerPhase.secondPass) {
        for (var i = 0; i < length; i++)
            state.dataView.setInt8(state.outIndex + i, value);
    }
    state.outIndex += length;
    return true;
}
fill.matches = basicDirectiveMatcher("fill");
