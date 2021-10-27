"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assemble = void 0;
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
        s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
const mips_inst_1 = require("mips-inst");
const types_1 = require("mips-assembler/dist/js/src/types");
const directives_1 = require("mips-assembler/dist/js/src/directives");
const labels_1 = require("mips-assembler/dist/js/src/labels");
const symbols_1 = require("mips-assembler/dist/js/src/symbols");
const expressions_1 = require("mips-assembler/dist/js/src/expressions");
const conditionals_1 = require("mips-assembler/dist/js/src/conditionals");
const state_1 = require("mips-assembler/dist/js/src/state");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * Assembles the given input instructions.
 * @param input Assembly text or lines.
 * @param opts Optional parameters.
 */
function assemble(input, opts) {
    opts = opts || {};
    var arr = normalizeInput(input);
    var state = (0, state_1.makeNewAssemblerState)(opts);
    var outStrs = [];
    // First pass, calculate label positions.
    // Not using `arr.map` because `arr` changes mid-processing.
    var arrNew = [];
    for (var i = 0; i < arr.length; i++) {
        var line = arr[i];
        state.line = line;
        if (shouldSkipCurrentInstruction(state)) {
            if (line) {
                arrNew.push(line);
            }
            continue;
        }
        line = processLabelsOnCurrentLine(state);
        var directive = (0, directives_1.getDirectiveToRun)(state);
        if (directive) {
            (0, expressions_1.parseExpressionsOnCurrentLine)(state);
            (0, directives_1.handleDirective)(state, directive);
            line = state.line; // Directive may change the line.
        }
        else {
            // If !line, then only labels were on the line.
            if (line) {
                state.outIndex += 4;
            }
        }
        if (line) {
            arrNew.push(line);
        }
        if ("linesToInsert" in state && state.linesToInsert) {
            var linesToInsert = normalizeInput(state.linesToInsert);
            arr.splice.apply(arr, __spreadArrays([i + 1, 0], linesToInsert));
            state.linesToInsert = null;
        }
    }
    ;
    arr = arrNew;
    state.buffer = opts.buffer || new ArrayBuffer(state.outIndex);
    state.dataView = new DataView(state.buffer);
    state.memPos = 0;
    state.outIndex = 0;
    state.currentPass = types_1.AssemblerPhase.secondPass;
    // Second pass, assemble!
    arr.forEach(function (line) {
        state.line = line;
        state.lineExpressions = [];
        state.evaluatedLineExpressions = [];
        if (shouldSkipCurrentInstruction(state))
            return line;
        var directive = (0, directives_1.getDirectiveToRun)(state);
        if (directive) {
            (0, expressions_1.evaluateExpressionsOnCurrentLine)(state);
            (0, directives_1.handleDirective)(state, directive);
            return;
        }
        // Start a new "area" if we hit a global symbol boundary.
        var globalSymbol = (0, symbols_1.getSymbolByValue)(state, state.memPos + state.outIndex);
        if (globalSymbol !== null) {
            state.currentLabel = globalSymbol;
        }
        // Apply any built-in functions, symbols.
        line = state.line = (0, expressions_1.evaluateExpressionsOnCurrentLine)(state);
        if (opts.text)
            outStrs.push(line);
        // At this point, we should be able to parse the instruction.
        var inst;
        try {
            inst = (0, mips_inst_1.parse)(line);
        }
        catch (e) {
            (0, errors_1.throwError)(e, state);
            return;
        }
        state.dataView.setUint32(state.outIndex, inst);
        state.outIndex += 4;
    });
    if (state.ifElseStack.length) {
        (0, errors_1.throwError)("An if directive was used without an endif directive", state);
    }
    if (state.staticSymbolIndices[0] !== 0) {
        (0, errors_1.throwError)("A beginfile directive was used without an endfile directive", state);
    }
    if (opts.text)
        return outStrs;
    return state.buffer;
}
exports.assemble = assemble;
/** Tests if the current state deems we shouldn't execute the current line. */
function shouldSkipCurrentInstruction(state) {
    if (state.ifElseStack.length) {
        var ifElseState = state.ifElseStack[state.ifElseStack.length - 1];
        return !(ifElseState & conditionals_1.IfElseStateFlags.ExecutingBlock)
            && !(0, directives_1.isConditionalDirective)(state.line);
    }
    return false;
}
function processLabelsOnCurrentLine(state) {
    var parsedLabel;
    while (parsedLabel = (0, labels_1.parseGlobalLabel)(state)) {
        state.line = state.line.substr(parsedLabel.length + 1).trim();
    }
    return state.line;
}
function normalizeInput(input) {
    var arr = _ensureArray(input);
    arr = arr.filter(function (s) { return typeof s === "string"; });
    arr = _stripComments(arr);
    arr = arr.map(function (s) { return s.trim(); });
    arr = arr.filter(Boolean);
    return arr;
}
/**
 * Strips single line ; or // comments.
 * This isn't perfect, but it does try to detect cases where the comment
 * characters are within a quoted string.
 */
