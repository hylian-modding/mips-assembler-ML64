import { runFunction } from "mips-assembler/dist/js/src/functions";
import { throwError } from "mips-assembler/dist/js/src/errors";
import { basicDirectiveMatcher } from "mips-assembler/dist/js/src/directives/directiveHelpers";
/**
 * .skip passes over a given amout of bytes without overwriting them.
 * @param state Current assembler state.
 */
export default function skip(state) {
    if (state.lineExpressions.length !== 1) {
        throwError(".skip directive requires one numeric argument", state);
    }
    var imm = runFunction(state.lineExpressions[0], state);
    if (typeof imm !== "number") {
        throwError("Could not parse .skip immediate " + imm, state);
        return false;
    }
    if (imm < 0)
        throwError(".skip directive cannot skip a negative length.", state);
    state.outIndex += imm;
    return true;
}
skip.matches = basicDirectiveMatcher("skip");
