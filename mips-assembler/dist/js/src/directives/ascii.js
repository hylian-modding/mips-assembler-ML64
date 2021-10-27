"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ascii = exports.asciiz = void 0;
const types_1 = require("mips-assembler/dist/js/src/types");
const functions_1 = require("mips-assembler/dist/js/src/functions");
const errors_1 = require("mips-assembler/dist/js/src/errors");
const directiveHelpers_1 = require("mips-assembler/dist/js/src/directives/directiveHelpers");
/**
 * Writes ascii bytes with a trailing zero.
 *
 * @param state Current assembler state.
 */
function asciiz(state) {
    return ascii(state, true);
}
exports.asciiz = asciiz;
asciiz.matches = (0, directiveHelpers_1.basicDirectiveMatcher)("asciiz");
/**
 * Writes ascii bytes.
 *
 * .ascii value[,...]
 * .asciiz value[,...]
 *
 * `value` can either be a string or byte value.
 * ex: "string"
 * ex: 'string'
 * ex: 0x0A
 *
 * @param state Current assembler state.
 */
function ascii(state, appendZero) {
    var numbers = [];
    var lineExps = state.lineExpressions;
    lineExps.forEach(function (expr) {
        var value = (0, functions_1.runFunction)(expr, state);
        if (value === null)
            (0, errors_1.throwError)("Could not parse .ascii value " + expr, state);
        if (typeof value === "number") {
            numbers.push(value);
        }
        else if (typeof value === "string") {
            for (var i = 0; i < value.length; i++) {
                numbers.push(value.charCodeAt(i));
            }
        }
    });
    if (appendZero)
        numbers.push(0); // Add NULL byte.
    if (state.currentPass === types_1.AssemblerPhase.secondPass) {
        for (var i = 0; i < numbers.length; i++) {
            if (numbers[i] < 0)
                state.dataView.setInt8(state.outIndex + i, numbers[i]);
            else
                state.dataView.setUint8(state.outIndex + i, numbers[i]);
        }
    }
    state.outIndex += numbers.length;
    return true;
}
exports.ascii = ascii;
ascii.matches = (0, directiveHelpers_1.basicDirectiveMatcher)("ascii");
