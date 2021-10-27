"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padBitString = exports.makeBitMask = exports.makeBitMaskFromString = exports.compareBits = exports.isBinaryLiteral = void 0;
function isBinaryLiteral(str) {
    return str[0] === "0" || str[0] === "1"; // Checking first char is enough for now
}
exports.isBinaryLiteral = isBinaryLiteral;
function compareBits(number, bitString, bitOffset) {
    var shifted = (number >>> bitOffset) & makeBitMask(bitString.length);
    var mask = makeBitMaskFromString(bitString);
    return shifted === mask;
}
exports.compareBits = compareBits;
function makeBitMaskFromString(bitString) {
    var mask = 0;
    for (var i = 0; i < bitString.length; i++) {
        var bit = bitString[i] === "1" ? 1 : 0;
        mask <<= 1;
        mask = mask | bit;
    }
    return mask;
}
exports.makeBitMaskFromString = makeBitMaskFromString;
function makeBitMask(len) {
    if (len <= 0)
        throw new Error("makeBitMask cannot make mask of length " + len);
    var mask = 1;
    while (--len) {
        mask <<= 1;
        mask = mask | 1;
    }
    return mask;
}
exports.makeBitMask = makeBitMask;
function padBitString(str, minLen) {
    while (str.length < minLen) {
        str = "0" + str;
    }
    return str;
}
exports.padBitString = padBitString;
