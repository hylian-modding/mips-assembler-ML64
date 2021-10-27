"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
const conditionals_1 = require("mips-assembler/dist/js/src/conditionals");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * .else
 *
 * @param state Current assembler state.
 */
function elseblock(state) {
    if (state.lineExpressions.length)
        (0, errors_1.throwError)("The else directive cannot take a condition or parameters", state);
    if (!state.ifElseStack.length)
        (0, errors_1.throwError)("An else directive was reached, but there was no previous if directive", state);
    var curState = state.ifElseStack[state.ifElseStack.length - 1];
    if (curState & conditionals_1.IfElseStateFlags.SawElse)
        (0, errors_1.throwError)("Encountered another else directive, but an else directive was already passed", state);
    switch (curState & conditionals_1.IfElseBlockStateMask) {
        case conditionals_1.IfElseStateFlags.AcceptingBlock:
            (0, conditionals_1.setIfElseBlockState)(state, conditionals_1.IfElseStateFlags.ExecutingBlock);
            break;
        case conditionals_1.IfElseStateFlags.ExecutingBlock:
            (0, conditionals_1.setIfElseBlockState)(state, conditionals_1.IfElseStateFlags.NoLongerAcceptingBlock);
            break;
        case conditionals_1.IfElseStateFlags.NoLongerAcceptingBlock:
            break;
        default:
            (0, errors_1.throwError)("Unexpected conditional block state: " + curState.toString(16), state);
    }
    state.ifElseStack[state.ifElseStack.length - 1] |= conditionals_1.IfElseStateFlags.SawElse;
    return true;
}
exports.default = elseblock;
elseblock.matches = (0, directiveHelpers_1.basicDirectiveMatcher)("else", true);
