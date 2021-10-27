"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = void 0;
var opcodes_1 = require("./opcodes");
var regs_1 = require("./regs");
var immediates_1 = require("./immediates");
var bitstrings_1 = require("./bitstrings");
/**
 * Prints a string representation of a MIPS instruction.
 *
 * With the `intermediate` option, this can also be used as a convenient base
 * for a disassembler. The object output with `intermediate` can be manipulated
 * prior to calling `print` with it again.
 * @param {Number|Array|ArrayBuffer|DataView|Object} inst MIPS instruction, or intermediate object format.
 * @param {Object} opts Behavior options
 * @param {String} opts.casing "toUpperCase" (default), "toLowerCase"
 * @param {Boolean} opts.commas True to separate values by commas
 * @param {Boolean} opts.include$ True to prefix registers with dollar sign
 * @param {Boolean} opts.intermediate: Output an object intermediate format instead of a string
 * @param {Number} opts.numBase Number format. 16 (hex, default), 10 (decimal)
 * @returns {String|Array|Object} Returns a string representation of the given
 * MIPS instruction code(s).
 * If multiple values are given (array) then multiple values are returned.
 * When the `intermediate` option is passed, the return type is an object.
 */
function print(inst, opts) {
    opts = _getFinalOpts(opts);
    if (Array.isArray(inst))
        return inst.map(function (i) { return _print(i, opts); });
    var isArrayBuffer = inst instanceof ArrayBuffer;
    if (isArrayBuffer || inst instanceof DataView) {
        var dataView = isArrayBuffer ? new DataView(inst) : inst;
        var result = [];
        for (var i = 0; i < dataView.byteLength; i += 4) {
            result.push(_print(dataView.getUint32(i), opts));
        }
        return result;
    }
    var inputType = typeof inst;
    if (inputType === "number" || inputType === "object")
        return _print(inst, opts);
    throw new Error("Unexpected input to print.");
}
exports.print = print;
function _getFinalOpts(givenOpts) {
    return Object.assign({
        casing: "toUpperCase",
        commas: false,
        include$: false,
        intermediate: false,
        numBase: 16
    }, givenOpts);
}
function _print(inst, opts) {
    var opcodeObj, opName, values;
    if (typeof inst === "number") {
        opName = (0, opcodes_1.findMatch)(inst);
        if (!opName)
            throw new Error("Unrecognized instruction");
        opcodeObj = (0, opcodes_1.getOpcodeDetails)(opName);
        values = _extractValues(inst, opcodeObj.format);
        values.op = opName;
    }
    else if (typeof inst === "object") {
        if (!inst.op)
            throw new Error("Instruction object did not contain op");
        opcodeObj = (0, opcodes_1.getOpcodeDetails)(inst.op);
        values = inst;
    }
    else
        throw new Error("Unexpected value " + inst);
    if (!opcodeObj)
        throw new Error("Invalid opcode");
    if (opts.intermediate)
        return values;
    return _printValues(values, opcodeObj, opts);
}
function _printValues(values, opcodeObj, opts) {
    var result = _formatOpcode(values, opts);
    function _getRegName(displayEntry) {
        switch (displayEntry) {
            case "rs":
            case "rt":
            case "rd":
                return (0, regs_1.getRegName)(values[displayEntry]);
            case "fs":
            case "ft":
            case "fd":
                return (0, regs_1.getFloatRegName)(values[displayEntry]);
        }
    }
    var display = opcodeObj.display;
    for (var i = 0; i < display.length; i++) {
        var displayEntry = display[i];
        if (displayEntry.endsWith("?")) {
            displayEntry = displayEntry.replace("?", "");
            if (values[displayEntry] === undefined)
                continue; // Optional value, not set.
        }
        var value = values[displayEntry];
        if (value === undefined && displayEntry !== "(" && displayEntry !== ")") {
            throw new Error("Expected " + displayEntry + " value, got undefined");
        }
        var addComma = opts.commas;
        switch (displayEntry) {
            case "rs":
            case "rt":
            case "rd":
            case "fs":
            case "ft":
            case "fd":
                if (!result.endsWith("("))
                    result += " ";
                result += _formatReg(_getRegName(displayEntry), opts);
                break;
            case "(":
            case ")":
                addComma = false;
                if (result.endsWith(","))
                    result = result.slice(0, -1); // Lop off comma, since we are involved in a parenthesis open/close
                result += displayEntry;
                break;
        }
        var immDetails = (0, immediates_1.getImmFormatDetails)(displayEntry);
        if (immDetails) {
            if (!result.endsWith("("))
                result += " ";
            if (immDetails.signed && immDetails.bits === 16) {
                value = (0, immediates_1.makeInt16)(value);
            }
            if (immDetails.shift) {
                value = value << immDetails.shift;
            }
            result += _formatNumber(value, opts);
        }
        if (addComma && (i !== display.length - 1) && !result.endsWith(",")) {
            result += ",";
        }
    }
    return result.trim();
}
function _extractValues(inst, format) {
    var values = {};
    for (var i = format.length - 1; i >= 0; i--) {
        var value = void 0, bitLength = void 0;
        var piece = format[i];
        if (Array.isArray(piece)) {
            for (var j = piece.length - 1; j >= 0; j--) {
                bitLength = (0, opcodes_1.getValueBitLength)(piece[j]);
                value = inst & (0, bitstrings_1.makeBitMask)(bitLength);
                if ((0, bitstrings_1.isBinaryLiteral)(piece[j])) {
                    if (piece[j] === (0, bitstrings_1.padBitString)(value.toString(2), bitLength)) {
                        piece = piece[j];
                        break;
                    }
                }
                else {
                    piece = piece[j];
                    break;
                }
            }
        }
        else {
            bitLength = (0, opcodes_1.getValueBitLength)(piece);
            value = inst & (0, bitstrings_1.makeBitMask)(bitLength);
        }
        if ((0, bitstrings_1.isBinaryLiteral)(piece)) {
            inst >>>= bitLength;
            continue;
        }
        values[piece] = value;
        inst >>>= bitLength;
    }
    return values;
}
function _formatNumber(num, opts) {
    if (num === 0)
        return num.toString(opts.numBase);
    var value = "";
    if (num < 0)
        value += "-";
    if (opts.numBase === 16)
        value += "0x";
    else if (opts.numBase === 8)
        value += "0o";
    else if (opts.numBase === 2)
        value += "0b";
    value += _applyCasing(Math.abs(num).toString(opts.numBase), opts.casing);
    return value;
}
function _formatReg(regStr, opts) {
    var value = "";
    if (opts.include$)
        value += "$";
    value += _applyCasing(regStr, opts.casing);
    return value;
}
function _formatOpcode(values, opts) {
    var pieces = values.op.split(".");
    for (var i = 0; i < pieces.length; i++) {
        if (pieces[i] === "fmt") {
            if (values.hasOwnProperty("fmt3"))
                pieces[i] = (0, regs_1.getFmt3Name)(values["fmt3"]);
            else if (values.hasOwnProperty("fmt"))
                pieces[i] = (0, regs_1.getFmtName)(values["fmt"]);
            else
                throw new Error("Format value not available");
        }
        else if (pieces[i] === "cond") {
            if (values.hasOwnProperty("cond"))
                pieces[i] = (0, regs_1.getCondName)(values["cond"]);
            else
                throw new Error("Condition value not available");
        }
    }
    var opcode = pieces.join(".");
    return _applyCasing(opcode, opts.casing);
}
function _applyCasing(value, casing) {
    switch (casing) {
        case "toLowerCase":
            return value.toLowerCase();
        case "toUpperCase":
        default:
            return value.toUpperCase();
    }
}
