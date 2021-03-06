import { basicDirectiveMatcher } from "mips-assembler/dist/js/src/directives/directiveHelpers";
import { runFunction } from "mips-assembler/dist/js/src/functions";
import { setIfElseBlockState, IfElseStateFlags, IfElseBlockStateMask } from "mips-assembler/dist/js/src/conditionals";
import { throwError } from "mips-assembler/dist/js/src/errors";
/**
 * .elseif cond
 *
 * `cond` is met if it evaluates to a non-zero integer.
 *
 * @param state Current assembler state.
 */
export default function elseif(state) {
    if (!state.lineExpressions.length)
        throwError("A condition must be passed to an elseif directive", state);
    if (state.lineExpressions.length > 1)
        throwError("Only a single condition can be passed to an elseif directive", state);
    if (!state.ifElseStack.length)
        throwError("An elseif directive was reached, but there was no previous if directive", state);
    var curState = state.ifElseStack[state.ifElseStack.length - 1];
    if (curState & IfElseStateFlags.SawElse)
        throwError("Encountered an elseif after seeing an else directive", state);
    var value = runFunction(state.lineExpressions[0], state);
    if (value === null)
        throwError("Could not parse .elseif condition", state);
    if (typeof value !== "number")
        throwError("Condition of elseif directive must evaluate to a numeric value, saw: " + value, state);
    switch (curState & IfElseBlockStateMask) {
        case IfElseStateFlags.AcceptingBlock:
            if (value) {
                setIfElseBlockState(state, IfElseStateFlags.ExecutingBlock);
            }
            break;
        case IfElseStateFlags.ExecutingBlock:
            setIfElseBlockState(state, IfElseStateFlags.NoLongerAcceptingBlock);
            break;
        case IfElseStateFlags.NoLongerAcceptingBlock:
            break;
        default:
            throwError("Unexpected conditional block state: " + curState.toString(16), state);
    }
    return true;
}
elseif.matches = basicDirectiveMatcher("elseif");
