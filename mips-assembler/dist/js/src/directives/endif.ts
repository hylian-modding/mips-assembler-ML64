import { basicDirectiveMatcher } from "mips-assembler/dist/js/src/directives/directiveHelpers";
import { throwError } from "mips-assembler/dist/js/src/errors";
/**
 * .endif
 * Ends the last open if or else block.
 *
 * @param state Current assembler state.
 */
export default function endif(state) {
    if (state.lineExpressions.length)
        throwError("The endif directive cannot take a condition or parameters", state);
    if (!state.ifElseStack.length)
        throwError("An endif directive was reached, but there was no previous if directive", state);
    state.ifElseStack.pop();
    return true;
}
endif.matches = basicDirectiveMatcher("endif", true);
