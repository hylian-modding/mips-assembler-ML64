"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
const functions_1 = require("mips-assembler/dist/js/src/functions");
const conditionals_1 = require("mips-assembler/dist/js/src/conditionals");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * .elseif cond
 *
 * `cond` is met if it evaluates to a non-zero integer.
 *
 * @param state Current assembler state.
 */
function elseif(state) {
    if (!state.lineExpressions.length)
        (0, errors_1.throwError)("A condition must be passed to an elseif directive", state);
    if (state.lineExpressions.length > 1)
        (0, errors_1.throwError)("Only a single condition can be passed to an elseif directive", state);
    if (!state.ifElseStack.length)
        (0, errors_1.throwError)("An elseif directive was reached, but there was no previous if directive", state);
    var curState = state.ifElseStack[state.ifElseStack.length - 1];
    if (curState & conditionals_1.IfElseStateFlags.SawElse)
        (0, errors_1.throwError)("Encountered an elseif after seeing an else directive", state);
    var value = (0, functions_1.runFunction)(state.lineExpressions[0], state);
    if (value === null)
        (0, errors_1.throwError)("Could not parse .elseif condition", state);
    if (typeof value !== "number")
        (0, errors_1.throwError)("Condition of elseif directive must evaluate to a numeric value, saw: " + value, state);
    switch (curState & conditionals_1.IfElseBlockStateMask) {
        case conditionals_1.IfElseStateFlags.AcceptingBlock:
            if (value) {
                (0, conditionals_1.setIfElseBlockState)(state, conditionals_1.IfElseStateFlags.ExecutingBlock);
            }
            break;
        case conditionals_1.IfElseStateFlags.ExecutingBlock:
            (0, conditionals_1.setIfElseBlockState)(state, conditionals_1.IfElseStateFlags.NoLongerAcceptingBlock);
            break;
        case conditionals_1.IfElseStateFlags.NoLongerAcceptingBlock:
            break;
        default:
            (0, errors_1.throwError)("Unexpected conditional block state: " + curState.toString(16), state);
    }
    return true;
}
exports.default = elseif;
elseif.matches = (0, directiveHelpers_1.basicDirectiveMatcher)("elseif");
