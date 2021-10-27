"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFloatReg = exports.isReg = exports.makeRegexForOpcode = exports.getOpcode = void 0;
var regs_1 = require("./regs");
var immediates_1 = require("./immediates");
var opRegex = "([A-Za-z0-3.]+)";
var immRegex = "(-)?0?([xbo]?)([A-Fa-f0-9]+)";
var regRegex = "\\$?(\\w+)";
var floatRegRegex = "\\$?[Ff]([0-9]+)";
var opcodeRegex = new RegExp("^\\s*" + opRegex);
var _regexCache = Object.create(null);
// Gets the op string from a given entire instruction.
// This is a general form (.fmt rather than .S, .D, etc.)
function getOpcode(str) {
    var match = opcodeRegex.exec(str);
    if (match) {
        var pieces = match[1].split("."); // Could be .fmt, .cond.fmt, etc
        if (pieces.length === 1)
            return pieces[0].toLowerCase();
        // Loop from the end, as the end has the .fmt for tricky things like .D.W
        var result = "";
        var foundFmt = false;
        var foundCond = false;
        for (var i = pieces.length - 1; i > 0; i--) {
            var piece = pieces[i];
            if (!foundFmt) {
                if (piece === "fmt" || (0, regs_1.isFmtString)(piece)) {
                    foundFmt = true;
                    piece = "fmt";
                }
            }
            if (!foundCond) {
                if ((0, regs_1.isCondString)(piece)) {
                    foundCond = true;
                    piece = "cond";
                }
            }
            result = "." + piece + result;
        }
        return (pieces[0] + result).toLowerCase();
    }
    return null;
}
exports.getOpcode = getOpcode;
function makeRegexForOpcode(opcode, opcodeObj) {
    if (_regexCache[opcode]) {
        return _regexCache[opcode];
    }
    var parts = [opRegex];
    var display = opcodeObj.display;
    for (var i = 0; i < display.length; i++) {
        var part = display[i];
        var optional = part.endsWith("?");
        var regexPart = "";
        if (optional)
            regexPart += "(?:[,\\s]+";
        if (display[i + 1] === "(") {
            if (optional)
                throw new Error("Not prepared to generate optional regex with parenthesis");
            if (display[i + 3] !== ")")
                throw new Error("Not prepared to generate regex for multiple values in parenthesis"); // Or no closing paren
            regexPart += makeParenthesisRegex(getRegexForPart(part), getRegexForPart(display[i + 2]));
            i = i + 3;
        }
        else {
            regexPart += getRegexForPart(part);
        }
        if (optional)
            regexPart += ")?";
        parts.push(regexPart);
    }
    var regexStr = "^\\s*" +
        parts.reduce(function (str, next, index) {
            if (index === 0 || partIsOptional(next))
                return str + next;
            return str + "[,\\s]+" + next;
        }, "") +
        "\\s*$";
    var regex = new RegExp(regexStr);
    _regexCache[opcode] = regex;
    return regex;
}
exports.makeRegexForOpcode = makeRegexForOpcode;
function getRegexForPart(part) {
    if (isReg(part))
        return regRegex;
    if (isFloatReg(part))
        return floatRegRegex;
    if ((0, immediates_1.getImmFormatDetails)(part))
        return immRegex;
    throw new Error("Unrecognized display entry " + part);
}
function makeParenthesisRegex(regex1, regex2) {
    return regex1 + "\\s*" + "\\(?" + regex2 + "\\)?";
}
function partIsOptional(partStr) {
    return partStr.startsWith("(?:");
}
function isReg(entry) {
    if (!entry)
        return false;
    switch (entry.substr(0, 2)) {
        case "rs":
        case "rt":
        case "rd":
            return true;
    }
    return false;
}
exports.isReg = isReg;
function isFloatReg(entry) {
    if (!entry)
        return false;
    switch (entry.substr(0, 2)) {
        case "fs":
        case "ft":
        case "fd":
            return true;
    }
    return false;
}
exports.isFloatReg = isFloatReg;