function _stripComments(input) {
    var withinBlockComment = false;
    var lines = input.map(function (line) {
        if (withinBlockComment) {
            // The only thing that can break us out is the closing block comment.
            var blockCommentEndIndex = line.indexOf("*/");
            if (blockCommentEndIndex >= 0) {
                line = line.substr(blockCommentEndIndex + 2);
                withinBlockComment = false;
            }
        }
        if (withinBlockComment) {
            return "";
        }
        var blockCommentIndex = line.indexOf("/*");
        while (blockCommentIndex >= 0) {
            if (!_appearsSurroundedByQuotes(line, blockCommentIndex)) {
                var blockCommentEndIndex = line.indexOf("*/", blockCommentIndex + 2);
                if (blockCommentEndIndex >= 0) {
                    line = line.substr(0, blockCommentIndex) + line.substr(blockCommentEndIndex + 2);
                }
                else {
                    line = line.substr(0, blockCommentIndex);
                    withinBlockComment = true;
                    break;
                }
            }
            else {
                blockCommentIndex++; // Avoid infinite loop
            }
            blockCommentIndex = line.indexOf("/*", blockCommentIndex);
        }
        var semicolonIndex = line.indexOf(";");
        while (semicolonIndex >= 0) {
            if (!_appearsSurroundedByQuotes(line, semicolonIndex)) {
                line = line.substr(0, semicolonIndex);
                // This invalidates any block comment we found earlier this iteration.
                withinBlockComment = false;
                break;
            }
            semicolonIndex = line.indexOf(";", semicolonIndex + 1);
        }
        var slashesIndex = line.indexOf("//");
        while (slashesIndex >= 0) {
            if (!_appearsSurroundedByQuotes(line, slashesIndex)) {
                line = line.substr(0, slashesIndex);
                // This invalidates any block comment we found earlier this iteration.
                withinBlockComment = false;
                break;
            }
            slashesIndex = line.indexOf("//", slashesIndex + 2);
        }
        return line;
    });
    if (withinBlockComment) {
        throw new Error("Unclosed block comment detected.");
    }
    return lines;
}
function _appearsSurroundedByQuotes(line, position) {
    return _appearsSurroundedByCharacter(line, position, "\"")
        || _appearsSurroundedByCharacter(line, position, "'");
}
function _appearsSurroundedByCharacter(line, position, char) {
    var firstCharIndex = line.indexOf(char);
    if (firstCharIndex === -1)
        return false;
    if (firstCharIndex > position)
        return false;
    var afterPosCharIndex = line.indexOf(char, position);
    if (afterPosCharIndex === -1)
        return false;
    return true; // Position seems to be surrounded by character.
}
function _ensureArray(input) {
    if (typeof input === "string")
        return input.split(/\r?\n/);
    if (!Array.isArray(input))
        throw new Error("Input must be a string or array of strings");
    return input;
}
