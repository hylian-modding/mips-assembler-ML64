"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * .endif
 * Ends the last open if or else block.
 *
 * @param state Current assembler state.
 */
function endif(state) {
    if (state.lineExpressions.length)
        (0, errors_1.throwError)("The endif directive cannot take a condition or parameters", state);
    if (!state.ifElseStack.length)
        (0, errors_1.throwError)("An endif directive was reached, but there was no previous if directive", state);
    state.ifElseStack.pop();
    return true;
}
exports.default = endif;
endif.matches = (0, directiveHelpers_1.basicDirectiveMatcher)("endif", true);
