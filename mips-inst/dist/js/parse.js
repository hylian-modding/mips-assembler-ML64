"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
var opcodes_1 = require("./opcodes");
var immediates_1 = require("./immediates");
var regs_1 = require("./regs");
var formats = __importStar(require("./regex"));
var bitstrings_1 = require("./bitstrings");
/**
 * Parses a string MIPS instruction, returning numeric machine code.
 *
 * With the `intermediate` option, this can also be used as a convenient base
 * for an assembler. The object output with `intermediate` can be manipulated
 * prior to calling `parse` with it again.
 * @param {String|Array|Object} value MIPS instruction, or intermediate object format.
 * @param {Object} opts Behavior options
 * @param {Boolean} opts.intermediate: Output an object intermediate format instead of a number
 * @returns {Number|Array|Object} Returns a numeric representation of the given
 * MIPS instruction string.
 * If multiple values are given (array) then multiple values are returned.
 * When the `intermediate` option is passed, the return type is an object.
 */
function parse(value, opts) {
    opts = _getFinalOpts(opts);
    if (Array.isArray(value)) {
        return value.map(function (s) { return _parse(s, opts); });
    }
    if (typeof value === "object") {
        return _parse(value, opts);
    }
    if (typeof value === "string") {
        var values = value.split(/\r?\n/).filter(function (v) { return !!(v.trim()); });
        if (values.length === 1)
            return _parse(values[0], opts);
        else
            return values.map(function (s) { return _parse(s, opts); });
    }
    throw new Error("Unexpected input to parse. Pass a string or array of strings.");
}
exports.parse = parse;
function _getFinalOpts(givenOpts) {
    return Object.assign({
        intermediate: false,
    }, givenOpts);
}
function _parse(value, opts) {
    var opcode, opcodeObj, values;
    if (typeof value === "string") {
        opcode = formats.getOpcode(value);
        if (!opcode)
            throw new Error("Could not parse opcode from " + value);
        opcodeObj = (0, opcodes_1.getOpcodeDetails)(opcode);
        if (!opcodeObj)
            throw new Error("Opcode " + opcode + " was not recognized");
        values = _parseValues(opcode, opcodeObj, value);
    }
    else if (typeof value === "object") {
        opcode = formats.getOpcode(value.op);
        if (!opcode)
            throw new Error("Object input to parse did not contain 'op'");
        opcodeObj = (0, opcodes_1.getOpcodeDetails)(opcode);
        if (!opcodeObj)
            throw new Error("Opcode " + opcode + " was not recognized");
        values = value;
    }
    if (opts.intermediate)
        return values;
    return bitsFromFormat(opcodeObj.format, values);
}
function _parseValues(opcode, opcodeObj, value) {
    var regex = formats.makeRegexForOpcode(opcode, opcodeObj);
    var match = regex.exec(value);
    if (!match)
        throw new Error("Could not parse instruction: " + value);
    var values = {
        op: opcode
    };
    if (opcode.indexOf(".fmt") !== -1 || opcode.indexOf(".cond") !== -1) {
        determineOpcodeValues(match[1], opcode, opcodeObj.fmts, opcodeObj.format, values);
    }
    var display = opcodeObj.display;
    var matchIndex = 2; // 0 is whole match, 1 is opcode - skip both
    for (var i = 0; i < display.length; i++, matchIndex++) {
        var parsedVal = match[matchIndex];
        var displayEntry = display[i];
        var optional = displayEntry.endsWith("?");
        if (optional) {
            displayEntry = displayEntry.replace("?", "");
        }
        switch (displayEntry) {
            case "(":
            case ")":
                matchIndex--; // Eh
                continue;
            case "rs":
            case "rd":
            case "rt": {
                var tryReg = (0, regs_1.getRegBits)(parsedVal);
                if (tryReg === undefined) {
                    if (optional)
                        continue;
                    throw new Error("Unrecognized " + displayEntry + " register " + parsedVal);
                }
                values[displayEntry] = tryReg;
                continue;
            }
            case "fs":
            case "ft":
            case "fd":
            case "fr":
                values[displayEntry] = parseInt(parsedVal);
                if (isNaN(values[displayEntry]))
                    throw new Error("Unrecognized " + displayEntry + " register " + parsedVal);
                continue;
        }
        var immDetails = (0, immediates_1.getImmFormatDetails)(displayEntry);
        if (immDetails) {
            var value_1 = void 0;
            var immPieces = [match[matchIndex], match[matchIndex + 1], match[matchIndex + 2]];
            if (!optional || immPieces[2]) {
                value_1 = (0, immediates_1.parseImmediate)(immPieces, immDetails.bits, immDetails.signed, immDetails.shift);
                if (isNaN(value_1)) {
                    throw new Error("Could not parse immediate " + immPieces.join(""));
                }
                values[displayEntry] = value_1;
            }
            matchIndex += 2;
            continue;
        }
        throw new Error("Unrecognized opcode display entry " + displayEntry);
    }
    return values;
}
function bitsFromFormat(format, values) {
    var output = 0;
    var bitOffset = 0;
    for (var i = 0; i < format.length; i++) {
        var writeResult = void 0;
        var piece = format[i];
        var bitLength = (0, opcodes_1.getValueBitLength)(Array.isArray(piece) ? piece[0] : piece);
        output = (output << bitLength) >>> 0;
        if (Array.isArray(piece)) {
            for (var j = 0; j < piece.length; j++) {
                writeResult = writeBitsForPiece(piece[j], output, values);
                if (writeResult.wrote) {
                    output = writeResult.output;
                    break; // j
                }
            }
        }
        else {
            writeResult = writeBitsForPiece(piece, output, values);
            if (writeResult.wrote) {
                output = writeResult.output;
            }
        }
        bitOffset += bitLength;
    }
    if (bitOffset != 32)
        throw new Error("Incorrect number of bits written for format " + format);
    return output;
}
function writeBitsForPiece(piece, output, values) {
    var wrote = false;
    if ((0, bitstrings_1.isBinaryLiteral)(piece)) {
        output |= (0, bitstrings_1.makeBitMaskFromString)(piece);
        wrote = true;
    }
    else if (values[piece] !== undefined) {
        var value = values[piece] & (0, bitstrings_1.makeBitMask)((0, opcodes_1.getValueBitLength)(piece));
        wrote = true;
        output |= value;
    }
    return {
        wrote: wrote,
        output: output >>> 0,
    };
}
function determineOpcodeValues(givenOpcode, genericOpcode, allowedFormats, format, values) {
    var givenPieces = givenOpcode.split(".");
    var genericPieces = genericOpcode.split(".");
    if (givenPieces.length !== genericPieces.length)
        throw new Error("Given opcode " + givenOpcode + " does not have all pieces (" + genericOpcode + ")");
    for (var i = 0; i < genericPieces.length; i++) {
        var genericPiece = genericPieces[i];
        if (genericPiece === "fmt" || genericPiece === "ftm3") {
            if (allowedFormats.indexOf(givenPieces[i].toUpperCase()) === -1)
                throw new Error("Format " + givenPieces[i] + " is not allowed for " + genericPiece + ". Allowed values are " + allowedFormats);
            if (genericPiece === "fmt")
                values["fmt"] = (0, regs_1.getFmtBits)(givenPieces[i]);
            else if (genericPiece === "fmt3")
                values["fmt3"] = (0, regs_1.getFmt3Bits)(givenPieces[i]);
        }
        if (genericPiece === "cond")
            values["cond"] = (0, regs_1.getCondBits)(givenPieces[i]);
    }
}
