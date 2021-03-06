import { runFunction } from "mips-assembler/dist/js/src/functions";
import { throwError } from "mips-assembler/dist/js/src/errors";
import { basicDirectiveMatcher } from "mips-assembler/dist/js/src/directives/directiveHelpers";
/**
 * .orga updates the current output buffer index.
 * @param state Current assembler state.
 */
export default function orga(state) {
    if (state.lineExpressions.length !== 1) {
        throwError(".orga directive requires one numeric argument", state);
    }
    var imm = runFunction(state.lineExpressions[0], state);
    if (typeof imm !== "number") {
        throwError("Could not parse .orga immediate " + imm, state);
        return false;
    }
    if (imm < 0)
        throwError(".orga directive cannot be negative.", state);
    state.outIndex = imm >>> 0; // Better be 32-bit
    return true;
}
orga.matches = basicDirectiveMatcher("orga");
