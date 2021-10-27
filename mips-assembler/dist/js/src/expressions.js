"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateExpressionsOnCurrentLine = exports.parseExpressionsOnCurrentLine = exports.EXPR_CHARS = void 0;
const functions_1 = require("mips-assembler/dist/js/src/functions");
const immediates_1 = require("mips-assembler/dist/js/src/immediates");
const labels_1 = require("mips-assembler/dist/js/src/labels");
const errors_1 = require("mips-assembler/dist/js/src/errors");
const strings_1 = require("mips-assembler/dist/js/src/strings");
const symbols_1 = require("mips-assembler/dist/js/src/symbols");
exports.EXPR_CHARS = ",-\\w\\s\\(\\)" + labels_1.LABEL_CHARS;
function parseExpressionsOnCurrentLine(state) {
    var line = state.line;
    var firstWhitespaceIndex = (0, strings_1.firstIndexOf)(line, " ", "\t");
    if (firstWhitespaceIndex === -1) {
        state.lineExpressions = [];
        return; // Must not have any arguments, there would need to be whitespace for those.
    }
    var exprList = line.substr(firstWhitespaceIndex + 1);
    var exprs = [];
    splitExpressionList(exprList, exprs, state);
    state.lineExpressions = exprs;
}
exports.parseExpressionsOnCurrentLine = parseExpressionsOnCurrentLine;
function evaluateExpressionsOnCurrentLine(state) {
    var line = state.line;
    var firstWhitespaceIndex = (0, strings_1.firstIndexOf)(line, " ", "\t");
    if (firstWhitespaceIndex === -1)
        return line; // Must not have any arguments, there would need to be whitespace for those.
    var firstPiece = line.substring(0, firstWhitespaceIndex);
    var exprList = line.substr(firstWhitespaceIndex + 1);
    var exprs = [];
    splitExpressionList(exprList, exprs, state);
    state.lineExpressions = exprs;
    if (exprs.length > 0) {
        var evaluatedExprs_1 = [];
        exprs.forEach(function (expr, i) {
            var evaluated = (0, functions_1.runFunction)(expr, state);
            // For the last piece, do extra logic to fix branch values.
            if (typeof evaluated === "number" && i === exprs.length - 1) {
                evaluated = _fixBranch(firstPiece, evaluated, state);
            }
            evaluatedExprs_1.push(evaluated);
        });
        state.evaluatedLineExpressions = evaluatedExprs_1;
        line = firstPiece + " " + _formatEvaluatedExprs(evaluatedExprs_1, exprs).join(" ");
    }
    return line;
}
exports.evaluateExpressionsOnCurrentLine = evaluateExpressionsOnCurrentLine;
function _formatEvaluatedExprs(values, originalValues) {
    return values.map(function (value, i) {
        if (typeof value === "number") {
            return (0, immediates_1.formatImmediate)(value);
        }
        if (value === null) {
            return originalValues[i];
        }
        return value;
    });
}
/** Transforms branches from absolute to relative. */
function _fixBranch(inst, offset, state) {
    if (_instIsBranch(inst)) {
        var memOffset = state.memPos + state.outIndex;
        var offsetDiff = offset - memOffset;
        if (offsetDiff % 4 !== 0) {
            (0, errors_1.throwError)("Misaligned branch instruction detected", state);
        }
        var diff = (offsetDiff / 4) - 1;
        return diff;
    }
    return offset; // Leave as is.
}
function _instIsBranch(inst) {
    inst = inst.toLowerCase();
    if (inst[0] !== "b")
        return false;
    switch (inst) {
        case "bc1f":
        case "bc1fl":
        case "bc1t":
        case "bc1tl":
        case "beq":
        case "beql":
        case "bgez":
        case "bgezal":
        case "bgezall":
        case "bgezl":
        case "bgtz":
        case "bgtzl":
        case "blez":
        case "blezl":
        case "bltz":
        case "bltzal":
        case "bltzall":
        case "bltzl":
        case "bne":
        case "bnel":
            return true;
    }
    return false;
}
function splitExpressionList(str, pieces, state) {
    var currentPiece = "";
    var currentStrQuoteChar = ""; // When set, we're writing a string
    var currentParenLevel = 0; // When > 0, we're inside a parenthesis grouper
    var escaped = false;
    var prevChar = "";
    function writeToCurrentPiece(char) {
        currentPiece += char;
    }
    function endCurrentPiece() {
        while (charSplitsExpressions(currentPiece[currentPiece.length - 1])) {
            currentPiece = currentPiece.slice(0, -1);
        }
        currentPiece = currentPiece.trim(); // Sanity check
        // We actually have only seen white spaces, so don't create a separate piece yet.
        if (!currentPiece)
            return;
        // If this piece directly evaluates to an equ replacement symbol,
        // then handle the replacement here.
        // This is what makes equ work, in a limited capacity.
        var symValue = (0, symbols_1.getSymbolValue)(state, currentPiece);
        if (typeof symValue === "string") {
            splitExpressionList(symValue, pieces, state);
        }
        else {
            pieces.push(currentPiece);
        }
        currentPiece = "";
    }
    function endPieceIfApplicable() {
        if (currentStrQuoteChar || currentParenLevel)
            return; // Still need to close a string/group, can't end piece.
        if (!charSplitsExpressions(prevChar))
            return; // Still writing something.
        endCurrentPiece();
    }
    for (var i = 0; i < str.length; i++) {
        var char = str[i];
        endPieceIfApplicable();
        switch (char) {
            case "(":
                if (!escaped && !currentStrQuoteChar) {
                    currentParenLevel++;
                }
                break;
            case ")":
                if (!escaped && !currentStrQuoteChar) {
                    if (currentParenLevel <= 0) {
                        (0, errors_1.throwError)("Imbalanced parenthesis in expression: " + str, state);
                    }
                    currentParenLevel--;
                }
                break;
            case "\"":
            case "'":
                if (!escaped) {
                    if (currentStrQuoteChar) {
                        if (currentStrQuoteChar === char) { // Ending string
                            currentStrQuoteChar = "";
                        }
                        // Else just writing a quote inside, ex: "assembler's"
                    }
                    else { // Beginning string
                        currentStrQuoteChar = char;
                    }
                }
                break;
        }
        writeToCurrentPiece(char);
        if (!escaped && char === "\\") {
            escaped = true;
        }
        else {
            escaped = false;
        }
        prevChar = char;
    }
    if (currentParenLevel > 0)
        (0, errors_1.throwError)("Imbalanced parenthesis in expression: " + str, state);
    if (currentStrQuoteChar)
        (0, errors_1.throwError)("Unterminated string: " + currentPiece, state);
    endCurrentPiece();
    return pieces;
}
function charSplitsExpressions(char) {
    return char === "," || charIsWhitespace(char);
}
function charIsWhitespace(char) {
    return char === " " || char === "\t";
}
