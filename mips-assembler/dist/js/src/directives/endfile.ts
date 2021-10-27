import { basicDirectiveMatcher } from "mips-assembler/dist/js/src/directives/directiveHelpers";
import { popStaticLabelStateLevel } from "mips-assembler/dist/js/src/symbols";
import { throwError } from "mips-assembler/dist/js/src/errors";
/**
 * .endfile
 *
 * @param state Current assembler state.
 */
export default function beginfile(state) {
    if (state.lineExpressions.length)
        throwError("The endfile directive takes no arguments", state);
    popStaticLabelStateLevel(state);
    return true;
}
beginfile.matches = basicDirectiveMatcher("endfile", true);
