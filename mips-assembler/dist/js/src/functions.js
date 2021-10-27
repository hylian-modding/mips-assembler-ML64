"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runFunction = void 0;
const immediates_1 = require("mips-assembler/dist/js/src/immediates");
const symbols_1 = require("mips-assembler/dist/js/src/symbols");
const strings_1 = require("mips-assembler/dist/js/src/strings");
const labels_1 = require("mips-assembler/dist/js/src/labels");
const abs_1 = require("mips-assembler/dist/js/src/functions/abs");
const hi_1 = require("mips-assembler/dist/js/src/functions/hi");
const lo_1 = require("mips-assembler/dist/js/src/functions/lo");
const org_1 = require("mips-assembler/dist/js/src/functions/org");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/** Runs any built-in functions, and also resolves symbols. */
function runFunction(value, state) {
    return _runFunction(value, state);
}
exports.runFunction = runFunction;
var fnRegex = new RegExp("^([-\\w]+)\\(([\\(\\),-\\w" + labels_1.LABEL_CHARS + "]*)\\)$", "i");
function _runFunction(value, state) {
    var results = fnRegex.exec(value);
    if (results === null) { // Not a function
        // Symbol?
        var symbolValue = (0, symbols_1.getSymbolValue)(state, value);
        if (symbolValue !== null) {
            return symbolValue;
        }
        // Number?
        var imm = (0, immediates_1.parseImmediate)(value);
        if (imm !== null) {
            return imm;
        }
        // String?
        var str = (0, strings_1.unescapeString)(value);
        if (typeof str === "string") {
            return str;
        }
        return null;
    }
    else {
        var fn = results[1];
        if (!fns[fn]) {
            // Did a symbol label accidentally look like a function?
            var symbolValue = (0, symbols_1.getSymbolValue)(state, fn);
            if (symbolValue !== null) {
                return symbolValue;
            }
            return null; // Might have been something like 0x10(V0)
        }
        // Parse args slightly different than the regex suggests,
        // to support lo(label)(V0)
        var fnArgs = "";
        var parenLevel = 0;
        var i = void 0;
        for (i = fn.length + 1; i < value.length - 1; i++) {
            var char = value[i];
            if (char === "(") {
                parenLevel++;
            }
            else if (char === ")") {
                parenLevel--;
                if (parenLevel < 0) {
                    i++;
                    break;
                }
            }
            fnArgs += char;
        }
        var extraStr = "";
        if (i < value.length - 1) {
            // There was extra content after the end of the function,
            // like the (VO) of lo(label)(V0)
            extraStr = value.substring(i, value.length);
        }
        // TODO: Doesn't support nested calls, multiple arguments.
        var arg = 0;
        if (fnArgs) {
            arg = _runFunction(fnArgs, state);
        }
        if (arg === null) {
            (0, errors_1.throwError)("Could not evaluate " + fnArgs, state);
            return null;
        }
        var result = fns[fn](state, arg);
        if (extraStr) {
            result = result + extraStr;
        }
        return result;
    }
}
/** Built-in functions */
var fns = Object.create(null);
fns.abs = abs_1.abs;
fns.hi = hi_1.hi;
fns.lo = lo_1.lo;
fns.org = org_1.org;
