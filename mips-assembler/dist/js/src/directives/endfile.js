"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
const symbols_1 = require("mips-assembler/dist/js/src/symbols");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * .endfile
 *
 * @param state Current assembler state.
 */
function beginfile(state) {
    if (state.lineExpressions.length)
        (0, errors_1.throwError)("The endfile directive takes no arguments", state);
    (0, symbols_1.popStaticLabelStateLevel)(state);
    return true;
}
exports.default = beginfile;
beginfile.matches = (0, directiveHelpers_1.basicDirectiveMatcher)("endfile", true);
