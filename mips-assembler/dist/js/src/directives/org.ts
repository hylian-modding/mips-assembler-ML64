import { runFunction } from "mips-assembler/dist/js/src/functions";
import { throwError } from "mips-assembler/dist/js/src/errors";
import { basicDirectiveMatcher } from "mips-assembler/dist/js/src/directives/directiveHelpers";
/**
 * .org changes the effective memory position.
 * @param state Current assembler state.
 */
export default function org(state) {
    if (state.lineExpressions.length !== 1) {
        throwError(".org directive requires one numeric argument", state);
    }
    var imm = runFunction(state.lineExpressions[0], state);
    if (typeof imm !== "number") {
        throwError("Could not parse .org immediate " + imm, state);
        return false;
    }
    if (imm < 0)
        throwError(".org directive cannot be negative", state);
    state.memPos = imm >>> 0; // Better be 32-bit
    return true;
}
org.matches = basicDirectiveMatcher("org");
