"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("mips-assembler/dist/js/src/types");
const functions_1 = require("mips-assembler/dist/js/src/functions");
const errors_1 = require("mips-assembler/dist/js/src/errors");
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
/**
 * .fill length[,value]
 * @param state Current assembler state.
 */
function fill(state) {
    if (!state.lineExpressions.length || state.lineExpressions.length > 2) {
        (0, errors_1.throwError)(".fill directive takes a length and optional value", state);
    }
    var length, value;
    length = (0, functions_1.runFunction)(state.lineExpressions[0], state);
    if (typeof length !== "number") {
        (0, errors_1.throwError)("Could not parse .fill length " + state.lineExpressions[0], state);
        return false;
    }
    if (length < 0)
        (0, errors_1.throwError)(".fill length must be positive.", state);
    if (state.lineExpressions.length > 1) {
        value = (0, functions_1.runFunction)(state.lineExpressions[1], state);
        if (typeof value !== "number") {
            (0, errors_1.throwError)("Could not parse .fill value " + state.lineExpressions[1], state);
            return false;
        }
    }
    else
        value = 0;
    if (state.currentPass === types_1.AssemblerPhase.secondPass) {
        for (var i = 0; i < length; i++)
            state.dataView.setInt8(state.outIndex + i, value);
    }
    state.outIndex += length;
    return true;
}
exports.default = fill;
fill.matches = (0, directiveHelpers_1.basicDirectiveMatcher)("fill");
