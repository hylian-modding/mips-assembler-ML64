import { basicDirectiveMatcher } from "mips-assembler/dist/js/src/directives/directiveHelpers";
import { pushStaticLabelStateLevel } from "mips-assembler/dist/js/src/symbols";
import { throwError } from "mips-assembler/dist/js/src/errors";
/**
 * .beginfile
 *
 * @param state Current assembler state.
 */
export default function beginfile(state) {
    if (state.lineExpressions.length)
        throwError("The beginfile directive takes no arguments", state);
    pushStaticLabelStateLevel(state);
    return true;
}
beginfile.matches = basicDirectiveMatcher("beginfile", true);
