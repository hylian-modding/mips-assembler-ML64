"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("mips-assembler/dist/js/src/functions");
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
const types_1 = require("mips-assembler/dist/js/src/types");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * .include FileName
 *
 * `FileName` is a key in the `files` object passed to `assemble`.
 *
 * @param state Current assembler state.
 */
function include(state) {
    if (!state.lineExpressions.length)
        (0, errors_1.throwError)("A file name must be passed to an include directive", state);
    if (state.lineExpressions.length > 1)
        (0, errors_1.throwError)("Only a single file name can be passed to an include directive", state);
    var filename = (0, functions_1.runFunction)(state.lineExpressions[0], state);
    if (filename === null)
        (0, errors_1.throwError)("Could not parse .include file name", state);
    if (typeof filename !== "string") {
        (0, errors_1.throwError)("File name of include directive must evaluate to a string, saw: " + filename, state);
        return;
    }
    var file = state.files[filename];
    if (typeof file !== "string")
        (0, errors_1.throwError)("The " + filename + " file was not a string", state);
    if (state.currentPass !== types_1.AssemblerPhase.firstPass) {
        (0, errors_1.throwError)("The `include` directive shouldn't be present after the first assembly phase", state);
        return;
    }
    state.linesToInsert =
        ".beginfile\n" + file + "\n.endfile";
    state.line = ""; // Delete this directive.
}
exports.default = include;
include.matches = (0, directiveHelpers_1.basicDirectiveMatcher)("include");
