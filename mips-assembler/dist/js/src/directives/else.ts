import { basicDirectiveMatcher } from "mips-assembler/dist/js/src/directives/directiveHelpers";
import { setIfElseBlockState, IfElseStateFlags, IfElseBlockStateMask } from "mips-assembler/dist/js/src/conditionals";
import { throwError } from "mips-assembler/dist/js/src/errors";
/**
 * .else
 *
 * @param state Current assembler state.
 */
export default function elseblock(state) {
    if (state.lineExpressions.length)
        throwError("The else directive cannot take a condition or parameters", state);
    if (!state.ifElseStack.length)
        throwError("An else directive was reached, but there was no previous if directive", state);
    var curState = state.ifElseStack[state.ifElseStack.length - 1];
    if (curState & IfElseStateFlags.SawElse)
        throwError("Encountered another else directive, but an else directive was already passed", state);
    switch (curState & IfElseBlockStateMask) {
        case IfElseStateFlags.AcceptingBlock:
            setIfElseBlockState(state, IfElseStateFlags.ExecutingBlock);
            break;
        case IfElseStateFlags.ExecutingBlock:
            setIfElseBlockState(state, IfElseStateFlags.NoLongerAcceptingBlock);
            break;
        case IfElseStateFlags.NoLongerAcceptingBlock:
            break;
        default:
            throwError("Unexpected conditional block state: " + curState.toString(16), state);
    }
    state.ifElseStack[state.ifElseStack.length - 1] |= IfElseStateFlags.SawElse;
    return true;
}
elseblock.matches = basicDirectiveMatcher("else", true);
