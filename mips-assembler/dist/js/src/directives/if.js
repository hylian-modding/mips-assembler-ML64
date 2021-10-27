"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("mips-assembler/dist/js/src/functions");
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
const conditionals_1 = require("mips-assembler/dist/js/src/conditionals");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * .if cond
 *
 * `cond` is met if it evaluates to a non-zero integer.
 *
 * @param state Current assembler state.
 */
function ifcond(state) {
    if (!state.lineExpressions.length)
        (0, errors_1.throwError)("A condition must be passed to an if directive", state);
    if (state.lineExpressions.length > 1)
        (0, errors_1.throwError)("Only a single condition can be passed to an if directive", state);
    var value = (0, functions_1.runFunction)(state.lineExpressions[0], state);
    if (value === null)
        (0, errors_1.throwError)("Could not parse .if condition", state);
    if (typeof value !== "number")
        (0, errors_1.throwError)("Condition of if directive must evaluate to a numeric value, saw: " + value, state);
    if (value) {
        state.ifElseStack.push(conditionals_1.IfElseStateFlags.ExecutingBlock);
    }
    else {
        state.ifElseStack.push(conditionals_1.IfElseStateFlags.AcceptingBlock);
    }
    return true;
}
exports.default = ifcond;
ifcond.matches = (0, directiveHelpers_1.basicDirectiveMatcher)("if");
