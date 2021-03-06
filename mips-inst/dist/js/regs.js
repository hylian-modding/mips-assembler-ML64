"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCondString = exports.getCondName = exports.getCondBits = exports.isFmtString = exports.getFmt3Name = exports.getFmt3Bits = exports.getFmtName = exports.getFmtBits = exports.getFloatRegName = exports.getRegName = exports.getRegBits = void 0;
var regs = {
    r0: 0,
    zero: 0,
    at: 1,
    v0: 2,
    v1: 3,
    a0: 4,
    a1: 5,
    a2: 6,
    a3: 7,
    t0: 8,
    t1: 9,
    t2: 10,
    t3: 11,
    t4: 12,
    t5: 13,
    t6: 14,
    t7: 15,
    s0: 16,
    s1: 17,
    s2: 18,
    s3: 19,
    s4: 20,
    s5: 21,
    s6: 22,
    s7: 23,
    t8: 24,
    t9: 25,
    k0: 26,
    k1: 27,
    gp: 28,
    sp: 29,
    fp: 30,
    ra: 31
};
function getRegBits(reg) {
    if (!reg)
        return undefined;
    return regs[reg.toLowerCase()];
}
exports.getRegBits = getRegBits;
function getRegName(bits) {
    for (var name_1 in regs) {
        if (regs[name_1] === bits)
            return name_1;
    }
    return "";
}
exports.getRegName = getRegName;
function getFloatRegName(bits) {
    if (typeof bits !== "number")
        throw new Error("getFloatRegName encountered non-number");
    return "F" + bits;
}
exports.getFloatRegName = getFloatRegName;
var fmts = {
    S: 16,
    D: 17,
    W: 20,
    L: 21,
};
function getFmtBits(fmtStr) {
    return fmts[fmtStr.toUpperCase()];
}
exports.getFmtBits = getFmtBits;
function getFmtName(bits) {
    for (var name_2 in fmts) {
        if (fmts[name_2] === bits)
            return name_2;
    }
    return "";
}
exports.getFmtName = getFmtName;
var fmt3s = {
    S: 0,
    D: 1,
    W: 4,
    L: 5,
};
function getFmt3Bits(fmtStr) {
    return fmt3s[fmtStr.toUpperCase()];
}
exports.getFmt3Bits = getFmt3Bits;
function getFmt3Name(bits) {
    for (var name_3 in fmt3s) {
        if (fmt3s[name_3] === bits)
            return name_3;
    }
    return "";
}
exports.getFmt3Name = getFmt3Name;
function isFmtString(fmtStr) {
    return fmts.hasOwnProperty(fmtStr.toUpperCase()) || fmt3s.hasOwnProperty(fmtStr.toUpperCase());
}
exports.isFmtString = isFmtString;
var conds = {
    F: 0,
    UN: 1,
    EQ: 2,
    UEQ: 3,
    OLT: 4,
    ULT: 5,
    OLE: 6,
    ULE: 7,
    SF: 8,
    NGLE: 9,
    SEQ: 10,
    NGL: 11,
    LT: 12,
    NGE: 13,
    LE: 14,
    NGT: 15,
};
function getCondBits(condStr) {
    return conds[condStr.toUpperCase()];
}
exports.getCondBits = getCondBits;
function getCondName(bits) {
    for (var name_4 in conds) {
        if (conds[name_4] === bits)
            return name_4;
    }
    return "";
}
exports.getCondName = getCondName;
function isCondString(condStr) {
    return conds.hasOwnProperty(condStr.toUpperCase());
}
exports.isCondString = isCondString;
